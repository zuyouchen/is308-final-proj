Chart.defaults.font.family = 'Calibri'
const semesterSelect = document.getElementById("semester-select-cumulative");
const levelSelect = document.getElementById("level-select");
const chartSelect = document.getElementById("chart-type-select");
const axisScaleSelect = document.getElementById('axis-scale-select');

// Track the selected racial categories as selectedRaceValues
const checkboxes = document.querySelectorAll('.racial-category-select input[type="checkbox"]');
let selectedRaceValues = [];
// Add event listeners to each checkbox
checkboxes.forEach(checkbox => {
  checkbox.addEventListener('change', event => {
    const checkboxValue = event.target.value;
    if (event.target.checked) {
      // If the checkbox is checked, add its value to the array
      selectedRaceValues.push(checkboxValue);
    } else {
      // If the checkbox is unchecked, remove its value from the array
      const index = selectedRaceValues.indexOf(checkboxValue);
      if (index !== -1) {
        selectedRaceValues.splice(index, 1);
      }
    }
    updateChart();
    // console.log(selectedRaceValues);
  });
});

// Define the lines for the line chart
const lines = [
    { key: "Caucasian", label: "Caucasian", borderColor: "rgba(54, 162, 235, 1)", backgroundColor: "rgba(54, 162, 235, 0.7)" },
    { key: "All Asian", label: "Asian", secondaryKey: "Asian American", borderColor: "rgba(90, 142, 226, 1)", backgroundColor: "rgba(90, 142, 226, 0.7)" },
    { key: "Hispanic", label: "Hispanic", borderColor: "rgba(0, 97, 164, 1)", backgroundColor: "rgba(0, 97, 164, 0.7)" },
    { key: "All   African American", label: "African-American", secondaryKey: "African American", borderColor: "rgba(121, 120, 210, 1)", backgroundColor: "rgba(121, 120, 210, 0.7)" },
    { key: "All    Native American", label: "Native-American", secondaryKey: "Native American", borderColor: "rgba(146, 96, 186, 1)", backgroundColor: "rgba(146, 96, 186, 0.7)" },
    { key: "All Hawaiian/ Pac Isl", label: "Hawaiian/Pacific Islander", secondaryKey: "Hawaiian/Pacific Isl", borderColor: "rgba(163, 69, 155, 1)", backgroundColor: "rgba(163, 69, 155, 0.7)" },
    { key: "Multiracial", label: "Multiracial", borderColor: "rgba(171, 37, 118, 1)", backgroundColor: "rgba(171, 37, 118, 0.7)" },
    { key: "Unreported Race", label: "Unreported Race", borderColor: "rgba(0, 40, 97, 1)", backgroundColor: "rgba(0, 40, 97, 0.7" }
];

const fetchData = async (url) => {
    const response = await fetch(url);
    const data = await response.text();
    return Papa.parse(data, { header: true, skipEmptyLines: true }).data;
};

// Filter data to selected level, term
const filterData = (data) => {
    const filtered = [];    
    data.forEach((row) => {
        // if the row matches term (fa, sp, su) and the level 
        if (row['Student Level'] == levelSelect.value && row['Term'].substr(0, 2) == semesterSelect.value) {
            // add the row to the filtered data
            filtered.push(row);
        }
    });
    return filtered;
};

function convertTermAndYear(str) {
    let term = str.slice(0, 2);
    let year = str.slice(2);
  
    // Convert term abbreviation to full name
    switch (term) {
      case "fa":
        term = "Fall";
        break;
      case "su":
        term = "Summer";
        break;
      case "sp":
        term = "Spring";
        break;
      default:
        // Invalid term abbreviation
        return null;
    }
  
    // Convert year abbreviation to full year
    let fullYear = parseInt("20" + year, 10);
    if (isNaN(fullYear)) {
      // Invalid year abbreviation
      return null;
    }
  
    // Return full term and year
    return term + " " + fullYear;
}

let enrollmentChart;
const plotEnrollmentChart = (filteredData) => {
    const labels = filteredData.map((row) => convertTermAndYear(row.Term));

    // We default to displaying all lines, but then only display selectedRaceValues
    const datasets = selectedRaceValues.length === 0 ? 
        lines.map(line => ({
        label: line.label,
        // We use the key but sometimes secondaryKey (when they didn't record "All [X]")
        data: filteredData.map(row => {
          if (!isNaN(row[line.secondaryKey])) {
              return parseInt(row[line.secondaryKey]);
          } else {
              return parseInt(row[line.key]);
          }
        }),
        borderColor: line.borderColor,
        backgroundColor: line.backgroundColor
    }))
    : lines.filter(line => selectedRaceValues.includes(line.label))
        .map(line => ({
          label: line.label ?? line.secondaryLabel,
          data: filteredData.map(row => {
            if (!isNaN(row[line.secondaryKey])) {
                return parseInt(row[line.secondaryKey]);
            } else {
                return parseInt(row[line.key]);
            }
          }),          
          borderColor: line.borderColor,
          backgroundColor: line.backgroundColor
    }));
    
    let config = {
        type: "line",
        data: {
          labels,
          datasets,
        },
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
            },
            x: {
              stacked: false,
            }
          },
        },
    };

    switch(chartSelect.value) {
        case "line":
            config.type = 'line';
            config.options.scales.y.stacked = false
            config.options.scales.x.stacked = false
            config.options.scales.y.type = 'linear'
            break;
        case "bar":
            config.type = 'bar';
            config.options.scales.y.stacked = false
            config.options.scales.x.stacked = false
            config.options.scales.y.type = 'linear'
            break;
        case "bar-stacked":
            config.type = 'bar';
            config.options.scales.y.stacked = true
            config.options.scales.x.stacked = true
            config.options.scales.y.type = 'linear'
            break;
        default:
            break;
    }

    switch(axisScaleSelect.value) {
        case "linear":
            config.options.scales.y.type = 'linear'
            break;
        case "logarithmic":
            config.options.scales.y.type = 'logarithmic'
            break;
        default:
            break;
    }
    
    if (enrollmentChart) {
        enrollmentChart.destroy();
    }

    const ctx = document.getElementById("enrollment-line-chart").getContext("2d");
    enrollmentChart = new Chart(ctx, config);
}

const updateChart = async () => {
    const data = await fetchData(`https://raw.githubusercontent.com/zuyouchen/is308-final-proj/main/data/cumulative_fa05-sp23.csv`);
    const filteredData = filterData(data);
    if (filteredData) {
        plotEnrollmentChart(filteredData);
    }
    // console.log(filteredData);
}

semesterSelect.addEventListener("change", updateChart);
levelSelect.addEventListener("change", updateChart);
chartSelect.addEventListener("change", updateChart);
axisScaleSelect.addEventListener("change", updateChart);

updateChart();