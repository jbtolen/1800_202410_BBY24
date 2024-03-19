// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {

    // run the function once to display the initial amount upon page load
    updateCollection();
    
    // Get reference to the button
    var updateCollectionButton = document.getElementById('amount1');

    // Add event listener to the button
    updateCollectionButton.addEventListener('click', function() {
        updateCollection();
    });

    // Get reference to the <h1> element
    var totalAmountDisplay = document.querySelector('.display-5.fw-bold.text-body-emphasis');
});

// function logInUponPageLoad() {
//     firebase.auth().onAuthStateChanged(function(user) {
//         if (user) {
//             console.log("User signed in:", user);
//             return user;
//         } else {
//             console.log("No user signed in.");
//         }
//     });
// }

function updateCollection() {
    // var user = firebase.auth().currentUser

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user logged in");
            var userId = user.uid;
            var collectionRef = db.collection("users").doc(userId).collection("your_collection");

            // Update collection data
            // For example, you can add a new document to the collection
            collectionRef.add({
                key: 14 // Add any data you want to update or add to the collection
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                
                // After updating collection, fetch the total amount and update the display
                fetchTotalAmount()
                .then(function(totalAmount) {
                    var totalAmountDisplay = document.querySelector('.display-5.fw-bold.text-body-emphasis');
                    totalAmountDisplay.textContent = "You drank a total of " + totalAmount + "oz";
                })
                .catch(function(error) {
                    console.error("Error fetching total amount:", error);
                });
            })
            .catch(function(error) {
                console.error("Error adding document: ", error);
            });
        } else {
            console.log("No user signed in.");
        }
    });
}



function fetchTotalAmount() {
    return new Promise(function(resolve, reject) {
        // var user = firebase.auth().currentUser

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var userId = user.uid;
                var collectionRef = db.collection("users").doc(userId).collection("your_collection");

                // Fetch all documents in the collection
                collectionRef.get()
                .then(function(querySnapshot) {
                    var totalAmount = 0;
                    querySnapshot.forEach(function(doc) {
                        // Sum up the values of all documents
                        totalAmount += doc.data().key;
                    });
                    resolve(totalAmount);
                })
                .catch(function(error) {
                    reject(error);
                });
            } else {
                reject("No user signed in.");
            }
        });
    });
}
document.getElementById("inputForm").addEventListener("submit", function(event) {

    var inputElement = document.getElementById("goalInput");
    var inputValue = inputElement.value;
    document.getElementById("displayArea").innerText = "The input number is: " + inputValue;
});