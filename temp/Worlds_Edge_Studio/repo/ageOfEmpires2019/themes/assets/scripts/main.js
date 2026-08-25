if (module.hot) module.hot.accept();

// import external dependencies
import $ from 'expose?$!expose?jQuery!jquery';
import './component/jquery-ui.js';
import './component/jquery.ui.touch-punch.js';
import 'script!foundation-sites'
import 'babel-polyfill';
import 'slick-carousel';
import './component/jquery.sticky.js';
import objectFitVideos from 'object-fit-videos';
import * as d3 from "d3";
// import local dependencies
import config from './config';
import CategorySelect from './component/CategorySelect';
import Comments from './component/Comments';
import ClanProfile from './component/ClanProfile';
import History from './component/HistoryContent';
import ScrollTo from './component/ScrollTo';
import FixedSidebar from './component/FixedSidebar';
import './component/HeroHeaderStream';
import './component/BannerFranchise';
import './component/HeroHeaderFranchise';
import './component/HeroHeaderFranchise3';
//import './component/HeroHeaderFranchiseAge4';
//import Video from './component/Video';
import './util/responsiveAspectRatio';
import './component/HeroHeaderCarousel';
import './component/HeroVideoModal';
import './component/HeroFranchiseVideoModal';
import './component/MediaCarouselVideos';
import './component/MediaCarouselScreenshots';
import './component/MediaCarouselScreenshotsModal';
import './component/MediaCarouselWallpapers';
import './component/MediaScrollToSection';
import './component/Comparison';
import './component/jquery.jOrgChart';
import './component/TechTree';

import Cookies from './util/js.cookie';
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import aboutUs from './routes/about';
import insiderSignup from './routes/insiderSignup';
import ageOfEmpiresIv from './routes/ageOfEmpiresIv';

import pageTemplatePageModsAllBlade from './routes/pageTemplatePageModsAllBlade';
import pageTemplatePageModsCreateBlade from './routes/pageTemplatePageModsCreateBlade';
import profile from './routes/profile';

import pageTemplatePageModsInstalledBlade from './routes/pageTemplatePageModsInstalledBlade';
import pageTemplatePageModsMineBlade from './routes/pageTemplatePageModsMineBlade';
import pageTemplatePageModsSingleBlade from './routes/pageTemplatePageModsSingleBlade';
import postTypeArchiveClans from './routes/postTypeArchiveClans';
import singleClans from './routes/singleClans';
import pageTemplatePageClansCreateBlade from './routes/pageTemplatePageClansCreateBlade';
import singleHistory from './routes/singleHistory';
import postTemplateReleasesBlade from './routes/postTemplateReleasesBlade';
import postTypeArchiveHistory from './routes/postTypeArchiveHistory';
import postTypeArchiveBuyNowPages from './routes/postTypeArchiveBuyNowPages';

import pageTemplatePageStatsMatchDetailsBlade from './routes/pageTemplatePageStatsMatchDetailsBlade';
import pageTemplatePageStatsBlade from './routes/pageTemplatePageStatsBlade';
import pageTemplatePageStatsGameBlade from './routes/pageTemplatePageStatsGameBlade';
import pageTemplatePageSupportBlade from './routes/pageTemplatePageSupportBlade';
import pageTemplateTemplateGamescomBlade from './routes/pageTemplateTemplateGamescomBlade';
import pageTemplateTemplateInsiderLandingBlade from './routes/pageTemplateTemplateInsiderLandingBlade';

/**
 * Populate Router instance with DOM routes
 * @type {Router} routes - An instance of our router
 */
const routes = new Router({
  // All pages
  common,
  // Home page
  home,
  // About Us page, note the change from about-us to aboutUs.
  aboutUs,
  insiderSignup,
  profile,
  pageTemplatePageSupportBlade,
  //Mods pages
  pageTemplatePageModsAllBlade,
  pageTemplatePageModsCreateBlade,
  pageTemplatePageModsInstalledBlade,
  pageTemplatePageModsMineBlade,
  pageTemplatePageModsSingleBlade,
  // // Clans pages
  pageTemplatePageClansCreateBlade,
  postTypeArchiveClans,
  singleClans,
  // // Stats pages
  pageTemplatePageStatsBlade,
  pageTemplatePageStatsGameBlade,
  pageTemplatePageStatsMatchDetailsBlade,
  // pageTemplatePageStatsCampaignBlade,

  pageTemplateTemplateGamescomBlade,
  pageTemplateTemplateInsiderLandingBlade,
  ageOfEmpiresIv,
  singleHistory,
  postTemplateReleasesBlade,
  postTypeArchiveHistory,
  postTypeArchiveBuyNowPages,
});

/**
 * Load Events
 */
$(() => {

  $(function() {
    $("#toc a").click(function (e) {
      e.preventDefault();
      var id = $(this).attr("data-id");
      var $anchor = $('#' + id);
      var position = $anchor.offset().top - 20;

      $('html, body').animate({
        scrollTop: position,
      }, 500);
      return false;
    });
  })

  function playVid() {
    if(vid) {
      vid.addEventListener("loadedmetadata", fn);
      let fn = function(){
        vid.play();
      }
      if (vid.readyState >= 2) {
        fn();
      }
    }
  }

  if (!$('#banner-franchise-video').parent().hasClass('banner-franchise-background-video__ms-edge')) {
    objectFitVideos();

    var vid = document.getElementById("banner-franchise-video");

    playVid();
  }

  $('html').addClass(config.isMobileDevice ? 'mobile' : 'desktop');
  $(document).foundation();

  new ClanProfile();
  new CategorySelect();
  new Comments();

  routes.loadEvents();
});



