# == Schema Information
#
# Table name: paid_states
#
#  id         :integer          not null, primary key
#  user_id    :integer          not null
#  game_id    :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class PaidState < ActiveRecord::Base
  belongs_to :user
  belongs_to :game

  attr_accessible :user_id, :game_id

  def self.set!(params)
    user_id = params[:user_id] || params[:user].id
    game_id = params[:game_id] || params[:game].id
    PaidState.create!(params) unless PaidState.find_by_user_id_and_game_id(user_id, game_id)
  end

end
