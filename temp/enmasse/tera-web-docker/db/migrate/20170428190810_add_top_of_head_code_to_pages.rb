class AddTopOfHeadCodeToPages < ActiveRecord::Migration
  def up
    add_column ::Refinery::Page.table_name, :top_of_head_code, :text
    Refinery::Page.reset_column_information
  end

  def down
    remove_column ::Refinery::Page.table_name, :top_of_head_code
    Refinery::Page.reset_column_information
  end
end