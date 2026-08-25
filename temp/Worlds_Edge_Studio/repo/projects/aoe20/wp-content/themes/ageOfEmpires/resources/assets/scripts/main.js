// import external dependencies
import 'jquery';

// Import everything from autoload
import './autoload/**/*'

// import local dependencies
import Router from './util/Router';
import common from './routes/common';
import home from './routes/home';
import singleGames from './routes/singleGames';
import indexData from './routes/indexData';
import insiderLanding from './routes/pageTemplateTemplateInsiderLanding';
import modsSingle from './routes/pageTemplatePageModsSingle';

/** Populate Router instance with DOM routes */
const routes = new Router({
  // All pages
  common,
  // Home page
  home,
  // Individual Game Pages
  singleGames,
  //
  indexData,
  // Insider Landing page
  insiderLanding,
  // Mods singlular page
  modsSingle,
});

// Load Events
jQuery(document).ready(() => routes.loadEvents());
