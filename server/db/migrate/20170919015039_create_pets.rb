class CreatePets < ActiveRecord::Migration[5.1]
  def change
    create_table :pets do |t|
      t.string :name, null:false
      t.string :type, null:false
      t.string :avatar
      t.text :bio
      t.boolean :is_rescue
      t.boolean :is_missing
      t.references :owner, foreign_key: { to_table: :users }, index: true

      t.timestamps
    end
  end
end
