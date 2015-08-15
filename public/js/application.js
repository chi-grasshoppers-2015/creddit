
$(document).ready(function() {
  $(".tabs").hide();
  $(".loader").hide();
  $(".arrow").velocity({ translateY: "6px" }, { loop: true }).velocity("reverse");

  $("form").on("submit", function(e){
    e.preventDefault();
    $(".arrow").hide();
    clearSearchResults();
    $(".loader").show();

    var request = $.ajax ({
      method: "POST",
      url: "/data",
      data: $(this).serialize()
    });
    request.done(function(response){
      console.log(response);
      $(".tabs").show();
      $(".chart").show();
      $(".average-score").hide();
      $(".hours-posted").hide();
      $(".score-distribution").hide();
      $(".loader").hide();
      $("h4").show();
      $(".tabs").on('click','a', function(event){
        event.preventDefault();
        $('svg.chart').children().remove();
        $(".tab").hide();
        $(".chart div").hide();
        var a_href = $(event.target).attr('href');
        $(a_href).show();
        if (a_href === ".total-frequency") {
          $('.frequency-chart').show();
          drawFrequencyBarChart(response);
        }
        else if (a_href === ".average-score") {
          $('.avg-score-chart').show();
          drawAvgScoreBarChart(response);
        }
        else if (a_href === ".hours-posted") {
          $('.hours-posted-chart').show();
          drawHoursPostedPlot(response);
        }
        else {
          $('.score-distribution-chart').show();
          drawScoreDistributionPlot(response);
        }
        $('li').removeClass("active");
        $(event.target).parent().addClass("active");
      });
      $("form").trigger('reset');
      drawFrequencyBarChart(response);
      drawAvgScoreBarChart(response);
      drawHoursPostedPlot(response);
      drawScoreDistributionPlot(response);
    });

  })
});

function clearSearchResults() {
  $('svg.chart').children().remove();
  $('.chart').hide();
}

GRAPH_HEIGHT = 300
GRAPH_WIDTH = 750

