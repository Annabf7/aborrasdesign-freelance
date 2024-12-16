// OrderHistory.jsx
import React, { useEffect, useState } from "react";
import grandma5 from "../assets/grandma5.jpg";
import { useAuth } from "./AuthContext";
import { db } from "../firebase/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import "../styles/OrderHistory.css";

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserOrders = async () => {
      if (!user) return;

      try {
        const q = query(
          collection(db, "orders"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);
        const userOrders = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const firstItem = data.items[0]; // Agafem el primer item per mostrar la imatge
          const totalItems = data.items.reduce((acc, it) => acc + it.quantity, 0);
          userOrders.push({
            id: doc.id,
            date: data.created.toDate().toLocaleString(),
            status: data.status,
            price: `€${parseFloat(data.retail_costs.total).toFixed(2)}`,
            // Podem mostrar només el primer article o tots
            items: data.items.map(i => i.name).join(", "),
            thumbnail: firstItem ? firstItem.thumbnail_url || firstItem.image : null,
            totalItems: totalItems
          });
        });

        setOrders(userOrders);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserOrders();
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
  {error && <p>Error: {error}</p>}
  {orders.length > 0 ? (
    <table className="order-table">
      <thead>
        <tr>
          <th>Order ID</th>
          <th>Art</th>
          <th>Date</th>
          <th>Items</th>
          <th>Total Items</th>
          <th>Status</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td>{order.id}</td>
            <td>
              {order.thumbnail && (
                <img
                  src={order.thumbnail}
                  alt="Order thumbnail"
                  className="order-thumbnail-img"
                />
              )}
            </td>
            <td>{order.date}</td>
            <td>{order.items}</td>
            <td>{order.totalItems}</td>
            <td>{order.status}</td>
            <td>{order.price}</td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No orders found.</p>
  )}
</div>

      </div>
    </div>
  );
};

export default OrderHistory;
