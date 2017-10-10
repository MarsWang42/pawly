class CreateAdoptionRequests < ActiveRecord::Migration[5.1]
  def change
    create_table :adoption_requests do |t|
      t.references :adoption_applicant, foreign_key: { to_table: :users }
      t.references :adoption_pet_owner, foreign_key: { to_table: :users }
      t.references :pet, foreign_key: true
      t.string :email
      t.string :phone
      t.string :full_name

      t.timestamps
    end
  end
end
