json.feeds(@feeds) do |feed|
  json.pictureId feed.id
  json.image feed.image.url
  json.timestamp feed.created_at
  json.creator do
    json.id feed.creator.id
    json.username feed.creator.username
    json.avatar feed.creator.avatar.url
    json.facebookId feed.creator.facebook_id
  end
  json.pets(feed.pets) do |pet|
    json.id pet.id
    json.isRescue pet.is_rescue
    json.name pet.name
    json.avatar pet.avatar.url
  end
  if feed.place.present?
    json.place do |place|
      json.placeId feed.place.id
      json.name feed.place.name
      json.latitude feed.place.latitude
      json.longitude feed.place.longitude
    end
  end
  json.caption feed.caption
  json.liked @user.liked?(feed)
  json.likerLength feed.likers.length
  json.commentLength feed.comments.length
end
