class Picture < ApplicationRecord
  reverse_geocoded_by :latitude, :longitude

  belongs_to :creator, class_name: "User"
  has_and_belongs_to_many :pets
  has_many :like_relationships, class_name:  "LikePicture",
                                  foreign_key: "liked_id",
                                  dependent:   :destroy
  has_many :likers, through: :like_relationships, source: :liker

  mount_uploader :image, PictureUploader
end
