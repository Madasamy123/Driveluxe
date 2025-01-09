function displayLikedCars() {
    const userDetails = JSON.parse(localStorage.getItem("DriveLuxeUserDetails")); // Get the logged-in user's details
    const likedCars = JSON.parse(localStorage.getItem("likedCars")) || [];
    const likedCarSection = document.getElementById("liked-car-section");

    likedCarSection.innerHTML = ""; // Clear existing content

    // If no user is logged in, show a message and exit
    // if (!userDetails) {
    //     likedCarSection.innerHTML = "<p>Please log in to view your liked cars.</p>";
    //     return;
    // }

    // Filter the liked cars by the logged-in user's email
    const userLikedCars = likedCars.filter(car => car.likedBy === userDetails.email);

    if (userLikedCars.length === 0) {
        likedCarSection.innerHTML = "<p>You haven't liked any cars yet.</p>";
        return;
    }

    // Display the liked cars
    userLikedCars.forEach((car) => {
        const carCard = document.createElement("div");
        carCard.classList.add("car-card");

        carCard.innerHTML = `
            <img src="${car.carImage}" alt="${car.carName}">
            <h4>${car.carName}</h4>
            <p>Price: ₹${car.carPrice}</p>
           
        `;

        likedCarSection.appendChild(carCard);
    });
}

//     // Add event listeners for the remove buttons
//     const removeButtons = likedCarSection.querySelectorAll(".remove-btn");
//     removeButtons.forEach((button) => {
//         button.addEventListener("click", (event) => {
//             const carId = event.target.dataset.id;
//             removeFromLikedCars(carId);
//         });
//     });
// }

// function removeFromLikedCars(carId) {
//     const userDetails = JSON.parse(localStorage.getItem("DriveLuxeUserDetails")); // Get the logged-in user's details
//     let likedCars = JSON.parse(localStorage.getItem("likedCars")) || [];

//     // Only remove the car liked by the logged-in user
//     likedCars = likedCars.filter((car) => !(car.id === carId && car.likedBy === userDetails.email));

//     localStorage.setItem("likedCars", JSON.stringify(likedCars)); // Update localStorage
//     displayLikedCars(); // Refresh the UI
// }

window.addEventListener("load", () => {
    const userDetails = JSON.parse(localStorage.getItem("DriveLuxeUserDetails"));
    if (!userDetails) {
        alert("Please log in to access this page.");
        window.location.href = "/pages/login.html"; // Redirect to login page
    } else {
        displayLikedCars(); // Display liked cars for the logged-in user
    }
});
