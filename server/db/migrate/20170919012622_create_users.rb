class CreateUsers < ActiveRecord::Migration[5.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :password_digest
      t.string :username
      t.string :gender
      t.string :facebook_id
      t.string :facebook_email
      t.string :avatar

      t.timestamps
    end
  end
end
