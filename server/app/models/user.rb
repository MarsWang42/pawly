class User < ApplicationRecord
  has_secure_password
  has_many :pets, foreign_key: :owner_id, dependent: :destroy
  has_many :comments, foreign_key: :author_id, dependent: :destroy
  has_many :pictures, foreign_key: :creator_id, dependent: :destroy
  has_many :active_relationships, class_name:  "Relationship",
                                  foreign_key: "follower_id",
                                  dependent:   :destroy
  has_many :passive_relationships, class_name:  "Relationship",
                                 foreign_key: "followed_id",
                                 dependent:   :destroy
  has_many :like_relationships, class_name:  "LikePicture",
                                  foreign_key: "liker_id",
                                  dependent:   :destroy
  has_many :following, through: :active_relationships, source: :followed
  has_many :followers, through: :passive_relationships, source: :follower
  has_many :liked, through: :like_relationships, source: :liked

  mount_uploader :avatar, UserAvatarUploader

  validates :username, length: { in: 2..20 }, uniqueness: true, allow_nil: true
  validates :email,
    uniqueness: true, allow_nil: true, :email_format => { :message => 'is not looking good' },
    if: :email?
  validates :password, length: { in: 6..20 }, on: :create

  scope :starts_with, -> (username) { where("username like ?", "#{username}%")}

  # Follows a user.
  def follow(other_user)
    if !followed?(other_user)
      following << other_user
    end
  end

  # Unfollows a user.
  def unfollow(other_user)
    if followed?(other_user)
      following.delete(other_user)
    end
  end

  # Returns true if the current user is following the other user.
  def followed?(other_user)
    following.include?(other_user)
  end

  # Like a pic.
  def like(picture)
    if !liked?(picture)
      liked << picture
    end
  end

  # Unlike a pic.
  def unlike(picture)
    if liked?(picture)
      liked.delete(picture)
    end
  end

  # Returns true if the current user liked the pic.
  def liked?(picture)
    liked.include?(picture)
  end

  def feed
    following_ids = "SELECT followed_id FROM relationships
                     WHERE  follower_id = :user_id"
    Picture
      .where("creator_id IN (#{following_ids})
              OR creator_id = :user_id", user_id: id)
      .order("created_at DESC")
  end

  def available_pets(name)
    following_ids = "SELECT followed_id FROM relationships
                     WHERE  follower_id = :user_id"
    if name
      Pet
        .where("owner_id IN (#{following_ids})
                OR owner_id = :user_id", user_id: id)
        .where("name like ?", "#{name}%")
    else
      Pet
        .where("owner_id IN (#{following_ids})
                OR owner_id = :user_id", user_id: id)
    end
  end

end
