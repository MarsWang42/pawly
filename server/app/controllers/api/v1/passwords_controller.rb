class Api::V1::PasswordsController < ApiController

  def forgot
    if params[:email].blank?
      return render :json => { error: 'Email not present' }
    end

    user = User.find_by_email(params[:email])

    if user.present?
      user.generate_password_token!

      send_reset_password_token(user.reset_password_token, params[:email])

      render :json => { message: "Email sent to #{params[:email]}" }
    else
      render :json => { error: ['Email address not found. Please check and try again.'] }, status: :not_found
    end
  end

  def reset
    token = params[:token].to_s

    if token.blank?
      return render :json => { error: ['Token not present.'] }
    end

    user = User.find_by(reset_password_token: token)

    if user.present? && user.password_token_valid?
      if user.reset_password!(params[:password])
        render :json => { status: 'ok' }, status: :ok
      else
        render :json => { error: user.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render :json => { error:  ['Link not valid or expired. Try generating a new link.'] }, status: :not_found
    end
  end

  private
    def send_reset_password_token(token, email)
      # Send email to user with new password.
      mg_client = Mailgun::Client.new
      message_params =  { from:    'reset_password@' + Rails.application.secrets.mailgun_domain,
                          to:      email,
                          subject: 'Password reset for fabric health app.',
                          text:    "Your password reset token for fabric is #{token}."
                        }
      mg_client.send_message Rails.application.secrets.mailgun_domain, message_params
    end

end
