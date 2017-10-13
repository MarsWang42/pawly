class Pet < ApplicationRecord
  belongs_to :owner, class_name: "User"
  has_and_belongs_to_many :pictures
  has_many :adoption_requests
  has_many :report, as: :reportable

  mount_uploader :avatar, PetAvatarUploader

  validates :name, length: { maximum: 20 }, presence: true
  validates :type, length: { maximum: 20 }, presence: true

  self.inheritance_column = 'type_column'
end
