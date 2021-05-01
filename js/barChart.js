class BarChart {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 296,
      containerHeight: 380,
      margin: { top: 25, right: 25, bottom: 20, left: 45 },
    };
    this.initVis();
  }
  
  initVis() {
    // Create SVG area, initialize scales and axes
    let vis = this;

    // Define size of SVG drawing area
    vis.svg = d3
        .select(vis.config.parentElement)
        .attr("width", vis.config.containerWidth)
        .attr("height", vis.config.containerHeight);
    vis.svg
        .append("rect")
        .attr("width", vis.config.containerWidth)
        .attr("height", vis.config.containerHeight)
        .attr("stroke", "lightgray")
        .attr("fill", "none");

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chartArea = vis.svg
        .append("g")
        .attr(
            "transform",
            `translate(${vis.config.margin.left},${vis.config.margin.top})`
        );

    // define inner box size
    vis.innerHeight =
        vis.config.containerHeight -
        vis.config.margin.top -
        vis.config.margin.bottom;

    vis.innerWidth =
        vis.config.containerWidth -
        vis.config.margin.left -
        vis.config.margin.right;

    vis.chart = vis.chartArea.append("g");
    vis.yAxis = vis.chart.append("g");
    vis.xAxis = vis.chart
        .append("g")
        .attr("transform", `translate(0, ${vis.innerHeight})`);

    // text label
    vis.svg
        .append("text")
        .attr('y', 20)
        .attr('x', 10)
        .attr("class", "text-label")
        .text("Gender");
  }

  updateVis(data) {
    // Prepare data and scales
    let vis = this;
    vis.data = data;

    // define xScale
    vis.xScale = d3
        .scaleBand()
        .domain(["Male", "Female"])
        .range([0, vis.innerWidth])
        .padding(0.3);

    // define yScale
    vis.yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, d => d[1])])
        .range([vis.innerHeight, 0]);


    vis.yAxis.call(d3.axisLeft(vis.yScale).tickSize(-vis.innerWidth));
    vis.xAxis.call(d3.axisBottom(vis.xScale));
    // remove the paths on both axes
    vis.yAxis.selectAll("path").remove();
    vis.yAxis.selectAll("line").attr("stroke", "lightgray");
    vis.xAxis.selectAll("path").remove();
    this.renderVis();
  }

  renderVis() {
    // Bind data to visual elements, update axes
    let vis = this;
    vis.chart
        .selectAll("rect")
        .data(vis.data)
        .join("rect")
        .attr("x", (d) => vis.xScale(d[0]))
        .attr("y", (d) => vis.yScale(d[1]))
        .attr("width", vis.xScale.bandwidth())
        .attr("height", (d) => vis.innerHeight - vis.yScale(d[1]))
        .attr("fill", "#bfc0d4") //#bfc0d4
        .on("click", (e, d) => {
          // select the gender
          // we have rollsup the data in main.js. so each data is an array with 2 elts
          //  __data__[0] is gender, __data__[1] is number of people of this gender
          let gender = e.target.__data__[0];
          // the selected data
          let target = d3.select(e.target);
          // determine whether it is selected according to the stroke
          let stroke = target.attr("stroke");
          // when clicking twice, graph will recover to original
          // toggle logic
          if (stroke === "black") {
            target.attr("stroke", null).attr("fill", "#bfc0d4");
            d3.selectAll(".arrowLine").attr("stroke-width", d =>
                d.label === 1 ? 6 : 2
            );
            d3.selectAll(".label").attr("opacity", d =>
                d.label === 1 ? 6 : 2
            );
            d3.selectAll("circle").attr("opacity", 0.8);
          } else {
            // first clicking, the stroke becomes black
            target.attr("stroke", "black").attr("fill", "#a4a5c2");
            // not selected gender, the arrowline will disappear in the graph
            d3.selectAll(".arrowLine").attr("stroke-width", d =>
                d.gender !== gender ? 0 : d.label === 1 ? 6 : 2
            );
            // not selected gender, the label will disappear
            d3.selectAll(".label").attr("opacity", d =>
                d.gender !== gender ? 0 : d.label === 1 ? 1 : 0
            );

            // the circles that dont meet the condition, will have less opacity
            d3.selectAll("circle").attr("opacity", d =>
                d.gender === gender ? 0.8 : 0.2
            );
          }
        });
  }
}