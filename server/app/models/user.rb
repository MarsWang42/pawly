class User < ApplicationRecord
  has_secure_password
  has_many :pets, foreign_key: :owner_id
  mount_uploader :avatar, AvatarUploader

  validates :username, length: { in: 2..20 }, uniqueness: true, allow_nil: true
  validates :email,
    uniqueness: true, allow_nil: true, :email_format => { :message => 'is not looking good' },
    if: :email?
  validates :password, length: { in: 6..20 }, on: :create

end
