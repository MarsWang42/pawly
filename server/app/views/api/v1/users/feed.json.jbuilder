json.feeds(@feeds) do |feed|
  json.image feed.image.url
  json.timestamp feed.created_at
  json.height feed.height
  json.width feed.width
  json.creator do
    json.username feed.creator.username
    json.avatar feed.creator.avatar.url
  end
  json.pets(feed.pets) do |pet|
    json.name pet.name
    json.avatar pet.avatar.url
  end
  json.pictureId feed.id
  json.liked @user.liked?(feed)
  json.likers(feed.likers) do |liker|
    json.username liker.username
  end
end
