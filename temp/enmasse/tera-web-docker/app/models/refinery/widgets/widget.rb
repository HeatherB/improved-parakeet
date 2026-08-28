module Refinery
  module Widgets
    class Widget < Refinery::Core::BaseModel
      self.table_name = 'refinery_widgets'

      #attr_accessible :name, :content, :position
      def widget_params
      		params.require(:widget).permit(:name, :content, :position)
      end

      acts_as_indexed :fields => [:name, :content]

      validates :name, :presence => true, :uniqueness => true
    end
  end
end