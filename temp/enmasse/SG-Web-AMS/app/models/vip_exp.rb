# == Schema Information
#
# Table name: vip_exps
#
#  id              :integer          not null, primary key
#  game_account_id :integer
#  game_exp        :integer
#  pub_exp         :integer
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#

class VipExp < ActiveRecord::Base
  belongs_to :game_account
  has_many :vip_exp_logs
  has_many :vip_prize_fulfillments

  attr_accessible :game_account_id, :game_exp, :pub_exp

  class Error < StandardError
  end

  class InsufficientVipPubExp < Error
    def initialize
      super('Insufficient VipPubExp to operate')
    end
  end

  def self.get_vip_exp(game_account_id)
    game_account = GameAccount.find(game_account_id)
    vip_exp = game_account.vip_exp
    vip_exp = VipExp.create!({game_account_id: game_account.id, game_exp: 0, pub_exp: 0}) if vip_exp.nil?
    vip_exp.refresh_game_exp
    vip_exp.save!
    vip_exp
  end

  def self.update_vip_pub_exp(game_account_id, vip_pub_exp, message, additional_info: nil)
    game_account = GameAccount.find(game_account_id)
    vip_exp = game_account.vip_exp
    vip_exp = VipExp.create!({game_account_id: game_account.id, game_exp: 0, pub_exp: 0}) if vip_exp.nil?
    before_vip_pub_exp = vip_exp.pub_exp
    vip_exp.refresh_game_exp
    vip_exp.pub_exp = vip_pub_exp
    vip_exp.notify_pub_exp_change
    vip_exp.process_vip_prize
    vip_exp.save!

    additional_info = {} if additional_info.nil?
    additional_info.merge!({vip_game_exp: vip_exp.game_exp, before_vip_pub_exp: before_vip_pub_exp, after_vip_pub_exp: vip_exp.pub_exp})
    additional_info = additional_info.to_json
    vip_exp.vip_exp_logs.create!({event_type: 'update', message: message, additional_info: additional_info})
    vip_exp
  end

  def self.notify_vip_game_exp_change(game_account_id, vip_game_exp)
    game_account = GameAccount.find(game_account_id)
    vip_exp = game_account.vip_exp
    vip_exp = VipExp.create!({game_account_id: game_account.id, game_exp: 0, pub_exp: 0}) if vip_exp.nil?
    vip_exp.game_exp = vip_game_exp
    vip_exp.process_vip_prize
    vip_exp.save!
    vip_exp
  end

  def self.add_vip_pub_exp(game_account_id, vip_pub_exp_add, message, additional_info: nil)
    game_account = GameAccount.find(game_account_id)
    vip_exp = game_account.vip_exp
    vip_exp = VipExp.create!({game_account_id: game_account.id, game_exp: 0, pub_exp: 0}) if vip_exp.nil?
    before_vip_pub_exp = vip_exp.pub_exp
    vip_exp.refresh_game_exp
    vip_exp.pub_exp = vip_exp.pub_exp + vip_pub_exp_add
    vip_exp.notify_pub_exp_change
    vip_exp.process_vip_prize
    vip_exp.save!

    additional_info = {} if additional_info.nil?
    additional_info.merge!({vip_game_exp: vip_exp.game_exp, before_vip_pub_exp: before_vip_pub_exp, after_vip_pub_exp: vip_exp.pub_exp})
    additional_info = additional_info.to_json
    vip_exp.vip_exp_logs.create!({event_type: 'add', message: message, additional_info: additional_info})
    vip_exp
  end

  def self.remove_vip_pub_exp(game_account_id, vip_pub_exp_remove, message, additional_info: nil)
    game_account = GameAccount.find(game_account_id)
    vip_exp = game_account.vip_exp
    vip_exp = VipExp.create!({game_account_id: game_account.id, game_exp: 0, pub_exp: 0}) if vip_exp.nil?
    if vip_exp.pub_exp < vip_pub_exp_remove
      raise InsufficientVipPubExp
    end
    before_vip_pub_exp = vip_exp.pub_exp
    vip_exp.refresh_game_exp
    vip_exp.pub_exp = vip_exp.pub_exp - vip_pub_exp_remove
    vip_exp.notify_pub_exp_change
    vip_exp.process_vip_prize
    vip_exp.save!

    additional_info = {} if additional_info.nil?
    additional_info.merge!({vip_game_exp: vip_exp.game_exp, before_vip_pub_exp: before_vip_pub_exp, after_vip_pub_exp: vip_exp.pub_exp})
    additional_info = additional_info.to_json
    vip_exp.vip_exp_logs.create!({event_type: 'remove', message: message, additional_info: additional_info})
    vip_exp
  end

  def refresh_game_exp
    adapter = GameAdapter.new(Game.find_by_name('TERA').settings(:fcgi_url))
    adapter_log = []
    res = adapter.make_request(:get_vip_game_exp, {game_account_id: self.game_account_id}, {}, adapter_log)
    unless res
      # error
      raise VipExp::Error.new(adapter_log.last)
    else
      self.game_exp = String.new(res).to_i  # RestClient::Response.to_i will return http status code, to avoid this problem, cast it to String
      self.save!
    end
  end

  def notify_pub_exp_change
    adapter = GameAdapter.new(Game.find_by_name('TERA').settings(:fcgi_url))

    adapter_log = []
    result = {:game_account_id => self.game_account_id}
    res = adapter.make_request(:query, { :game_account_id => self.game_account_id }, {}, adapter_log)
    unless res
      result[:error_message] = adapter_log.last
      result[:server_id] = nil
      result[:success] = false
    else
      server_id = res.split(' ').last.to_i rescue 0
      if server_id > 0
        adapter_log = []
        res = adapter.make_request(:update_vip_pub_exp, {server_id: server_id, game_account_id: self.game_account_id, pub_exp: self.pub_exp}, {}, adapter_log)
        unless res
          result[:error_message] = adapter_log.last
          result[:server_id] = server_id
          result[:success] = false
        else
          case res
            when '0'
              # success
              result[:error_message] = nil
              result[:server_id] = server_id
              result[:success] = true
            when '1'
              # failed
              result[:error_message] = 'failed by unknown reason'
              result[:server_id] = server_id
              result[:success] = false
            when '2'
              # not exist
              result[:error_message] = nil
              result[:server_id] = server_id
              result[:success] = true
          end
        end
      else
        result[:error_message] = nil
        result[:server_id] = server_id
        result[:success] = true
      end
    end
    result
  end

  def process_vip_prize
    # find any eligible vip prizes
    vip_exp = self.game_exp + self.pub_exp
    query = %{
            SELECT P.id
            FROM #{VipPrize.table_name} AS P LEFT JOIN
                  (SELECT vip_prize_id
                   FROM #{VipPrizeFulfillment.table_name}
                   WHERE game_account_id=#{self.game_account_id}) AS F
                 ON P.id = F.vip_prize_id
            WHERE F.vip_prize_id IS NULL and P.vip_exp < #{vip_exp}
            ORDER BY P.vip_exp
    }
    result = connection.select_rows(query)
    vip_prize_ids = result.map { |x| x[0] }
    options = {pref_acct: self.game_account_id}

    # redeem each vip prizes
    vip_prize_ids.each do |vip_prize_id|
      vip_prize = VipPrize.find(vip_prize_id) rescue nil
      VipPrizeFulfillment.transaction do
        vip_prize_fulfillment = VipPrizeFulfillment.where(game_account_id: self.game_account_id, vip_prize_id: vip_prize_id).lock.first
        if vip_prize_fulfillment.nil?
          vip_prize_fulfillment = VipPrizeFulfillment.create!(
            {
              game_account_id: self.game_account_id,
              vip_prize_id:    vip_prize_id
            })
        end

        if vip_prize_fulfillment.promo_code.nil? && vip_prize
          promo_code_used = nil
          error_message = nil
          begin
            promo_code_used = PromoCode.use_code(self.game_account.user, vip_prize.prize_group_code, options, true)
          rescue PromoCode::CodeNotFound => e
            # Probably group_promo_code is not registered yet. Process it next time.
            error_message = "#{e.class}: #{e.message}, Backtrace: #{"\n" + Utils.clean_trace(e.backtrace).join("\n")}"
          rescue Exception => e
            # For other errors, process it next time
            error_message = "#{e.class}: #{e.message}, Backtrace: #{"\n" + Utils.clean_trace(e.backtrace).join("\n")}"
          end

          if promo_code_used
            vip_prize_fulfillment.promo_code = promo_code_used
            vip_prize_fulfillment.fulfilled_at = Time.now.utc
            vip_prize_fulfillment.vip_exp_at = vip_exp
            vip_prize_fulfillment.last_error = nil
            vip_prize_fulfillment.save!
          else
            vip_prize_fulfillment.last_error = error_message
            vip_prize_fulfillment.attempts += 1
            vip_prize_fulfillment.save!
          end
        end
      end
    end
  end
end
