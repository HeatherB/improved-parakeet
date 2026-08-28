class GameAccount < ActiveRecord::Base
  if Rails.env == "test"
    establish_connection :tera_game_portal_test
  else
    establish_connection :tera_game_portal
  end
  self.primary_key = "game_account_id"
  
  self.has_many :characters, :foreign_key => :source_account_id
  
end