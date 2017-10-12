class Api::V1::AdoptionRequestsController < ApiController
  before_action :authenticate_user

  def received_index
    @adoption_requests = current_user.received_adoption_requests
    render :index
  end

  def create
    user = current_user
    pet = Pet.find(adoption_request_params[:pet_id])
    pet_owner = pet.owner

    if !pet.is_rescue
      render :json => { errors: ['This pet is not a rescue.'] }, :status => 400
    elsif user.requested_adopt_pet?(adoption_request_params[:pet_id])
      render :json => { errors: ['Already applied this pet.'] }, :status => 400
    else
      @adoption_request = user.adoption_requests.create(adoption_request_params)
      @adoption_request.adoption_pet_owner = pet_owner
      if !@adoption_request.save
        render :json => { errors: @adoption_request.errors }, :status => 400
      else
        render :create
      end
    end
  end

  private
    def adoption_request_params
      params.permit(:pet_id, :adoption_pet_owner_id, :email, :phone, :full_name)
    end
end
