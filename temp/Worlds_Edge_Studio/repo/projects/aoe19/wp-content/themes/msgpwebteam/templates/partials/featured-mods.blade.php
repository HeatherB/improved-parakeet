<div class="mods-featured section--divider-egypt-mid section--padding background--rock">
  <div class="row">
    <main class="main">
      <h3 class="h3 light">Community Creations: Featured Mods</h3>
      <div class="row results-container">

        <?php

          $query = [
            "q" => "",
            "sort" => "createDate",
            "order" => "desc",
            "start" => 1,
            "count" => 3,
            "status" => "Featured",
            "game" => 1,
          ];

          $response = wp_safe_remote_post( 'https://api.ageofempires.com/api/v1/Mods/Find', array(
              'headers' => array('Content-Type' => 'application/json', 'Accept' => 'application/json'),
              'body'    => json_encode($query)
            ) );
          $json = json_decode($response['body']);  

          foreach ($json->modList as $mod) {                 

        ?>

        <div class="mod-featured-item">
          <div class="frame-box mods-detail-gallery">
            <div class="frame-box__inner frame-box__inner--dark frame-box__inner--no-pad">                    
              
              <div class="mods-detail-gallery--media">
                <div class="mods-detail-gallery--tabs-content tabs-content" data-tabs-content="mods-detail-gallery-tabs">                          
                  <div class="mods-detail-gallery--tabs-panel tabs-panel is-active" role="tabpanel" aria-hidden="false" aria-labelledby="<?php echo $mod->modName; ?>">
                    <a href="/mods/details/<?php echo $mod->modId; ?>"><img src="<?php echo $mod->thumbnail; ?>" alt="<?php echo $mod->modName; ?>"></a>
                  </div>                      
                </div>
              </div>
              <div class="mod-detail">
                <div class="mod-type">                        
                </div>
                <div class="mod-name">
                  <a href="/mods/details/<?php echo $mod->modId; ?>"><?php echo $mod->modName; ?></a>
                </div>
                <div class="mod-description">
                  <?php echo \App\trim_text($mod->modDescription, 150, $ellipses = true, $strip_html = true); ?>
                </div>
                <div class="mod-creator">
                  <div class="mod-creator-avatar"><a href=""><?php //echo $Mod['CreatorAvatar']; ?></a></div>
                  <div class="mod-creator-details"><a href=""><?php echo $mod->creatorName ?></a><br />Last Update: <?php echo date_format(date_create($mod->lastUpdate),"j/d/Y"); ?></div>
                  <div class="mod-game-logo hidden"><?php //echo $Mod['Game']; ?></div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <?php } ?>

        </div>
        <div class="row column small-12 news__button">
          <a href="/mods" class="btn btn--small">SEE ALL MODS
          </a>
        </div>
    </main>
  </div>
</div>
