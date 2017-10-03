json.users(@users) do |user|
  json.id user.id
  json.username user.username
  json.facebookId user.facebook_id
  json.avatar user.avatar
  json.followed @current_user.followed?(user)

  json.pets(user.pets) do |pet|
    json.id pet.id
    json.name pet.name
    json.type pet.type
    json.avatar pet.avatar
  end
end
