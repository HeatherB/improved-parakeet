Refinery::MetaHelper.class_eval do
  def browser_title(yield_title=nil)
    # in some cases @meta seems to be nil, which really causes issues.
    center = @meta.browser_title.presence || @meta.path.split(" - ").reverse.join(" | ") if @meta && @meta.path
    [ yield_title, center, Refinery::Core.site_name ].reject(&:blank?).join(" | ")
  end
end
