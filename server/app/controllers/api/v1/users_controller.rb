class Api::V1::UsersController < ApiController
  before_action :authenticate_user, except: ['create']

  def create
    @user = User.new(auth_params)
    if @user.save
      @token = Knock::AuthToken.new payload: { sub: @user.id }
      render :create
    else
      render :json => @user.errors
    end
  end

  def update
    @user = current_user
    @user.username = register_params[:username]

    if register_params[:pet_name]
      @pet = @user.pets.new(name: register_params[:pet_name])
      if register_params[:pet_type]
        @pet.type = register_params[:pet_type]
      end
      if register_params[:pet_avatar]
        @pet.avatar = register_params[:pet_avatar]
      end

      if !@pet.save
        render :json => @user.errors
      end
    end

    if @user.save
      @token = Knock::AuthToken.new payload: { sub: @user.id }
      render :create
    else
      render :json => @user.errors
    end
  end

  def upload_avatar
    @user = current_user
    @user.avatar = auth_params[:avatar]
    if @user.save
      render :json => @user.avatar
    else
      render :json => @user.errors
    end
  end

  private
    def auth_params
      params.permit(:email, :password, :avatar)
    end

    def register_params
      params.require(:username)
      params.permit(:username, :pet_name, :pet_type, :pet_avatar)
    end
end
