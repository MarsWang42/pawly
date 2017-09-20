Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'users' => 'users#create'
      patch 'users' => 'users#update'
      post 'username' => 'users#check_username'
      patch 'user/avatar' => 'users#upload_avatar'
      post 'user_token' => 'user_token#create', defaults: {format: :json}
    end
  end
end
