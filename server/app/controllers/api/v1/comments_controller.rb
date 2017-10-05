class Api::V1::ControllersController < ApiController
  before_action :authenticate_user

  def create
    @user = current_user
    @comment = @user.comments.new(body: comment_params[:body])
    @comment.picture = Picture.find(comment_params[:picture_id])
    @comment.target_id = comment_params[:target_id]

    if !@comment.save
      render :json => @comment.errors, :status => 422
    end

    render :create
  end

  def index
    picture = Picture.find(params[:picture_id])
    @comments = picture.comments
  end

  private
    def comment_params
      params.permit(:id, :body, :picture_id, :target_id)
    end

    def set_comment
      Comment.find(comment_params[:id])
    end
end
