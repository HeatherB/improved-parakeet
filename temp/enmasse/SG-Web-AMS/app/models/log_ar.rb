class LogAR < ActiveRecord::Base
  self.abstract_class = true
  db="logdb_#{Rails.env}"
  self.establish_connection(db)

  def self.perform_migration(&block)
    ActiveRecord::Base.establish_connection(ActiveRecord::Base.configurations["logdb_#{Rails.env}"])
    yield
  ensure
    ActiveRecord::Base.establish_connection(ActiveRecord::Base.configurations[Rails.env])
  end

end