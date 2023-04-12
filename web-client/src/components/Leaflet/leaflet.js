import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import * as parkData from "../data/skateboard-parks.json";
import "./leaflet.css";
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

const Leaflet = () => {
  const position = [19.07609, 72.877426];

  const markers = [
{
  geocode: [19.07609, 72.877426],
  popUp: "Hi, This is Mumbai"
},
{
  geocode: [18.516726, 73.856255],
  popUp: "Hi, This is Pune"
},
{
  geocode: [21.1458, 79.0082],
  popUp: "Hi, This is Nagpur"
},
{
  geocode: [19.9975, 73.7898],
  popUp: "Hi, This is Nashik"
},
  ];

const customIcon = new Icon({
  iconUrl:"https://cdn-icons-png.flaticon.com/512/6153/6153497.png",
  iconSize:[38,38]
})


  return (
    <div className="map_outer_div">
      <MapContainer
        center={position}
        zoom={7}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup> {
          markers.map(marker =>(
            <Marker position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))
        }</MarkerClusterGroup>
       
        {/* <Marker position={position}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker> */}
      </MapContainer>
    </div>
  );
};

export default Leaflet;
