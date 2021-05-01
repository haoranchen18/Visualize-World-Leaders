class ScatterPlot {

  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 700,
      containerHeight: 380,
      margin: { top: 25, right: 15, bottom: 20, left: 45 },
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

    // define innerbox size
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
        .attr("transform", `translate(0,${vis.innerHeight})`);

    // add labels
    vis.svg
        .append("text")
        .attr("x", 15)
        .attr("y", 20)
        .attr("class", "text-label")
        .text("Age");

    vis.svg
        .append("text")
        .attr("y", vis.innerHeight + 15)
        .attr("x", vis.innerWidth - 98)
        .attr("class", "text-label")
        .text("GDP per Capita (US$)");
  }

  updateVis(data) {
    // Prepare data and scales
    let vis = this;

    // filter the data
    data = data.filter(d => d.pcgdp != null);

    vis.data = data;
    // Prepare data and scales
    vis.xScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.pcgdp)])
        .range([0, vis.innerWidth]);
    vis.yScale = d3
        .scaleLinear()
        .domain(d3.extent(data, d => d.end_age))
        .range([vis.innerHeight, 0]);


    // deploy the axes
    vis.yAxis.call(d3.axisLeft(vis.yScale).tickSize(-vis.innerWidth).ticks(6));
    vis.xAxis.call(d3.axisBottom(vis.xScale).tickSize(-vis.innerHeight));

    //remove the paths
    vis.yAxis.selectAll("path").remove();
    vis.yAxis.selectAll("line").attr("stroke", "lightgray");
    vis.xAxis.selectAll("path").remove();
    vis.xAxis.selectAll("line").attr("stroke", "lightgray");
    vis.renderVis();
  }

  renderVis() {
    // Bind data to visual elements, update axes
    this.chart
        .selectAll("circle")
        .data(this.data)
        .join("circle")
        .attr("cx", (d) => this.xScale(d.pcgdp) + 5)
        .attr("cy", (d) => this.yScale(d.end_age))
        .attr("r", 5)
        .attr("fill", "#a4a5c2")
        .attr("opacity", 0.7)
        .attr("stroke", "gray")
        .on("mouseover", (e, d) => {
          // tooltip
          d3
              .select(".tip")
              .style("visibility", "visible")
              .style("top", e.pageY + 20 + "px")
              .style("left", e.pageX + 20 + "px")
              .style("background-color", "white")
              .style("padding", "5px").html(
                  `<strong>${d.leader}</strong>
                   <div> <i> ${d.country}, ${d.start_year}-${d.end_year} </i></div>
                   <p>
                        <li>Age at inauguration: ${d.end_age}</li>
                        <li>Time in office: ${d.end_year - d.start_year} years</li>
                        <li>GDP/capital: ${Math.round(d.pcgdp)}</li>
                   </p>
        `     );
        })
        .on("mouseout", () => {
          // hide tooltip
          d3.select(".tip").style("visibility", "hidden");
        })
        .on("click", (e) => {
          // circles become orange when clicking
          // __data__ is a property of target, and we can get the id of each __data__ to represent each circle
          let id = e.target.__data__.id;
          let circleFill = d3.select(e.target).attr("fill");
          // if the fill color is blue--#a4a5c2, then change it into orange
          // if the fill color is orange, then change it into blue
          // toggle logic, control them via clicking
          if (circleFill === "#a4a5c2") {
            d3.select(e.target).attr("fill", "orange");
            // the corresponded arrowLine would be orange along with the clicked circle
            d3.select(`.L${id}`)
                .style("marker-end", "url(#arrow-head-orange)")
                .attr("stroke", "orange")
                .attr("stroke-width", 6);
          } else {
            d3.select(e.target).attr("fill", "#a4a5c2");
            // clicking twice, it will recover to original
            d3.select(`.L${id}`)
                .attr("stroke", d => (d.label === 1 ? "#a4a5c2" : "gray"))
                .attr("stroke-width", d => (d.label === 1 ? 6 : 2))
                .style("marker-end", d =>
                    d.label === 1
                        ? "url(#arrow-head-purple)"
                        : "url(#arrow-head-gray)"
                );
          }
        });
  }

}