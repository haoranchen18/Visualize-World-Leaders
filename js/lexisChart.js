class LexisChart {

  /**
   * Class constructor with initial configuration
   * @param {Object}
   * @param {Array}
   */
  constructor(_config) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 1000,
      containerHeight: 380,
      margin: {top: 15, right: 15, bottom: 20, left: 25}
    }
    this.initVis();
  }
  
  /**
   * Create scales, axes, and append static elements
   */
  initVis() {
    let vis = this;

    // Define size of SVG drawing area
    vis.svg = d3.select(vis.config.parentElement)
        .attr('width', vis.config.containerWidth)
        .attr('height', vis.config.containerHeight)
        .attr("rx", 20).attr("ry", 20);

    // add a lightgray outline for the rect of lexis svg
    vis.svg
        .append("rect")
        .attr("width", vis.config.containerWidth)
        .attr("height", vis.config.containerHeight)
        .attr("stroke", "lightgray")
        .attr("fill", "none");


    // Append group element that will contain our actual chart 
    // and position it according to the given margin config
    vis.chartArea = vis.svg.append('g')
        .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);



    // define inner box size
    vis.innerHeight =
        vis.config.containerHeight -
        vis.config.margin.top -
        vis.config.margin.bottom;

    vis.innerWidth =
        vis.config.containerWidth -
        vis.config.margin.left -
        vis.config.margin.right;

    vis.chart = vis.chartArea.append('g');


    /**
     * Have implemented this part in HTML file
     */
    // Create default arrow head
    // Can be applied to SVG lines using: `marker-end`
    // vis.chart.append('defs').append('marker')
    //       .attr('id', 'arrow-head')
    //       .attr('markerUnits', 'strokeWidth')
    //       .attr('refX', '2')
    //       .attr('refY', '2')
    //       .attr('markerWidth', '10')
    //       .attr('markerHeight', '10')
    //       .attr('orient', 'auto')
    //     .append('path')
    //       .attr('d', 'M0,0 L2,2 L 0,4')
    //       .attr('stroke', '#ddd')
    //       .attr('fill', 'none');


    // apply clipping mask to 'vis.chart', restricting the region at the very beginning and end of a year
    vis.chart
        .append("defs")
        .append("clipPath")
        .attr("id", "chart-mask")
        .append("rect")
        .attr("width", vis.config.containerWidth)
        .attr("height", vis.config.containerHeight);
    vis.chart.attr("clip-path", "url(#chart-mask)");

    // text label for lexischart
    vis.svg
        .append("text")
        .attr("y", 25)
        .attr("x", 10)
        .attr("class", "text-label")
        .text("Age");

    // Todo: initialize scales, axes, static elements, etc.

    // define x-axis scale
    vis.yearScale = d3
        .scaleLinear()
        .domain([1950, 2021])
        .range([0, vis.innerWidth]);

    // define y-axis scale
    vis.ageScale = d3
        .scaleLinear()
        .domain([25, 95])
        .range([vis.innerHeight, 0]);

    //define y-axis
    vis.chartArea
        .append("g")
        .call(d3.axisLeft(vis.ageScale).tickValues([40, 50, 60, 70, 80, 90]));

    // define x-axis
    vis.chartArea
        .append("g")
        .attr("transform", `translate(0,${vis.innerHeight})`)
        .call(d3.axisBottom(vis.yearScale).tickFormat(d3.format(""))); // tickFormat can make x-axis tick's label without comma, like 1,950

    // remove path on the axis
    vis.chartArea.selectAll("path").remove();

    // define tooltip
    d3.select("body")
        .append("div")
        .attr("class", "tip")
        .attr("visible", "hidden")
        .style("position", "absolute");
  }


  updateVis(data) {
    let vis = this;
    
    // Todo: prepare data
    
    vis.renderVis(data);
  }


  renderVis(data) {
    
    // Todo: Bind data to visual elements (enter-update-exit or join)
    let vis = this;
    let xScale = vis.yearScale;
    let yScale = vis.ageScale;

    // draw arrowlines
    vis.chart
        .selectAll(".arrowLine")
        .data(data)
        .join("line")
        .attr("class", d => `arrowLine L${d.id}`) // make every arrowline an index
        .attr("x1", d => `${xScale(d.start_year)}`)
        .attr("x2", d => `${xScale(d.end_year)}`)
        .attr("y1", d => `${yScale(d.start_age)}`)
        .attr("y2", d => `${yScale(d.end_age)}`)
        .attr("stroke", d => (d.label === 1 ? "#a4a5c2" : "gray"))
        .attr("stroke-width", d => (d.label === 1 ? 6 : 2))
        .attr("fill", "none")
        .attr("stroke-opacity", 0.8)
        .style("marker-end", d =>
            d.label === 1 ? "url(#arrow-head-purple)" : "url(#arrow-head-gray)"
        )
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
                        <li>GDP/capita: ${Math.round(d.pcgdp)}</li>
                   </p>        
               `);
        })
        .on("mouseout", () => {
          // hide the tip
          d3.select(".tip").style("visibility", "hidden");
        });

    // add labels for the arrowlines
    vis.chart
        .selectAll(".label")
        .data(data)
        .join("text")
        .attr("class", "label")
        .attr("transform-origin", "origin")
        .attr(
            "transform",
            (d) => `translate(${xScale(d.start_year)},${yScale(d.start_age) - 10}) rotate(-20)`
        )
        .attr("dominant-baseline", "auto")
        .text((d) => (d.label === 1 ? d.leader : null));
  }
}