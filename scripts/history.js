const xValues = ["04/01", "04/02", "04/03", "04/04", "04/05"];
const yValues = [40, 50, 30, 60, 20];
let barColors = "blue";

new Chart("historyGraph", {
  type: "bar",
  data: {
    labels: xValues,
    datasets: [{
      label: "oz",
      backgroundColor: barColors,
      data: yValues
    }]
  },
  options: {
    xlegend: {display: false},
    scales: {
      yAxes: [{
        ticks: {
          beginAtZero: true
        }
      }],
    }
  }
});