function drawScoreDistributionPlot(jsonWords) {

  var wordList = jsonWords.map(function(wordObj) {
    return wordObj.word;
  });

  var scoreData = jsonWords.map(function(wordObj) {
    return wordObj.scores_distribution;
  });

  var scoreDataFlattened = scoreData.reduce(function(a, b) {
    return a.concat(b);
  });

  var margin = {top: 20, right: 30, bottom: 30, left: 50},
      width = GRAPH_WIDTH - margin.left - margin.right,
      height = GRAPH_HEIGHT - margin.top - margin.bottom;

  var xScale = d3.scale.linear()
      .range([10, width]);


  var yScale = d3.scale.linear()
      .range([(height - 5), 0]);

  var colorScale = d3.scale.category20()
      .domain(wordList);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  var chart = d3.select(".score-distribution-chart")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var legend = chart.append("g")
                .attr("class", "legend")
                .attr("transform", "translate(" + (width - 80) + ",0)");

  for (var i=0; i < wordList.length; i++) {
    legend.append("text")
          .text(wordList[i])
          .attr("fill", colorScale(wordList[i]))
          .attr("y", (i+1) * 25);
  }

  xScale.domain([5, d3.max(scoreDataFlattened, function(d) { return d[1] })])
  yScale.domain([1, d3.max(scoreDataFlattened, function(d) { return d[2]; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var plot = chart.selectAll(".plot-point")
                  .data(scoreDataFlattened)
                  .enter();

  var points = plot.append("circle")
                  .attr("class", "plot-point")
                  .attr("r", "5")
                  .attr("cx", 0)
                  .attr("cy", 0)
                  .attr("fill", function(d) { return colorScale(d[0]); });

  points.transition()
        .duration(500)
        .ease("elastic-in")
        .attr("cx", function(d) { return xScale(d[1]); })
        .attr("cy", function(d) { return yScale(d[2]); });
}

function drawHoursPostedPlot(jsonWords) {

  var wordList = jsonWords.map(function(wordObj) {
    return wordObj.word;
  });

  var timeData = jsonWords.map(function(wordObj) {
    return wordObj.hours_posted_data;
  });

  var timeDataFlattened = timeData.reduce(function(a, b) {
    return a.concat(b);
  });

  var margin = {top: 20, right: 30, bottom: 30, left: 50},
      width = GRAPH_WIDTH - margin.left - margin.right,
      height = GRAPH_HEIGHT - margin.top - margin.bottom;

  var xScale = d3.scale.ordinal()
      .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
              13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23])
      .rangePoints([10, width]);


  var yScale = d3.scale.linear()
      .range([(height - 5), 0]);

  var colorScale = d3.scale.category20()
      .domain(wordList);

  var chart = d3.select(".hours-posted-chart")
      .attr("width", width)
      .attr("height", height);

  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom");

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left");

  var chart = d3.select(".hours-posted-chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var legend = chart.append("g")
              .attr("class", "legend")
              .attr("transform", "translate(" + (width - 80) + ",0)");

  for (var i=0; i < wordList.length; i++) {
    legend.append("text")
        .text(wordList[i])
        .attr("fill", colorScale(wordList[i]))
        .attr("y", (i+1) * 25);
  }

  yScale.domain([0, d3.max(timeDataFlattened, function(d) { return d[2]; })]);

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  var plot = chart.selectAll(".plot-point")
            .data(timeDataFlattened)
            .enter();

  var points = plot.append("circle")
                  .attr("class", "plot-point")
                  .attr("r", "5")
                  .attr("cx", 0)
                  .attr("cy", 0)
                  .attr("fill", function(d) { return colorScale(d[0]); });

  points.transition()
        .duration(500)
        .ease("elastic-in")
        .attr("cx", function(d) { return xScale(d[1]); })
        .attr("cy", function(d) { return yScale(d[2]); });

}

function drawAvgScoreBarChart(jsonWords) {
  var margin = {top: 20, right: 30, bottom: 30, left: 50},
      width = GRAPH_WIDTH - margin.left - margin.right,
      height = GRAPH_HEIGHT - margin.top - margin.bottom;

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

  var bars = bar.append("rect")
     .attr("class", "bar")
     .attr("x", function(d) { return x(d.word); })
     .attr("y", height)
     .attr("width", x.rangeBand())
     .attr("height", 0)
      .attr("transform", function(d) {
        return "rotate(180," + (x(d.word) + (x.rangeBand() / 2)) + "," + height + ")";
      });

  bars.transition()
      .duration(500)
      .attr("height", function(d) { return height - y(d.avgpoints); });


  // bar.append("text")
  //    .attr("x", function(d) { return x(d.word) + (barWidth / 2) - (margin.right / 2); })
  //    .attr("y", function(d) { return y(d.avgpoints) + 5; })
  //    .attr("dy", ".75em")
  //    .text(function(d) { return d.avgpoints; });


  var labels = bar.append("text")
     .attr("x", function(d) { return x(d.word) + (x.rangeBand() / 2) - 5; })
     .attr("y", height)
     .attr("dy", "-0.2em")
     .attr("fill", "black")
     .text(function(d) { return d.avgpoints; });

  labels.transition()
        .duration(500)
        .attr("y", function(d) { return y(d.avgpoints) - 5; });
}


function drawFrequencyBarChart(jsonWords) {
  var margin = {top: 20, right: 30, bottom: 30, left: 50},
      width = GRAPH_WIDTH - margin.left - margin.right,
      height = GRAPH_HEIGHT - margin.top - margin.bottom;

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
    .orient("left")
    .tickFormat(d3.format("d"));

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

  var bars = bar.append("rect")
      .attr("class", "bar2")
      .attr("x", function(d) { return x(d.word); })
      .attr("y", height)
      .attr("width", x.rangeBand())
      .attr("height", 0)
      .attr("transform", function(d) {
        return "rotate(180," + (x(d.word) + (x.rangeBand() / 2)) + "," + height + ")";
      });

  bars.transition()
      .duration(500)
      .attr("height", function(d) { return height - y(d.frequency); });

  var labels = bar.append("text")
     .attr("x", function(d) { return x(d.word) + (x.rangeBand() / 2) - 5; })
     .attr("y", height)
     .attr("dy", "-0.2em")
     .attr("fill", "black")
     .text(function(d) { return d.frequency; });

  labels.transition()
        .duration(500)
        .attr("y", function(d) { return y(d.frequency) - 5; });
}
