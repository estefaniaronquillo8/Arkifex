import React, { useEffect, useState, useRef, useCallback } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import axios from 'axios';
import { handleEdit } from '../../services/location.api.routes';

const mapContainerStyle = {
  height: '70vh',
  width: '100%',
};

const LocationDetails = ({locationId}) => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCmIHtN6kcNKAzzF_Fxv1E3U0Fjq8tm66Y',
  });

  const [location, setLocation] = useState();
  const [center, setCenter] = useState();
  const mapRef = useRef();

  const getGeocode = async (address) => {
    try {
      const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCmIHtN6kcNKAzzF_Fxv1E3U0Fjq8tm66Y`);
      const { results } = response.data;
      return results[0].geometry.location;
    } catch (error) {
      console.error('Error occurred while fetching geocode:', error);
    }
  };

  useEffect(() => {
    const fetchLocation = async () => {
      const { response } = await handleEdit(locationId);
      if (response?.location) {
        let polygonData = JSON.parse(response.location.polygon).map(point => {
          return {
            lat: parseFloat(point.lat),
            lng: parseFloat(point.lng)
          };
        });
  
        setLocation({
          ...response.location,
          polygon: polygonData,
        });
  
        if (response.location.address) {
          const geo = await getGeocode(response.location.address);
          if (geo) {
            setCenter(geo);
          } 
        } else if (response.location.lat && response.location.lng) {
          setCenter({ lat: parseFloat(response.location.lat), lng: parseFloat(response.location.lng) });
        }
      }
    };
  
    fetchLocation();
  }, [locationId]);

  const onLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  useEffect(() => {
    if (!mapRef.current || !isLoaded || !center || !location?.polygon) return;

    new window.google.maps.Marker({
      position: center,
      map: mapRef.current,
    });

    new window.google.maps.Polygon({
      paths: location?.polygon,
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: mapRef.current,
    });
  }, [isLoaded, center, location]);

  const mapOptions = {
    center,
    zoom: 15,
  };

  return isLoaded && center && location?.polygon ? (
    <GoogleMap mapContainerStyle={mapContainerStyle} options={mapOptions} onLoad={onLoad} />
  ) : (
    <div>Loading...</div>
  );
};

export default LocationDetails;