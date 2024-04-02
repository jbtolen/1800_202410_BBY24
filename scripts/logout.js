function logout(){
    firebase.auth().signOut().then(()=>{
        console.log("User logged out.");
    }).catch((error)=>{
        console.log("Error occured.");
    });
}