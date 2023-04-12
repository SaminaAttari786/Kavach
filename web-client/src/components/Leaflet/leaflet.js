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
import * as parkData from "../data/skateboard-parks.json";
import "./leaflet.css";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";

const Leaflet = () => {
  const position = [19.07609, 72.877426];

  const markers = [
    {
      geocode: [19.07609, 72.877426],
      lat:19.07609,
      long:72.877426,
      popUp: "Hi, This is User1",
    },
    {
      geocode: [18.516726, 73.856255],
      lat:18.516726,
      long:73.856255,
      popUp: "Hi, This is User2",
    },
    {
      geocode: [21.1458, 79.0082],
      lat:21.1458,
      long:79.0082,
      popUp: "Hi, This is User3",
    },
    {
      geocode: [19.9975, 73.7898],
      popUp: "Hi, This is User4",
    },
  ];

  const circle_markers = [
    {
      center: [25.24209, 75.877426],
      popUp: "Hi, This is Circle1",
    },
    {
      center: [19.21226, 74.856255],
      popUp: "Hi, This is Circle2",
    },
    {
      center: [20.98978, 76.0082],
      popUp: "Hi, This is Circle3",
    },
    {
      center: [21.89775, 70.7898],
      popUp: "Hi, This is Circle4",
    },
  ];

  const customIcon = new Icon({
    iconUrl: "https://cdn-icons-png.flaticon.com/512/6153/6153497.png",
    iconSize: [38, 38],
  });


  //distance calculation - 1
  ///Can't get proper distance oof.
  // console.log(circle_markers[0].center[0]);
  // console.log(markers[0].geocode[0]);
  // distance = (Math.abs(circle_markers[0].center[0] - markers[0].geocode[0])).toFixed(7);
 

  //distance calculation - 2

  

//   setDistance = (latA, latB) => {
//     if (latA !== undefined && latB !== undefined) {
        
//         let dis = latA.distanceTo(latB);
//         let distanceConversion = ((dis) / 1000).toFixed(0);
//         let distanceKm = distanceConversion;
//         distance = distanceKm;
//         return distance || 0;
//     }
//     else {
//         return 0;
//     }
// }

var distance = 0;

  return (
    <div className="map_outer_div">
      <MapContainer center={position} zoom={7} scrollWheelZoom={false}>
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

        {circle_markers.map((marker) => (
          <CircleMarker center={marker.center} radius={100} />
        ))}
        {/* {distance = setDistance(circle_markers.center[0],markers.geocode[0])} */}
      </MapContainer>


      {/* <p>Distance is {distance}</p> */}
    </div>
  );
};

export default Leaflet;
