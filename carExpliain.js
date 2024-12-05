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

                <button id="book_now">BOOK NOW</button>
                <button id="test_drive">TEST DRIVE</button>
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
