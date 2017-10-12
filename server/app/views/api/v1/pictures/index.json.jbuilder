json.pictures(@pictures) do |picture|
  json.image picture.image.url
  json.timestamp picture.created_at
  json.creator do
    json.username picture.creator.username
    json.avatar picture.creator.avatar.url
  end
  json.pets(picture.pets) do |pet|
    json.id pet.id
    json.name pet.name
    json.avatar pet.avatar.url
  end
  if picture.place.present?
    json.place do |place|
      json.placeId picture.place.id
      json.name picture.place.name
      json.latitude picture.place.latitude
      json.longitude picture.place.longitude
    end
  end
  json.pictureId picture.id
  json.liked @user.liked?(picture)
  json.likers(picture.likers) do |liker|
    json.username liker.username
  end
end
