// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function () {
    populateUserGoal(); // Populate user's goal
    updateCollection(0); // Update collection with default option (0)

    // Button references
    var buttons = [
        document.getElementById('amount1'),
        document.getElementById('amount2'),
        document.getElementById('amount3'),
        document.getElementById('reset')
    ];

    // Add event listeners to buttons
    buttons.forEach((button, index) => {
        button.addEventListener('click', function () {
            updateCollection(index + 1); // Update collection based on button index
            console.log("button", index + 1, "clicked");
        });
    });

    // Check if the user is logged in
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // Check if the user's goal exists
            checkUserGoal(user);
        } else {
            console.log("No user signed in.");
        }
    });
});

// Update collection based on buttons or customer amount
function updateCollection(option) {
    var keyToAdd;
    var currentDate = new Date().toISOString().split('T')[0]; // Get current date

    switch (option) {
        case 1:
            keyToAdd = 14;
            break;
        case 2:
            keyToAdd = 22;
            break;
        case 3:
            keyToAdd = 32;
            break;
        case 4:
            keyToAdd = 0; // Reset to 0 when reset button is clicked
            console.log("key reset to 0");
            break;
        case 0:
            keyToAdd = 0;
            break;
        default:
            if (option === 0) {
                keyToAdd = 0;
            } else {
                // Handle custom amount here
                keyToAdd = option;
            }
            break;
    }

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            var docRef = db.collection("users").doc(userId).collection("your_collection").doc(currentDate);

            // Check if the document for the current date exists
            docRef.get()
                .then(function (doc) {
                    var currentValue = doc.exists ? doc.data().key || 0 : 0;
                    var updatedValue = (option === 4 || !doc.exists) ? 0 : currentValue + keyToAdd;

                    docRef.set({ key: updatedValue })
                        .then(function () {
                            console.log(doc.exists ? "Document updated" : "Document created", "successfully");
                            fetchTotalAmount();
                        })
                        .catch(function (error) {
                            console.error("Error updating document:", error);
                        });
                })
                .catch(function (error) {
                    console.error("Error getting document:", error);
                });
        } else {
            console.log("No user signed in.");
        }
    });
}

// Function to check if the user's goal exists
function checkUserGoal(user) {
    var userId = user.uid;
    var userRef = db.collection("users").doc(userId);

    userRef.get().then(function (doc) {
        if (doc.exists) {
            var userData = doc.data();
            var userGoal = userData.goal;

            if (userGoal) {
                // User's goal exists, proceed with other functionality
                populateUserGoal();
                updateCollection(0);
            } else {
                // User's goal doesn't exist, show popup
                showGoalPopup();
            }
        } else {
            console.log("No such document!");
        }
    }).catch(function (error) {
        console.log("Error getting document:", error);
    });
}

// Function to prompt the user to input their goal
function showGoalPopup() {
    document.getElementById('goalPopup').style.display = 'block';
}

// Function to handle adding the goal
function addGoal() {
    var goalInput = document.getElementById('goalPopupInput').value;
    if (goalInput.trim() !== '') {
        var user = firebase.auth().currentUser;
        if (user) {
            var userId = user.uid;
            var userRef = db.collection("users").doc(userId);
            saveUserGoal(userRef, goalInput.trim());
        }
        hideGoalPopup();
    } else {
        alert('Please enter a valid goal number.');
    }
}

// Function to save the user's goal to the database
function saveUserGoal(userRef, goal) {
    userRef.update({
        goal: goal
    }).then(function () {
        console.log("User's goal successfully saved:", goal);
        // Proceed with other functionality after saving the goal
        populateUserGoal();
        updateCollection(0);
    }).catch(function (error) {
        console.error("Error updating document:", error);
    });
}

// Function to hide the goal popup
function hideGoalPopup() {
    document.getElementById('goalPopup').style.display = 'none';
}
// Populate user's goal
function populateUserGoal() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var currentUser = db.collection("users").doc(user.uid);
            currentUser.get()
                .then(function (userDoc) {
                    var userGoal = userDoc.data()?.goal;
                    if (userGoal != null) {
                        document.getElementById("goalPopupInput").value = userGoal;
                    }
                    fetchTotalAmount();
                })
                .catch(function (error) {
                    console.error("Error getting user document: ", error);
                });
        } else {
            console.log("No user is signed in");
        }
    });
}
// Fetch total amount from database
function fetchTotalAmount() {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            var userId = user.uid;
            var currentDate = new Date().toISOString().split('T')[0]; // Get current date
            var collectionRef = db.collection("users").doc(userId).collection("your_collection").doc(currentDate); // Reference to document for current date

            collectionRef.get()
                .then(function (doc) {
                    var currentValue = doc.exists ? parseInt(doc.data().key || 0) : 0; // Get current value for current date
                    updateTotalAmountDisplay(currentValue); // Update total amount display with current value
                })
                .catch(function (error) {
                    console.error("Error getting document:", error);
                });
        } else {
            console.log("No user signed in.");
        }
    });
}

// Update total amount display
function updateTotalAmountDisplay(currentValue) {
    var userGoal = parseInt(document.getElementById('goalPopupInput').value);
    var totalAmountDisplay = document.querySelector('.display-5.fw-bold.text-body-emphasis');
    var message1 = (currentValue === 0) ? `You drank a total of 0mL.` : `You drank a total of ${currentValue}mL.`;
    var message2 = `Your goal is ${userGoal}mL`
    if (totalAmountDisplay) {
        totalAmountDisplay.textContent = message1 + " " + message2;
    } else {
        console.error("Total amount display element not found.");
    }
}

// Function to show popup with input field for custom amount
function showPopup() {
    // Display the popup and overlay
    document.getElementById('popup').style.display = 'block';
    document.querySelector('.overlay').style.display = 'block';

    // Clear any previous input value
    document.getElementById('customAmountInput').value = '';
}

// Function to add custom amount to the collection
function addCustomAmount() {
    // Get the custom amount entered by the user
    var customAmount = parseInt(document.getElementById('customAmountInput').value);

    // Check if the custom amount is valid
    if (!isNaN(customAmount)) {
        // Update the collection with the custom amount
        updateCollection(customAmount); // Pass the custom amount to updateCollection()
        // Hide the popup and overlay
        hidePopup();
    } else {
        // Notify the user that the input is invalid
        alert('Please enter a valid number for the custom amount.');
    }
}

function getName() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            var userName = user.displayName;

            document.getElementById("name-goes-here").innerText = userName;
        } else {

            console.log("No user is logged in");
        }
    });
}

getName();

function hidePopup() {
    // Hide the popup and overlay
    document.getElementById('popup').style.display = 'none';
    document.querySelector('.overlay').style.display = 'none';
}