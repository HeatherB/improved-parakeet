<?php
namespace Roots\AzureStorage;

use Roots\AzureStorage\Config;
use WindowsAzure\Common\ServicesBuilder;
use WindowsAzure\Common\Internal\MediaServicesSettings;
use WindowsAzure\MediaServices\MediaServicesRestProxy;
use WindowsAzure\MediaServices\Authentication\AzureAdTokenCredentials;
use WindowsAzure\MediaServices\Authentication\AzureAdClientSymmetricKey;
use WindowsAzure\MediaServices\Authentication\AzureAdTokenProvider;
use WindowsAzure\MediaServices\Authentication\AzureEnvironments;
use WindowsAzure\MediaServices\Models\Asset;
use WindowsAzure\MediaServices\Models\AccessPolicy;
use WindowsAzure\MediaServices\Models\Locator;
use WindowsAzure\MediaServices\Models\Task;
use WindowsAzure\MediaServices\Models\Job;
use WindowsAzure\MediaServices\Models\TaskOptions;

class Video
{
    private $restProxy;

    public function __construct () {
        $aadTenantDomain = \Roots\AzureStorage\Utilities\Helpers::get_option('aadTenantDomain') ?? null;
        $aadClientID = \Roots\AzureStorage\Utilities\Helpers::get_option('aadClientID') ?? null;
        $aadClientSecret = \Roots\AzureStorage\Utilities\Helpers::get_option('aadClientSecret') ?? null;

        // 1 - Instantiate the credentials
        $credentials = new AzureAdTokenCredentials(
            $aadTenantDomain,
            new AzureAdClientSymmetricKey($aadClientID, $aadClientSecret),
            AzureEnvironments::AZURE_CLOUD_ENVIRONMENT());

        // 2 - Instantiate a token provider
        $provider = new AzureAdTokenProvider($credentials);

        // 3 - Connect to Azure Media Services
        $this->restProxy = ServicesBuilder::getInstance()->createMediaServicesService(new MediaServicesSettings(Config::REST_API_ENDPOINT, $provider));

    }

    public function create_new_asset($video_id,$file){
        $asset = new Asset(Asset::OPTIONS_NONE);
        $asset = $this->restProxy->createAsset($asset);

        $access = new AccessPolicy('UploadAccessPolicy');
        $access->setDurationInMinutes(60.0);
        $access->setPermissions(AccessPolicy::PERMISSIONS_WRITE);
        $access = $this->restProxy->createAccessPolicy($access);

        $sasLocator = new Locator($asset,$access,Locator::TYPE_SAS);
        $sasLocator->setStartTime(new \DateTime('now -5 minutes'));
        $sasLocator = $this->restProxy->createLocator($sasLocator);

        $file_content = file_get_contents($file['tmp_name']);

        $this->restProxy->uploadAssetFile($sasLocator,$file['name'],$file_content);
        $this->restProxy->createFileInfos($asset);

        // Cleanup
        $this->restProxy->deleteLocator($sasLocator);
        $this->restProxy->deleteAccessPolicy($access);

        $paths = $this->encode_asset($asset);

        if(!empty($paths)){
            update_post_meta($video_id, 'cdn_path', $paths['download']);
            update_post_meta($video_id, 'stream_path', $paths['stream']);
            update_post_meta($video_id, 'cdn_file_name', $file['name']);
        }

        return;

    }

    private function encode_asset($asset)
    {
        $mediaProcessor = $this->restProxy->getLatestMediaProcessor('Media Encoder Standard');

        // Create Job and run
        $outputAssetName = "Encoded " . $asset->getName();
        $outputAssetCreationOption = Asset::OPTIONS_NONE;
        $taskBody = '<?xml version="1.0" encoding="utf-8"?><taskBody><inputAsset>JobInputAsset(0)</inputAsset><outputAsset assetCreationOptions="' . $outputAssetCreationOption . '" assetName="' . $outputAssetName . '">JobOutputAsset(0)</outputAsset></taskBody>';

        $task = new Task($taskBody, $mediaProcessor->getId(), TaskOptions::NONE);
        $task->setConfiguration('H264 Multiple Bitrate 720p');

        $job = $this->restProxy->createJob(new Job(), [$asset], [$task]);

        // 2.3 Check to see if the Job has completed
        $result = $this->restProxy->getJobStatus($job);

        $jobStatusMap = array('Queued', 'Scheduled', 'Processing', 'Finished', 'Error', 'Canceled', 'Canceling');

        while($result != Job::STATE_FINISHED && $result != Job::STATE_ERROR && $result != Job::STATE_CANCELED) {
            //echo "Status: {$jobStatusMap[$result]}"); // TODO -- Feedback on progress
            sleep(5);
            $result = $this->restProxy->getJobStatus($job);
        }

        if ($result != Job::STATE_FINISHED) {
            error_log("The job has finished with a wrong status: {$jobStatusMap[$result]}");
            exit(-1);
        }

        // Get output asset
        $outputAssets = $this->restProxy->getJobOutputMediaAssets($job);
        $encodedAsset = $outputAssets[0];

        //echo "Asset encoded: name={$encodedAsset->getName()} id={$encodedAsset->getId()}".PHP_EOL;

        return $this->get_asset_url($encodedAsset);
    }

    private function get_asset_url($encodedAsset){

        $files = $this->restProxy->getAssetAssetFileList($encodedAsset);
        $manifestFile = null;
        $mp4File = null;

        foreach($files as $file) {
            if ($this->endsWith(strtolower($file->getName()), '.ism')) {
                $manifestFile = $file;
            } else if ($this->endsWith(strtolower($file->getName()), '.mp4')){
                $mp4File = $file;
            }
        }

        if ($manifestFile == null) {
            error_log("Unable to found the manifest file");
            exit(-1);
        }


        $accessPolicy = new AccessPolicy('ReadAccessPolicy');
        $accessPolicy->setDurationInMinutes(60 * 24 * 90);
        $accessPolicy->setPermissions(AccessPolicy::PERMISSIONS_READ);
        $accessPolicy = $this->restProxy->createAccessPolicy($accessPolicy);

        $locator = new Locator($encodedAsset, $accessPolicy, Locator::TYPE_ON_DEMAND_ORIGIN);
        $locator->setName("Streaming Locator");
        $locator = $this->restProxy->createLocator($locator);

        $streamingUrl = $locator->getPath() . $manifestFile->getName() . "/manifest(format=m3u8-aapl)";
        $downloadLink = $locator->getPath() . $mp4File->getName();


        return ["stream" => $streamingUrl, "download" => $downloadLink];
    }

    private function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }

        return (substr($haystack, -$length) === $needle);
    }

}