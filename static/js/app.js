// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    // Filter the metadata for the object with the desired sample number
    //console.log(data);

    let metadata = data.metadata.filter(sampleObj => sampleObj.id == sample)[0];

    // Use d3 to select the panel with id of `#sample-metadata`

    console.log(metadata);
    
    let metadataPanel = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata

    metadataPanel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("h6").text(`${key}: ${value}`);
    });
   }).catch(error => {
     console.error("Error JSON: ", error);
   });
};


// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    
    // Filter the samples for the object with the desired sample number

    let samples = data.samples.filter(sampleObj => sampleObj.id == sample)[0];

    // Get the otu_ids, otu_labels, and sample_values

    let otuIds = samples.otu_ids;
    let otuLabels = samples.otu_labels;
    let sampleValues = samples.sample_values;

    //console.log(otuIds, otuLabels, sampleValues);



    // Build a Bubble Chart

    let trace = {

    x: otuIds,
    y: sampleValues,
    mode: "markers",
    marker: {
      size: sampleValues.map(value => value * 0.8),
      color: otuIds,
      colorscale: "Earth",
      showscale: true,
      opacity: 0.8
    },
    text: otuLabels,
    hoverinfo: "text"
    };

    let dataBubble = [trace];

    let layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: 'OTU ID'},
      yaxis: { title: 'Number of Bacteria'},
      showlegend: false,
      width: 1000,
      height: 500 
    };

    // Render the Bubble Chart
    
  Plotly.newPlot('bubble', dataBubble, layout);
  

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks

    let sortedData = sampleValues
      .map((value, index) => ({ value, index }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);  

    let topValues = sortedData.map(d => d.value);
    let topOtuIds = sortedData.map(d => otuIds[d.index]);
    let topOtuLabels = sortedData.map(d => otuLabels[d.index]);

    let reversedTopValues = topValues.reverse();
    let reversedTopOtuIds = topOtuIds.reverse();
    let reversedTopOtuLabels = topOtuLabels.reverse();

    let yticks = topOtuIds.map(id => `OTU ${id}`);


    // Build a Bar Chart

    let traceBar = {
      x: topValues,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: topOtuLabels,
      hoverinfo: 'text'
    };

    let dataBar = [traceBar];

    
    let layoutBar = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: { title: 'Number of Bacteria' },
      yaxis: { title: " " }
    };

    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart

    Plotly.newPlot('bar', dataBar, layoutBar);

  }).catch(error => {
    console.error("Error loading JSON: ", error);
  });
}


// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let sampleNames = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select("#selDataset");

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.

    sampleNames.forEach((sample) => {
      dropdown.append("option")
        .text(sample)
        .property("value", sample);
    });

    // Get the first sample from the list

    let firstSample = sampleNames[0];

    // Build charts and metadata panel with the first sample
    
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};


// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}


// Initialize the dashboard
init();
