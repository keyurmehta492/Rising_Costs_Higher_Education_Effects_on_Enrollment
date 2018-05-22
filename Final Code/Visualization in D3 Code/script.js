var div = d3.select('body').append('div')

var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 960 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y").parse; 

// Set the ranges
var x = d3.time.scale().range([0, width]).nice();  
        
var y = d3.scale.linear().range([height, 0]);

// Define the axes
var xAxis = d3.svg.axis().scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis().scale(y)
    .orient("left");


var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.cost); });

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 50)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var dataFiltered = {}
var dataNested = {}

d3.csv("tuition_1973.csv", function(error, data) {
  data.forEach(function(d) {
    d.year = parseDate(d.year);
    d.cost = +d.cost;
    d.value = +d.value;
  });

  var dataNested = d3.nest()
    .key(function (d) { return d.type })
    .entries(data)

    // var arr = ["1: All Institute","2:Public Institute","3:Private Institute","4:Private Non profit","5:Private for profit"];
  // div.append('select')
  d3.select('select')
      .attr('id','variableSelect')
      .on('change',variableChange)
    .selectAll('option')  
      .data(dataNested).enter()
      //.data(arr)
    .append('option')
      .attr('value',function (d) { return d.key })
      .text(function (d) { return d.key })

var dataFiltered = dataNested.filter(function (d) { return d.key===d3.select('#variableSelect').property('value') })
   // var dataFiltered = dataNested.filter(function (d) { 
   //  return d.key===d3.select("select").on("change",function(d){
   //  var selected = d3.select("#variableSelect").node().value;
   //  }) 
   //  })
   console.log(dataFiltered);

  x.domain(d3.extent(dataFiltered[0].values, function(d) { return d.year; }));
  y.domain(d3.extent(dataFiltered[0].values, function(d) { return d.cost; }));

  svg.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);


  svg.append("g")
      .attr("class", "yAxis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(0)")
      .attr("y", 6)
      .attr("x", 50)
      .attr("dy", "1em")
      .style("text-anchor", "end")
      .text("Total Cost");
      svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", (height + margin.bottom + 20))
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .style("padding-top","20px") 
        .text("All Higher Education Cost Filter by Different Type of Institutions");


  svg.append("path")
      .datum(dataFiltered[0].values)
      .attr("class", "line")
      .attr("d", line);

  function variableChange() {
  	var value = this.value
   	var dataFiltered = dataNested.filter(function (d) { return d.key===value })
    x.domain(d3.extent(dataFiltered[0].values, function(d) { return d.year; }));
    y.domain(d3.extent(dataFiltered[0].values, function(d) { return d.cost; }));
    d3.select('.xAxis').transition().duration(1000).call(xAxis)
    d3.select('.yAxis').transition().duration(1000).call(yAxis)
    d3.select('.line').datum(dataFiltered[0].values).attr('d',line)
	 }

});