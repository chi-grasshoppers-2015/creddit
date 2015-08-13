class Comment < ActiveRecord::Base

  def self.frequencies(word)
    self.where("body LIKE ?", "%#{word}%")
  end

  def self.avgpoints(array_containing_comments)
    array_containing_comments.average('score').to_i
    # array_containing_comments.map(&:score).inject(:+) / array_containing_comments.count
  end

  def hour_posted
    self.creation_date.hour
  end

end
