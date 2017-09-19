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

end
