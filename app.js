function buildDropdown() {
    var selDataset = document.getElementById("selDataset");

    Plotly.d3.json('/names', function(error, data){
        if (error) return console.warn(error);
        for (i = 0; i < data.length; i++) {
            SampleName=data[i]
            var selDatasetItem = document.createElement("option");
            selDatasetItem.text=SampleName;
            selDatasetItem.value=SampleName;
            selDataset.appendChild(selDatasetItem);
                }
    }
)}

buildDropdown()

function getPieChartData(data) {
    console.log(data.samples)
    if (data.samples.length>10) {
        endListRange=9
        }
    else endListRange=data.samples.length-1

    top10Samples=[]
    top10OTUIDs=[]
    for (i = 0; i < endListRange; i++) {
        top10Samples.push(+data.samples[i])
        top10OTUIDs.push(+data.otu_id[i])
    }

    pieChartData = [{
        "labels": top10OTUIDs,
        "values": top10Samples,
        "type": "pie"}]

    return pieChartData    
}


function buildPie(sampleID) {
    url='/samples/'+sampleID;
    Plotly.d3.json(url, function(error, data){
        var layout = {
            title: "It's a CHART"}
        var PIE = document.getElementById('pie');
        var trace=getPieChartData(data)
        Plotly.plot(PIE, trace, layout);
    })
}


function updatePieChart(newdata) {
    url='/samples/'+newdata;
    Plotly.d3.json(url, function(error, data){
        if (error) return console.warn(error);

        var PIE = document.getElementById('pie');
        
        var trace=getPieChartData(data)

        Plotly.restyle(PIE, "labels", [trace[0].labels]);
        Plotly.restyle(PIE, "values", [trace[0].values]);
    })
  }

  function updateBubbleChart(newdata) {
    url='/samples/'+newdata;
    Plotly.d3.json(url, function(error, data){
        var PLOT = document.getElementById('plot');
        
        var trace = {
            x: data.otu_id,
            y: data.samples
            };
        
        var data = [trace];

        Plotly.restyle(PLOT, "x", [trace.x]);
        Plotly.restyle(PLOT, "y", [trace.y]);
        Plotly.restyle(PLOT, "marker.color", [trace.x]);
    })
  }

    function getMetadata(sampleID) {
        url = '/metadata/'+sampleID
        Plotly.d3.json(url, function(error, data){
            if (error) return console.warn(error);
            
            var metadata_results={
                "AGE":data.AGE,
                "TYPE":data.BBTYPE,
                "ETHINCITY":data.ETHNICITY,
                "GENDER":data.GENDER,
                "LOCATION":data.LOCATION,
                "SAMPLEID":data.SAMPLEID
            }

            var Metadata=document.getElementById('metadata')
            var Age=document.getElementById('age')
            var BBType=document.getElementById('type')
            var Ethnicity=document.getElementById('ethnicity')
            var Gender=document.getElementById('gender')
            var Location=document.getElementById('location')
            var SampleID=document.getElementById('sampleid')

            Age.innerHTML="Age: "+data.AGE[0]
            BBType.innerHTML="BBType: "+data.BBTYPE[0]
            Ethnicity.innerHTML="Ethnicity: "+data.ETHNICITY[0]
            Gender.innerHTML="Gender: "+data.GENDER[0]
            Location.innerHTML="Location: "+data.LOCATION[0]
            SampleID.innerHTML="Sample ID: "+data.SAMPLEID[0]

        })
    }

function optionChanged(sampleID) {
    updatePieChart(sampleID)
    updateBubbleChart(sampleID)
    getMetadata(sampleID)
    }

function buildPlot(sampleID) {
    url = '/samples/'+sampleID
    Plotly.d3.json(url, function(error, response) {

        console.log(response.samples);
        var trace1 = {
            x: response.otu_id,
            y: response.samples,
            mode: 'markers',
            marker: {
                size: response.samples,
                color: response.otu_id,
                text: "sup"
            }
        };

        var data = [trace1];
      
        var layout = {
            title: "Bubble Size", 
            height: 600,
            width: 1000
            };
        
        var PLOT = document.getElementById('plot');
        Plotly.newPlot(PLOT, data, layout);
    });
}

buildPlot();