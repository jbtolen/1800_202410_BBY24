// const xValues = ["04/01", "04/02", "04/03", "04/04", "04/05"];
// const yValues = [40, 50, 30, 60, 20];
let barColors = "blue";



// new Chart("historyGraph", {
//   type: "bar",
//   data: {
//     labels: xValues,
//     datasets: [{
//       label: "oz",
//       backgroundColor: barColors,
//       data: yValues
//     }]
//   },
//   options: {
//     xlegend: {display: false},
//     scales: {
//       yAxes: [{
//         ticks: {
//           beginAtZero: true
//         }
//       }],
//     }
//   }
// });


document.addEventListener("DOMContentLoaded", function () {
    // Fetch data from Firebase and create chart
    getChartData();
});

function getChartData() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            var db = firebase.firestore();
            var collectionRef = db.collection("users").doc(userId).collection("your_collection");

            var xValues = [];
            var yValues = [];

            collectionRef.get().then(function (querySnapshot) {
                querySnapshot.forEach(function (doc) { 
                    var date = doc.id; // Assuming the document ID is the date
                    var amount = doc.data().key || 0;
                    xValues.push(date);
                    yValues.push(amount);
                });

                // Call function to create chart
                createChart(xValues, yValues);
            })
        } else {
            console.log("No user signed in.");
        }
    });
}
 

function createChart(xValues, yValues) {
    var myChart = new Chart(document.getElementById('historyGraph').getContext('2d'), {
        type: 'bar',
        data: {
            labels: xValues,
            datasets: [{
                label: 'Amount (oz)',
                backgroundColor: barColors,
                data: yValues,
                categorySpacing: 1,

            }]
        },
        options: {
            legend: { display: false },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}
