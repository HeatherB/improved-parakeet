class Ticket < ObjectShim

  def resolved?
    self.state == 'resolved'
  end

  def locked?
    self.state == 'locked'
  end

  def format_date_time_created
    self.created_at.to_time.in_time_zone("Pacific Time (US & Canada)").strftime("%F %I:%M%p %Z")
  end

  def format_date_time_updated
    self.updated_at.to_time.in_time_zone("Pacific Time (US & Canada)").strftime("%F %I:%M%p %Z")
  end

  class << self

    def per_page
      10
    end

  end

end
