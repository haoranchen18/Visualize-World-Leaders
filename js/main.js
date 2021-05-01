/**
 * Load data from CSV file asynchronously and render charts
 */
d3.csv('data/leaderlist.csv').then(data => {
  
  // Convert columns to numerical values
  data.forEach(d => {
    Object.keys(d).forEach(attr => {
      if (attr == 'pcgdp') {
        d[attr] = (d[attr] == 'NA') ? null : +d[attr];
      } else if (attr != 'country' && attr != 'leader' && attr != 'gender') {
        d[attr] = +d[attr];
      }
    });
  });

  // filter the data, remove the data with year duration <= 0
  data = data.filter(d => d.end_year - d.start_year !== 0);
  data.sort((a,b) => a.label - b.label);

  let lexis = new LexisChart({ parentElement: "#lexis" });
  let bar = new BarChart({parentElement: "#bar"});
  let scatter = new ScatterPlot({ parentElement: "#scatter"});

  let value = d3.select("#country-selector").attr("value");
  // render the selected option
  let filteredData = data.filter((d) => d[value] === 1);
  render(filteredData);


  // when changing the selection
  d3.select("#country-selector").on("change", (e, d) => {
    // the clicked value
    let selectValue = e.target.value;

    let _data = data.filter((d) => d[selectValue] === 1);
    render(_data);
  });

  function render(data) {
    //lexis
    lexis.updateVis(data);

    //bar
    const barData = d3.rollups(
        data,
        d => d.length,
        d => d.gender
    );
    bar.updateVis(barData);

    //scatter
    scatter.updateVis(data);
  }

});

/*
 * Todo:
 * - initialize views
 * - filter data
 * - listen to events and update views
 */
