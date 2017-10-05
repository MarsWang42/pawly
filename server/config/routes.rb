Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      post 'users' => 'users#create'
      patch 'users' => 'users#update'
      get 'users/search/:keyword' => 'users#index'
      get 'users/detail/:id' => 'users#detail'
      post 'users/follow' => 'users#follow'
      post 'users/unfollow' => 'users#unfollow'
      get 'users/:id/followers' => 'users#followers'
      get 'users/:id/following' => 'users#following'
      get 'users/feed/:page' => 'users#get_feed'
      get 'users/pets/(:keyword)' => 'users#get_available_pets'

      post 'username' => 'users#check_username'
      patch 'users/avatar' => 'users#upload_avatar'
      post 'user_token' => 'user_token#create', defaults: {format: :json}

      get 'pets/:id' => 'pets#show'
      post 'pets' => 'pets#create'
      delete 'pets/:id' => 'pets#delete'

      post 'places/nearby' => 'places#nearby'

      get 'pictures/:pic_id' => 'pictures#show'
      post 'pictures' => 'pictures#create'
      post 'pictures/like' => 'pictures#like'
      post 'pictures/unlike' => 'pictures#unlike'

      post 'comments' => 'comments#create'
      post 'comments/:picture_id' => 'comments#index'
    end
  end
end
