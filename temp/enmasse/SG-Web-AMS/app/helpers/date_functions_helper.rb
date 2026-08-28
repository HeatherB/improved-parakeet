module DateFunctionsHelper 
  def build_date_from_params(field_name, params)
    begin
      Date.new(params["#{field_name.to_s}(1i)"].to_i,
               params["#{field_name.to_s}(2i)"].to_i,
               params["#{field_name.to_s}(3i)"].to_i)
    rescue 
      nil
    end
  end
    
  def short_dist_of_time_in_words(from_time, to_time = 0, include_seconds = false, no_date = false)
    from_time = from_time.to_time if from_time.respond_to?(:to_time)
    to_time = to_time.to_time if to_time.respond_to?(:to_time)
    distance_in_minutes = (((to_time - from_time).abs)/60).round

    case distance_in_minutes
      when 0..1           then (distance_in_minutes==0) ? "seconds ago" : "1 min ago"
      when 2..59          then format("%i min ago", distance_in_minutes)
      when 60..90         then "1 hr ago"
      when 90..1440       then format("%i hrs ago", (distance_in_minutes.to_f / 60.0).round)
      when 1440..2160     then "1 day ago" # 1 day to 1.5 days
      when 2160..525600   then format("%i days ago", (distance_in_minutes.to_f / 1440.0).round) # 1.5 days to 365 days
      else 
        if no_date 
          format("%i days ago", (distance_in_minutes.to_f / 1440.0).round)
        else
          from_time.strftime("%b %d %Y, %I:%M%p %Z").to_s.gsub(/([AP]M)/) { |x| x.downcase }
        end
    end
  end
  
  def date_diff(from_time, to_time, range = 'day')
    from_time = from_time.to_time if from_time.respond_to?(:to_time)
    to_time = to_time.to_time if to_time.respond_to?(:to_time)

    diff_in_minutes = (((to_time - from_time).abs)/60).round

    case range
      when 'second'       then to_time - from_time
      when 'minute'       then diff_in_minutes
      when 'hour'         then (diff_in_minutes / 60).round
      when 'day'          then (diff_in_minutes / 1440).round
      else  diff_in_minutes
    end
  end
  
  def time_utc_with_format(fmt, t, nil_text="")
    t.present? ? t.in_time_zone("UTC").strftime(fmt) : nil_text
  end
  
end