
const urlParams = new URLSearchParams(window.location.search);
let carId = urlParams.get('carId') || 'TATA';
// document.getElementById('car-id').textContent = `Car ID: ${carId}`;
// document.getElementById('car_id').textContent = `${carId} CARS`;



import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";

// Firebase Config - Replace with your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyC0tw4_CFl84kb5i4DeuBkKf0gA7gS3mF4",
    authDomain: "login-page1234.firebaseapp.com",
    projectId: "login-page1234",
    storageBucket: "login-page1234.appspot.com",
    messagingSenderId: "471482088238",
    appId: "1:471482088238:web:eb3db8a185185e54e118bf"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



let selectedCarModel = "Hatchback";

window.updateCarModel = function (model) {
    selectedCarModel = model;
    fetchAllCarDetails();
};

async function fetchAllCarDetails() {
    try {
        const querySnapshot = await getDocs(collection(db, "cardetails"));


        const uniqueCars = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            console.log("Document data:", data);

            const car = JSON.stringify(data, null, 2);
            const jsonobj = JSON.parse(car)[carId];
            if (jsonobj) uniqueCars.push(jsonobj);
        });

        const flattenedData = flattenCarData(uniqueCars[0], selectedCarModel);
        const container = document.getElementById("car-container");
        container.innerHTML = ""; // Clear container

        for (const carName in flattenedData) {
            const car = flattenedData[carName];
            const carDiv = document.createElement("div");
            carDiv.classList.add("car-detail");
            carDiv.innerHTML = `
                <div class="car_img">
                    <h5 class="car-title">${car.Title}</h5>
                    <a href="#"><img src="${car.img1}" alt="${car.Title}"></a>
                </div>
                <div class="carPoint_head">
                    <div>
                        <p class="car-id"><strong>Price:</strong> ${car.Price}</p>
                        <p><strong>Mileage:</strong> ${car.Mileage || "N/A"}</p>
                    </div>
                    <div>
                        <p><strong>Engine:</strong> ${car.Engine}</p>
                        <p><strong>Fuel Type:</strong> ${car["Fuel Type"]}</p>
                    </div>
                </div>`;
            container.appendChild(carDiv);
        }
    } catch (error) {
        console.error("Error fetching car details:", error);
    }
}


function flattenCarData(data, type) {
    const flattenedData = {};
    for (const carName in data[type]) {
        flattenedData[carName] = data[type][carName];
    }
    return flattenedData;
}



// Call the fetchAllCarDetails function on window load
window.onload = fetchAllCarDetails;







