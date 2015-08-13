helpers do

  def summarize_values(array)
    unique_values = array.uniq
    summary = {}
    unique_values.each do |val|
      summary[val] = array.count(val)
    end
    return unique_values
  end

end
