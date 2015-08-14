

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
  @words = params[:search].downcase.split(" ")
  array = []
  @words.each do |word|
    hash = {}
    @comments = Comment.frequencies(word)
    hash[:word] = word
    hash[:frequency] = @comments.count
    hash[:avgpoints] = Comment.avgpoints(@comments)
    hours_posted_array = @comments.map { |comment| comment.hour_posted }
    hash[:hours_posted_data] = summarize_values(hours_posted_array, word)
    scores_array = discard_comments_below_threshold(@comments, 5).map { |comment| comment.score }
    hash[:scores_distribution] = summarize_values(scores_array, word)
    array << hash
  end
  # array << time_summary_data
  array.to_json
end


=begin
[{word: "dog", frequency: 10, guilded: 3, avg: 20}, {word: "cat", freq: 10, guilded: 3}]

array = []





=end
