<div class="frame-box">
  <div class="frame-box__inner frame-box__inner--light">
    <form>
      <div class="row">
        <div class="columns">
          <h1>Upload a New Mod</h1>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque vitae euismod lacus.</p>
        </div>
      </div>
      <div class="row">
        <div class="columns">
          <label>
            <h5>Mod Title</h5>
            <input type="text" placeholder="Type title here">
          </label>
        </div>
      </div>
      <div class="row">
        <div class="medium-6 columns">
          <label>
            <h5>Game</h5>
            <select>
              <option value="age-of-empires">Age of Empires</option>
            </select>
          </label>
        </div>
        <div class="medium-6 columns">
          <label>
            <h5>Mod Type</h5>
            <select>
              <option value="campaign-scenario">Campaign Scenario</option>
              <option value="multi-player-scenario">Multi-Player Scenario</option>
              <option value="art">Art</option>
              <option value="localization">Localization</option>
            </select>
          </label>
        </div>
      </div>
      <div class="row">
        <div class="columns">
          <label>
            <h5>Description</h5>
            <?php
              $editorContent = '';
              $editorID = 'mod-description';
              $editorSettings = array(
                'wpautop' => true,
                'media_buttons' => false,
                'textarea_rows' => 6,
                'editor_class' => 'mod-richtext',
                'teeny' => false,
                'tinymce' => array(
                  'toolbar1' => 'formatselect bold italic bullist link | fullscreen',
                  'toolbar2' => ''
                ),
                'quicktags' => false,
                'drag_drop_upload' => false
              );
              wp_editor($editorContent, $editorID, $editorSettings);
            ?>
          </label>
        </div>
      </div>
      <div class="row">
        <div class="columns">
          <label>
            <h5>Change List</h5>
            <?php
              $editorContent = '';
              $editorID = 'mod-change-list';
              $editorSettings = array(
                'wpautop' => true,
                'media_buttons' => false,
                'textarea_rows' => 6,
                'editor_class' => 'mod-richtext',
                'teeny' => false,
                'tinymce' => array(
                  'toolbar1' => 'formatselect bold italic bullist link | fullscreen',
                  'toolbar2' => ''
                ),
                'quicktags' => false,
                'drag_drop_upload' => false
              );
              wp_editor($editorContent, $editorID, $editorSettings);
            ?>
          </label>
        </div>
      </div>
      <div class="row">
        <div class="columns">
          <h5>Video and Images</h5>
        </div>
      </div>
      <div class="row">
        <div class="columns">
          <h5>Mod Upload</h5>
          <label for="exampleFileUpload" class="button">Select a file...</label>
          <input type="file" id="exampleFileUpload" class="show-for-sr">
        </div>
      </div>
      <div class="row">
        <div class="columns">
          <input id="checkbox3" type="checkbox"><label for="checkbox3">Notify me about game updates</label>
        </div>
      </div>
      <div class="row">
        <div class="columns">
          <input type="submit" class="button" value="Submit">
          <input type="button" class="button" value="Cancel">
        </div>
      </div>
    </form>
  </div>
</div>
