class BetaAccountTypeGrant < ActiveRecord::Base
	belongs_to :beta_access_window
	attr_accessible :beta_access_window_id, :account_type_id, :grant_code, :name, :description
end