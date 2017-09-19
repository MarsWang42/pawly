class Pet < ApplicationRecord
  belongs_to :owner, class_name: "User"

  self.inheritance_column = 'type_column_name'
end
