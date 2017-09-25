class CreatePictures < ActiveRecord::Migration[5.1]
  def change
    create_table :pictures do |t|
      t.references :creator, foreign_key: { to_table: :users }
      t.string :image
      t.text :note
      t.integer :height
      t.integer :width

      t.timestamps
    end

    create_table :pets_pictures, id: false do |t|
      t.belongs_to :pet, index: true
      t.belongs_to :picture, index: true

      t.timestamps
    end
    add_index :pets_pictures, [:pet_id, :picture_id], unique: true

    create_table :like_pictures do |t|
      t.integer :liker_id
      t.integer :liked_id

      t.timestamps
    end
    add_index :like_pictures, [:liker_id, :liked_id], unique: true
  end
end
