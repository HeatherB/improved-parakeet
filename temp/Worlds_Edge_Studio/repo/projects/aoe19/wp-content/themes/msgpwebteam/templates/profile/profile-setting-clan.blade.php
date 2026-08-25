<div class="frame-box">
  <div id="clanProfileSettings">
    <div class="frame-box__inner frame-box__inner--dark frame-box__inner--padding">
      <h3 class="h3 light space-between">Clan Settings</h3>
      <div class="frame-box__inner--light space-between space-above--large-below">
        <div class="row">
          <form id="clansProfileForm" class="profile-clans js-form">
            <div class="columns large-6 medium-6">
              <label for="member-activity-level" class="h4 dark">
                <div class="label-name">Activity Level</div>
                <select name="ClanActivityLevel"
                        id="member-activity-level">
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </label>
              <div class="profile-clans__submit">
                <button type="submit" data-sub="save" class="btn-aoe btn-aoe--small js-button js-save">Save</button>
              </div>
            </div>
            <div class="columns large-6 medium-6">
              <label for="member-skill-level" class="h4 dark">
                <div class="label-name">Skill Level</div>
                <select name="ClanAvgSkillLevel"
                        id="member-skill-level">
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>