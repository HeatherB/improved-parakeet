<?php
$german = ( $_SERVER[ 'HTTP_ACCEPT_LANGUAGE' ] == 'de' ? true : false );
?>
<div class="tease purchase">
  <div class="bg">
    <div class="text">
      <div class="holder">
        <h4 class="title"><?php echo $content_section['cb_content_title']; ?></h4>
        <div class="words"><?php echo $content_section['cb_content_paragraph']; ?></div>
      </div>
      <div class="holder windows">
        <div class="center">
          <h4 class="title"><?php echo $content_section['cb_content_windows_title']; ?></h4>
          <?php if($german){ ?>
            <a href="<?php echo $content_section['cb_content_btn_windows_url']; ?>" class="button tall"><img src="@asset('images/btn/getitonwindows_de.svg')" class="logo"/></a>
          <?php } else { ?>
            <a href="<?php echo $content_section['cb_content_btn_windows_url']; ?>" class="button tall"><img src="@asset('images/btn/getitonwindows.svg')" class="logo"/></a>
          <?php } ?>
        </div>
        <div class="words"><?php echo $content_section['cb_content_windows_paragraph']; ?></div>
      </div>
      <div class="holder steam">
        <div class="center">
          <h4 class="title"><?php echo $content_section['cb_content_steam_title']; ?></h4>
          <a href="<?php echo $content_section['cb_content_btn_steam_url']; ?>" class="button tall"><img src="@asset('images/btn/steam.svg')" class="logo"/></a>
        </div>
        <div class="words"><?php echo $content_section['cb_content_steam_paragraph']; ?></div>
      </div>
    </div>
  </div>
  <div class="frame-gold"></div>
</div>
