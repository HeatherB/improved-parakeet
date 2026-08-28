class KritikaGameAccountEx < ActiveRecord::Base

	belongs_to :game_account

	validates :world_selection, inclusion: { in: ['na', 'eu', 'none'], message: "%{value} is not a vaild world" }

end