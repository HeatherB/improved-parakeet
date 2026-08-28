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

class WhAssetGameItem < WarehouseSkuAsset

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
          game = Game.nolock.find(acct.game_id)
          asset_fulfillment.game_account_id = acct.id

          case game.name.upcase
            when 'TERA'
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
            when 'ZMR'
              # Use send_mail facility to send items to a user
              zmr_send_mail(acct,
                            meta_hash["send_mail_title"] || '',
                            meta_hash["send_mail_sender"] || '',
                            meta_hash["send_mail_message"] || '',
                            meta_hash["item_code"],
                            meta_hash["send_mail_item_duration"] || '-1',
                            meta_hash["send_mail_item_count"] || '1',
                            log)
            when 'AVA'
              game_account_id = acct.id
              item_id = meta_hash['item_code'].to_i
              expire_date = (meta_hash['expire_date'].to_i rescue nil) || 365
              memo = meta_hash['memo'] || ''

              log << "Attempting to call send_item(#{game_account_id}, #{item_id}, #{expire_date}, '#{memo}')"
              res = GameTools::AVA::API.new.send_item(game_account_id, item_id, expire_date, memo)
              log << "Response: #{res}"
              case res['error_code']
                when 'not_found'
                  log << "Failed, error_message: #{res['message']}"
                  raise FulfillErrorWithRetry.new("send_item failed, error_emssage: #{res['message']}")
                when 'operation_error'
                  log << "Failed, error_message: #{res['message']}"
                  raise FulfillErrorWithRetry.new("send_item failed, error_message: #{res['message']}")
                when nil
                  log << 'Success'
              end
              asset_fulfillment.meta_json = af_meta.to_json
              asset_fulfillment.game_account_id = acct.id
            when 'KRITIKA'
              begin
                game_account_id = acct.id
                item_id = meta_hash['item_code']

                transaction_id = ""
                amount = 0
                quantity = 1
                purchased = false
                if asset_fulfillment.source_type == 'PromoCode'
                  pc ='PromoCode'.constantize.find_by_id(asset_fulfillment.source_id)
                  if pc.present? && pc.fulfillable_type == 'BillingTransaction' && pc.fulfillable_id.present?
                    bt = "BillingTransaction".constantize.find_by_id(pc.fulfillable_id)
                    if bt.present?
                      # purchased one
                      purchased = true

                      # getting transaction id
                      transaction_id = bt.provider_txn_key

                      # getting amount paid
                      matched = false
                      bt.billing_transaction_items.each do |bti|
                        if bti.meta_json.present?
                          meta_json = JSON.parse(bti.meta_json)
                          in_game_id = meta_json["in_game_id"]
                          if in_game_id == pc.promo_code
                            quantity = meta_json["quantity"].to_i
                            amount = meta_json["amount"].to_i
                            matched = true
                            break
                          end
                        end
                      end
                    end
                  end
                end

                quantity.times do |i|
                  log << trace_msg("Attempting to call send_item(#{game_account_id}, #{item_id}, #{amount}, #{transaction_id})")
                  res = GameTools::Kritika::API.new.send_item(game_account_id, item_id, amount, transaction_id, purchased)
                  log << trace_msg("Response: #{res}")
                  case res['error_code']
                  when nil
                    log << trace_msg('Success')
                  else
                    log << trace_msg("Failed, error_message: #{res['error_code']}")
                    cnt = asset_fulfillment.attempts
                    if cnt < 25
                      min = 2 ** (cnt + 1) 
                      min = 1440 if min > 1440      # cannot exceed 1 day
                      log << trace_msg("Retry will be run at #{min.minutes.from_now.to_s}")
                      raise FulfillErrorWithRetry.new("send_item failed, error_message: #{res['error_code']}", min.minutes.from_now)
                    else
                      log << trace_msg("Retry excceeded 25 times. Quit.")
                      raise RuntimeError.new("Retry exceeded 25 times")
                    end
                  end
                end

                asset_fulfillment.meta_json = af_meta.to_json
                asset_fulfillment.game_account_id = acct.id
              rescue FulfillErrorWithRetry => ex
                raise ex
              rescue Exception => ex
                log << trace_msg("Failed, error: #{ex.message} --- #{ex.backtrace}")
                cnt = asset_fulfillment.attempts
                if cnt < 25
                  min = 2 ** (cnt + 1) 
                  min = 1440 if min > 1440      # cannot exceed 1 day
                  log << trace_msg("Retry will be run at #{min.minutes.from_now.to_s}")
                  raise FulfillErrorWithRetry.new("Retry due to exception: #{ex.message}", min.minutes.from_now)
                else
                  log << trace_msg("Retry excceeded 25 times. Quit.")
                  raise RuntimeError.new("Retry exceeded 25 times")
                end
              end
            else
              raise RuntimeError.new("Cannot handle asset_fulfillment for game.name=#{game.name}")
          end

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

  def check_precondition(user, options)
    options = options.symbolize_keys
    pref_acct = options[:pref_account]
    acct_id = options[:game_account_id].to_i
    log = []
    begin
      game_account = get_asset_account(user, acct_id, log, { :pref_acct => pref_acct })
    rescue UserInputRequired => e
      # Ignore error, this error will be processed when fulfill! is called
      # Since there is no game_account to check, return immediately without error
      #
      # possible errors:
      #
      #   :none_eligible       => "User does not have any accounts eligible for this SKU",
      #   :selection_required  => "Requires selection of game account",
      #   :selected_ineligible => "Selected game account (ID: %s) is not eligible for this SKU",
      #   :selected_invalid    => "Selected game account does not exist or does not belong to this user"
      if e.message == ASSET_ERRORS[:none_eligible]
        game_account = nil
      else
        return nil
      end
    rescue => e
      return e.message
    end

    if game_account
      game_id = game_account.game_id
    else
      game_ids = self.warehouse_sku.applicable_game_ids()
      if game_ids.is_a?(Array) && game_ids.length > 0
        game_id = game_ids[0]
      else
        return nil
      end
    end
    game = Game.find(game_id)

    case game.name.upcase
      when 'TERA'
        #if game_account.nil? && user.game_accounts.where(:game_id => game.id).length == 0
        #  GameAccount.auto_account_creation(user, true, '/', game)
        #end
        # WAREHOUSE SKU applicable_game_accounts seems the best place to make game accounts -cr-
        return nil
      when 'ZMR'
        character_id = nil
        if game_account.nil?
          GameAccount.auto_account_creation(user, true, '/', game)
          return 'ZMR Game Account created Add ZMR Character and retry to redeem'
        else
          response = GameTools::API.new.game_account_search(game_account.id)
          if response.is_a?(Hash) && response.has_key?('characters')
            active_characters = response['characters'].select { |char| char['deleted'] == 0 }
            if active_characters.length >= 1
              character_id = active_characters.first['character_id'] rescue nil
            end
          end

          if character_id.nil?
            return 'User does not have any ZMR Character for this SKU'
          else
            return nil
          end
        end
      else
        return nil
    end
  end

  private

  def box_timeout_options
    { :rest_options => { :open_timeout => BOX_TIMEOUT, :timeout => BOX_TIMEOUT } }
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

  def zmr_send_mail(game_account, mail_title, mail_sender, mail_message, item_code, item_duration, item_count, log)
    # convert account.id to character_id
    # assumption: every game account has only one character.
    game_tools_api = GameTools::API.new
    response = game_tools_api.game_account_search(game_account.id)
    if response.is_a?(Hash) && response.has_key?('characters')
      active_characters = response['characters'].select { |char| char['deleted'] == 0 }
      if active_characters.length >= 1
        character_id = active_characters.first['character_id'] rescue nil

        if character_id.nil?
          log << trace_msg('Fail to convert character_id from character information')
          raise FulfillErrorWithRetry.new("Converting character_id from game account (game_account_id=#{game_account.id}) Failed")
        else
          # send mail with attachments
          log << trace_msg("Game account (game_account_id=#{game_account.id}) is converted to character (character_id=#{character_id})")
          attachments = "#{item_code},#{item_duration},#{item_count}"
          coins = 0

          begin
            res = game_tools_api.send_mail(character_id, mail_sender, mail_title, mail_message, attachments, coins)
          rescue => e
            log << trace_msg("Error occurred while communicating gametools, error='#{e}'")
            raise FulfillErrorWithRetry.new("Communication error")
          end

          # parse result
          res_hash = JSON.load res.body rescue {'error' => "Failed to decode res.body='#{res.body}'"}
          if res_hash == {}
            log << trace_msg("A mail is sent to character (character_id=#{character_id}) with attachment (attachment='#{attachments}')")
          else
            log << trace_msg("Sending a mail Failed, reason='#{res_hash}'")
            raise FulfillErrorWithRetry.new("Sending a mail Failed, reason='#{res_hash}'")
          end
        end
      else
        log << trace_msg('The account has no character to which mail is sent')
        raise FulfillErrorWithRetry.new("Converting character_id from game account (game_account_id=#{game_account.id}) Failed")
      end
    else
      log << trace_msg('Fail to fetch character information from ZMR server')
      raise FulfillErrorWithRetry.new("Converting character_id from game account (game_account_id=#{game_account.id}) Failed")
    end
  end
end

