async function fetchOrders(orderType) {
  const ordersList = document.getElementById("ordersList");
  ordersList.innerHTML = "Loading your orders...";

  const user = auth.currentUser; // Get the current logged-in user
  if (!user) {
    ordersList.innerHTML = "<p>You are not logged in. Please log in to view your orders.</p>";
    return;
  }

  const uid = user.uid;  // Use the UID to filter orders

  const collectionName = orderType === "cars" ? "customerbook" : "orders";
  const ordersRef = collection(db, collectionName);
  const q = query(ordersRef, where("uid", "==", uid));

  try {
    const querySnapshot = await getDocs(q);
    ordersList.innerHTML = "";  // Clear previous orders

    if (querySnapshot.empty) {
      ordersList.innerHTML = `<p>No ${orderType === "cars" ? "cars" : "accessories"} found.</p>`;
    } else {
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Fetched Order Data: ", data);  // Log the order data to verify
        const orderDiv = document.createElement("div");
        orderDiv.innerHTML = `
          <p><strong>${orderType === "cars" ? "Car" : "Accessory"}:</strong> ${data.accessoryName || data.name}</p>
          <p><strong>Date:</strong> ${new Date(data.timestamp.seconds * 1000).toLocaleDateString()}</p>
          <p><strong>Price:</strong> $${data.price || data.price}</p>
        `;
        ordersList.appendChild(orderDiv);
      });
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    ordersList.innerHTML = "<p>Error loading orders. Please try again later.</p>";
  }
}
