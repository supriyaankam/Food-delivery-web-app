import React from "react";

const OrderTracking = ({ order }) => {
  const statuses = ["placed", "preparing", "on the way", "delivered"];

  return (
    <div style={{ marginBottom: "10px" }}>
      <strong>Order Tracking:</strong>
      <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
        {statuses.map((status) => (
          <span
            key={status}
            style={{
              fontWeight: order.orderStatus === status ? "bold" : "normal",
              color: order.orderStatus === status ? "green" : "gray",
              textTransform: "uppercase",
            }}
          >
            {status}
          </span>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking;