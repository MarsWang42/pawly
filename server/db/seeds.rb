# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

user1 = User.create(email: 'asdf@asdf.com', username: 'mars02', password: 'asdfasdf')
user2 = User.create(email: 'asd@asd.com', username: 'sunny32', password: 'asdfasdf')
user3 = User.create(email: 'asd@asdf.com', username: 'sunny13', password: 'asdfasdf')
user4 = User.create(email: 'asdf@asd.com', username: 'sunny21', password: 'asdfasdf')
user5 = User.create(email: 'as@asd.com', username: 'mars12', password: 'asdfasdf')
user6 = User.create(email: 'asd@as.com', username: 'mars95', password: 'asdfasdf')
user7 = User.create(email: 'as@as.com', username: 'sunny92', password: 'asdfasdf')

user1.pets.create(name: 'Zoey', type: 'dog')
user1.pets.create(name: 'Cloud', type: 'cat')
user2.pets.create(name: 'Pika', type: 'dog')
user2.pets.create(name: 'Simba', type: 'cat')
user3.pets.create(name: 'Lucky', type: 'cat')
user3.pets.create(name: 'Ruby', type: 'cat')

picture1 = user2.pictures.create(
  image: File.open(File.join(Rails.root, 'test.jpeg')),
  latitude: 33.6880546,
  longitude: -117.8341277,
  place_name: '85°C Bakery Cafe - Irvine',
)
picture1.pets << user1.pets.first
picture2 = user3.pictures.create(
  image: File.open(File.join(Rails.root, 'test1.jpeg')),
  latitude: 33.6875054,
  longitude: -117.8338896,
  place_name: 'Meet Fresh'
)
picture2.pets << user3.pets.first
picture3 = user1.pictures.create(
  image: File.open(File.join(Rails.root, 'test2.jpg')),
  latitude: 33.68813470000001,
  longitude: -117.8340868,
  place_name: '2700 Alton Pkwy, Irvine, CA 92606, USA'
)
picture3.pets << user1.pets.first
picture4 = user1.pictures.create(image: File.open(File.join(Rails.root, 'test3.jpeg')))
picture4.pets << user1.pets.first
picture4.pets << user1.pets.last
picture4.pets << user2.pets.first
picture5 = user2.pictures.create(image: File.open(File.join(Rails.root, 'test4.jpeg')))
picture5.pets << user2.pets.first
picture6 = user2.pictures.create(image: File.open(File.join(Rails.root, 'test5.jpg')))
picture6.pets << user2.pets.first

user1.follow(user2)
user1.follow(user3)
user4.follow(user1)
user4.follow(user2)
user4.follow(user3)

user4.like(picture1)
