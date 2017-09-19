class Api::V1::UserTokenController < Knock::AuthTokenController
  def create
    @user = entity
    @token = Knock::AuthToken.new payload: { sub: @user.id }
  end

  def authenticate
    unless entity.present?
      raise Knock.not_found_exception_class
    end
  end

  def entity
    if auth_params[:strategy] == 'local'
      @entity ||=
        if entity_class.respond_to? :from_token_request
          entity_class.from_token_request request
        else
          entity_class.find_by email: auth_params[:email]
        end
    elsif auth_params[:strategy] == 'facebook'
      logger.debug 'good'
      @entity ||=
        if FacebookService.valid_token?(auth_params[:access_token])
          logger.debug 'good too'
          data = FacebookService.fetch_data(auth_params[:access_token])
          User.find_or_create_by facebook_id: data['id'] do |user|
            user.facebook_email = data['email']
            user.password = rand(36**16).to_s(36)
            user.save!
          end
        end
    end
  end

  private
    def auth_params
      params.permit(:strategy, :email, :password, :access_token)
    end

end
