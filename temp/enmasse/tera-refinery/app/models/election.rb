class Election
  #if Rails.env == "test"
  #  establish_connection :tera_game_portal_test
  #else
  #  establish_connection :tera_game_portal
  #end
  
  #has_many :campaigns
  #belongs_to :candidate
  
  DAY_ZERO = Date.new(2012, 5, 18)
  FOUR_WEEK_CHANGEOVER = Date.new(2012, 7, 20)
  
  @timestamp = nil
  attr_reader :state, :first_day, :round
  
  def initialize(timestamp)
    @timestamp = timestamp
    if @timestamp.kind_of? Time
      @timestamp = @timestamp.getutc
    end
    
    if @timestamp > FOUR_WEEK_CHANGEOVER
      @round = 4 + ((@timestamp.to_date - FOUR_WEEK_CHANGEOVER).to_i / 28)
      @first_day = FOUR_WEEK_CHANGEOVER + ((@round - 4) * 28)
    elsif @timestamp > DAY_ZERO
      @round = ((@timestamp.to_date - DAY_ZERO).to_i / 21) + 1
      @first_day = DAY_ZERO + ((@round-1) * 21)
    else
      raise RuntimeError, "No elections before #{DAY_ZERO}"
    end
    @state = if @timestamp >= @first_day + 14
      :reign
    elsif @timestamp >= @first_day + 7
      :competition
    else
      :registration
    end
    self
  end
  
  def self.at(timestamp)
    return self.new(timestamp)
  end
  
  def self.now
    return self.new(Time.now)
  end
  
end
