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
          .select("scatter")
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

    //cast age data to number for each piece of the healthData
    //Question: does this make a new array? what does it do?
    //like, does it make it so we can refer to d.age later?
    healthData.forEach(function(d){
        d.age = +d.hours;
    });

    //now do the same w/smoker column? 
    //still need to find out what that means lol.
    healthData.forEach(function(d){
        d.smokes = +d.smokes;
    });

    //configure band scale for horizontal axis 
    var xBandScale = d3.scaleBand()
                    .domain(healthData.map(d=>d.age))
                    //range-->viewing range, right?
                    .range([0, chartWidth]);
    
    //make linear scale for vertical axis 
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d=> d.smokes)])
        .range([chartHeight, 0]);

    //now need variables made from d3 axis functions (right?)
    //that pass in scales as arguments, which actually makes
    //chart's axes. 
    //might need to change ticks later. 
    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);
    //code circles

    //bind data to circles for scatterplot

    //code state abbrevs to each circle



    
    //populate axes w/numbers 
})