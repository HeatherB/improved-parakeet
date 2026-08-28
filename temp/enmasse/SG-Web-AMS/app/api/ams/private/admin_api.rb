module AMS
  module Private
  	class AdminAPI < AMS::Private::BaseAPI

  		resources :admin do
  			resources :betaaccesswindow do
  				desc 'list'
  				get 'list' do

  					if params['id'].present?
  						beta = BetaAccessWindow.find(params['id'].to_i)
  						game = Game.find(beta.game_id)
  						beta['game'] = game
  						return beta
  					else 
  						betas = BetaAccessWindow.all
  						betas.each do |b|
  							b['game'] = Game.find(b.game_id)
  						end
  						return {:total => betas.count, :data => betas}	
  					end  			
  				end

  				desc 'update'
  				post 'update' do
  					if params['id'].present?
  						beta = BetaAccessWindow.find(params['id'].to_i)
  						keys = params.keys
  						attrs = {}
  						keys.each do |k|
  							if BetaAccessWindow.column_names.include? k
  								attrs[k] = params[k]
  							end	
  						end
  						beta.update_attributes!(attrs)
  					end
  					return {:success => true}
  				end

          desc 'create'
          post 'create' do
            keys = params.keys
            attrs = {}
            keys.each do |k|
              if (BetaAccessWindow.column_names.include?(k) && params[k].present?)
                attrs[k] = params[k]
              end
            end
            Rails.logger.info "bbbbbbbb #{attrs.inspect}"
            BetaAccessWindow.create!(attrs)
            return {:success => true}
          end

          desc 'destroy'
          post 'destroy' do
            if params['id'].present?
              beta = BetaAccessWindow.find(params['id'].to_i)
              beta.destroy
            end
            return {:success => true}
          end
		  	end

        resource :betaaccounttypegrant do
          desc 'list'
          get 'list' do
            if params['filter'].present?
              _filters = params['filter']
              filters = JSON.parse(_filters)
              where = {}
              filters.each do |f|
                where[f["property"]] = f["value"]
              end
              Rails.logger.info "++++++++ where: #{where.inspect}"
              grant = BetaAccountTypeGrant.where(where)
            else
              grant = BetaAccountTypeGrant.all
            end
            grant.each do |g|
              g['beta_access_window'] = BetaAccessWindow.find(g.beta_access_window_id)
              g['account_type'] = GameAccountType.find(g.account_type_id)
            end
            return {:total => grant.count, :data => grant}
          end

          desc 'update'
          post 'update' do 
            if params['id'].present?
              grant = BetaAccountTypeGrant.find(params['id'].to_i)
              keys = params.keys
              attrs = {}
              keys.each do |k|
                if BetaAccountTypeGrant.column_names.include? k
                  attrs[k] = params[k]
                end
              end
              grant.update_attributes!(attrs)
            end
            return {:success => true}
          end

          desc 'create'
          post 'create' do
            keys = params.keys
            attrs = {}
            keys.each do |k|
              if (BetaAccountTypeGrant.column_names.include?(k) && params[k].present? && k != 'id')
                attrs[k] = params[k]
              end
            end
            BetaAccountTypeGrant.create!(attrs)
            return {:success => true}
          end

          desc 'destroy'
          post 'destroy' do
            if params['id'].present?
              grant = BetaAccountTypeGrant.find(params['id'].to_i)
              grant.destroy
            end
            return {:success => true}
          end
        end

        resource :accounttype do
          desc 'list'
          get 'list' do
            if params['filter'].present?
              _filters = params['filter']
              filters = JSON.parse(_filters)
              where = {}
              filters.each do |f|
                where[f["property"]] = f["value"]
              end
              Rails.logger.info "++++++++ where: #{where.inspect}"
              accounts = GameAccountType.where(where)
            else
              accounts = GameAccountType.all
            end

            accounts.each do |a|
              a['game'] = Game.find(a.game_id)
            end
            return {:total => accounts.count, :data => accounts}
          end
        end

		  	resources :game do
		  		desc 'list'
		  		get 'list' do

		  			if params['id'].present?
		  				game = Game.find(params['id'].to_i)
		  				return game
		  			else
		  				games = Game.all
		  				return {:total => games.count, :data => games}
		  			end
		  		end
		  	end
		  end
	  end
  end
end