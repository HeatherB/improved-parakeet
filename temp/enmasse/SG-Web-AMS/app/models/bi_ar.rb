class BiAR < ActiveRecord::Base
  self.abstract_class = true
  db="bi_#{Rails.env.to_s}"
  if Rails.env.production?
    begin
      self.establish_connection(db)
    rescue ActiveRecord::AdapterNotSpecified
    end
  end

  def self.get_emp_spent(user_id)
    # get amount of emp spent of the given user
    unless Rails.env.production?
      "NOT AVAILABLE"
    else
      begin
        result = self.execute_procedure("sp_AMS_Get_Amount_Of_dollar_Spent", user_id)
        result[0]["amount_of_dollar"]
      rescue
        0.0
      end
    end
  end

end