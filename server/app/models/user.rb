class User < ApplicationRecord
  has_secure_password
  has_many :pets, foreign_key: :owner_id, dependent: :destroy
  has_many :pictures, foreign_key: :creator_id, dependent: :destroy
  has_many :active_relationships, class_name:  "Relationship",
                                  foreign_key: "follower_id",
                                  dependent:   :destroy
  has_many :passive_relationships, class_name:  "Relationship",
                                 foreign_key: "followed_id",
                                 dependent:   :destroy
  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower

  mount_uploader :avatar, UserAvatarUploader

  validates :username, length: { in: 2..20 }, uniqueness: true, allow_nil: true
  validates :email,
    uniqueness: true, allow_nil: true, :email_format => { :message => 'is not looking good' },
    if: :email?
  validates :password, length: { in: 6..20 }, on: :create

    # Follows a user.
  def follow(other_user)
    following << other_user
  end

  # Unfollows a user.
  def unfollow(other_user)
    following.delete(other_user)
  end

  # Returns true if the current user is following the other user.
  def following?(other_user)
    following.include?(other_user)
  end

  def feed
    following_ids = "SELECT followed_id FROM relationships
                     WHERE  follower_id = :user_id"
    Picture.where("creator_id IN (#{following_ids})
                     OR creator_id = :user_id", user_id: id)
  end

end