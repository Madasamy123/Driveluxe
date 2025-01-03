import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyC0tw4_CFl84kb5i4DeuBkKf0gA7gS3mF4",
    authDomain: "login-page1234.firebaseapp.com",
    projectId: "login-page1234",
    storageBucket: "login-page1234.appspot.com",
    messagingSenderId: "471482088238",
    appId: "1:471482088238:web:eb3db8a185185e54e118bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const shownCars = new Set(); // Track displayed car IDs

// Function to fetch cars
async function fetchCars() {
    const carsCollection = collection(db, "customerbook");
    const q = query(carsCollection, limit(8)); // Fetch first 8 cars

    try {
        const querySnapshot = await getDocs(q);
        const carDetails = [];

        querySnapshot.forEach((doc) => {
            if (!shownCars.has(doc.id)) {
                shownCars.add(doc.id); // Add car ID to the set
                const carData = doc.data();
                const car = {
                    id: doc.id, // Include car ID for tracking
                    carImage: carData.carImage || 'default-image.jpg',
                    carName: carData.carName || 'Unknown Car',
                    carPrice: carData.carPrice || 'Price Not Available'
                };

                carDetails.push(car);
            }
        });

        if (carDetails.length > 0) {
            displayCars(carDetails);
        } else {
            console.log("No new cars found in the database.");
        }
    } catch (error) {
        console.error("Error fetching cars:", error);
    }
}

// Function to display cars on the page
function displayCars(cars) {
    const carSection = document.getElementById("car-detail-section");
    cars.forEach((car) => {
        const carCard = document.createElement("div");
        carCard.classList.add("car-card");

        carCard.innerHTML = `
            <img src="${car.carImage}" alt="${car.carName}">
            <h4>${car.carName}</h4>
            <p>Price: ₹${car.carPrice}</p>
            <div class="ls_icon">
                <i class="fa-regular fa-thumbs-up like-icon" data-id="${car.id}" data-image="${car.carImage}" data-name="${car.carName}" data-price="${car.carPrice}"></i>
                <i class="fa-solid fa-share"></i>
            </div>
        `;
        carSection.appendChild(carCard);
    });

    // Add event listeners to the like icons
    const likeIcons = document.querySelectorAll(".like-icon");
    likeIcons.forEach((icon) => {
        icon.addEventListener("click", (event) => {
            const carId = event.target.dataset.id;
            const carImage = event.target.dataset.image;
            const carName = event.target.dataset.name;
            const carPrice = event.target.dataset.price;

            toggleLikeCar(event.target, { id: carId, carImage, carName, carPrice });
        });
    });
}

 function toggleLikeCar(icon, car) {
    const userDetails = JSON.parse(localStorage.getItem("DriveLuxeUserDetails"));

    // if (!userDetails) {
    //     alert("Please log in to like cars.");
    //     return;
    // }

    let likedCars = JSON.parse(localStorage.getItem("likedCars")) || [];
    const carIndex = likedCars.findIndex(
        (c) => c.id === car.id && c.likedBy === userDetails.email
    );

    if (carIndex === -1) {
        // Like the car
        car.likedBy = userDetails.email;
        likedCars.push(car);
        localStorage.setItem("likedCars", JSON.stringify(likedCars));
        icon.classList.remove("fa-regular");
        icon.classList.add("fa-solid");
    } else {
        // Unlike the car
        likedCars.splice(carIndex, 1);
        localStorage.setItem("likedCars", JSON.stringify(likedCars));
        icon.classList.remove("fa-solid");
        icon.classList.add("fa-regular");
    }

    // Display status alert
    const action = carIndex === -1 ? "added to" : "removed from";
    alert(`${car.carName} ${action} liked cars!`);
}




// Fetch cars on page load
fetchCars();


// //  share car details
// document.querySelector(".fa-share").addEventListener("click",async ()=> {

//     const shareData={
//        carImage: carData.carImage,
//        carName: carData.carName ,
//         carPrice: carData.carPrice 
        
// };
// try{
//     if(navigator.share){
//         await navigator.share(shareData);
//         alert("Shared successfully!");
//     }
//     else{
//         const link=shareData.url;
//         navigator.clipboard.writeText(link).then(()=>{
//             alert("Sharing not supported.  Link copied to clipboard!")
//         });
//     }
// }
// catch(error){
//     console.log("Error while sharing:",error);}
// });
