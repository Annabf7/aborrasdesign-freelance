import React, { useEffect, useState } from "react";
import grandma5 from "../assets/grandma5.jpg";
import { useAuth } from "./AuthContext";
import "../styles/OrderHistory.css";

const OrderHistory = () => {
  const { user } = useAuth(); // Accedim a l'usuari autenticat
  const [orders, setOrders] = useState([]);

  // Aquí simularem algunes comandes, això es temporal, s'haurà de configurar amb comandes reals
  useEffect(() => {
    // Simulem dades d'una comanda
    const mockOrders = [
      {
        id: "1234",
        date: "October 15, 2024",
        item: "Noise Field - Generative Art",
        status: "Completed",
        price: "€120.00",
      },
      {
        id: "1235",
        date: "October 20, 2024",
        item: "Flowing Patterns - Generative Art",
        status: "Completed",
        price: "€150.00",
      },
    ];

    // Filtrar les comandes només per l'usuari actual (simulat)
    if (user) {
      setOrders(mockOrders);
    }
  }, [user]);

  return (
    <div className="order-history-page">
      <div className="order-image-section">
        <img src={grandma5} alt="Order history background" className="order-image" />
      </div>
      <div className="order-details-section">
        <h1>Order History</h1>
        <p>See your past purchases and order details</p>

        <div className="order-list">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="order-item">
                <h3>Order #{order.id}</h3>
                <p>Date: {order.date}</p>
                <p>Item: {order.item}</p>
                <p>Status: {order.status}</p>
                <p>Price: {order.price}</p>
                <button onClick={() => console.log(`Viewing details for order ${order.id}`)}>
                  View Details
                </button>
              </div>
            ))
          ) : (
            <p>No orders found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
