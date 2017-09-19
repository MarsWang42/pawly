class User < ApplicationRecord
  has_secure_password
  has_many :pets, foreign_key: :owner_id
end
