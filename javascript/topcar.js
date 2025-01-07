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
    const CardetailsQuerySnapshot = await getDocs(collection(db, "Cardetails"));
    
    
            const uniqueCars = [];
            CardetailsQuerySnapshot.forEach((doc) => {
                const data = doc.data();
    
                const car = JSON.stringify(data, null, 2);
                const jsonobj = JSON.parse(car);
                if (jsonobj) uniqueCars.push(jsonobj);
            });

            const carDetails = extractCarDetails(uniqueCars);
            console.log(carDetails);



            const BookingCountListQuerySnapshot = await getDocs(collection(db, "countBookingList"));
    
            const countList = [];
    
            BookingCountListQuerySnapshot.forEach((doc) => {
                const data = doc.data();
    
                const count = JSON.stringify(data, null, 2);
                const jsonobj = JSON.parse(count);


                const sortedDescending = Object.entries(jsonobj)
                    .sort(([, valueA], [, valueB]) => valueB - valueA)
                    .reduce((acc, [key, value]) => {
                        acc[key] = value;
                        countList.push({[key]: value})
                        return acc;
                    }, {});

                console.log("Sorted Descending:", sortedDescending);
                // countList.push(sortedDescending)
                // if (jsonobj) uniqueCars.push(jsonobj);
            });





            const displayCarsList = [];

                // Ensure flattenedData is an array
                const flattenedArray = Array.isArray(carDetails) ? carDetails : Object.values(carDetails);

                // Loop through flattenedList and match IDs with flattenedArray
                countList.forEach((item) => {
                    flattenedArray.forEach((dataObj) => {
                        if (dataObj.id === Object.keys(item)[0]) {
                            displayCarsList.push(dataObj); // Push matching object into displayCarsList
                        }
                    });
                });

                console.log(displayCarsList);


                function extractCarDetails(data) {
                    const cars = [];
                
                    function traverse(obj) {
                        for (const key in obj) {
                            if (obj[key] && typeof obj[key] === 'object') {
                                // Check if this object represents a car
                                if (obj[key].Title && obj[key].Price) {
                                    // Add car details to the cars array
                                    cars.push({
                                        
                                            "Battery Capacity": obj[key]["Battery Capacity"] || "N/A",
                                            BookingCount: obj[key].BookingCount || 0,
                                            "Driving Range": obj[key]["Driving Range"] || "N/A",
                                            "Fuel Type": obj[key]["Fuel Type"] || "N/A",
                                            "Fuel& Performance": obj[key]["Fuel& Performance"] || "N/A",
                                            Price: obj[key].Price || "N/A",
                                            Safety: obj[key].Safety || "N/A",
                                            "Seating Capacity": obj[key]["Seating Capacity"] || "N/A",
                                            Title: obj[key].Title || "N/A",
                                            Transimission: obj[key].Transimission || "N/A",
                                            "charging Time": obj[key]["charging Time"] || "N/A",
                                            description: obj[key].description || "N/A",
                                            id: obj[key].id || "N/A",
                                            img1: obj[key].img1 || "N/A",
                                        },
                                    );
                                } else {
                                    // Recursively traverse nested objects
                                    traverse(obj[key]);
                                }
                            }
                        }
                    }
                
                    // Start traversing the dataset
                    data.forEach((item) => traverse(item));
                
                    return cars;
                }
                
               
                displayCars(displayCarsList)
               
                
                




}

// Function to display cars on the page
function displayCars(cars) {
    const carSection = document.getElementById("car-detail-section");
    for (let index = 0; index < cars.length; index++) {
        const car = cars[index];
         if(index > 7) break;
        const carCard = document.createElement("div");
        carCard.classList.add("car-card");

        carCard.innerHTML = `
            <img src="${car.img1}" alt="${car.Title}">
            <h4>${car.Title}</h4>
            <p>Price: ₹${car.Price}</p>
            <div class="ls_icon">
                <i class="fa-regular fa-thumbs-up like-icon" data-id="${car.id}" data-image="${car.img1}" data-name="${car.Title}" data-price="${car.Price}"></i>
                <i class="fa-solid fa-share"></i>
            </div>
        `;
        carSection.appendChild(carCard);
    };

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
