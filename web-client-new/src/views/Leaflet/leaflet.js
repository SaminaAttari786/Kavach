import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Pane,
  Circle,
  CircleMarker,
} from "react-leaflet";
import { Icon } from "leaflet";
// import * as parkData from "../data/skateboard-parks.json";
import "./leaflet.css";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

const Leaflet = () => {
  const position = [19.07609, 72.877426];

  // markers - represents users
  const markers = [
    {
      geocode: [19.0839385, 72.90321],
      // lat: 19.07609,
      // long: 72.877426,
      popUp: "Vriddhi's location",
    },
    {
      geocode: [19.0823626, 72.8960185],
      // lat: 18.516726,
      // long: 73.856255,
      popUp: "Sumit's location",
    },
  ];

  //circle positions - represents regions
  const circle_markers = [
    {
      center: [19.0839385, 72.90321],
      popUp: "Vriddhi's perimeter",
    },
    {
      center: [19.0823626, 72.8960185],
      popUp: "Sumit's perimeter",
    },
  ];

  // marker icon
  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/6153/6153497.png",
    iconSize: [38, 38],
  });


  // distance between two co-ordinates calculation
  const setDistance = (lat1,
    lat2, lon1, lon2) => {

    // The math module contains a function
    // named toRadians which converts from
    // degrees to radians.
    lon1 = lon1 * Math.PI / 180;
    lon2 = lon2 * Math.PI / 180;
    lat1 = lat1 * Math.PI / 180;
    lat2 = lat2 * Math.PI / 180;

    // Haversine formula
    let dlon = lon2 - lon1;
    let dlat = lat2 - lat1;
    let a = Math.pow(Math.sin(dlat / 2), 2)
      + Math.cos(lat1) * Math.cos(lat2)
      * Math.pow(Math.sin(dlon / 2), 2);

    let c = 2 * Math.asin(Math.sqrt(a));

    // Radius of earth in kilometers. Use 3956
    // for miles
    let r = 6371;

    // calculate the result
    return (c * r);
  }

  var distance = 0;

  return (
    <div className="map_outer_div">
      <MapContainer center={position} zoom={7} scrollWheelZoom={false} touchZoom={false} doubleClickZoom={false}
        closePopupOnClick={false} dragging={false} zoomSnap={false} zoomDelta={false} trackResize={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup chunkedLoading>
          {" "}
          {markers.map((marker) => (
            <Marker position={marker.geocode} icon={customIcon}>
              <Popup>{marker.popUp}</Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>

        {circle_markers.map((circle_marker) => (
          <CircleMarker center={circle_marker.center} radius={50}>  <Popup>{circle_marker.popUp}</Popup></CircleMarker>
        ))}

        {/* {distance = setDistance(circle_markers[0].center[0], markers[0].geocode[0], circle_markers[0].center[1], markers[0].geocode[1])} */}
      </MapContainer>


      {/* <p>Distance between circle1 and user1 is {distance}</p> */}
    </div>
  );
};

export default Leaflet;
