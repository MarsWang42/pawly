json.username @user.username
json.email @user.email
json.accessToken @token.token

json.pets(@user.pets) do |pet|
  json.pets pet.name
  json.type pet.type
end
