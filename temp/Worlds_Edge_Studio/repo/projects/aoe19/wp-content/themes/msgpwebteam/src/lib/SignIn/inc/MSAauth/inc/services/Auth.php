<?php

namespace MSAauth\Services;

class Auth
{

    static public function error_redirect($message)
    {
        wp_redirect(add_query_arg(['autherror' => urlencode($message)], home_url()));
        exit();
    }

}
