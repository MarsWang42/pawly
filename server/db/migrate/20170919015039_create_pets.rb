class CreatePets < ActiveRecord::Migration[5.1]
  def change
    create_table :pets do |t|
      t.string :name
      t.string :type
      t.references :owner, foreign_key: { to_table: :users }

      t.timestamps
    end
  end
end
