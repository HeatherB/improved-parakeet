class BetaAccessWindow < ActiveRecord::Base

	belongs_to :game
	has_many :beta_account_type_grants
	attr_accessible :game_id, :name, :from, :to, :default_grant_code, :description, :active

	scope :active, :conditions => { :active => true }

	def self.get_grant_code(game_id, user)

		# get account_type_id from user
		game_accounts = user.game_accounts.active.where(:game_id => game_id)
		return nil unless game_accounts.present?
		game_account = game_accounts.first
		account_type_id = game_account.game_account_type

		# find window
		windows = BetaAccessWindow.active.where(:game_id => game_id)
		now = Time.now
		window = nil
		windows.each do |w|
			if w.from <= now && now <= w.to
				window = w
				break
			end
		end

		# if no window matches, return nil
		return nil unless window.present?

		grants = window.beta_account_type_grants.where(:account_type_id => account_type_id)
		return window.default_grant_code unless grants.present?
		return grants.first.grant_code
		
	end
end