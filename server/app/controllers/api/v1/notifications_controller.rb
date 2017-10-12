class Api::V1::NotificationsController < ApiController
  before_action :authenticate_user

  def index
    @user = current_user
    @notifications = @user.notifications.order("created_at DESC")
    render :index
  end

  def read
    @notification = Notification.find(params[:id])
    if (current_user.has_notification?(@notification))
      @notification.update read: true
      render :json => { status: 'ok', read: params[:id] }
    else
      render :json => { errors: ['It\'s not your notificaiton'] }
    end
  end

  private

end
