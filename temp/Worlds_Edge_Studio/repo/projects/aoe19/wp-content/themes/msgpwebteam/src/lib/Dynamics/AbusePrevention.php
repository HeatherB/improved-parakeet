<?php

namespace Roots\Dynamics;

class AbusePrevention {

    private $action;
    private $user;
    private $tries_allowed;
    private $minutes_blocked;
    private $strike_window;
    private $exp_time;

    public function __construct($action)
    {
        $this->action = $action;
        $this->user = wp_get_current_user();
        $this->tries_allowed = 5;
        $this->minutes_blocked = 5;
        $this->strike_window = 5;
    }

    public function abuse_check($strike = true)
    {
        // Check and handle active block
        if($this->check_abuse_block()){
            return true;
        }

        // Check and Handle Strikes
        $strikes = get_user_meta($this->user->ID, $this->action . '_abuse_count', true);

        if($strike) {
            // if strikes are at limit and within 5 minutes from last then block
            if (isset($strikes) && !empty($strikes)) {
                $this->exp_time = $strikes['exp_time'];
                // If within time limit and hit try limit block
                if ($this->exp_time >= strtotime('now') && $strikes['strikes'] >= $this->tries_allowed) {
                    $this->add_abuse_block();
                } else {
                    $this->add_abuse_strike($strikes['strikes']);
                }
            } else {
                $this->add_abuse_strike(0);
            }
        }

        return false;

    }

    private function add_abuse_strike($strikes){

        if(!isset($this->exp_time) || $this->exp_time <= strtotime('now')){
            $this->exp_time = strtotime('+ ' . $this->strike_window . ' minutes');
            $strikes = 0;
        }

        $abuse_strike = [
            "exp_time" => $this->exp_time,
            "strikes" => ++$strikes
        ];

        update_user_meta($this->user->ID,$this->action . '_abuse_count',$abuse_strike);
    }

    private function add_abuse_block(){

        delete_user_meta($this->user->ID,$this->action . '_abuse_count');

        $abuse_block = [
            "action" => $this->action,
            "block_exp" => strtotime('+ ' . $this->minutes_blocked . ' minutes')
        ];

        update_user_meta($this->user->ID,$this->action . '_abuse_block',$abuse_block);

    }

    private function check_abuse_block(){

        $report = get_user_meta($this->user->ID,$this->action . '_abuse_block',true);

        if(isset($report) && !empty($report)){
            if($report['block_exp'] <= strtotime('now')){
                $this->remove_abuse_block();
                $is_blocked = false;
            } else {
                $is_blocked = true;
            }
        } else {
            $is_blocked = false;
        }

        return $is_blocked;

    }

    private function remove_abuse_block(){

        delete_user_meta($this->user->ID,$this->action . '_abuse_block');

    }

}