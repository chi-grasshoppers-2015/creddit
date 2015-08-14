helpers do

  def summarize_values(array, word)
    array.uniq.map { |val| [word, val, array.count(val)] }
  end

  def discard_comments_below_threshold(comments, threshold)
    comments.reject { |comment| comment.score < threshold }
  end

end
