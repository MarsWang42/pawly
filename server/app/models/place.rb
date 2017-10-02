class Place < ApplicationRecord
  reverse_geocoded_by :latitude, :longitude

  has_many :pictures
  validates :name, :presence => true
  validates :google_place_id, :presence => true
  validates :longitude, :presence => true
  validates :latitude, :presence => true
end
