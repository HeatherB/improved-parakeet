class KritikaGameAccountExLog < ActiveRecord::Base
	belongs_to :game_accounts
	attr_accessible :game_account_id, :event
end