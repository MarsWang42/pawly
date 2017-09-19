class Pet < ApplicationRecord
  belongs_to :owner, class_name: "User"
  mount_uploader :avatar, AvatarUploader

  validates :name, length: { maximum: 20 }, presence: true
  validates :type, length: { maximum: 20 }, presence: true

  self.inheritance_column = 'type_column'
end
