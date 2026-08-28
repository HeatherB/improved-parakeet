Refinery::Admin::PagesController.prepend(
  Module.new do
    def permitted_page_params
      super << [:top_of_head_code]
    end
  end
)