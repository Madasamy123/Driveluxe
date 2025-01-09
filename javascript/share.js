document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (event) => {
        // Check if the clicked element is the share icon
        if (event.target.id === "shareIcon") {
            const carSection = event.target.closest(".car-card");

            // Validate if carSection is found
            if (!carSection) {
                console.error("Car details section not found!");
                return;
            }

            // Get car details
            const carImage = carSection.querySelector("img")?.src;
            const carName = carSection.querySelector("h4")?.textContent;
            const carPrice = carSection.querySelector("p")?.textContent;

            // Validate if car details are available
            if (!carImage || !carName || !carPrice) {
                console.error("Car details are missing or invalid.");
                return;
            }

            // Construct the shareable message
            const websiteURL = "https://www.driveluxe.com"; // Replace with your actual website URL
            const shareMessage = `Check out this car on DriveLuxe!\n\nName: ${carName}\nPrice: ${carPrice}\n\nImage: ${carImage}\nView more cars here: ${websiteURL}`;

            // WhatsApp sharing link
            const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

            // Open WhatsApp sharing link in a new tab
            window.open(whatsappURL, "_blank");
        }
    });
});
