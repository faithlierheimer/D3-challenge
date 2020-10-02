//main goal: make a scatter plot that
//explores healthcare vs. poverty or smokers vs. age

//step 1: define SVG area dimensions
//REASON TO DO OTHER SIZES? -Nelson Q
var svgWidth = 960;
var svgHeight = 660;

//define chart margins--again, reason to do other measurements?
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

//use above measurements to define chart area 
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight = chartMargin.top - chartMargin.bottom;

//select scatter div (shouldn't be body like in examples, right?)
//as svg, set dimensions
var svg = d3
          .select("body")
          .append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

//Add a chart group to svg area, translate it to be within the 
//predefined chart margins

var chartGroup = svg.append("g")
                 .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

d3.csv("data.csv").then(function(healthData){
    //print data to check it
    console.log(healthData);

    //cast relevant parts of data to own arrays

    //select scatter div to append svg

    //code circles

    //bind data to circles for scatterplot

    //code state abbrevs to each circle


    //code individual axes

    //scale axes 

    //populate axes w/numbers 
})