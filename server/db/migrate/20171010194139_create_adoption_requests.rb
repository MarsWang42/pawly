class CreateAdoptionRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :adoption_requests do |t|
      t.references :adoption_applicant, foreign_key: { to_table: :users }, index: true
      t.references :adoption_pet_owner, foreign_key: { to_table: :users }, index: true
      t.references :pet, foreign_key: true, index: true
      t.string :email
      t.string :phone
      t.string :full_name
      t.text :introduction
      t.text :reason

      t.timestamps
    end
  end
end
