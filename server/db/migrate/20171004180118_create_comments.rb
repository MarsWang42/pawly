class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.references :author, foreign_key: { to_table: :users }
      t.integer :target_id
      t.references :picture, foreign_key: true
      t.text :body

      t.timestamps
    end
  end
end
