require 'partner_api'

class PartnerController < ApplicationController
    protect_from_forgery with: :null_session

    def create
       render text: PartnerAPI.add_partner(params)
    end

end