class Api::V1::PicturesController < ApiController
  before_action :authenticate_user, except: ['create']

  def create
    @user = User.new(auth_params)
    if @user.save
      @token = Knock::AuthToken.new payload: { sub: @user.id }
      render :create
    else
      render :json => @user.errors, :status => 422
    end
  end

  def like
    @pic = set_pic
    @user = current_user
    @user.like(@pic)
    render :show
  end

  def unlike
    @pic = set_pic
    @user = current_user
    @user.unlike(@pic)
    render :show
  end

  private
    def pic_params
      params.permit(:pic_id)
    end

    def set_pic
      logger.debug pic_params
      Picture.find(pic_params[:pic_id])
    end
end
