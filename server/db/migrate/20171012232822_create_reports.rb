class CreateReports < ActiveRecord::Migration[5.1]
  def change
    create_table :reports do |t|
      t.text :body
      t.references :reporter, foreign_key: { to_table: :users }, index: true
      t.references :reportable, polymorphic: true, index: true

      t.timestamps
    end
  end
end
