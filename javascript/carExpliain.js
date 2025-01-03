


const urlParams = new URLSearchParams(window.location.search);
const carJson = urlParams.get('car');

// Decode and parse the JSON string back to an object
const car = carJson ? JSON.parse(decodeURIComponent(carJson)) : null;

console.log('Car Object:', car);

if (car) {
    const carDetailSection = document.getElementById('car-detail-section');

    const carCard = `
        <div class="car-card">
        
            <div class="car-images">
                <img src="${car.img1}" alt="${car.Title}" class="car-image-main" id="mainImage">
              
                    <div class="car-image-thumbnails" id="thumbnailContainer">
                        <img src="${car.img2}" alt="Image 2" class="car-thumbnail" data-src="${car.img2}">
                        <img src="${car.img3}" alt="Image 3" class="car-thumbnail" data-src="${car.img3}">
                        <img src="${car.img4}" alt="Image 4" class="car-thumbnail" data-src="${car.img4}">
                        <img src="${car.img5}" alt="Image 5" class="car-thumbnail" data-src="${car.img5}">
                    </div>

                    
           
              
            </div>
            <div class="car-info">
                <h2>${car.Title}</h2>
                <p><strong>Engine:</strong> ${car.Engine}</p>
                <p><strong>Fuel Type:</strong> ${car['Fuel Type']}</p>
                <p><strong>Mileage:</strong> ${car.Mileage}</p>
                <p><strong>Price:</strong> ${car.Price}</p>
                <p><strong>Safety Rating:</strong> ${car.Safety}</p>
                <p><strong>Seating Capacity:</strong> ${car['Seating Capacity']}</p>
                <p><strong>Transmission:</strong> ${car.Transimission}</p>
                <p><strong>Description:</strong> ${car.description}</p>

                <button id="book_now"  onclick="showPopup(1)">BOOK NOW</button>
                <button id="test_drive" onclick="showPopup(2)">TEST DRIVE</button>
            </div>
        </div>
    `;

    carDetailSection.innerHTML = carCard;

    // Attach event listeners to thumbnails
    const thumbnails = document.querySelectorAll('.car-thumbnail');
    const mainImage = document.getElementById('mainImage');

    thumbnails.forEach(thumbnail => {
        thumbnail.addEventListener('click', function () {
            const newSrc = this.getAttribute('data-src');
            const currentMainSrc = mainImage.src;

            // Swap main image with clicked thumbnail
            mainImage.src = newSrc;
            this.src = currentMainSrc;

            // Update `data-src` attributes
            this.setAttribute('data-src', currentMainSrc);
            mainImage.setAttribute('data-src', newSrc);

            console.log('Swapped main image with thumbnail:', newSrc);
        });
    });

    // Add click functionality for the main image
    mainImage.addEventListener('click', function () {
        const currentMainSrc = mainImage.src;

        // Find a free spot in thumbnails for the current main image
        const firstThumbnail = document.querySelector('.car-thumbnail');
        if (firstThumbnail) {
            const firstThumbnailSrc = firstThumbnail.getAttribute('data-src');
            firstThumbnail.src = currentMainSrc;
            firstThumbnail.setAttribute('data-src', currentMainSrc);

            // Update the main image to the first thumbnail
            mainImage.src = firstThumbnailSrc;
            mainImage.setAttribute('data-src', firstThumbnailSrc);
        }
        console.log('Main image swapped back to thumbnail');
    });
}


// Add this function to handle the Book Now and Test Drive actions
function handleCarAction(actionType) {
    // Check if DriveLuxeUserDetails exists in localStorage and contains userEmail
    const userDetails = JSON.parse(localStorage.getItem('DriveLuxeUserDetails'));

    if (userDetails && userDetails.email) {
        // If user is logged in, store the car details and proceed
        const carDetails = {
            image:car.img1,
            title: car.Title,
            price: car.Price,
            actionType: actionType,  // Book Now or Test Drive
            userEmail: userDetails.email
        };

        // Store the car action details in localStorage
        localStorage.setItem('CarActionDetails', JSON.stringify(carDetails));

        // Show a confirmation popup based on the action (Book Now or Test Drive)
        showPopup(actionType); // Pass action type to popup function
    } else {
        // If user is not logged in, redirect to login page
        alert("Please log in to proceed.");
        window.location.href = "/pages/login.html"; // Redirect to login page
    }
}

// function CongratsPage() {
//     window.location.href = `/pages/congratulations.html?car=${car.img1}`;

// }








// Updated showPopup function to handle both actions
function showPopup(popupNumber) {
    // Show the overlay and selected popup
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup" + popupNumber).style.display = "block";
}




// Event listeners for the Book Now and Test Drive buttons
document.getElementById("book_now").addEventListener("click", function () {
    handleCarAction(1); // Book Now action
});

document.getElementById("test_drive").addEventListener("click", function () {
    handleCarAction(2); // Test Drive action
});

function closePopup() {
    // Hide the overlay and all popups
    document.getElementById("overlay").style.display = "none";
    var popups = document.getElementsByClassName("popup");
    for (var i = 0; i < popups.length; i++) {
        popups[i].style.display = "none";
    }
}

// Add event listener to all "X" icons
document.querySelectorAll(".close-popup").forEach((icon) => {
    icon.addEventListener("click", closePopup);
});






// Function to handle form submission












  
















// function showPopup(popupNumber) {
//     // Show the overlay and selected popup
//     document.getElementById("overlay").style.display = "block";
//     document.getElementById("popup" + popupNumber).style.display = "block";
// }

// function closePopup() {
//     // Hide the overlay and all popups
//     document.getElementById("overlay").style.display = "none";
//     var popups = document.getElementsByClassName("popup");
//     for (var i = 0; i < popups.length; i++) {
//         popups[i].style.display = "none";
//     }
// }


