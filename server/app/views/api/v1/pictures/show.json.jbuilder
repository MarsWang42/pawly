json.image @pic.image.url
json.timestamp @pic.created_at
json.height @pic.height
json.width @pic.width
json.creator do
  json.id @pic.creator.id
  json.username @pic.creator.username
  json.avatar @pic.creator.avatar.url
end
json.liked @user.liked?(@pic)
json.pets(@pic.pets) do |pet|
  json.name pet.name
  json.avatar pet.avatar.url
end
json.pictureId @pic.id
json.likers(@pic.likers) do |liker|
  json.username liker.username
end
