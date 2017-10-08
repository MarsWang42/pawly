class Place < ApplicationRecord
  reverse_geocoded_by :latitude, :longitude
  acts_as_mappable :default_units => :miles,
                 :lat_column_name => :latitude,
                 :lng_column_name => :longitude

  has_many :pictures
  validates :name, :presence => true
  validates :google_place_id, :presence => true
  validates :longitude, :presence => true
  validates :latitude, :presence => true
end
