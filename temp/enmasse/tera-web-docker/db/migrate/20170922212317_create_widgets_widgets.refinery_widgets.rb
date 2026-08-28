# This migration comes from refinery_widgets (originally 1)
class CreateWidgetsWidgets < ActiveRecord::Migration

  def up
    create_table :refinery_widgets do |t|
      t.string :name
      t.text :content
      t.integer :position

      t.timestamps
    end

  end

  def down
    if defined?(::Refinery::UserPlugin)
      ::Refinery::UserPlugin.destroy_all({:name => "refinerycms-widgets"})
    end

    if defined?(::Refinery::Page)
      ::Refinery::Page.delete_all({:link_url => "/widgets/widgets"})
    end

    drop_table :refinery_widgets

  end

end
