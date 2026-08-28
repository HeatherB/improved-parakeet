# == Schema Information
#
# Table name: warehouse_sku_assets
#
#  id               :integer          not null, primary key
#  warehouse_sku_id :integer
#  game_id          :integer
#  type             :string(255)
#  title            :string(255)
#  meta_json        :text
#  created_at       :datetime         not null
#  updated_at       :datetime         not null
#  deleted          :boolean          default(FALSE)
#

class WhAssetEmail < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    meta_hash = JSON.parse(self.meta_json)
    error_msg = nil
    
    write_log(asset_fulfillment) do |log|
      
      self.class.transaction(:requires_new => true) do
        user = asset_fulfillment.user
        sku = self.warehouse_sku
        template_id = meta_hash["email_template_id"]
                
        # TODO : perhaps we want to ensure that the template provided is an existing template?
        # Left out for now as it entails making an additional (and realtime) request to BlueHornet or ExactTarget to
        # get the available templates. Prefer to leave out the extra overhead and put the onus on
        # the person setting up the asset to ensure it is valid.
        error_msg = "Missing Email Template ID. The template ID must correspond to an existing #{Mailer.name} Message Template"
        raise error_msg if template_id.blank?
        
        email_params = {
          :name => user.screen_name_no_temp,
          :language => user.language,
          :sku_title => sku.title,
          :sku_description => sku.description
        }
        
        log << trace_msg("Sending Email via #{Mailer.name} - Template: #{template_id}")
        Mailer::Transactional.send_later(:send_transaction, user.email, template_id, email_params)
        log << trace_msg("Emailed queued for delivery")
      end      

    end
    
  end
  
end
