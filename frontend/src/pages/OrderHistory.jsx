import { useEffect, useState } from "react";
import axios from "axios";
import StarRating from "../components/StarRating";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [ratings, setRatings] = useState({});

  const user = JSON.parse(localStorage.getItem("userInfo"));

  useEffect(() => {
    if (user) {
      fetchOrders();
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/orders/user/${user._id}`
      );
      setOrders(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const submitRating = async (orderId) => {
    try {
      await axios.post("http://localhost:5000/api/orders/rate", {
        orderId,
        rating: ratings[orderId],
      });

      alert("⭐ Rating submitted successfully!");
      fetchOrders();
    } catch (error) {
      console.log(error);
    }
  };

  const handleRatingChange = (orderId, value) => {
    setRatings({ ...ratings, [orderId]: value });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>📦 Order History</h2>

      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          style={{ width: "100%", marginTop: "20px" }}
        >
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Payment Status</th>
              <th>Order Status</th>
              <th>Date</th>
              <th>Rating</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>₹{order.totalAmount}</td>
                <td>{order.paymentMethod}</td>
                <td>{order.paymentStatus}</td>
                <td>{order.orderStatus}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>

                <td>
                  {order.orderStatus === "Delivered" ? (
                    <>
                      <StarRating
                        rating={ratings[order._id] || 0}
                        setRating={(value) =>
                          handleRatingChange(order._id, value)
                        }
                      />

                      <button
                        onClick={() => submitRating(order._id)}
                        style={{ marginTop: "5px" }}
                      >
                        Submit
                      </button>
                    </>
                  ) : (
                    "Not Available"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderHistory;