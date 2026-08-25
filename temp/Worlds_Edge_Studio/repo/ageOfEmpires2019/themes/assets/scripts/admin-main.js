if (module.hot) module.hot.accept();

import Router from './util/Router';
import toolsPageModsModeration from './routes/toolsPageModsModeration';
import toolsPageShorturlAdmin from './routes/toolsPageShorturlAdmin';

/**
 * Populate Router instance with DOM routes
 * @type {Router} routes - An instance of our router
 */
const adminRoutes = new Router({

    toolsPageModsModeration,
    toolsPageShorturlAdmin,  
});

/**
 * Load Events
 */
$(() => {   
  adminRoutes.loadEvents();
});


