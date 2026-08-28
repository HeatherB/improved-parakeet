Refinery::Blog::Post.class_eval do
  #attr_accessible :header
  # Whitelist the :image_id parameter for form submission
  #attr_accessor :image_id
  #belongs_to :image
  translates :news_hero_field
  belongs_to :news_hero_field
  translates :teaser_img_field
  belongs_to :teaser_img_field

  belongs_to :teaser_image, :class_name => '::Refinery::Image'

  belongs_to :news_hero, :class_name => '::Refinery::Image'

  #protected

  	def post_params
  		params.require(:post).permit(:header, :news_hero_field, :teaser_img_field)
  	end

end