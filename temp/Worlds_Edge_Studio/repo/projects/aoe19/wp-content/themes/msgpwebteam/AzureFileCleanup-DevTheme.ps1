$StorageAccountName = "agewebcdn"
$StorageAccountKey = "jy2O4KbfNDGyKi1II6lvDMxkTb5lWA09wVJe8j5IoXKgUrucvAhAF946yjiDHAJplihjCkYfKwarhLHCvZ1I6g=="
$StorageContainerName = "aoe-e3"

# get Azure blob storage context
$context = New-AzStorageContext `
    -StorageAccountName $StorageAccountName `
    -StorageAccountKey $StorageAccountKey

$scriptBlobs = Get-AzStorageBlob -Container $StorageContainerName -Context $context -Prefix "wp-content/themes/msgpwebteam/dist/scripts/";
$styleBlobs = Get-AzStorageBlob -Container $StorageContainerName -Context $context -Prefix "wp-content/themes/msgpwebteam/dist/styles/";
$blobsremoved = 0;
$DaysOld = 1

if ($scriptBlobs -ne $null)
{    
    foreach ($blob in $scriptBlobs)
    {
        $lastModified = $blob.LastModified
        if ($lastModified -ne $null)
        {
            $blobDays = ([DateTime]::Now - $lastModified.DateTime)  #[DateTime]

            Write-Output "Blob $($blob.Name) has been in storage for $($blobDays) days";

            if ($blobDays.Days -ge $DaysOld)
            {
                Write-Output "Removing Blob: $($blob.Name)";

                Remove-AzStorageBlob -Blob $blob.Name -Container $StorageContainerName -Context $context;
                $blobsremoved += 1;
            }
        }
    }
}
if ($styleBlobs -ne $null)
{    
    foreach ($blob in $styleBlobs)
    {
        $lastModified = $blob.LastModified
        if ($lastModified -ne $null)
        {
            $blobDays = ([DateTime]::Now - $lastModified.DateTime)  #[DateTime]

            Write-Output "Blob $($blob.Name) has been in storage for $($blobDays) days";

            if ($blobDays.Days -ge $DaysOld)
            {
                Write-Output "Removing Blob: $($blob.Name)";

                Remove-AzStorageBlob -Blob $blob.Name -Container $StorageContainerName -Context $context;
                $blobsremoved += 1;
            }
        }
    }
}
