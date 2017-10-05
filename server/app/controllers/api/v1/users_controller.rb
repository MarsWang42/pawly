class Api::V1::UsersController < ApiController
  before_action :authenticate_user, except: ['create']

  def index
    @users = User.starts_with(params[:keyword]).limit(10)
    @current_user = current_user
    render :index
  end

  def followers
    @users = set_user.followers
    @current_user = current_user
    render :index
  end

  def following
    @users = set_user.following
    @current_user = current_user
    render :index
  end

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
    @user = set_user
    @current_user = current_user
    @pictures = @user.pictures.order("created_at DESC").all
    render :detail
  end

  def follow
    current_user.follow(set_user)
    render :json => {
      "currentUserId": current_user.id,
      "followed": true,
      "followerLength": set_user.followers.length,
      "followingLength": current_user.following.length
    }
  end

  def unfollow
    current_user.unfollow(set_user)
    render :json => {
      "currentUserId": current_user.id,
      "followed": false,
      "followerLength": set_user.followers.length,
      "followingLength": current_user.following.length
    }
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
    @feeds = @user.feed.page(params[:page]).per(5)
    render :feed
  end

  def get_available_pets
    @user = current_user
    @pets = @user.available_pets(params[:keyword])
    render :pets
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
    def set_user
      User.find(params[:id])
    end

    def auth_params
      params.permit(:email, :password, :avatar)
    end

    def register_params
      params.require(:username)
      params.permit(:username, :pet_name, :pet_type, :pet_avatar)
    end
end
