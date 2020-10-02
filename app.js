//main goal: make a scatter plot that
//explores healthcare vs. poverty or smokers vs. age

//step 1: define SVG area dimensions
//REASON TO DO OTHER SIZES? -Nelson Q
var svgWidth = 960;
var svgHeight = 660;
console.log(svgHeight);

//define chart margins--again, reason to do other measurements?
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
};

//use above measurements to define chart area 
var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;

//select scatter div (shouldn't be body like in examples, right?)
//as svg, set dimensions
var svg = d3
          .select("#scatter")
          .append("svg")
          .attr("height", svgHeight)
          .attr("width", svgWidth);

//Add a chart group to svg area, translate it to be within the 
//predefined chart margins

var chartGroup = svg.append("g")
                 .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);

//load health data
d3.csv("data.csv").then(function(healthData){
    //print data to check it
    console.log(healthData);

    //cast age data to number for each piece of the healthData
    //Question: does this make a new array? what does it do?
    //like, does it make it so we can refer to d.age later?
    healthData.forEach(function(d){
        d.age = +d.age;
    });

    //now do the same w/smoker column? 
    //still need to find out what that means lol.
    healthData.forEach(function(d){
        d.smokes = +d.smokes;
    });

    //configure band scale for horizontal axis 
    var xBandScale = d3.scaleLinear()
                    .domain([25,d3.max(healthData, d=>d.age)])
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

    //x axis showing up as NaNs, not sure how to explain? 
    var bottomAxis = d3.axisBottom(xBandScale);
    var leftAxis = d3.axisLeft(yLinearScale).ticks(10);


    //need two SVG group elements for chartGroup area,
    //this is what actually makes the axes I think?
    chartGroup.append("g")
        .call(leftAxis);

    chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
    //gonna need one svg circle per piece of healthData? 
    //and band scales help position the circles on the chart? 

    //do we select circle bc that's what we want? bc it's not in css
    //do i need to add circle to css??
    chartGroup.selectAll(".circle")
        .data(healthData)
        .enter()
        .append("circle")
        //i picked circle bc i don't think d3 has a scatterplot ?
        .attr("class", "circle")
        //x is the one that keeps showing up as zero, everything else 
        //looks right? 
        .attr("x", d=>xBandScale(d.age))
        .attr("y", d=>yLinearScale(d.smokes))
        .attr("width", xBandScale.bandwidth())
        .attr("height", d => chartHeight - yLinearScale(d.smokes)); 
}).catch(function(error){
    console.log(error);
});