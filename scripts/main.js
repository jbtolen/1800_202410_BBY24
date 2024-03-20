// Function to read the quote of the day from the Firestore "quotes" collection
// Input param is the String representing the day of the week, aka, the document name

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function() {

    // run the function once to display the initial amount upon page load
    // need to somehow have code here that retrives and display user current drank amount

    updateCollection(0);
    
    // Get reference to the button
    var updateCollectionButton1 = document.getElementById('amount1');
    var updateCollectionButton2 = document.getElementById('amount2');
    var updateCollectionButton3 = document.getElementById('amount3');

    // Add event listener to the button
    updateCollectionButton1.addEventListener('click', function() {
        updateCollection(1);
        console.log("button 1 clicked");
    });
    updateCollectionButton2.addEventListener('click', function() {
        updateCollection(2);
        console.log("button 2 clicked");
    });
    updateCollectionButton3.addEventListener('click', function() {
        updateCollection(3);
        console.log("button 3 clicked");
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

function updateCollection(option) {
    // var user = firebase.auth().currentUser
    var keyToAdd;
    console.log("entered updateCollection function");

    switch (option) {
        case 1:
            keyToAdd = 14;
            console.log("key changed to 14");
            break;
        case 2:
            keyToAdd = 23;
            console.log("key changed to 23");
            break;
        case 3:
            keyToAdd = 32;
            console.log("key changed to 32");
            break;
            //option used for just display the result initially
        case 0:
            keyToAdd = 0;
            console.log("key = 0");
            break;
        default:
            console.error("Invalid option:", option);
            return; // Exit the function if the option is invalid
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user logged in");
            var userId = user.uid;
            var collectionRef = db.collection("users").doc(userId).collection("your_collection");

            console.log("key to add: " + keyToAdd);

            // Update collection data
            // For example, you can add a new document to the collection
            collectionRef.add({
                key: keyToAdd
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
