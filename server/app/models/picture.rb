class Picture < ApplicationRecord
  belongs_to :creator, class_name: "User"
  belongs_to :place, optional: true
  has_and_belongs_to_many :pets
  has_many :comments
  has_many :like_relationships, class_name:  "LikePicture",
                                  foreign_key: "liked_id",
                                  dependent:   :destroy
  has_many :likers, through: :like_relationships, source: :liker
  has_many :notifications, dependent: :destroy

  mount_uploader :image, PictureUploader
end
