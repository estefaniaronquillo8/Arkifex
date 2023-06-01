import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import 'tailwindcss/tailwind.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibHVpc3ZpdGVyaSIsImEiOiJjbGljbnh1MTAwbHF6M3NvMnJ5djFrajFzIn0.f63Fk2kZyxR2JPe5pL01cQ'; // Replace with your Mapbox access token

const MapPage = () => {

    const mapContainer = useRef(null);
    const map = useRef(null);

    useEffect(() => {
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [0, 0], // Specify the initial map center
      zoom: 2 // Specify the initial zoom level
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);
  
    return (
      <div className="h-screen flex justify-center items-center">
        <div ref={mapContainer} className="w-1/5 h-1/4" />
      </div>
    );
};

export default MapPage;