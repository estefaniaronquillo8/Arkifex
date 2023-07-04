import React, { useEffect, useState, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";
import { handleEdit } from "../../services/location.api.routes";

const mapContainerStyle = {
  height: "70vh",
  width: "100%",
};

const LocationDetails = ({ locationId, mode, setLocationData, address }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyCmIHtN6kcNKAzzF_Fxv1E3U0Fjq8tm66Y",
    libraries: ["drawing", "geometry", "places"],
  });

  const [location, setLocation] = useState();
  const [center, setCenter] = useState();
  const mapRef = useRef();
  const markerRef = useRef(); // Ref for the marker
  const polygonRef = useRef(); // Ref for the polygon

  const getGeocode = async (address) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyCmIHtN6kcNKAzzF_Fxv1E3U0Fjq8tm66Y`
      );
      const { results } = response.data;
      return results[0].geometry.location;
    } catch (error) {
      console.error("Error occurred while fetching geocode:", error);
    }
  };

  const getAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCmIHtN6kcNKAzzF_Fxv1E3U0Fjq8tm66Y`
      );
      console.log(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyCmIHtN6kcNKAzzF_Fxv1E3U0Fjq8tm66Y`
      );
      const { results } = response.data;
      return results[0].formatted_address;
    } catch (error) {
      console.error("Error occurred while fetching geocode:", error);
    }
  };

  useEffect(() => {
    if (mode === "create") {
      const fetchLocationAddress = async () => {
        if (address) {
          console.log("CON ADDRESS", address);
          const geo = await getGeocode(address);
          if (geo) {
            setCenter(geo);
          }
        } else {
          console.log("SIN ADDRESS");
          setLocation({
            address: "",
            area: "",
            lat: "",
            lng: "",
            polygon: [],
          });
          setCenter({
            lat: -0.1833, // Se pueden establecer estos valores a la ubicación que se prefiera.
            lng: -78.4816,
          });
        }
      };
      fetchLocationAddress();
    } else if (locationId) {
      const fetchLocation = async () => {
        const { response } = await handleEdit(locationId);
        if (response?.location) {
          console.log("CONSOLE LOG", response.location.polygon);
          let polygonData = JSON.parse(response.location.polygon).map(
            (point) => {
              return {
                lat: parseFloat(point.lat),
                lng: parseFloat(point.lng),
              };
            }
          );

          setLocation({
            ...response.location,
            polygon: polygonData,
          });

          // Se comentó para que se ponga el punto en el mapa solamente por las coordenadas
          /* if (response.location.address) {
            const geo = await getGeocode(response.location.address);
            if (geo) {
              setCenter(geo);
            }
          } else  */ if (response.location.lat && response.location.lng) {
            setCenter({
              lat: parseFloat(response.location.lat),
              lng: parseFloat(response.location.lng),
            });
          }
        }
        if (mode !== "show") setLocationData(response.location); // Update location data in parent
      };

      fetchLocation();
    }
  }, [mode, locationId, address]);

  const onLoad = useCallback(
    (map) => {
      mapRef.current = map;

      if (mode === "edit" || mode === "create") {
        const drawingManager = new window.google.maps.drawing.DrawingManager({
          drawingMode: window.google.maps.drawing.OverlayType.POLYGON,
          drawingControl: true,
          drawingControlOptions: {
            position: window.google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              window.google.maps.drawing.OverlayType.MARKER,
              window.google.maps.drawing.OverlayType.POLYGON,
            ],
          },
        });

        drawingManager.setMap(map);

        window.google.maps.event.addListener(
          drawingManager,
          "overlaycomplete",
          async (event) => {
            if (event.type === window.google.maps.drawing.OverlayType.MARKER) {
              // If a marker already exists, remove it.
              if (markerRef.current) {
                markerRef.current.setMap(null);
              }

              let marker = event.overlay;
              markerRef.current = marker; // Store reference to the new marker

              const address = await getAddress(
                marker.position.lat(),
                marker.position.lng()
              );
              console.log("address", address);

              setLocationData({
                address: address,
                lat: marker.position.lat(),
                lng: marker.position.lng(),
              });
            } else if (
              event.type === window.google.maps.drawing.OverlayType.POLYGON
            ) {
              // If a polygon already exists, remove it.
              if (polygonRef.current) {
                polygonRef.current.setMap(null);
              }

              let polygon = new window.google.maps.Polygon({
                paths: event.overlay.getPath().getArray(),
                map: map,
              });
              polygonRef.current = polygon; // Store reference to the new polygon

              // Calcular el área del polígono
              const area = window.google.maps.geometry.spherical.computeArea(
                polygon
                  .getPath()
                  .getArray()
                  .map((latLng) => {
                    return { lat: latLng.lat(), lng: latLng.lng() };
                  })
              );
              console.log("Area of the polygon is: ", area);

              setLocationData({
                polygon: polygon
                  .getPath()
                  .getArray()
                  .map((point) => ({ lat: point.lat(), lng: point.lng() })),
                area: area,
              });

              // Remove the polygon that was just drawn with the DrawingManager
              event.overlay.setMap(null);
            }
          }
        );

        // Inicializar el servicio de autocompletado
        const autocomplete = new window.google.maps.places.Autocomplete(
          document.getElementById("location-search-input")
        );

        // Cuando el usuario selecciona una dirección desde el dropdown, se extrae la información de la dirección
        autocomplete.addListener("place_changed", () => {
          const place = autocomplete.getPlace();

          // Si el lugar tiene una geometría, entonces presenta sus detalles en el mapa
          if (place.geometry) {
            map.setCenter(place.geometry.location);
            map.setZoom(18); // Haz zoom a la ubicación seleccionada
            /* setCenter(place.geometry.location.toJSON()); // Actualiza el estado del centro
            map.setZoom(18); */ // Haz zoom a la ubicación seleccionada
          }
        });

      }

      if (location?.polygon) {
        let polygon = new window.google.maps.Polygon({
          paths: location?.polygon,
          map: map,
        });
        polygonRef.current = polygon; // Store reference to the initial polygon
      }

      if (center && mode !== "create") {
        let marker = new window.google.maps.Marker({
          position: center,
          map: map,
        });
        markerRef.current = marker; // Store reference to the initial marker
      }
    },
    [location, center, mode, setLocationData]
  );

  const mapOptions = {
    center,
    zoom: mode === "create" ? 11 : 16,
  };

  return isLoaded && center && location ? (
    <>
      <input id="location-search-input" type="text" />
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        options={mapOptions}
        onLoad={onLoad}
      />
    </>
  ) : (
    <div>Loading...</div>
  );
};

export default LocationDetails;
