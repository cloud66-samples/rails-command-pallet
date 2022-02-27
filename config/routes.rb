Rails.application.routes.draw do
  scope :command do 
    get :index, to: 'command#index'
    get :show, to: 'command#show'
    get :search, to: 'command#search'
  end
  
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  root 'command#show'
end
