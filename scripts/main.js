
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
    var userGoal = fetchUserGoal();
    if (userGoal) {
        totalAmountDisplay.textContent += " / Goal: " + userGoal + "oz";
    }

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

function updateCollection(option, currentUser) {
    // var user = firebase.auth().currentUser
    var keyToAdd;
    console.log("entered updateCollection function");

    var userGoal = fetchUserGoal();


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


//saves data to one document
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log("User logged in");
        var userId = user.uid;
        // Returns the string of the date and puts the format in YYYY-MM-DDTHH
        var currentDate = new Date().toISOString().split('T')[0]; // Get current date
        var docRef = db.collection("users").doc(userId).collection("your_collection").doc(currentDate);
 
        // Check if the document for the current date exists
        docRef.get()
        .then(function(doc) {
            if (doc.exists) {
                var currentValue = doc.data().key || 0;
                var updatedValue = currentValue + keyToAdd;

                console.log("Existing value:", currentValue);
                console.log("New value:", updatedValue);

                // Update document data
                docRef.update({
                    key: updatedValue
                })
                .then(function() {
                    console.log("Document updated successfully");
                    
                    fetchTotalAmount()
                    .then(function(totalAmount) {
                        console.log("tot amount"+totalAmount);
                        var totalAmountDisplay = document.querySelector('.display-5.fw-bold.text-body-emphasis');
                        totalAmountDisplay.textContent = "You drank a total of " + totalAmount + "oz" + "/";
                    })
                    .catch(function(error) {
                        console.error("Error fetching total amount:", error);
                    });
                })
                .catch(function(error) {
                    console.error("Error updating document: ", error);
                });
            } else {
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

// function fetchGoal() {
//     return new Promise(function(resolve, reject) {

//         firebase.auth().onAuthStateChanged(function(user) {
//             if (user) {
//                 var userId = user.uid;
//                 var collectionRef = db.collection("users").doc(userId).collection("your_collection");

//                 collectionRef.get()
//                 .then(function(querySnapshot) {
//                     var totalAmount = 0;
//                     querySnapshot.forEach(function(doc) {
//                         // Sum up the values of all documents
//                         totalAmount += doc.data().key;
//                     });
//                     resolve(totalAmount);
//                 })
//                 .catch(function(error) {
//                     reject(error);
//                 });
//             } else {
//                 reject("No user signed in.");
//             }
//         });
//     });
// }

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
                        var key = doc.data().key;
                        if (!isNaN(key)) {
                            totalAmount += key;
                        }
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
// function displayQuote(day){
//     db.collection("quotes").doc(day)
//         .onSnapshot(dayDoc => {
//             console.log("current document data: " + dayDoc.data());
//             document.getElementById("daily-quote").innerHTML = dayDoc.data().quote;
//         })
// }
// displayQuote("tuesday");

// document.getElementById("inputForm").addEventListener("submit", function(event) {

//     var inputElement = document.getElementById("goalInput");
//     var inputValue = inputElement.value;
//     document.getElementById("displayArea").innerText = "The input number is: " + inputValue;
// });

function fetchUserGoal() {
    var user = firebase.auth().currentUser;
    if (user) {
        var userId = user.uid;
        var userDoc = db.collection("users").doc(userId);
        var doc = userDoc.get();
        if (doc.exists) {
            console.log("returning from fetchUserGoal() -> " + doc.data().goal);
            return doc.data().goal;
            
        } else {
            console.error("User document not found");
            return null;
        }
    } else {
        console.error("No user signed in.");
        return null;
    }
}

document.getElementById("set-goal-button").addEventListener("click", function() {
    if(fetchUserGoal()){
        console.log("goal exists: " + fetchUserGoal());
    }else{
        console.log("goal doesnt exist: " + fetchUserGoal());
    }
});
