json.pictures(@pictures) do |picture|
  json.image picture.image.url
  json.timestamp picture.created_at
  json.creator do
    json.username picture.creator.username
    json.avatar picture.creator.avatar.url
  end
  json.pets(picture.pets) do |pet|
    json.name pet.name
    json.avatar pet.avatar.url
  end
  json.placeName picture.place_name
  json.latitude picture.latitude
  json.longitude picture.longitude
  json.pictureId picture.id
  json.liked @user.liked?(picture)
  json.likers(picture.likers) do |liker|
    json.username liker.username
  end
end
