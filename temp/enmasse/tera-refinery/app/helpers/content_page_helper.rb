module ContentPageHelper
  def content_page_for(page)
    ContentPage.for(page, self)
  end

  class ContentPage
    def self.for(page, view_context)
      new(page, view_context).to_html
    end

    delegate :content_tag, :render, :to => :@view_context
    delegate :content_for, :to => :@page

    def initialize(page, view_context)
      @page, @view_context = page, view_context
    end

    def to_html
      if body_content?
        [
          header,
          body,
          footer
        ].join("\n").html_safe
      else
        [
          header,
          footer
        ].join("\n").html_safe
      end
    end

    def body_content?
      !body.strip.blank?
    end

    def header
      header = content_for(:article_header)
      section(:article_header, header, {:class => "article_header row"}) if header.present?
    end

    def footer
      footer = content_for(:article_footer)
      section(:article_footer, footer, {:class => "article_footer row"}) if footer.present?
    end

    def body
      [split_body, wide_body].join("\n")
    end

    def wide_body
      wide_body = content_for(:wide_body)

      return "" unless wide_body.present? || image_gallery?

      section(:wide_body, [wide_body, image_gallery].join("\n"), :class => "row")
    end

    def split_body
      body, side_body = content_for(:body), content_for(:side_body)

      return "" unless body.present? || side_body.present?

      split_body = [
        section(:body_content_left, body, :class => 'eight columns'),
        section(:body_content_right, side_body, :class => 'four columns')
      ].join("\n")

      section(:split_body, split_body, :class => 'row')
    end

    def section(name, content, opts = {})
      opts[:id] = name
      content_tag :section, (content || "").html_safe, opts
    end

    def image_gallery
      items = @page.images
      image_gallery? ? render("shared/gallery", :items => items) : ""
    end

    def image_gallery?
      @page.images.present?
    end
  end
end
