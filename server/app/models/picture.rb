class Picture < ApplicationRecord
  belongs_to :creator, class_name: "User"
  has_and_belongs_to_many :pets
  mount_uploader :image, PictureUploader
end
