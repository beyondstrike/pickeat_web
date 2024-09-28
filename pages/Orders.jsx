"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useModal } from "../context/ModalContext";
import { useUser } from "../context/UserContext";
import Loader from "../components/Loader";
import moment from "moment";
import { useData } from "../context/DataContext";
import OrderCompletionScan from "@components/OrderCompletionScan";

const EmptyOrders = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-white">
      <p className="font-semibold">No current orders found</p>
    </div>
  );
};

const Orders = () => {
  const modalContext = useModal();
  const userContext = useUser();
  const dataContext = useData();

  if (!modalContext || !userContext || !dataContext) return null;

  const { openModal, closeModal } = modalContext;
  const { getOrders, socket } = userContext;
  const { currencies } = dataContext;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleScanBarcode = (orderId, id) => {
    const [modalId, updateModalContent] = openModal(
      <OrderCompletionScan id={id} orderId={orderId} />
    );
    updateModalContent(
      <OrderCompletionScan id={id} orderId={orderId} modalId={modalId} />
    );
  };

  const fetchOrders = useCallback(() => {
    setLoading(true);
    getOrders()
      .then((data) => {
        setOrders(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [getOrders]);

  useEffect(() => {
    fetchOrders(); // Fetch orders when component is mounted
  }, [fetchOrders]);

  useEffect(() => {
    if (!socket) return;

    socket.on("order_delivered", () => {
      fetchOrders();
      closeModal();
    });

    return () => {
      socket.off("order_delivered");
    };
  }, [socket, fetchOrders]);

  if (loading) {
    return <Loader />;
  }

  if (orders.length === 0) {
    return <EmptyOrders />;
  }

  return (
    <div className="flex-1 overflow-auto">
      {orders.map((order, index) => (
        <div key={index} className="rounded-lg border p-2 bg-gray-100 mt-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold">{`Order: ${order.orderID}`}</p>
            {order.status === "ready" ? (
              <button
                onClick={() => handleScanBarcode(order.orderID, order._id)}
              >
                <img
                  src="/icons/barcode.png" // Replace with the actual path to the barcode icon
                  alt="Scan Barcode"
                  className="h-5 w-5"
                />
              </button>
            ) : (
              <div className="flex items-center space-x-1">
                <img
                  src="/icons/timer.png" // Replace with the actual path to the timer icon
                  alt="Timer"
                  className="h-5 w-5"
                />
                <p className="text-xs font-semibold">
                  {moment(order.timeSlot, "HH:mm").fromNow()}
                </p>
              </div>
            )}
          </div>
          {order.items.map((item, index) => (
            <div
              key={index}
              className={`flex space-x-3 mt-4 pb-4 ${
                index === order.items.length - 1
                  ? ""
                  : "border-b border-black/10"
              }`}
            >
              <div className="border rounded-lg border-black/10 flex items-center justify-center px-2 py-4 bg-white">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-20 w-20 rounded-lg"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold truncate">{item.title}</p>
                <p className="my-1 text-base font-bold text-main-1">
                  {currencies[item.currency]}
                  {item.price}
                </p>
                <div className="flex flex-row">
                  <div className="flex-1">
                    {item.extras.map((extra) => (
                      <p key={extra._id} className="text-xs text-black/70">
                        • {extra.title}
                      </p>
                    ))}
                  </div>
                  <p className="text-xs font-semibold mt-auto">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
