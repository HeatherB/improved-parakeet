require 'responders'

module Refinery
  module Blog
    class PostsController < BlogController

      before_action :find_all_blog_posts, except: [:archive]
      before_action :find_blog_post, only: [:show, :comment, :update_nav]
      before_action :find_tags
      before_filter :available_locale_this_post, only: [:show]

      respond_to :html, :js, :rss


      def available_locale_this_post
        @post = Refinery::Blog::Post.friendly.find(params[:id])
        @available_locale_this_post = @post.translations


        next_post_id = @post.id + 1
        if Refinery::Blog::Post.friendly.where(:id => next_post_id).blank?
        else
          @post_next = Refinery::Blog::Post.friendly.find(next_post_id)
        end
        if @post_next
          @available_locale_next_post = @post_next.translations
        end

        previous_post_id = @post.id - 1
        if Refinery::Blog::Post.friendly.where(:id => previous_post_id).blank?
        else
          @post_previous = Refinery::Blog::Post.friendly.find(previous_post_id)
        end
        if @post_previous
          @available_locale_previous_post = @post_previous.translations
        end

        #@post_previous = @post
        #@available_locale_previous_post = @post_previous.translations
      end

      def index
        if request.format.rss?
          @posts = if params["max_results"].present?
            # limit rss feed for services (like feedburner) who have max size
            Post.recent(params["max_results"])
          else
            Post.newest_first.live.includes(:comments, :categories)
          end
        end
        respond_with (@posts) do |format|
          format.html
          format.rss { render layout: false }
        end
      end

      def show
        @comment = Comment.new

        @canonical = refinery.url_for(locale: Refinery::I18n.current_frontend_locale) if canonical?

        Post.increment_counter(:access_count, @post.id)

        respond_with (@post) do |format|
          format.html { present(@post) }
          format.js { render partial: 'post', layout: false }
        end
      end

      def comment
        @comment = @post.comments.create(comment_params)
        if @comment.valid?
          if Comment::Moderation.enabled? or @comment.ham?
            begin
              CommentMailer.notification(@comment, request).deliver_now
            rescue
              logger.warn "There was an error delivering a blog comment notification.\n#{$!}\n"
            end
          end

          if Comment::Moderation.enabled?
            flash[:notice] = t('thank_you_moderated', scope: 'refinery.blog.posts.comments')
            redirect_to refinery.blog_post_url(params[:id])
          else
            flash[:notice] = t('thank_you', scope: 'refinery.blog.posts.comments')
            redirect_to refinery.blog_post_url(params[:id],
                                      anchor: "comment-#{@comment.to_param}")
          end
        else
          render :show
        end
      end

      def archive
        if params[:month].present?
          date = "#{params[:month]}/#{params[:year]}"
          archive_date = Time.parse(date)
          @date_title = ::I18n.l(archive_date, format: '%B %Y')
          @posts = Post.live.by_month(archive_date).page(params[:page])
        else
          date = "01/#{params[:year]}"
          archive_date = Time.parse(date)
          @date_title = ::I18n.l(archive_date, format: '%Y')
          @posts = Post.live.by_year(archive_date).page(params[:page])
        end
        respond_with (@posts)
      end

      def tagged
        @tag = ActsAsTaggableOn::Tag.find(params[:tag_id])
        @tag_name = @tag.name
        @posts = Post.live.newest_first.distinct.tagged_with(@tag_name).page(params[:page])
      end

    private

      def comment_params
        params.require(:comment).permit(:name, :email, :message)
      end


    protected
      def canonical?
        Refinery::I18n.default_frontend_locale != Refinery::I18n.current_frontend_locale
      end
    end
  end
end