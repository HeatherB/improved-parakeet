<?php

namespace App\Controllers;

class LearnToPlayController
{
    /**
     * Return map points from Advanced Custom Fields
     *
     * @return array
     */
    public function ltp_map_point()
    {
        return get_field('map_points');
    }

}
