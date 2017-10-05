json.image @pic.image.url
json.timestamp @pic.created_at
json.creator do
  json.id @pic.creator.id
  json.username @pic.creator.username
  json.avatar @pic.creator.avatar.url
end
json.liked @user.liked?(@pic)
json.pets(@pic.pets) do |pet|
  json.id pet.id
  json.name pet.name
  json.avatar pet.avatar.url
end
if @pic.place.present?
  json.place do |place|
    json.placeId @pic.place.id
    json.name @pic.place.name
    json.latitude @pic.place.latitude
    json.longitude @pic.place.longitude
  end
end
json.pictureId @pic.id
json.likers(@pic.likers) do |liker|
  json.username liker.username
end
json.comments(@pic.comments) do |comment|
  json.id comment.id
  json.user do
    json.id comment.creator.id
    json.username comment.creator.username
    json.avatar comment.creator.avatar.url
  end
  json.body comment.body
end
json.likerLength @pic.likers.length
json.commentLength @pic.comments.length
