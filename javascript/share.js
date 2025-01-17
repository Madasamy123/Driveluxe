document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (event) => {
        if (event.target.id === "shareIcon") {
            const carSection = event.target.closest(".car-card");

            if (!carSection) {
                console.error("Car details section not found!");
                return;
            }

            // Fetch car details
            const carImage = carSection.querySelector("img")?.src; // Hosted image URL
            const carName = carSection.querySelector("h4")?.textContent;
            const carPrice = carSection.querySelector("p")?.textContent;

            if (!carImage || !carName || !carPrice) {
                console.error("Car details are missing or invalid.");
                return;
            }

            // Message content for WhatsApp
            const websiteURL = "https://driveluxe.netlify.app";
            const shareMessage = `
                Check out this car on DriveLuxe!\n\n
                Name: ${carName}\n
                Price: ${carPrice}\n\n
                View the image here: ${carImage}\n
                Visit our website: ${websiteURL}
            `;

            // Generate WhatsApp link
            const whatsappURL = `https://wa.me/?text=${encodeURIComponent(shareMessage)}`;

            // Open WhatsApp sharing link
            window.open(whatsappURL, "_blank");
        }
    });
});
