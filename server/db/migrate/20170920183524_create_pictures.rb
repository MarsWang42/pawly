class CreatePictures < ActiveRecord::Migration[5.1]
  def change
    create_table :pictures do |t|
      t.references :creator, foreign_key: { to_table: :users }
      t.string :image

      t.timestamps
    end

    create_table :pets_pictures, id: false do |t|
      t.belongs_to :pet, index: true
      t.belongs_to :picture, index: true
    end
  end
end
