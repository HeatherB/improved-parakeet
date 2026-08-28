TeradockerWebsite::Application.routes.draw do

  # from old site
  get "launcher/welcome"
  get "launcher" => 'launcher#index'

  #scope '/diag' do
  #  match 'whatismyip' => TeradockerWebsite::MyIpApp
  #end

  #scope '/apps' do
  #  match 'heartbeat' => TeradockerWebsite::HeartBeatApp
  #end

  # redirect news rss feed
  #get 'news.rss', :to => 'posts#index', :as => 'rss_feed', :defaults => {:format => "rss"}
  get '/news.rss', :to => 'postsfilter#rssfeed', :defaults => {:format => "rss"}
  get '/news/feed.rss', :to => 'postsfilter#rssfeed', :defaults => {:format => "rss"}

  # redirect news page for platform filters
  get '/news' => 'postsfilter#routeByPlatformFilter'
  get '/en/news' => 'postsfilter#routeByPlatformFilter'
  get '/fr/news' => 'postsfilter#routeByPlatformFilterFrench'
  get '/de/news' => 'postsfilter#routeByPlatformFilterGerman'

  # Founders pack redirection
  get '/store/console-founders-packs', to: redirect('/', 301);
  get '/en/store/console-founders-packs', to: redirect('/', 301);
  get '/fr/store/console-founders-packs', to: redirect('/', 301);
  get '/de/store/console-founders-packs', to: redirect('/', 301);

  # FB Auth
  post 'auth/:provider/callback' => 'authorizations#callback'

  # MASS 301's to clean up CMS
  get '/partner-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301);
  get '/community/partner-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301);
  get '/partners-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301);
  get '/community/partners-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301);
  get '/what-is-tera', to: redirect('/game/what-is-tera-page', 301);
  get '/game/what-is-tera', to: redirect('/game/what-is-tera-page', 301);
  get '/data', to: redirect('/', 301)
  get '/data/elections', to: redirect('/', 301)
  get '/data/leaderboards/', to: redirect('/', 301)
  get '/data/leaderboards/guild-battles/', to: redirect('/', 301)
  get '/data/leaderboards/guild-battles/:board', to: redirect('/', 301)
  get '/data/leaderboards/dungeons/:dungeon/:board', to: redirect('/', 301)
  get "/data/leaderboards/my-guild-battles(:fmt)" , to: redirect('/', 301)
  get "/data/leaderboards/my-guild-battles/:board(:fmt)", to: redirect('/', 301)
  get '/data/leaderboards/my-dungeons/:dungeon/:board', to: redirect('/', 301)
  get '/game-guide/store-items', to: redirect('https://store.enmasse.com/', 301)
  get '/game-guide/store-items/packs', to: redirect('https://store.enmasse.com/tera/items/consumables', 301)
  get '/standalone-pages/closed-beta-test-schedule', to: redirect('https://account.enmasse.com/sign-up', 302)
  get '/standalone-pages/mmo-fo', to: redirect('/', 301)
  #get '/news/post/spice-up-your-holidays-with-tera-store-deals', to: redirect('/news/posts/spice-up-your-holidays-with-tera-store-deals', 301)
  get '/sign-up', to: redirect('https://account.enmasse.com/tera/sign-up/TERA-Organic', 301)
  get '/game-guide/federation-bills', to: redirect('/', 301)
  get '/game-guide', to: redirect('/game/what-is-tera', 301);
  get '/game-guide/what-is-tera', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/the-basics', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/races', to: redirect('/game/races', 301)
  get '/game-guide/races/aman', to: redirect('/game/races/aman', 301)
  get '/game-guide/races/baraka', to: redirect('/game/races/baraka', 301)
  get '/game-guide/races/castanic', to: redirect('/game/races/castanic', 301)
  get '/game-guide/races/elin', to: redirect('/game/races/elin', 301)
  get '/game-guide/races/high-elf', to: redirect('/game/races/high-elf', 301)
  get '/game-guide/races/human', to: redirect('/game/races/human', 301)
  get '/game-guide/races/popori', to: redirect('/game/races/popori', 301)
  get '/game-guide/classes', to: redirect('/game/classes', 301)
  get '/game-guide/classes/archer', to: redirect('/game/classes/archer', 301)
  get '/game-guide/classes/berserker', to: redirect('/game/classes/berserker', 301)
  get '/game-guide/classes/lancer', to: redirect('/game/classes/lancer', 301)
  get '/game-guide/classes/mystic', to: redirect('/game/classes/mystic', 301)
  get '/game-guide/classes/valkyrie', to: redirect('/game/classes/valkyrie', 301)
  get '/game-guide/classes/priest', to: redirect('/game/classes/priest', 301)
  get '/game-guide/classes/slayer', to: redirect('/game/classes/slayer', 301)
  get '/game-guide/classes/sorcerer', to: redirect('/game/classes/sorcerer', 301)
  get '/game-guide/classes/warrior', to: redirect('/game/classes/warrior', 301)
  get '/game-guide/classes/reaper', to: redirect('/game/classes/reaper', 301)
  get '/game-guide/classes/gunner', to: redirect('/game/classes/gunner', 301)
  get '/game-guide/classes/brawler', to: redirect('/game/classes/brawler', 301)
  get '/game-guide/classes/ninja', to: redirect('/game/classes/ninja', 301)
  get '/game-guide/gameplay', to: redirect('/game/what-is-tera', 301)
  get '/game-guide/gameplay/ui-and-controls', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/combat-indicators', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/the-brokerage', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/equipment', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/dyeing-your-gear', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/glyphs', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/accessory-crystals', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/crafting', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/enchanting', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/inventory', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/pets', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/achievements', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/groups', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/guilds', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/guilds/advanced-guild-management', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/the-shariar', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/the-invalesco', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/the-hands-of-velika', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/the-hyderad-legacy', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/the-valsekyr-hunt', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/the-agnitor', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/jax-trust', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/factions/unified-theory-institute', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/cross-level-play', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/pvp', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/endgame', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/dungeons', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/battlegrounds', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/gameplay/dreamstorm', to: redirect('/', 301)
  get '/game-guide/gameplay/dreamstorm/dreamstorm-schedule', to: redirect('/', 301)
  get '/game-guide/atlas', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-arun', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-arun/velika', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-arun/arcadia', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-arun/poporia', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-arun/val-aureum', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-arun/ostgarath', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-shara', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-shara/allemantheia', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-shara/essenia', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-shara/westonia', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-shara/val-palrada', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-shara/val-elenium', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/southern-shara/veritas-district', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/northern-shara', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/northern-shara/kaiator', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/northern-shara/sylvanoth', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/northern-shara/lorcada', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/northern-shara/val-tirkai', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/northern-shara/helkan-district', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/atlas/northern-shara/val-kaeli', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/lore', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/fan-fiction', to: redirect('/', 301)
  get '/game-guide/returning-players', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/understanding-stats', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/buddyup-system', to: redirect('/game/what-is-tera-pagea', 301)
  get '/game-guide/tera-rewards', to: redirect('/game/what-is-tera-page', 301)
  get '/game-guide/fang-and-feather', to: redirect('/', 301)
  get '/game-guide/broken-prison', to: redirect('/', 301)
  get '/game-guide/sword-and-hoard', to: redirect('/', 301)
  get '/game-guide/teras-5th-anniversary', to: redirect('/', 301)
  get '/game-guide/lakans-fury', to: redirect('/', 301)
  get '/game-guide/dragonsires-revenge', to: redirect('/', 301)
  get '/game-guide/spellbound', to: redirect('/', 301)
  get '/game-guide/summer-festival', to: redirect('/', 301)
  get '/game-guide/demons-wheel', to: redirect('/', 301)
  get '/consolebeta', to: redirect('http://tera.enmasse.com/news/posts/tera-console-open-beta-begins-march-9', 301)

  # twitchprime redirect, not an in-page link, refinery navigation wont cut it
  get '/twitchprime', to: redirect('https://account.enmasse.com/twitchprime', 301)
  get '/twitch-prime', to: redirect('https://account.enmasse.com/twitchprime', 301)

  # redirect for founders pack
  get '/founders-pack', to: redirect('/store/console-founders-packs', 301)

  get '/account/emp' => 'account#emp'

  get 'static/:page_name' => 'static#staticpage'

  get '/guardian-legion' => "event_page#staticpage", :page => 'guardian-legion'
  # end from old site

  # This line mounts Refinery's routes at the root of your application.
  # This means, any requests to the root URL of your application will go to Refinery::PagesController#home.
  # If you would like to change where this extension is mounted, simply change the
  # configuration option `mounted_path` to something different in config/initializers/refinery/core.rb
  get '/account/emp' => 'account#emp'
  # ambassador program
  post '/partner/create' => 'partner#create'

  get '/about' => 'about#index'

  get '/game/media' => 'media#index'

  get '/game/media/reRollScreenshots' => 'media#reRollScreenshots'


  get '/cache/clear' => 'cache#clear'

  #resource :server_status, :only => :show, :path => '/support/server-status'
  get '/support/server-status' => 'server_statuses#show'
  get '/support/server-status-page' => 'server_statuses#show'


  #get 'legal/privacy-policy' => 'pages#show', :as => :privacy_policy



