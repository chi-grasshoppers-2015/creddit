$(document).ready(function() {
  $("form").on("submit", function(e){
    e.preventDefault();

    var request = $.ajax ({
      method: "POST",
      url: "/data",
      data: $(this).serialize()
    })
    request.done(function(response){
      console.log(response);
      drawFrequencyBarChart(response);
      drawAvgScoreBarChart(response);
      // Iterate through the json object that has been processed in ruby already, for each AR comment object
      // response.each()
    })

  })
  // This is called after the document has loaded in its entirety
  // This guarantees that any elements we bind to will exist on the page
  // when we try to bind to them

  // See: http://docs.jquery.com/Tutorials:Introducing_$(document).ready()
});

function drawAvgScoreBarChart(jsonWords) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var chart = d3.select(".avg-score-chart")
      .attr("width", width)
      .attr("height", height);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var chart = d3.select(".avg-score-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(jsonWords.map(function(d) { return d.word; }));
  y.domain([0, d3.max(jsonWords, function(d) { return d.avgpoints; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var barWidth = width / jsonWords.length;

  var bar = chart.selectAll(".bar-group")
            .data(jsonWords)
            .enter()
            .append("g")
            .attr("class", "bar-group")

  bar.append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return x(d.word); })
     .attr("y", function(d) { return y(d.avgpoints); })
     .attr("height", function(d) { return height - y(d.avgpoints); })
     .attr("width", x.rangeBand())

  bar.append("text")
     .attr("x", function(d) { return x(d.word) + (barWidth / 2) - (margin.right / 2); })
     .attr("y", function(d) { return y(d.avgpoints) + 5; })
     .attr("dy", ".75em")
     .text(function(d) { return d.avgpoints; });
}


function drawFrequencyBarChart(jsonWords) {
  var margin = {top: 20, right: 30, bottom: 30, left: 40},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

  var x = d3.scale.ordinal()
      .rangeRoundBands([0, width], .1);

  var y = d3.scale.linear()
      .range([height, 0]);

  var chart = d3.select(".frequency-chart")
      .attr("width", width)
      .attr("height", height);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

  var chart = d3.select(".frequency-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  x.domain(jsonWords.map(function(d) { return d.word; }));
  y.domain([0, d3.max(jsonWords, function(d) { return d.frequency; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var barWidth = width / jsonWords.length;

  var bar = chart.selectAll(".bar-group")
            .data(jsonWords)
            .enter()
            .append("g")
            .attr("class", "bar-group")

  bar.append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return x(d.word); })
     .attr("y", function(d) { return y(d.frequency); })
     .attr("height", function(d) { return height - y(d.frequency); })
     .attr("width", x.rangeBand())

  bar.append("text")
     .attr("x", function(d) { return x(d.word) + (barWidth / 2) - (margin.right / 2); })
     .attr("y", function(d) { return y(d.frequency) + 5; })
     .attr("dy", ".75em")
     .text(function(d) { return d.frequency; });
}
