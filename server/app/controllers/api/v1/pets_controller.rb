class Api::V1::PetsController < ApiController
  before_action :authenticate_user

  def create
    @user = current_user
    @pet = @user.pets.new(name: pet_params[:name])
    if pet_params[:type]
      @pet.type = pet_params[:type]
    end

    if pet_params[:avatar]
      @pet.avatar = pet_params[:avatar]
      pic = @pet.pictures.new(image: pet_params[:avatar])
      pic.creator = @user
      if !pic.save
        render :json => pic.errors, :status => 422
      end
    end

    if !@pet.save
      render :json => @pet.errors, :status => 422
    end

    render :create
  end

  def delete
    @pet = set_pet
    @pet.pictures.each do |picture|
      if picture.pets.length == 1
        picture.destroy
      end
    end
    @pet.destroy
    render :json => {
      'deleted': pet_params[:id],
      'userId': current_user.id,
    }
  end

  def show
    @pet = set_pet
    @pictures = @pet.pictures
    @user = current_user
    render :show
  end

  private
    def pet_params
      params.permit(:id, :name, :type, :avatar)
    end

    def set_pet
      Pet.find(pet_params[:id])
    end
end
