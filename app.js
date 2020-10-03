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

    //states as an object i think, so we can print text later
    // healthData.forEach(function(d){
    //     d.state =+d.state;
    //     console.log(d.state)
    // });

    //configure band scale for horizontal axis 
    var xLinearScale = d3.scaleLinear()
                    .domain([30,d3.max(healthData, d=>d.age)])
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
    var bottomAxis = d3.axisBottom(xLinearScale);
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
    var circlesGroup = chartGroup.selectAll(".circle")
        .data(healthData)
        .enter()
        .append("circle")
        .attr("class", "circle")
        .attr("cx", d=>xLinearScale(d.age))
        .attr("cy", d=>yLinearScale(d.smokes))
        .attr("r", "10")
        .attr("fill", "gold")
        .attr("stroke", "black")
var toolTip = d3.tip()
                .attr("class", "tooltip")
                .offset([80, -60])
                .html(function(d){
                    return(`Age: ${d.age}, Smoker: ${d.smokes}, State: ${d.state}`);
                });
chartGroup.call(toolTip);

circlesGroup.on("mouseover", function(d){
    toolTip.show(d, this);
})
    .on("mouseout", function(d){
        toolTip.hide(d);
    });

}).catch(function(error){
    console.log(error);
});