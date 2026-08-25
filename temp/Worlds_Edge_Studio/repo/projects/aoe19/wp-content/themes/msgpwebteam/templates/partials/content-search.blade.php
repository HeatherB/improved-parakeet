<article class="news-preview__result frame-box search-results mods-search-results">
  <div id="mods-listing" class="frame-box__inner frame-box__inner--light frame-box__inner--no-pad">
    <div class="news-preview-wrapper">
      <div class="news-preview news-preview--no-img">
        <div class="news-preview__content" style="padding: 20px 20px;">
          <div class="news-preview__content-wrapper" style="height: 150px;">
            <div class="news-preview__content-text">
              <div class="news-preview__title-wrapper">
                <h4 class="news-preview__entry-title"><a href="{{ get_the_permalink() }}">{{ get_the_title() }}</a></h4>
              </div>
              <div class="news-preview__excerpt">
                @php(the_excerpt())
              </div>
            </div>
            <div class="news-preview__content-footer">
              <div class="news-preview__content-footer-wrapper">
                <div class="news-preview__byline">
                  <span class="news-preview__author">Posted by {{ get_the_author() }}</span>
                  <span class="news-preview__timestamp">{{ get_the_time() }}</span>
                </div>
                <div class="news-preview__game-logo">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</article>
