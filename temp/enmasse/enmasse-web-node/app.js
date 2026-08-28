require('dotenv').config()
var path = require('path');

var apostropheAttachments = {};
if (process.env.UPLOADFS_STORAGE == 'azure') {
  apostropheAttachments = {
    uploadfs: {
      storage: 'azure',
      account: process.env.UPLOADFS_ACCOUNT,
      container: process.env.UPLOADFS_CONTAINER,
      key: process.env.UPLOADFS_KEY,
      disabledFileKey: process.env.UPLOADFS_DISABLED_FILE_KEY,
    }
  };
  if (process.env.UPLOADFS_CDN_ENABLED == 'true') {
    apostropheAttachments.uploadfs.cdn = {
      enabled: true,
      url: process.env.UPLOADFS_CDN_URL,
    };
  }
}

var apos = require('apostrophe')({
  shortName: 'enmasse-website',
  // the blog bundle must be declared!
  bundles: [ 'apostrophe-blog' ],
  // See lib/modules for basic project-level configuration of our modules
  // responsible for serving static assets, managing page templates and
  // configuring user accounts.

  modules: {

    // Apostrophe module configuration

    // Note: most configuration occurs in the respective
    // modules' directories. See lib/apostrophe-assets/index.js for an example.
    
    // However any modules that are not present by default in Apostrophe must at
    // least have a minimal configuration here: `moduleName: {}`

    // If a template is not found somewhere else, serve it from the top-level
    // `views/` folder of the project
    'enmasse-helpers': { alias:'enMasse' },
    'apostrophe-redirects': {statusCode: 301},
    'apostrophe-templates': { viewsFolderFallback: path.join(__dirname, 'views') },
    'apostrophe-pages': {
      types: [
        {
          name: 'default',
          label: 'Default'
        },
        {
          name: 'apostrophe-blog-page',
          label: 'News'
        },
        {
          name: 'legal',
          label: 'Legal'
        },
        {
          name: 'games',
          label: 'Games'
        },
        {
          name: 'jobs',
          label: 'Jobs'
        },
        {
          name: 'devportal',
          label: 'Developer Portal'
        },
        {
          name: 'partnerprogram',
          label: 'Partner Program'
        },
        {
          name: 'receipt',
          label: 'Receipt'
        },
        {
          name: 'dc_release',
          label: 'DC Release'
        },
        {
          name: 'quiz',
          label: 'Quiz'
        },
        {
          name: 'home',
          label: 'Home'
        }
      ],
      filters: {
        // pull ancestor pages, with two levels of subpages
        ancestors: { 
          children: { 
            depth: 2
          }
        }
      },
      // pull current page children
      children: true,
      // enable rest api
      restApi: true
    },
    // our modules
    'slides': { extend: 'apostrophe-pieces' },
    'slides-widgets': { extend: 'apostrophe-pieces-widgets',
      filters: {
        projection: {
          slug: 1,
          title: 1,
          type: 1,
          tags: 1,
          headline: 1,
          bodycopy: 1,
          btnlabel: 1,
          btnlink: 1,
          slidevid: 1,
          imgpath: 1,
          leftcolor: 1,
          rightcolor: 1
        }
      }
     },

    'videos': { extend: 'apostrophe-pieces' },
    'videos-widgets': { extend: 'apostrophe-pieces-widgets',
      filters: {
        projection: {
          slug: 1,
          title: 1,
          type: 1,
          tags: 1,
          headline: 1,
          bodycopy: 1,
          logopath: 1,
          youtubepath: 1,
          videopath: 1
        }
      }
     },

    'dcmedias': { extend: 'apostrophe-pieces' },
    'dcmedias-widgets': { extend: 'apostrophe-pieces-widgets',
      filters: {
        projection: {
          slug: 1,
          type: 1,
          tags: 1,
          mediavid: 1,
          mediaimgpath: 1
        }
      }
     },

    'games': { extend: 'apostrophe-pieces' },
    'games-widgets': { 
      extend: 'apostrophe-pieces-widgets',
      filters: {
        projection: {
          slug: 1,
          title: 1,
          type: 1,
          tags: 1,
          bodycopy: 1,
          btnlabel: 1,
          btnlink: 1,
          imgpath: 1,
          iconxbox: 1,
          iconwin: 1,
          iconmac: 1,
          iconps: 1,
          iconswitch: 1
          /*genre: 1,
          developer: 1,
          releasedate: 1,
          esrbpending: 1,
          esrbe: 1,
          esrbeplus: 1,
          esrbteen: 1,
          esrbmature: 1,
          esrbadults: 1,
          esrbextra: 1,*/
        }
      }
    },
    /* sitemap and robots module */
    'apostrophe-site-map': {
      baseUrl: 'https://www.enmasse.com/',
      excludeTypes: []
    },
    /* not quite ready, probably not acturally going to use */
    'devcontact-form': { extend: 'apostrophe-pieces' },
    'devcontact-form-widgets': { extend: 'apostrophe-widgets' },

    'partnercontact-form': { extend: 'apostrophe-pieces' },
    'partnercontact-form-widgets': { extend: 'apostrophe-widgets'},
    'apostrophe-attachments': apostropheAttachments,
    'apostrophe-blog': {
      restApi: {
        maxPerPage: 8,
        safeDistinct: [ "tags" ]
      },
      contextual: true,
      // apiKeys: ['DcKbO5vZZ4Cp5feygcwVRdMOpDP7AyL'] <== enable for testing non GET requests. disable by default
    },
    'apostrophe-blog-pages': {},
    'apostrophe-blog-widgets': {},
    'apostrophe-headless': {
      // apiKeys: [] <== enable for testing non GET requests. disable by default
    },
    // build out RSS feeds for blog
    'rss': {},
    'apostrophe-i18n':{
      locales:['en-us', 'fr', 'de', 'es-eu', 'es-la', 'it', 'pt', 'zh', 'ja', 'ko'],
      defaultLocale: 'en-us'
    },
    'apostrophe-workflow': {
      prefixes: {
        'fr': '/fr',
        'de': '/de',
        'es-eu': '/es-eu',
        'es-la': '/es-la',
        'it': '/it',
        'pt': '/pt',
        'zh': '/zh',
        'ja': '/ja',
        'ko': '/ko',
      },
      locales: [
        {
          name: 'en-us',
          label: 'English (US)',
          private: false,
          children: [
            {
              name: 'de',
              label: 'Deutsche',
              stylesheet: 'de'// account for text size in language change
            },
            {
              name: 'es-eu',
              label: 'Español ( EU )',
              stylesheet: 'es-eu'// account for text size in language change
            },
            {
              name: 'es-la',
              label: 'Español ( LA )',
              stylesheet: 'es-la'// account for text size in language change
            },
            {
              name: 'fr',
              label: 'Français',
              stylesheet: 'fr'// account for text size in language change
            },
            {
              name: 'it',
              label: 'Italiano',
              stylesheet: 'it'// account for text size in language change
            },
            {
              name: 'pt',
              label: 'Português',
              stylesheet: 'pt'// account for text size in language change
            },
            {
              name: 'zh',
              label: '中文'
            },
            {
              name: 'ja',
              label: '日本語',
              stylesheet: 'ja'
            },
            {
              name: 'ko',
              label: '한국어',
              stylesheet: 'ko'
            }

          ],
        },
      ],
      defaultLocale: 'en-us',
      // be sure to set this so the templates work
      alias: 'workflow',
      // Recommended to save database space. You can still
      // export explicitly between locales
      replicateAcrossLocales: false
    },
    'apostrophe-workflow-modified-documents': {}
  }
});