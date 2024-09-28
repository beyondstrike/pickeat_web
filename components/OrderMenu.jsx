"use client";
import { useData } from "@context/DataContext";
import { useModal } from "@context/ModalContext";
import { useUser } from "@context/UserContext";
import React, { useEffect, useState } from "react";

const OrderMenu = ({ modalId, item }) => {
  const modalContext = useModal();
  const dataContext = useData();
  const userContext = useUser();

  if (!modalContext || !dataContext || !userContext) return null;

  const { closeModal, displayImage } = modalContext;
  const { addToCart } = userContext;
  const { currencies } = dataContext;

  const [loading, setLoading] = useState(false);
  const [totalPrice, setTotalPrice] = useState(item.price * 1);
  const [notes, setNotes] = useState("");

  const finish = async () => {
    try {
      setLoading(true);
      await addToCart({
        ...item,
        amount: orderNumber,
        extras: additions.map((index) => item.extras[index]),
        totalPrice: parseFloat(totalPrice),
        notes,
      });
    } catch (error) {
      console.error("Error adding to cart from OrderMenu:", error);
    } finally {
      setLoading(false);
      closeModal(modalId);
    }
  };

  const [orderNumber, setOrderNumber] = useState(1);
  const [additions, setAdditions] = useState([]);

  useEffect(() => {
    const totalAdditions = additions.reduce(
      (acc, index) => acc + item.extras[index].price,
      0
    );
    setTotalPrice(((item.price + totalAdditions) * orderNumber).toFixed(2));
  }, [orderNumber, additions]);

  return (
    <div className="bg-white border border-black/20 rounded-2xl h-full w-full max-h-screen overflow-auto py-10 px-5">
      <div className="flex justify-end">
        <button className="p-2" onClick={() => closeModal(modalId)}>
          <img className="h-3 w-3" src="/icons/close.png" alt="close" />
        </button>
      </div>

      <div className="flex items-center justify-between pb-4">
        <div className="flex items-center space-x-2">
          <img src={item.imageUrl} className="h-20 w-20 rounded-full" />
          <p className="text-[16px] font-bold">{item.title}</p>
        </div>
        <div className="flex p-1 items-center space-x-2 bg-gray-200 rounded-full">
          <button
            disabled={orderNumber === 1}
            className="p-1 rounded-full bg-white h-5 w-5 flex items-center justify-center disabled:opacity-50"
            onClick={() =>
              setOrderNumber((prev) => (prev - 1 < 1 ? 1 : prev - 1))
            }
          >
            <img
              className="h-full w-full object-contain"
              src="/icons/minus.png"
              alt="minus"
            />
          </button>
          <p>{orderNumber}</p>
          <button
            className="p-1 rounded-full bg-white h-5 w-5 flex items-center justify-center"
            onClick={() => setOrderNumber((prev) => prev + 1)}
          >
            <img
              className="h-full w-full object-contain"
              src="/icons/add.png"
              alt="add"
            />
          </button>
        </div>
      </div>
      <p className="text-sm text-black/70">{item.description}</p>
      <div className="flex flex-col py-4">
        <h2 className="font-semibold">Ingredients</h2>
        <p className="text-black/70 whitespace-pre-line">
          {item.ingredients.map((ingredient) => `▶ ${ingredient}`).join("\n")}
        </p>
      </div>
      <button
        onClick={() =>
          displayImage(
            `https://pickeat.blob.core.windows.net/allegerics/${item.restaurant}.png`,
            item.restaurant
          )
        }
        className="py-2 border-t border-b border-black/10 w-full text-left flex items-center gap-2"
        type="button"
      >
        <div className="h-6 w-6 p-1 bg-main-1/10 rounded-lg">
          <img
            className="h-full w-full object-contain"
            src="/icons/allergenic.png"
            alt="allergenic"
          />
        </div>
        Allergic & Nutritional Information
      </button>
      <div className="flex flex-col py-4">
        <h2 className="font-semibold">Extras</h2>
        <p className="text-black/70 whitespace-pre-line">
          {item.extras.map((extra, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex flex-1">
                <input
                  type="checkbox"
                  id={`extra-${index}`}
                  onChange={() =>
                    setAdditions((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    )
                  }
                />
                <label
                  className="ml-2 text-black/70 flex-1"
                  htmlFor={`extra-${index}`}
                >
                  {extra.title}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <p className="text-[16px] font-bold">
                  {currencies[item.currency]}
                  {extra.price.toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </p>
      </div>
      <div className="flex flex-col py-4">
        <h2 className="font-semibold">Notes</h2>
        <textarea
          className="p-2 border border-black/10 rounded-lg"
          placeholder="Add notes for your order"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      <div className="flex items-center justify-between py-4">
        <button
          className="p-1 rounded-full bg-main-1 w-full py-3 text-white font-bold"
          onClick={finish}
        >
          {loading
            ? "Adding to cart..."
            : `Add to cart | ${currencies[item.currency]}${totalPrice}`}
        </button>
      </div>
    </div>
  );
};

export default OrderMenu;
