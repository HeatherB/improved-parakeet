class SitePageController < ApplicationController

  def pages
      if params[:page_seo_id]
        @site_page = SitePage.pages.published.find_by_page_seo_id(params[:page_seo_id])
        redirect_to index_path unless @site_page
      end
    end
    
  def docs
    if params[:page_seo_id]
      @site_page = SitePage.docs.published.find_by_page_seo_id(params[:page_seo_id])
      redirect_to index_path unless @site_page
    end
  end

end
