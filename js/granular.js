const schoolSelect = document.getElementById("school-select");
const levelSelect = document.getElementById("level-select");
const termSelect = document.getElementById('term-select');
const chartTypeSelect = document.getElementById('chart-type-select')
Chart.defaults.font.family = 'Calibri'

// TODO: clarify that "All" means including mixed multi-response
const enrollmentDataKeys = [
  "Caucasian",
  "All Asian",
  "Hispanic",
  "All   African American",
  "All    Native American",
  "All Hawaiian/ Pac Isl",
  "Multiracial",
  "Unreported Race"
];

const enrollmentDataLabels = [
  "Caucasian",
  "Asian",
  "Hispanic",
  "African American",
  "Native American",
  "Hawaiian/Pacific Islander",
  "Multiracial",
  "Unreported Race"
];

const fetchData = async (url) => {
  const response = await fetch(url);
  const data = await response.text();
  return Papa.parse(data, { header: true }).data;
};

const filterData = (data) => {
  const filteredRows = data.filter((row) => row.Name === schoolSelect.value && row["Student Level"] === levelSelect.value);
  return filteredRows.length > 0 ? filteredRows[0] : null;
};

const transformData = (row) => {
  const enrollmentData = {};
  enrollmentDataKeys.forEach((key) => {
    enrollmentData[key] = parseInt(row[key]);
  });
  return enrollmentData;
};

function barChartConfig (enrollmentData) {
  return {
    type: "bar",
    data: {
      labels: enrollmentDataLabels,
      datasets: [
        {
          label: "Students Enrolled",
          data: Object.values(enrollmentData),
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: false,
          text: schoolSelect.value + levelSelect.value + "Students",
          padding: {
            top: 10,
            bottom: 10
          }
        }
      },
      // scales: {
      //   x: {
      //       ticks: {
      //           font: {
      //               size: 12,
      //           }
      //       }
      //   }
      // },
      responsive: true
    }
  };
}

function polarChartConfig (enrollmentData) {
  return {
    type: "polarArea",
    data: {
      labels: enrollmentDataLabels,
      datasets: [
        {
          label: "Students Enrolled",
          data: Object.values(enrollmentData),
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(90, 142, 226, 0.5)',
            'rgba(0, 97, 164, 0.5)',
            'rgba(121, 120, 210, 0.5)',
            'rgba(146, 96, 186, 0.5)',
            'rgba(163, 69, 155, 0.5)',
            'rgba(171, 37, 118, 0.5)',
            'rgba(0, 40, 97, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(90, 142, 226, 1)',
            'rgba(0, 97, 164, 1)',
            'rgba(121, 120, 210, 1)',
            'rgba(146, 96, 186, 1)',
            'rgba(163, 69, 155, 1)',
            'rgba(171, 37, 118, 1)',
            'rgba(0, 40, 97, 1)'
          ]
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: false,
          text: schoolSelect.value + levelSelect.value + "Students",
          padding: {
            top: 10,
            bottom: 10
          }
        }
      },
      responsive: true
    }
  };
}

function doughnutChartConfig (enrollmentData) {
  return {
    type: "doughnut",
    data: {
      labels: enrollmentDataLabels,
      datasets: [
        {
          label: "Students Enrolled",
          data: Object.values(enrollmentData),
          backgroundColor: [
            'rgba(54, 162, 235, 0.5)',
            'rgba(90, 142, 226, 0.5)',
            'rgba(0, 97, 164, 0.5)',
            'rgba(121, 120, 210, 0.5)',
            'rgba(146, 96, 186, 0.5)',
            'rgba(163, 69, 155, 0.5)',
            'rgba(171, 37, 118, 0.5)',
            'rgba(0, 40, 97, 0.5)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)',
            'rgba(90, 142, 226, 1)',
            'rgba(0, 97, 164, 1)',
            'rgba(121, 120, 210, 1)',
            'rgba(146, 96, 186, 1)',
            'rgba(163, 69, 155, 1)',
            'rgba(171, 37, 118, 1)',
            'rgba(0, 40, 97, 1)'
          ]
        },
      ],
    },
    options: {
      plugins: {
        title: {
          display: false,
          text: schoolSelect.value + levelSelect.value + "Students",
          padding: {
            top: 10,
            bottom: 10
          }
        }
      },
      responsive: true
    }
  };
}

let enrollmentChart;
const plotEnrollmentChart = (config) => {
  if (enrollmentChart) {
    enrollmentChart.destroy();
  }
  const ctx = document.getElementById("enrollment-bar-chart").getContext("2d");
  enrollmentChart = new Chart(ctx, config)
}

const updateChart = async () => {
  const data = await fetchData(`https://raw.githubusercontent.com/zuyouchen/is308-final-proj/main/data/summary_${termSelect.value}.csv`);
  const filteredRow = filterData(data);
  if (filteredRow) {
    const enrollmentData = transformData(filteredRow);
    if (chartTypeSelect.value == 'bar') {
      plotEnrollmentChart(barChartConfig(enrollmentData));
    } 
    if (chartTypeSelect.value == 'doughnut') {
      plotEnrollmentChart(doughnutChartConfig(enrollmentData));
    }
    if (chartTypeSelect.value == 'polar') {
      plotEnrollmentChart(polarChartConfig(enrollmentData));
    }
    document.getElementById('no-data-message').style.display = 'none';
  } else {
    console.error(`No matching row found for ${schoolSelect.value}, ${levelSelect.value}, ${termSelect.value}`);
    document.getElementById('no-data-message').innerHTML = `<b>No data found.</b> <br> Please <b>select</b> a different <b>term, college, or level</b>. <br> ${levelSelect.value} students <b>may not exist</b> in this college.`;
    document.getElementById('no-data-message').style.display = 'block';
    if (enrollmentChart) {
      enrollmentChart.destroy();
    }
  }
};

schoolSelect.addEventListener("change", updateChart);
levelSelect.addEventListener("change", updateChart);
termSelect.addEventListener("change", updateChart);
chartTypeSelect.addEventListener("change", updateChart);

updateChart();
