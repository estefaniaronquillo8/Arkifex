import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { handleEdit, handleUpdate } from "../../services/location.api.routes";
import { routesProtection } from "../../assets/routesProtection";
import LocationDetails from "./Details";

function LocationEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useGlobalContext();

  const { register, handleSubmit, getValues, setValue, watch } = useForm({
    defaultValues: {
      projectId: "",
      address: "",
      area: 0,
      lat: 0,
      lng: 0,
      polygon: [],
    },
  });

  // Creamos una referencia para los valores iniciales
  const initialFormValues = useRef(null);

  // Observamos todos los cambios en los campos del formulario
  const currentFormValues = watch();

  const [calculatedArea, setCalculatedArea] = useState(0);

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, [navigate]);

  const setLocationData = useCallback(
    (data) => {
      if (data?.lat) setValue("lat", data.lat);
      if (data?.lng) setValue("lng", data.lng);
      if (data?.polygon) setValue("polygon", JSON.stringify(data.polygon));
      if (data?.address) setValue("address", data.address);
      if (data?.area) setCalculatedArea(data.area); // Descomenta esta línea
    },
    [setValue]
  );

  useEffect(() => {
    const fetchLocation = async () => {
      const { response, success, error } = await handleEdit(id);
      if (response?.location) {
        setValue("projectId", response.location.projectId);
        setValue("address", response.location.address);
        setValue("area", response.location.area);
        setValue("lat", response.location.lat);
        setValue("lng", response.location.lng);
        setValue("polygon", JSON.parse(response.location.polygon));

        // Guardamos los valores iniciales del formulario
        initialFormValues.current = getValues();
      }
      if (success || error) {
        showNotification(success || error, success ? "success" : "error");
      }
    };

    fetchLocation();
  }, [id, setValue, showNotification, setLocationData]);

  const onSubmit = async (data) => {
    // Comparamos los valores iniciales con los actuales
    if (
      JSON.stringify(initialFormValues.current) ===
      JSON.stringify(currentFormValues)
    ) {
      // No hubo cambios, simplemente redirigimos
      navigate(`/projects/details/${data?.projectId}`);
      return;
    }

    const { response, success, error } = await handleUpdate(id, data);
    if (success || error) {
      showNotification(success || error, success ? "success" : "error");
    }
    if (success) {
      navigate(`/projects/details/${data?.projectId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-4xl font-semibold mb-6">Edit location</h2>
      <div className="bg-white shadow-md rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-8 gap-y-4">
            {/* <div>
              <label
                htmlFor="projectId"
                className="block text-sm font-medium text-gray-700"
              >
                Project ID:
              </label>
              <input
                id="projectId"
                type="number"
                {...register("projectId")}
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address:
              </label>
              <input
                id="address"
                type="text"
                {...register("address")}
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              />
            </div> */}
            <div>
              <label
                htmlFor="calculatedArea"
                className="block text-sm font-medium text-gray-700"
              >
                Área del polígono:
              </label>
              <input
                id="calculatedArea"
                type="number"
                step="any"
                value={calculatedArea}
                readOnly
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label
                htmlFor="area"
                className="block text-sm font-medium text-gray-700"
              >
                Area del proyecto:
              </label>
              <input
                id="area"
                type="number"
                step="any"
                {...register("area")}
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              />
            </div>

            <div>
              {/* <label
                htmlFor="lat"
                className="block text-sm font-medium text-gray-700"
              >
                Latitude:
              </label> */}
              <input
                id="lat"
                type="hidden"
                {...register("lat")}
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              />
            </div>
            <div>
              {/* <label
                htmlFor="lng"
                className="block text-sm font-medium text-gray-700"
              >
                Longitude:
              </label> */}
              <input
                id="lng"
                type="hidden"
                {...register("lng")}
                className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
              />
            </div>
          </div>
          <div>
            {/* <label
              htmlFor="polygon"
              className="block text-sm font-medium text-gray-700"
            >
              Polygon:
            </label> */}
            <input
              id="polygon"
              type="hidden"
              {...register("polygon")}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
            />
          </div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save
          </button>
        </form>
        <LocationDetails
          locationId={id}
          mode="edit"
          setLocationData={setLocationData}
        />
      </div>
    </div>
  );
}

export default LocationEdit;
