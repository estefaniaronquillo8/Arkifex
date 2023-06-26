import React, { useState } from "react";
import ReactMapGL, { Marker } from "react-map-gl";

export const Map = ({ latitude, longitude }) => {
  const [viewport, setViewport] = useState({
    latitude: latitude,
    longitude: longitude,
    zoom: 14,
    width: "100%",
    height: "400px",
  });

  return (
    <ReactMapGL
      {...viewport}
      onViewportChange={(viewport) => setViewport(viewport)}
      mapboxApiAccessToken="pk.eyJ1IjoibHVpc3ZpdGVyaSIsImEiOiJjbGljbnh1MTAwbHF6M3NvMnJ5djFrajFzIn0.f63Fk2kZyxR2JPe5pL01cQ"
      mapStyle="mapbox://styles/mapbox/streets-v11"
    >
      <Marker latitude={latitude} longitude={longitude}>
        <div>📍</div>
      </Marker>
    </ReactMapGL>
  );
};
