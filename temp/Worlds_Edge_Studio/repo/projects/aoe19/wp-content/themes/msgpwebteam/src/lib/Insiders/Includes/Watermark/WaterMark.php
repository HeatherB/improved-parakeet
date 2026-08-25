<?php


namespace Roots\Insiders\Watermark;


class WaterMark
{

    public function __construct()
    {
        add_action('wp_ajax_watermark',[$this,'watermarker']);
    }

    public function watermarker()
    {

        $userObj = wp_get_current_user();

        // Create Image and append watermark
        $text = $userObj->msa_gt . $userObj->msa_xuid;
        $mark_loop = 5;
        $fontsize = 20;
        $angle = 45;
        $spacing = 250;

        $imageWidth = 1920;
        $imageHeight = 1080;
        $logoimg = imagecreatetruecolor($imageWidth, $imageHeight);
        imagealphablending($logoimg, false);
        imagesavealpha($logoimg, true);
        $col = imagecolorallocatealpha($logoimg, 255, 255, 255, 127);

        imagefill($logoimg, 0, 0, $col);

        $color = imagecolorallocatealpha($logoimg, 255, 255, 255, 100);
        $font = __DIR__ . '/fonts/verdana.ttf';

        for ($i = 1; $i <= $mark_loop; $i++) {

            imagettftext($logoimg, $fontsize, $angle, 0, $spacing * $i, $color, $font, $text);
            imagettftext($logoimg, $fontsize, $angle, 600, $spacing * $i, $color, $font, $text);
            imagettftext($logoimg, $fontsize, $angle, 1200, $spacing * $i, $color, $font, $text);
            imagettftext($logoimg, $fontsize, $angle, 1800, $spacing * $i, $color, $font, $text);
            imagettftext($logoimg, $fontsize, $angle, 2400, $spacing * $i, $color, $font, $text);

        }

        // Capture Image from output buffer
        ob_start();
        imagepng($logoimg);
        $imagedata = ob_get_clean();
        imagedestroy($logoimg);

        echo base64_encode($imagedata);

        wp_die();

    }

}