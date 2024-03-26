var currentUser;

function editUserInfo(){
    document.getElementById('personalInfoFields').disabled = false;
}

function saveUserInfo(){
    userName = document.getElementById('nameInput').value;
    userOccupation = document.getElementById('occupationInput').value;
    userCountry = document.getElementById('countryInput').value;
    userCity = document.getElementById('cityInput').value;
    userGoal = document.getElementById('goalInput').value;

    currentUser.update({
        name: userName,
        occupation: userOccupation,
        country: userCountry,
        city: userCity,
        goal: userGoal
    })

    document.getElementById('personalInfoFields').disabled = true;
}