class Api::V1::UsersController < ApiController
  before_action :authenticate_user, except: ['create']

  def create
    @user = User.new(auth_params)
    if @user.save
      @token = Knock::AuthToken.new payload: { sub: @user.id }
      render :show
    else
      render :json => @user.errors, :status => 422
    end
  end

  def show
    @user = current_user
    @token = Knock::AuthToken.new payload: { sub: @user.id }
    render :show
  end

  def detail
    @user = User.find(params[:id])
    render :detail
  end

  def check_username
    if User.exists?(username: register_params[:username])
      render :json => { "exist": true }
    else
      render :json => { "exist": false }
    end
  end

  def get_feed
    @user = current_user
    @feeds = @user.feed
    render :feed
  end

  def update
    @user = current_user
    @user.username = register_params[:username]

    if register_params[:pet_name]
      pet = @user.pets.new(name: register_params[:pet_name])
      if register_params[:pet_type]
        pet.type = register_params[:pet_type]
      end
      if register_params[:pet_avatar]
        pet.avatar = register_params[:pet_avatar]
        pic = pet.pictures.new(image: register_params[:pet_avatar])
        pic.width = 600
        pic.height = 600
        pic.creator = @user
        if !pic.save
          render :json => pic.errors, :status => 422
        end
      end

      if !pet.save
        render :json => pet.errors, :status => 422
      end
    end

    if @user.save
      @token = Knock::AuthToken.new payload: { sub: @user.id }
      render :show
    else
      render :json => @user.errors, :status => 422
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
