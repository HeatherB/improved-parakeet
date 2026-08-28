class TicketResponse < ObjectShim

  def parsed_body(include_admin=false)
    # for chat logs, the messages are encoded as a json array
    begin
      result = JSON.parse(self.body)

      if include_admin && self.supervisor_body
        begin
          supervisor_result = JSON.parse(self.supervisor_body)
          result = result + supervisor_result if supervisor_result && supervisor_result.respond_to?(:to_ary)
        rescue Exception => ex
          # Ignore invalid supervisor messages
        end
      end

      result = result.sort { |x,y| x["time"] <=> y["time"] }
    rescue JSON::ParserError => pe
      result = self.body
    rescue Exception => ex
      result = "There was an error parsing this ticket response."
    end

    result
  end

  def format_date_time_created
    self.created_at.to_time.in_time_zone("Pacific Time (US & Canada)").strftime("%F %I:%M%p %Z")
  end

  class << self

    def per_page
      10
    end

  end

end
