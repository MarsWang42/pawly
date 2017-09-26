json.username @user.username
json.facebookId @user.facebook_id
json.avatar @user.avatar

json.pets(@user.pets) do |pet|
  json.id pet.id
  json.name pet.name
  json.type pet.type
  json.avatar pet.avatar
end

json.pictures(@user.pictures) do |picture|
  json.image picture.image.url
  json.timestamp picture.created_at
  json.height picture.height
  json.width picture.width
  json.creator do
    json.username picture.creator.username
    json.avatar picture.creator.avatar.url
  end
  json.pets(picture.pets) do |pet|
    json.name pet.name
    json.avatar pet.avatar.url
  end
  json.pictureId picture.id
  json.liked @user.liked?(picture)
  json.likers(picture.likers) do |liker|
    json.username liker.username
  end
end
