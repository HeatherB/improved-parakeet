# == Schema Information
#
# Table name: ava_account_migrations
#
#  id                       :integer          not null, primary key
#  user_id                  :integer          not null
#  random_token             :string(255)
#  ava_usn                  :string(255)
#  completed                :boolean
#  created_at               :datetime         not null
#  updated_at               :datetime         not null
#  game_account_id          :integer
#  last_response_from_aeria :string(255)
#  last_response_from_sp    :string(255)
#  last_error               :text
#

class AvaAccountMigration < ActiveRecord::Base
  attr_accessible :user_id, :game_account_id, :ava_usn, :completed, :random_token, :last_response_from_aeria,
                  :last_response_from_sp, :last_error
end
