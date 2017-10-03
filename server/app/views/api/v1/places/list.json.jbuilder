json.places(@places) do |place|
  json.placeId place.id
  json.name place.name
  json.latitude place.latitude
  json.longitude place.longitude

  json.pictures(place.pictures) do |picture|
    json.place do
      json.name place.name
      json.placeId picture.place.id
      json.latitude place.latitude
      json.longitude place.longitude
    end
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
    json.pictureId picture.id
    json.liked @user.liked?(picture)
    json.likers(picture.likers) do |liker|
      json.username liker.username
    end
  end
end
