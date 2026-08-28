module AMS
  module Private

    class VipPrizesAPI < AMS::Private::BaseAPI

      resources :vip_prizes do

        desc 'List vip prizes'
        params do
        end
        paginate
        get '',
            {
              entity:     AMS::Private::Entities::VipPrize,
              http_codes: [
                          ] + standard_error_codes
            } do
          vip_prizes = paginate(VipPrize)
          present vip_prizes, with: AMS::Private::Entities::VipPrize
        end

        desc 'Create a new vip prize'
        params do
          requires :name, type: String
          requires :vip_exp, type: Integer
          requires :prize_group_code, type: String
          requires :activated, type: Boolean
          requires :started_at, type: DateTime
          requires :ended_at, type: DateTime
        end
        post '',
             {
               entity:     AMS::Private::Entities::VipPrize,
               http_codes: [
                           ] + standard_error_codes
             } do
          vip_prize = VipPrize.create!(
            {
              name:             params[:name],
              vip_exp:          params[:vip_exp],
              prize_group_code: params[:prize_group_code],
              activated:        params[:activated],
              started_at:       params[:started_at],
              ended_at:         params[:ended_at]
            }
          )
          status 200
          present vip_prize, with: AMS::Private::Entities::VipPrize
        end

        route_param :vip_prize_id do
          desc 'Get the vip prize'
          params do
            requires :vip_prize_id, type: Integer
          end
          get '',
              {
                entity:     AMS::Private::Entities::VipPrize,
                http_codes: [
                            ] + standard_error_codes
              } do
            vip_prize = VipPrize.find(params[:vip_prize_id])
            present vip_prize, with: AMS::Private::Entities::VipPrize
          end

          desc 'Update the given vip_prize'
          params do
            requires :vip_prize_id, type: Integer
            optional :vip_exp, type: Integer
            optional :prize_group_code, type: String
            optional :activated, type: Boolean
            optional :started_at, type: DateTime
            optional :ended_at, type: DateTime
          end
          put '',
              {

              } do
            vip_prize = VipPrize.find(params[:vip_prize_id])
            VipPrize.transaction do
              vip_prize.vip_exp          = params[:vip_exp] if params[:vip_exp]
              vip_prize.prize_group_code = params[:prize_group_code] if params[:prize_group_code]
              vip_prize.activated        = params[:activated] if params[:activated]
              vip_prize.started_at       = params[:started_at] if params[:started_at]
              vip_prize.ended_at         = params[:ended_at] if params[:ended_at]
              vip_prize.save!
            end
            status 200
            present vip_prize, with: AMS::Private::Entities::VipPrize
          end

          desc 'Delete the given vip_prize'
          params do
            requires :vip_prize_id, type: Integer
          end
          delete '',
                 {
                   entity:     AMS::Private::Entities::ResultFlag,
                   http_codes: [
                               ] + standard_error_codes
                 } do
            vip_prize = VipPrize.find(params[:vip_prize_id])
            vip_prize.destroy
            status 200
            present({result: true}, AMS::Private::Entities::ResultFlag)
          end

        end

      end
    end
  end
end
