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

class WhAssetChronoScroll < WarehouseSkuAsset

  def fulfill!(asset_fulfillment)
    error_msg = nil
    user = asset_fulfillment.user
    af_meta = JSON.parse(asset_fulfillment.meta_json) if asset_fulfillment.meta_json.present?
    af_meta ||= {}
    acct_id, acct = af_meta["game_account_id"].to_i, nil
    meta_hash = JSON.parse(self.meta_json)

    write_log(asset_fulfillment) do |log|
      self.class.transaction(:requires_new => true) do
        begin
          acct = get_asset_account(user, acct_id, log, { :pref_acct => af_meta["pref_acct"], :creation_path => af_meta["creation_path"] })
          quantity = (af_meta["quantity"] || 1).to_i rescue 1
          csr = create_chrono_scroll_redemption(acct, meta_hash["item_code"], log)
          game = Game.nolock.find(acct.game_id)
          asset_fulfillment.game_account_id = acct.id
          game_item = GameItem.where(item_code: meta_hash['item_code']).first
          if quantity > 1 && game_item && game_item.description && !game_item.description.empty? && game_item.item_sn && !game_item.item_sn.empty?
            log << trace_msg("Use CreateBoxSimple, quantity=#{quantity}")
            txn_id = get_box_transaction_id(game, log)
            create_box_simple(asset_fulfillment, acct, txn_id, game_item, quantity, log)
            af_meta['box_txn_id'] = txn_id
            log << trace_msg("box transaction id: #{txn_id}")
          else
            log << trace_msg("Use CreateBoxTemplate, quantity=#{quantity}")
            box_txn_id_list = []
            quantity.times do
              txn_id = get_box_transaction_id(game, log)
              create_box_from_template(asset_fulfillment, acct, txn_id, game_item, log)
              box_txn_id_list << txn_id
            end
            af_meta['box_txn_id'] = box_txn_id_list
            log << trace_msg("box transaction id: #{box_txn_id_list}")
          end

          # Notify player that their item was redeemed
          box_notification(acct, log)

          # we're done... mark that this item was redeemed by the account
          asset_fulfillment.meta_json = af_meta.to_json
          asset_fulfillment.game_account_id = acct.id

        rescue FulfillErrorWithRetry => fewr

          # without this workaround, the ENTIRE transaction (including promocode redemption status and logs) gets rolled back
          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = fewr.message
          raise ActiveRecord::Rollback

        rescue ActiveRecord::StatementInvalid => e

          log << trace_msg("Rolling back transaction and adding to retry queue")
          error_msg = e.message
          raise ActiveRecord::Rollback

        end
      end

      raise FulfillErrorWithRetry.new(error_msg) if error_msg.present?

    end
  end

  def fields_for_user_input
    [:game_account_id]
  end

  private

  def create_chrono_scroll_redemption(acct, item_code, log)
    log << trace_msg("Creating chrono scroll redemption record")

    out = acct.chrono_scroll_redemptions.new(
      :user_id     => acct.user_id,
      :game_id     => acct.game_id,
      :box_item_id => item_code
    )

    if out.save
      log << trace_msg("Record created: Chrono ID = #{out.id}")
      out
    else
      err = "Failed to create chrono scroll redemption record: #{out.errors.full_messages.to_sentence}"
      raise FulfillErrorWithRetry.new(err)
    end
  end

  def get_box_transaction_id(game, log)
    log << trace_msg('Fetching BOX transaction ID')
    begin
      txn_id = Box.get_box_transaction_id(log, game)
    rescue Box::BoxError => e
      raise FulfillErrorWithRetry.new(e)
    end
    return txn_id
  end

  def create_box_simple(asset_fulfillment, acct, txn_id, game_item, quantity, log)
    log << trace_msg("Attempting to create BOX: #{game_item.item_code} for Account ID: #{acct.id} - #{acct.account_name}")
    begin
      Box.create_box_simple(log, acct.id, txn_id, game_item, quantity, asset_fulfillment.id)
    rescue Box::BoxError => e
      raise FulfillErrorWithRetry.new(e)
    end
  end

  def create_box_from_template(asset_fulfillment, acct, txn_id, game_item, log)
    log << trace_msg("Attempting to create BOX for Template ID: #{game_item.item_code} for Account ID: #{acct.id} - #{acct.account_name}")
    begin
      Box.create_box_template(log, acct.id, txn_id, game_item, asset_fulfillment.id)
    rescue Box::BoxError => e
      raise FulfillErrorWithRetry.new(e)
    end
  end

  def box_notification(acct, log)
    Box.box_notify(log, acct.id)
  end

end

