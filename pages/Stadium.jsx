"use client";
import React, { useEffect, useState } from "react";
import { MapContainer, Circle, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useData } from "@context/DataContext";
import { useUser } from "@context/UserContext";
import moment from "moment";
import Link from "next/link";

const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return parseInt(distance);
};

const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const Stadium = () => {
  const { getStadium } = useData();
  const { userLocation } = useUser();

  const [stadiums, setStadiums] = useState([]);
  const [loading, setLoading] = useState(true);

  const locations = [
    [40.684, -73.965],
    [40.688, -73.97],
    [40.691, -73.96],
    [40.695, -73.95],
  ];

  useEffect(() => {
    const fetchStadiums = async () => {
      setLoading(true);
      const data = await getStadium(userLocation);
      setStadiums(data);
      setLoading(false);
    };

    fetchStadiums();
  }, [userLocation]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex h-full gap-10">
      <div className="flex-1 hidden md:block">
        <MapContainer
          className="flex-1 h-full w-full opacity-70 rounded-lg shadow"
          style={{
            userSelect: "none",
          }}
          center={[40.684, -73.965]}
          zoom={14}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {locations.map((location, idx) => (
            <Circle
              key={idx}
              center={location}
              radius={50} // Adjust the radius as needed
              color="purple"
              fillColor="purple"
              fillOpacity={1}
            />
          ))}
        </MapContainer>
      </div>
      <div className="w-full md:w-72">
        <h1 className="font-bold text-lg mb-6">
          {stadiums.length} Stadium's Around You
        </h1>
        <div className="flex flex-col gap-4 h-[80vh] overflow-auto no-scroller">
          {stadiums.map((stadium) => {
            const now = moment();
            const events = stadium.events;
            const upcomingEvent = events.find((event) =>
              moment(event.date).isAfter(now)
            );
            const distance = getDistanceFromLatLonInKm(
              userLocation.latitude,
              userLocation.longitude,
              stadium.location.coordinates[1],
              stadium.location.coordinates[0]
            );

            return (
              <Link
                key={stadium._id}
                href={`/menu/${stadium._id}`}
                className="relative w-full rounded-2xl shadow-sm shadow-black bg-white mb-2 mx-1"
              >
                <div className="w-full h-[70%]">
                  <img
                    src={stadium.image}
                    alt={stadium.title}
                    className="flex-1 object-cover rounded-t-2xl h-full w-full object-cover"
                  />
                </div>
                <div className="p-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{stadium.title}</p>
                    <div className="flex items-center bg-main-1 px-1">
                      <p className="text-xs font-semibold text-white">
                        {`${distance} km`}
                      </p>
                    </div>
                  </div>
                </div>
                {upcomingEvent ? (
                  <>
                    <div className="p-2 flex space-x-2">
                      <img
                        src="/icons/calendar.png"
                        className="w-5 h-5 object-contain"
                        alt="calendar"
                      />
                      <p className="text-xs text-black/70 font-bold">
                        {upcomingEvent ? upcomingEvent?.title : ""}
                      </p>
                    </div>
                    <p className="text-[10px] absolute bottom-2 right-2">
                      {upcomingEvent
                        ? moment(upcomingEvent?.date).format("MMM DD")
                        : ""}
                    </p>
                  </>
                ) : null}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Stadium;
