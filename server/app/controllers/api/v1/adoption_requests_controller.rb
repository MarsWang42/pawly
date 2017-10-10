class Api::V1::AdoptionRequestsController < ApiController
  before_action :authenticate_user

  def create
    user = current_user
    pet_owner = set_pet_owner
    pet = Pet.find(adoption_request_params[:pet_id])

    if !pet.is_rescue
      render :json => { errors: ['This pet is not a rescue.'] }, :status => 400
    elsif user.requested_adopt_pet(adoption_request_params[:pet_id])
      render :json => { errors: ['Already applied this pet.'] }, :status => 400
    elsif (pet_owner.present? && pet_owner.has_pet?(pet))
      @adoption_request = user.adoption_requests.create(adoption_request_params)
      if !@adoption_request.save
        render :json => { errors: @adoption_request.errors }, :status => 400
      else
        render :create
      end
    else
      render :json => { errors: ['Pet doesn\'n belong to owner'] }, :status => 400
    end
  end

  private
    def adoption_request_params
      params.permit(:pet_id, :adoption_pet_owner_id, :email, :phone, :full_name)
    end

    def set_pet_owner
      User.find(adoption_request_params[:adoption_pet_owner_id])
    end
end
