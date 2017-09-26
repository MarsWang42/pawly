Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'users' => 'users#create'
      patch 'users' => 'users#update'
      post 'username' => 'users#check_username'
      get 'users/feed' => 'users#get_feed'
      get 'users/detail/:id' => 'users#detail'
      patch 'users/avatar' => 'users#upload_avatar'
      post 'user_token' => 'user_token#create', defaults: {format: :json}

      post 'pictures/like' => 'pictures#like'
      post 'pictures/unlike' => 'pictures#unlike'
    end
  end
end
