module AMS
  module Private
    class GlobalAlertsAPI < AMS::Private::BaseAPI

      helpers do
        def processed_conditions
          processed_conditions = {}
          return processed_conditions unless params[:conditions]
          params[:conditions].each { |k, v| processed_conditions[k] = v.blank? ? nil : v }
          processed_conditions
        end
      end

      resources :global_alerts do

        desc 'Find all global alerts',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          optional :conditions, type: Hash
          optional :order, type: String
        end
        get 'find_all',
            {
              entity:     AMS::Private::Entities::GlobalAlertsResponse,
              http_codes: [
                          ] + standard_error_codes
            } do
          order         = params[:order] || 'global_alerts.id ASC'
          global_alerts = GlobalAlert.nolock.where(processed_conditions).order(order)
          result        = {global_alerts: global_alerts}
          present result, with: AMS::Private::Entities::GlobalAlertsResponse
        end

        desc 'Find global alert',
             {
               notes: <<-NOTE

               NOTE
             }
        params do
          optional :conditions, type: Hash
          optional :order, type: String
        end
        get 'find',
            {
              entity:     AMS::Private::Entities::GlobalAlertResponse,
              http_codes: [
                          ] + standard_error_codes
            } do
          order        = params[:order] || 'global_alerts.id ASC'
          global_alert = GlobalAlert.nolock.where(processed_conditions).order(order).first
          result       = {global_alert: global_alert}
          present result, with: AMS::Private::Entities::GlobalAlertResponse
        end

      end
    end
  end
end
