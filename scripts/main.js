
document.addEventListener("DOMContentLoaded", function() {

    updateCollection();
    
    var updateCollectionButton = document.getElementById('amount1');

    updateCollectionButton.addEventListener('click', function() {
        updateCollection();
    });

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

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("user logged in");
            var userId = user.uid;
            var collectionRef = db.collection("users").doc(userId).collection("your_collection");

            // Update collection data
            collectionRef.add({
                key: 14 
            })
            .then(function(docRef) {
                console.log("Document written with ID: ", docRef.id);
                
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

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var userId = user.uid;
                var collectionRef = db.collection("users").doc(userId).collection("your_collection");

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

function displayQuote(day){
    db.collection("quotes").doc(day)
        .onSnapshot(dayDoc => {
            console.log("current document data: " + dayDoc.data());
            document.getElementById("daily-quote").innerHTML = dayDoc.data().quote;
        })
}
displayQuote("tuesday");

document.getElementById("inputForm").addEventListener("submit", function(event) {

    var inputElement = document.getElementById("goalInput");
    var inputValue = inputElement.value;
    document.getElementById("displayArea").innerText = "The input number is: " + inputValue;
});