"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useUser } from "@context/UserContext";

const Navbar = ({ children }) => {
  const { logout, cart, orders, orderPing, cartPing } = useUser();
  const pathName = usePathname();
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null); // Ref to detect clicks outside the menu

  // Close the menu if a click is detected outside the menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    // Add the event listener when the menu is open
    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  useEffect(() => {
    setShowMenu(false);
  }, [pathName]);

  return (
    <div className="flex">
      <div className="w-64 px-6 py-4 bg-white hidden md:flex flex-col h-screen sticky top-0">
        <h1 className="px-4">
          <span className="text-2xl font-bold">Pick</span>
          <span className="text-2xl font-bold text-main-1">Eat.</span>
        </h1>
        <div className="flex flex-col mt-20">
          <Link
            className={`flex items-center gap-2 py-2 font-semibold text-sm px-4 hover:bg-main-1/10 transition-all duration-150 ease-in-out ${
              pathName === "/"
                ? "border-l-4 border-main-1"
                : "border-l-0 border-transparent"
            }`}
            href="/"
          >
            <Image src="/icons/home.png" alt="home" width={22} height={22} />
            Home
          </Link>
          <Link
            className={`flex items-center gap-2 py-2 font-semibold text-sm px-4 hover:bg-main-1/10 transition-all duration-150 ease-in-out ${
              pathName === "/a"
                ? "border-l-4 border-main-1"
                : "border-l-0 border-transparent"
            }`}
            href="#"
          >
            <Image src="/icons/cart.png" alt="cart" width={22} height={22} />
            Cart
          </Link>
          {/* ...Other Links */}
        </div>
      </div>
      <div className="flex-1 flex flex-col p-6 gap-6">
        <nav className="w-full flex items-center gap-4 md:gap-6 justify-end">
          <Link
            href="/orders"
            className="bg-white p-2 rounded-full shadow border hover:opacity-80 relative"
          >
            <Image
              src="/icons/orders.png"
              alt="orders"
              width={16}
              height={16}
            />
            {orderPing && (
              <div className="animate-ping  rounded-full bg-red-500 text-white absolute min-h-4 min-w-4 -top-1 -right-1 flex items-center justify-center" />
            )}
            {orders.length > 0 ? (
              <div className="rounded-full bg-red-500 text-white absolute min-h-4 min-w-4 -top-1 -right-1 flex items-center justify-center text-xs">
                {orders.length}
              </div>
            ) : null}
          </Link>
          <Link
            href="/cart"
            className="bg-white p-2 rounded-full shadow border hover:opacity-80 relative"
          >
            <Image src="/icons/cart.png" alt="cart" width={16} height={16} />
            {cartPing && (
              <div className="animate-ping  rounded-full bg-red-500 text-white absolute min-h-4 min-w-4 -top-1 -right-1 flex items-center justify-center" />
            )}
            {cart.length > 0 ? (
              <div className="rounded-full bg-red-500 text-white absolute min-h-4 min-w-4 -top-1 -right-1 flex items-center justify-center text-xs">
                {cart.length}
              </div>
            ) : null}
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Image
              className="rounded-full"
              src="/media/avatar.webp"
              alt="avatar"
              width={36}
              height={36}
            />
            <div>
              <h3 className="font-semibold">John Doe</h3>
              <p className="text-sm">User</p>
            </div>
          </div>
          <button
            onClick={() => setShowMenu((prev) => !prev)}
            className="block md:hidden bg-white p-2 rounded-full shadow border hover:opacity-80"
            type="button"
          >
            <Image src="/icons/menu.png" alt="menu" width={16} height={16} />
          </button>
          {showMenu && (
            <div
              ref={menuRef} // Attach ref to the menu
              className="md:hidden absolute right-2 top-0 mt-12 bg-white p-4 rounded-lg shadow z-[9999]"
            >
              <Link
                className="flex items-center gap-2 py-2 font-semibold text-sm px-4 hover:bg-main-1/10 transition-all duration-150 ease-in-out"
                href="/"
              >
                <Image
                  src="/icons/home.png"
                  alt="home"
                  width={22}
                  height={22}
                />
                Home
              </Link>
              <Link
                className="flex items-center gap-2 py-2 font-semibold text-sm px-4 hover:bg-main-1/10 transition-all duration-150 ease-in-out"
                href="/cart"
              >
                <Image
                  src="/icons/cart.png"
                  alt="cart"
                  width={22}
                  height={22}
                />
                Cart
              </Link>
              <button
                onClick={logout}
                type="button"
                className="flex items-center gap-2 py-2 font-semibold text-sm px-4 hover:bg-main-1/10 transition-all duration-150 ease-in-out"
              >
                <Image
                  src="/icons/logout.png"
                  alt="cart"
                  width={22}
                  height={22}
                />
                Logout
              </button>
            </div>
          )}
        </nav>
        {children}
      </div>
    </div>
  );
};

export default Navbar;
