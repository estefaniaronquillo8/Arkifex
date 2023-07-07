import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { handleCreate } from "../../services/location.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { useEffect, useCallback, useState } from "react";
import LocationDetails from "./Details";
import { routesProtection } from "../../assets/routesProtection";

const LocationCreate = () => {
  const navigate = useNavigate();
  const { showNotification, selectedProjectId, setSelectedProjectId } =
    useGlobalContext();
  const [address, setAddress] = useState("");
  console.log("LUEGO", address);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectId: "",
      address: address,
      area: 0,
      lat: "",
      lng: 0,
      polygon: [],
    },
  });

  const setLocationData = useCallback(
    (data) => {
      console.log("setLocationData", data);
      if (data?.lat) setValue("lat", data.lat);
      if (data?.lng) setValue("lng", data.lng);
      if (data?.polygon) setValue("polygon", JSON.stringify(data.polygon));
      if (data?.address) setValue("address", data.address);
      //if (data?.area) setValue("area", data.area);
      if (data?.area) setValue("displayArea", data.area);      
    },
    [setValue]
  );

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
  }, []);

  const createHandler = async (data) => {
    console.log("data", data);
    console.log("selectedProjectId", selectedProjectId);

    console.log("current form state", getValues());

    data.projectId = selectedProjectId;
    const { response, success, error, notificationType } = await handleCreate(
      data
    );

    console.log(response);

    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    setSelectedProjectId(null);
    if (response?.status === 200) {
      navigate(`/projects/details/${data.projectId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      {/* <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]"> */}
      <form onSubmit={handleSubmit(async (data) => await createHandler(data))}>
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
                  type="hidden"
                  {...register("projectId")}
                  className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
                />
              </div> */}
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
              onChange={(e) => setAddress(e.target.value)}
              readOnly
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label
              htmlFor="displayArea"
              className="block text-sm font-medium text-gray-700"
            >
              Area del polígono:
            </label>
            <input
              id="displayArea"
              type="text"
              {...register("displayArea")}
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
            {...register("lat", {
              required: "Ingrese un marcador en el mapa.",
            })}
            readOnly
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
          />
          {errors.lat && <p className="text-red-800">{errors.lat.message}</p>}
        </div>
        {/* <div>
            <label
              htmlFor="lng"
              className="block text-sm font-medium text-gray-700"
            >
              Longitude:
            </label>
            <input
              id="lng"
              //type="hidden"
              {...register("lng")}
              className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
            />
          </div> */}
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
            {...register("polygon", {
              required: "Ingrese el polígono en el mapa.",
            })}
            className="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 border-gray-300 rounded-md"
          />
          {errors.polygon && (
            <p className="text-red-800">{errors.polygon.message}</p>
          )}
        </div>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Crear
        </button>
      </form>
      <LocationDetails
        mode="create"
        setLocationData={setLocationData}
        address={address}
      />
      {/*   </div>
      </div> */}
    </div>
  );
};

export default LocationCreate;