# news post filters
  get '/postsfilter_all' => 'postsfilter#posts_filter_all'
  get '/postsfilter_windows' => 'postsfilter#posts_filter_windows'
  get '/postsfilter_playstation' => 'postsfilter#posts_filter_playstation'
  get '/postsfilter_xbox' => 'postsfilter#posts_filter_xbox'
  get '/featuredfilter' => 'postsfilter#rerollFeatured'

  post '/live-partners' => 'live#livestreamers'


 #scope "/:locale", locale: /#{I18n.available_locales.join("|")}/ do
 #   resources :blog
 #   root to: redirect("/%{locale}/news", status: 302)
 # end
  #root to: redirect("/#{I18n.default_locale}", status: 302), as: :redirected_root
  #get "/*path", to: redirect("/#{I18n.default_locale}/%{path}", status: 302), constraints: {path: /(?!(#{I18n.available_locales.join("|")})\/).*/}, format: false

  #scope '/apps' do
  #  get 'heartbeat' => TeradockerWebsite::Apps::HeartBeatApp
  #  get 'my_ip' => TeradockerWebsite::Apps::MyIpApp
  #end
  #
  # We ask that you don't use the :as option here, as Refinery relies on it being the default of "refinery"
  #mount Refinery::Core::Engine, at: Refinery::Core.mounted_path
  mount Refinery::Blog::Engine, :at => '/news'
  mount Refinery::Core::Engine, :at => '/'

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products
  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
