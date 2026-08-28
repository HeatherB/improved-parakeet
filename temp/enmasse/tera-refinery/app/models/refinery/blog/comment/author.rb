module Refinery
  module Blog
    class Comment
      class Author < ActiveRecord::Base
        has_many :comments

        def self.update_name_for(account_id, name)
          return unless account_id && name

          find_or_initialize_by_account_id(account_id).
            update_attributes!(:name => name)
        end
      end
    end
  end
end
