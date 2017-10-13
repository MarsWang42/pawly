json.pets(@pets) do |pet|
  json.id pet.id
  json.name pet.name
  json.type pet.type
  json.avatar pet.avatar
  json.owner pet.owner.username
  json.isRescue pet.is_rescue
end
