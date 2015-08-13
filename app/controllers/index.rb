

get '/' do
  # Look in app/views/index.erb
  erb :index
end

# post '/' do
#   content_type :json
#   @comments = Comment.all
#   @comements.to_json
# end

post '/data' do
  content_type :json
  @words = params[:search].split(" ")
  array = []
  @words.each do |word|
    hash = {}
    @comments = Comment.frequencies(word)
    hash[:word] = word
    hash[:frequency] = @comments.count
    hash[:avgpoints] = Comment.avgpoints(@comments)
    array << hash
  end
  array.to_json
end


=begin
[{word: "dog", frequency: 10, guilded: 3, avg: 20}, {word: "cat", freq: 10, guilded: 3}]

array = []





=end
