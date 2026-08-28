class PGModel < ActiveRecord::Base
  establish_connection :"postgres_db_#{Rails.env}"
  self.abstract_class = true
  
end
