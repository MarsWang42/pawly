json.id @user.id
json.username @user.username
json.email @user.email
json.facebookId @user.facebook_id
json.facebookEmail @user.facebook_email
json.avatar @user.avatar
json.accessToken @token.token

json.pets(@user.pets) do |pet|
  json.id pet.id
  json.name pet.name
  json.type pet.type
  json.avatar pet.avatar
end
