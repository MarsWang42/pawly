class Api::V1::CommentsController < ApiController
  before_action :authenticate_user

  def create
    @user = current_user
    @comment = @user.comments.new(comment_params)
    @picture = Picture.find(comment_params[:picture_id])

    if !@comment.save
      render :json => @comment.errors, :status => 422
    end

    create_notification @picture, @comment
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

    def create_notification(picture, comment)
      return if picture.creator.id == current_user.id
      Notification.create(user_id: picture.creator.id,
                          notified_by_id: current_user.id,
                          picture_id: picture.id,
                          identifier: comment.id,
                          notice_type: 'comment')
    end

    def set_comment
      Comment.find(comment_params[:id])
    end
end
