
const urlParams = new URLSearchParams(window.location.search);
let carId = urlParams.get('carId') || 'TATA';




import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";


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





// Call the loadJsonData function to start the upload
const querySnapshot = await getDocs(collection(db, "Cardetails"));
if (querySnapshot.empty) {
    // Load JSON and upload data
    async function loadJsonData() {
        const response = await fetch('./JSON/detailCars.json');
        const data = await response.json();
        await uploadToFirestore(data);
    }

    // Upload each item to Firestore
    async function uploadToFirestore(data) {
        const collectionRef = collection(db, 'Cardetails');
        for (const item of data) {
            try {
                await addDoc(collectionRef, item);
                console.log('Document added:', item);
            } catch (error) {
                console.error('Error adding document:', error);
            }
        }
    }
    loadJsonData();

}

fetchAllCarDetails();

let selectedCarModel = "Suv";

window.updateCarModel = function (model) {
    selectedCarModel = model;
    fetchAllCarDetails();
};


let carChangeIndex = 0;
let totalCarsLength = 2;
let carIndexValue = 0;

window.updateIndexCar = function (count) {
    console.log(totalCarsLength);

    carIndexValue = (carChangeIndex + count + totalCarsLength) % totalCarsLength;
    fetchAllCarDetails();
    totalCarsLength = 2;
};

function navigateToCarDetailPage(car) {
    console.log('#############  => ', car);

    // Serialize the object and encode it before passing it as a URL parameter
    const carJson = encodeURIComponent(JSON.stringify(car));
    window.location.href = `./carExplain.html?car=${carJson}`;
}




async function fetchAllCarDetails() {
    try {
        const querySnapshot = await getDocs(collection(db, "Cardetails"));


        const uniqueCars = [];
        querySnapshot.forEach((doc) => {
            const data = doc.data();

            const car = JSON.stringify(data, null, 2);
            const jsonobj = JSON.parse(car)[carId];
            if (jsonobj) uniqueCars.push(jsonobj);
        });

        const flattenedData = flattenCarData(uniqueCars[0], selectedCarModel);
        totalCarsLength = Object.keys(flattenedData).length;
        const container = document.getElementById("car-container");
        container.innerHTML = ""; // Clear container

        for (const carName in flattenedData) {
            const car = flattenedData[carName];
            if (car.index === carIndexValue) {
                const carDiv = document.createElement("div");
                carDiv.classList.add("car-detail");
                carDiv.onclick = () => navigateToCarDetailPage(car);
                carDiv.innerHTML = `
                <div class="car_img">
                    <h5 class="car-title">${car.Title}</h5>
                    <a href="#"><img src="${car.img1}" alt="${car.Title}" ></a>
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
        }
    } catch (error) {
        console.error("Error fetching car details:", error);
    }
}


function flattenCarData(data, type) {
    if (type === 'All') {
        const allCars = {};
        let index = 0; // Start index at 0
        for (const category in data) {
            if (data.hasOwnProperty(category)) {
                for (const [key, value] of Object.entries(data[category])) {
                    // Add index to each object
                    allCars[`${index}`] = { ...value, index };
                    index++; // Increment index for each object
                }
            }
        }
        return allCars;
    }

    const typeData = data[type];
    const indexedData = {};
    let index = 0;

    // Add index to each object in the type category
    for (const [key, value] of Object.entries(typeData)) {
        indexedData[`${index}`] = { ...value, index };
        index++;
    }

    return indexedData;
}



// Call the fetchAllCarDetails function on window load
window.onload = fetchAllCarDetails;







