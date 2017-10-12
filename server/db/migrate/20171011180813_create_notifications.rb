class CreateNotifications < ActiveRecord::Migration[5.1]
  def change
    create_table :notifications do |t|
      t.references :user, foreign_key: true, index: true
      t.references :notified_by, foreign_key: { to_table: :users }, index:true
      t.references :picture, foreign_key: true
      t.string :notice_type
      t.integer :identifier
      t.boolean :read, default: false

      t.timestamps null: false
    end
  end
end
