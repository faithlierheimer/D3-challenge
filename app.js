//main goal: make a scatter plot that
//explores healthcare vs. poverty or smokers vs. age

//step 1: define SVG area dimensions
//REASON TO DO OTHER SIZES? -Nelson Q

//NELSON Q: why can't i see the x axis at the moment????
var svgWidth = 960;
var svgHeight = 660;
console.log(svgHeight);

//define chart margins--again, reason to do other measurements?
var chartMargin = {
    top: 30,
    right: 30,
    bottom: 70,
    left: 70
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


//try to add more params for different data? 
var chosenXAxis = "age";

//update x-scale when tehy click axis label? 
function xScale(healthData, chosenXAxis){
    //remake scales?
    var xLinearScale = d3.scaleLinear()
                    .domain([d3.min(healthData, d=>d[chosenXAxis]),
                    d3.max(healthData, d=>d[chosenXAxis])])
                    .range([0, chartWidth]);
    return xLinearScale;
}

//updating axis var when you click the label
function renderAxes(newXScale, xAxis){
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
         .duration(1000)
         .call(bottomAxis);
    return xAxis;
}

//fxn to update circles that data is bound to w/transition to new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis){
    circlesGroup.transition()
                .duration(1000)
                .attr("cx", d=>newXScale(d[chosenXAxis]));

    return circlesGroup;
}

//update circles w/different tooltip?
function updateToolTip(chosenXAxis, circlesGroup){
    var label;

    if (chosenXAxis === "age"){
        label = "Age";
    }
    else {
        label = "Income";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d){
            return(`${chosenXAxis}: ${d[chosenXAxis]}, Smokers Per Capita: ${d.smokes}, State: ${d.state}`);
        });
    
    chartGroup.call(toolTip);
    circlesGroup.on("mouseover", function(d){
        toolTip.show(d);
    })

    //now mouseout
    .on("mouseout", function(data, index){
        toolTip.hide(data);
    });

    return circlesGroup;
}
//load health data, use all the fxns
d3.csv("data.csv").then(function(healthData, err){
    if (err) throw err;
    //print data to check it
    console.log(healthData);

    //cast age data to number for each piece of the healthData
    //Question: does this make a new array? what does it do?
    //like, does it make it so we can refer to d.age later?
    healthData.forEach(function(d){
        d.age = +d.age;
        d.smokes = +d.smokes;
        d.income = +d.income;
    });

    //xlinearscale fxn
    var xLinearScale = xScale(healthData, chosenXAxis);

    //y scale fxn
    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(healthData, d =>d.smokes)])
        .range([chartHeight, 0]);

    //axes functions 
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
    //now do the same w/smoker column? 
    //still need to find out what that means lol.
   
    //append x axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);

    //append y axis
    chartGroup.append("g")
    .call(leftAxis);



    //states as an object i think, so we can print text later
    // healthData.forEach(function(d){
    //     d.state =+d.state;
    //     console.log(d.state)
    // });

    //configure band scale for horizontal axis 
    // var xLinearScale = d3.scaleLinear()
    //                 .domain([30,d3.max(healthData, d=>d.age)])
    //                 //range-->viewing range, right?
    //                 .range([0, chartWidth]);
    
    //make linear scale for vertical axis 
    // var yLinearScale = d3.scaleLinear()
    //     .domain([0, d3.max(healthData, d=> d.smokes)])
    //     .range([chartHeight, 0]);


    //now need variables made from d3 axis functions (right?)
    //that pass in scales as arguments, which actually makes
    //chart's axes. 
    //might need to change ticks later. 

    //x axis showing up as NaNs, not sure how to explain? 
    // var bottomAxis = d3.axisBottom(xLinearScale);
    // var leftAxis = d3.axisLeft(yLinearScale).ticks(10);


    //need two SVG group elements for chartGroup area,
    //this is what actually makes the axes I think?
    // chartGroup.append("g")
    //     .call(leftAxis);

    // chartGroup.append("g")
    //     .attr("transform", `translate(0, ${chartHeight})`)
    //     .call(bottomAxis);
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
        .attr("stroke", "black");
// var toolTip = d3.tip()
//                 .attr("class", "tooltip")
//                 .offset([80, -60])
//                 .html(function(d){
//                     return(`Age: ${d.age}, Smoker: ${d.smokes}, State: ${d.state}`);
//                 });

//group for both x axis labels
var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${chartWidth/2}, ${chartHeight})`);

var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age")
    .text("Age (Median)")
    .classed("active", true);

var incomeLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "income")
    .text("Household Income (Median)")
    .classed("inactive", true);
//append y axis
chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - chartMargin.left-5)
    .attr("x", 0 - (chartHeight/2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Smokers per Capita");

//update tooltip fxn
var circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

// x axis labels event listener
labelsGroup.selectAll("text")
    .on("click", function() {
  // get value of selection
  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    // replaces chosenXAxis with value
    chosenXAxis = value;

    // console.log(chosenXAxis)

    // functions here found above csv import
    // updates x scale for new data
    xLinearScale = xScale(healthData, chosenXAxis);

    // updates x axis with transition
    xAxis = renderAxes(xLinearScale, xAxis);

    // updates circles with new x values
    circlesGroup = renderCircles(circlesGroup, xLinearScale, chosenXAxis);

    // updates tooltips with new info
    circlesGroup = updateToolTip(chosenXAxis, circlesGroup);

    // changes classes to change bold text
    if (chosenXAxis === "income") {
      incomeLabel
        .classed("active", true)
        .classed("inactive", false);
      ageLabel
        .classed("active", false)
        .classed("inactive", true);
    }
    else {
      incomeLabel
        .classed("active", false)
        .classed("inactive", true);
      ageLabel
        .classed("active", true)
        .classed("inactive", false);
    }
  }
});
// chartGroup.call(toolTip);

// circlesGroup.on("mouseover", function(d){
//     toolTip.show(d, this);
// })
//     .on("mouseout", function(d){
//         toolTip.hide(d)
//     });

}).catch(function(error){
    console.log(error);
});