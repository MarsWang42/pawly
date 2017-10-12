json.places(@places) do |place|
  json.placeId place.id
  json.name place.name
  json.latitude place.latitude
  json.longitude place.longitude

  json.pictures(place.pictures) do |picture|
    json.pictureId picture.id
    json.place do
      json.name place.name
      json.placeId picture.place.id
      json.latitude place.latitude
      json.longitude place.longitude
    end
    json.image picture.image.url
    json.timestamp picture.created_at
    json.creator do
      json.id picture.creator.id
      json.username picture.creator.username
      json.avatar picture.creator.avatar.url
      json.facebookId picture.creator.facebook_id
    end
    json.pets(picture.pets) do |pet|
      json.id pet.id
      json.name pet.name
      json.avatar pet.avatar.url
      json.type pet.type
      json.isRescue pet.is_rescue
    end
    json.caption picture.caption
    json.liked @user.liked?(picture)
    json.likerLength picture.likers.length
    json.commentLength picture.comments.length
  end
end
