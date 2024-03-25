
document.addEventListener("DOMContentLoaded", function() {

    // run the function once to display the initial amount upon page load
    // need to somehow have code here that retrives and display user current drank amount

    updateCollection(0);
    
    // Get reference to the button
    var updateCollectionButton1 = document.getElementById('amount1');
    var updateCollectionButton2 = document.getElementById('amount2');
    var updateCollectionButton3 = document.getElementById('amount3');
    var updateCollectionButtonReset = document.getElementById('reset');

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

    updateCollectionButtonReset.addEventListener('click', function(){
        updateCollection(4);
        console.log("button reset clicked");
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
            keyToAdd = 22;
            console.log("key changed to 23");
            break;
        case 3:
            keyToAdd = 32;
            console.log("key changed to 32");
            break;
        case 4:
            console.log("key reset to 0");
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

    // firebase.auth().onAuthStateChanged(function(user) {
    //     if (user) {
    //         console.log("user logged in");
    //         var userId = user.uid;
    //         var collectionRef = db.collection("users").doc(userId).collection("your_collection");

    //         console.log("key to add: " + keyToAdd);

    //         // Update collection data
    //         collectionRef.add({
    //             key: keyToAdd
    //         })
    //         .then(function(docRef) {
    //             console.log("Document written with ID: ", docRef.id);
                
    //             fetchTotalAmount()
    //             .then(function(totalAmount) {   
    //                 var totalAmountDisplay = document.querySelector('.display-5.fw-bold.text-body-emphasis');
    //                 totalAmountDisplay.textContent = "You drank a total of " + totalAmount + "oz";
    //             })
    //             .catch(function(error) {
    //                 console.error("Error fetching total amount:", error);
    //             });
    //         })
    //         .catch(function(error) {
    //             console.error("Error adding document: ", error);
    //         });
    //     } else {
    //         console.log("No user signed in.");
    //     }
    // });

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            console.log("User logged in");
            var userId = user.uid;
            var docRef = db.collection("users").doc(userId).collection("your_collection").doc("document_id");

            // Get the existing value from Firestore
            docRef.get()
            .then(function(doc) {
                if (doc.exists) {
                    // If the document exists, update the value by adding the new keyToAdd value to it
                    var currentValue = doc.data().key || 0; // If the key doesn't exist, default to 0
                    var updatedValue = currentValue + keyToAdd;

                    console.log("Existing value:", currentValue);
                    console.log("New value:", updatedValue);

                    // Update document data
                    docRef.set({
                        key: updatedValue
                    }, { merge: true }) // merge option ensures that existing data isn't overwritten
                    .then(function() {
                        console.log("Document updated successfully");
                        
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
                        console.error("Error updating document: ", error);
                    });
                } else {
                    console.log("Document does not exist, creating a new one.");
                    // If the document doesn't exist, create a new one with the provided keyToAdd value
                    docRef.set({
                        key: keyToAdd
                    })
                    .then(function() {
                        console.log("Document created successfully");
                        
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
                        console.error("Error creating document: ", error);
                    });
                }
            })
            .catch(function(error) {
                console.error("Error getting document:", error);
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

