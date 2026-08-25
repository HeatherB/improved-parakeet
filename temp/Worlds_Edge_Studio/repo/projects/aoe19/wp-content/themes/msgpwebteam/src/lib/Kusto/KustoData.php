<?php
namespace Roots\Kusto;

class KustoData
{
  public $AAD_Authentication_body = [
    'grant_type' => 'client_credentials',
    'client_secret' => '6lEIIMkT06NYxaTdE6P0j+VUI9wTnbtVwIBM8L0fb0w=',
    'client_id' => '02baa1cb-3518-4416-9c56-3facc30e7067',
    'resource' => 'https://xspiint.kusto.windows.net',
  ];
  public function __construct()
  {
    add_action( 'wp_ajax_chart_total_mp_wins', [$this, 'chart_total_mp_wins'] );
    add_action( 'wp_ajax_nopriv_chart_total_mp_wins', [$this, 'chart_total_mp_wins'] );
    add_action( 'wp_ajax_chart_total_mp_matches', [$this, 'chart_total_mp_matches'] );
    add_action( 'wp_ajax_chart_total_mp_matches', [$this, 'chart_total_mp_matches'] );
    $this->constants();
    //$this->post();
  }
  public function constants() {
    define( 'TENANT_ID', '72f988bf-86f1-41af-91ab-2d7cd011db47' );
  }
  public function get_token(){

    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://login.microsoftonline.com/".TENANT_ID."/oauth2/token",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => http_build_query($this->AAD_Authentication_body),
      CURLOPT_HTTPHEADER => array(
      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);
    if($response) {
      $response = json_decode($response);
      $access_token = $response->access_token;
      return $access_token;
    } else {
      return "Something went wrong";
    }

  }
  public function post($csl) {

    $postfields = [
      "db" => "DallasTelemetry",
      "properties" => "{\"Options\":{\"OptionQueryTrace\":\"false\"}}",
      "csl" => $csl,
    ];

    $access_token = $this->get_token();
    $curl = curl_init();

    curl_setopt_array($curl, array(
      CURLOPT_URL => "https://xspiint.kusto.windows.net/v1/rest/query",
      CURLOPT_RETURNTRANSFER => true,
      CURLOPT_ENCODING => "",
      CURLOPT_MAXREDIRS => 10,
      CURLOPT_TIMEOUT => 30,
      CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
      CURLOPT_CUSTOMREQUEST => "POST",
      CURLOPT_POSTFIELDS => json_encode($postfields),
      CURLOPT_HTTPHEADER => array(
        "authorization: Bearer ".$access_token,
        "content-type: application/json",

      ),
    ));

    $response = curl_exec($curl);
    $err = curl_error($curl);

    curl_close($curl);

    return $response;

  }

  public function campaign_progress() {
    $csl = 'MaelstromEvents | where event_name == \'CampaignProgress\' | extend e=parse_json(event_body) | where e.s_UserId == \'2535418399685948\' | project label = \'Campaign Progress\', value = tostring(e.f_CampaignTotal), Body = event_body';

  }

  public function time_of_Age() {

  }

  public function chart_total_mp_wins() {
    $user_id = $_REQUEST['user_id'] ?? null;
    if(null != $user_id) :
      $csl = 'MaelstromEvents | where event_name == "GameEnd" | extend e=parse_json(event_body) | where e.i32_PlayerResult == "1" | where e.s_UserId == "' . $user_id . '" | project GUIDLeft = tostring(e.g_UniqueGameId), BODY = event_body, GUID = e.g_UniqueGameId | join kind=inner (MaelstromEvents | where event_name == "GameStart" | extend e=parse_json(event_body) | where e.b_Multiplayer == true | project GUIDRight = tostring(e.g_UniqueGameId)) on $left.GUIDLeft == $right.GUIDRight | count';
    else :
      $csl = 'MaelstromEvents | where event_name == "GameEnd" | extend e=parse_json(event_body) | where e.i32_PlayerResult == "1" | project GUIDLeft = tostring(e.g_UniqueGameId), BODY = event_body, GUID = e.g_UniqueGameId | join kind=inner (MaelstromEvents | where event_name == "GameStart" | extend e=parse_json(event_body) | where e.b_Multiplayer == true | project GUIDRight = tostring(e.g_UniqueGameId)) on $left.GUIDLeft == $right.GUIDRight | count';
    endif;
    $str = $this->post($csl);
    $obj = json_decode($str);
    $data['label'] = $obj->Tables[0]->Columns[0]->ColumnName;
    $data['value'] = $obj->Tables[0]->Rows[0][0];
    header('Content-Type: application/json');
    echo json_encode($data);
    die();
  }
  public function chart_total_mp_matches() {
    $csl = 'MaelstromEvents | where event_name == "GameEnd" | extend e=parse_json(event_body) | project GUIDLeft = tostring(e.g_UniqueGameId), BODY = event_body, GUID = e.g_UniqueGameId | join kind=inner (MaelstromEvents | where event_name == "GameStart" | extend e=parse_json(event_body) | where e.b_Multiplayer == true | project GUIDRight = tostring(e.g_UniqueGameId)) on $left.GUIDLeft == $right.GUIDRight | count';
    $str = $this->post($csl);
    $obj = json_decode($str);
    $data['label'] = $obj->Tables[0]->Columns[0]->ColumnName;
    $data['value'] = $obj->Tables[0]->Rows[0][0];
    header('Content-Type: application/json');
    echo json_encode($data);
    die();
  }
}
