require 'net/http'
require 'json'
require 'uri'

all_uri = URI.parse("http://www.reddit.com/r/all.json")

comments_json = []
10.times do
  response = Net::HTTP::get_response(all_uri)
  posts = JSON.parse(response.body)
  post_ids = posts["data"]["children"].map { |p| p["data"]["id"] }
  post_ids.each do |id|
    post_uri = URI.parse("http://www.reddit.com/comments/#{id}.json")
    response = Net::HTTP::get_response(post_uri)
    begin
      comments = JSON.parse(response.body)
    rescue
      p "ERROR. ERROR. WE KILLED REDDIT."
      sleep(10)
      response = Net::HTTP::get_response(post_uri)
    end
    comments[1]["data"]["children"].each do |comment|
      comments_json << comment["data"]
    end
  end
  url_string = "http://www.reddit.com/r/all.json?count=25&after=t3_#{post_ids.last}"
  all_uri = URI.parse(url_string)
end

def traverse_comment_hierarchy(comment)
  if comment["body"] == nil
    return nil
  elsif comment["replies"] == ""
    return build_comment_hash(comment)
  else
    comment_children = comment["replies"]["data"]["children"]
    comment_children.reject! { |com| com["kind"] != "t1" }
    if comment_children.empty? || comment_children[0]["kind"] == "more"
      return build_comment_hash(comment)
    else
      return comment_children.map do |comment|
        traverse_comment_hierarchy(comment["data"])
      end
    end
  end
end

def build_comment_hash(comment)
  return {
    body: comment["body"],
    author: comment["author"],
    subreddit: comment["subreddit"],
    score: comment["score"],
    gilded: comment["gilded"],
    creation_date: DateTime.strptime(comment["created"].to_s,'%s')
  }
end

comment_data = comments_json.map { |com| traverse_comment_hierarchy(com) }.flatten.compact

comment_data.each do |comment|
  Comment.create!(comment)
end
