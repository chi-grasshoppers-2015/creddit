get '/' do
  # Look in app/views/index.erb
  @comments = Comment.all
  erb :index
end

post '/' do
  content_type :json
  @comments = Comment.all
  @comements.to_json
end
