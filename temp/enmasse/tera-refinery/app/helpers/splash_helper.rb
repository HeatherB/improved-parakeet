module SplashHelper
  
  def show_splash_page_partial
    !!(splash_page || age_gate_page)
  end
  
  def splash_page
    @splash_page ||= Rails.cache.fetch(Refinery::Page.cache_key_for("/splash")) do
      begin
        Refinery::Page.find("splash")
      rescue
        "none"
      end
    end
    return nil if @splash_page == "none" || @splash_page.draft?
    return @splash_page
  end

  def age_gate_page
    @age_gate_page ||= Rails.cache.fetch(Refinery::Page.cache_key_for("/age-gate")) do
      begin
        Refinery::Page.find("age-gate")
      rescue
        "none"
      end
    end
    return nil if @age_gate_page == "none" || @age_gate_page.draft?
    return @age_gate_page
  end
  
end