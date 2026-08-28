ClosersWebsite::Application.routes.draw do

  # This line mounts Refinery's routes at the root of your application.
  # This means, any requests to the root URL of your application will go to Refinery::PagesController#home.
  # If you would like to change where this extension is mounted, simply change the
  # configuration option `mounted_path` to something different in config/initializers/refinery/core.rb
  get '/partner-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301)
  get '/community/partner-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301)
  get '/partners-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301)
  get '/community/partners-program', to: redirect('http://www.enmasse.com/eme-partner-program', 301)
  get '/legal/privacy-policy' => redirect('http://www.enmasse.com/legal/privacy-policy-page', 301)
  get '/store' => redirect('https://store.enmasse.com/closers/items')
  get '/giveaway' => redirect('https://gleam.io/uOD84/closers-launch-giveaway')
  get '/about/harpy-vs-tina' => redirect('https://closers.enmasse.com/about/wolf-dogs#Tina')
  get '/account/emp' => 'account#emp'
  get '/artwork/submission' => 'artwork#submission'
  get '/bug-report' => redirect('http://support.enmasse.com/closers/tickets/submit')
  get '/store/collectors-edition' => redirect('https://store.enmasse.com/closers/packs', 301)

  # ambassador program
   post '/partner/create' => 'partner#create'

  get '/media/artwork-contests' => 'artwork#index'
  #get '/about/tiamat-raid' => 'promo#index'
  #get '/about/tiamat-raid-page' => 'promo#index'

  get '/about' => 'about#index'

  get '/cache/clear' => 'cache#clear'




  # 301 redirects
  #get '/media', to: redirect('/about/media', 301)

  #scope '/apps' do
  #  get 'heartbeat' => ClosersWebsite::Apps::HeartBeatApp
  #  get 'my_ip' => ClosersWebsite::Apps::MyIpApp
  #end
  #
  # We ask that you don't use the :as option here, as Refinery relies on it being the default of "refinery"
  #mount Refinery::Core::Engine, at: Refinery::Core.mounted_path
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
