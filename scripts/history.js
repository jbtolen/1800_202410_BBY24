let barColors = "blue";


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
                label: 'Amount (L)',
                backgroundColor: barColors,
                data: yValues,
                color: "black",
                categorySpacing: 1,

            }]
        },
        options: {
            plugins:{
                legend:{
                    labels:{
                        color: "black",
                    },
                },
            },
            scales: {
                y: {
                    ticks:{
                        color: "black",
                        beginAtZero: true
                    }
                },
                x: {
                    ticks:{
                        color: "black"
                    }
                },
            }
        }
    });
}
