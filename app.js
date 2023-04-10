const schoolSelect = document.getElementById("school-select");
const levelSelect = document.getElementById("level-select");
const termSelect = document.getElementById('term-select');
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
  "Hawaiian or Pacific Islander",
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

let enrollmentChart;
const plotChart = (enrollmentData) => {
  if (enrollmentChart) {
    enrollmentChart.destroy();
  }
  const ctx = document.getElementById("enrollment-chart").getContext("2d");
  enrollmentChart = new Chart(ctx, {
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
      responsive: true
    }
  });
}

const updateChart = async () => {
  const data = await fetchData(`https://raw.githubusercontent.com/zuyouchen/is308-final-proj/main/data/summary_${termSelect.value}.csv`);
  const filteredRow = filterData(data);
  if (filteredRow) {
    const enrollmentData = transformData(filteredRow);
    plotChart(enrollmentData);
    document.getElementById('no-data-message').style.display = 'none';
  } else {
    console.error(`No matching row found for ${schoolSelect.value}, ${levelSelect.value}, ${termSelect.value}`);
    document.getElementById('no-data-message').innerHTML = `<b>No data found.</b> <br> Please <b>select</b> a different <b>level</b>. <br> ${levelSelect.value} students <b>do not exist</b> in this college.`;
    document.getElementById('no-data-message').style.display = 'block';
    if (enrollmentChart) {
      enrollmentChart.destroy();
    }
  }
};


schoolSelect.addEventListener("change", updateChart);
levelSelect.addEventListener("change", updateChart);
termSelect.addEventListener("change", updateChart);

updateChart();
