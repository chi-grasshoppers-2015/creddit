helpers do

  def summarize_values(array, word)
    array.uniq.map { |val| [word, val, array.count(val)] }
  end

  def generate_hours_posted_data(array, word)
    unique_values = array.uniq
    summary = []
    unique_values.each do |val|
      summary << { word: word, hour: array.count(val) }
    end
    return summary
  end

end
