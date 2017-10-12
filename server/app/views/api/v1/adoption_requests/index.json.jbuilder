json.adoptionRequests(@adoption_requests) do |adoption_request|
  json.id adoption_request.id
  json.adoptionApplicant do
    json.id adoption_request.adoption_applicant.id
    json.avatar adoption_request.adoption_applicant.avatar.url
    json.facebookId adoption_request.adoption_applicant.facebook_id
  end
  json.fullName adoption_request.full_name
  json.createdAt adoption_request.created_at
  json.pet do
    json.id adoption_request.pet.id
    json.name adoption_request.pet.name
    json.avatar adoption_request.pet.avatar.url
  end
end
