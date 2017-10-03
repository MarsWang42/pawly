class Api::V1::PetsController < ApiController
  before_action :authenticate_user

  def create
  end

  def show
    @pet = set_pet
    @pictures = @pet.pictures
    @user = current_user
    render :show
  end

  private
    def pet_params
      params.permit(:id)
    end

    def set_pet
      Pet.find(pet_params[:id])
    end
end
