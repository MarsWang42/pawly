class CreatePlaces < ActiveRecord::Migration[5.1]
  def change
    create_table :places do |t|
      t.string :google_place_id, index: true
      t.string :name
      t.float :latitude
      t.float :longitude
      t.timestamps
    end

    add_reference :pictures, :place, foreign_key: true
  end
end
