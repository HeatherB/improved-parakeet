class InGameReport < ActiveRecord::Base
  attr_accessible :violation_reason,
                  :reporter_in_game_account_id,
                  :reporter_eme_game_account_id,
                  :reporter_in_game_character_name,
                  :reporter_additional_info,
                  :chat_line,
                  :target_in_game_account_id,
                  :target_eme_game_account_id,
                  :target_in_game_character_name,
                  :target_additional_info,
                  :reservved
end