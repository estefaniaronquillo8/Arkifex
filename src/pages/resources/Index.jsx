import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../contexts/GlobalContext";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import {
  getAllResources,
  handleDelete,
} from "../../services/resource.api.routes";
import { Link } from "react-router-dom";
import { routesProtection } from "../../assets/routesProtection";
import { useNavigate } from "react-router-dom";

const ResourceIndex = () => {
  const { resources, setResources, showNotification } = useGlobalContext();
  const [success, setSuccess] = useState();
  const [error, setError] = useState();
  const [notificationType, setNotificationType] = useState();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!routesProtection()) navigate("/login");
    localStorage.clear();
    if (token !== null) {
      localStorage.setItem("token", token);
    }
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      const { response, success, error, notificationType } =
        await getAllResources();
      if (response?.resources) {
        setResources(response.resources);
      }

      setError(error);
      setSuccess(success);
      setNotificationType(notificationType);
    };

    fetchResources();
  }, []);

  useEffect(() => {
    if (success) {
      showNotification(success, notificationType);
    }
    if (error) {
      showNotification(error, notificationType);
    }
  }, [success, error, notificationType, showNotification]);

  const deleteHandler = async (id) => {
    const { response, success, error, notificationType } = await handleDelete(
      id
    );
    if (response?.status === 200) {
      setResources(response.resources);
    }
    setError(error);
    setSuccess(success);
    setNotificationType(notificationType);
  };

  const PrevArrow = ({ onClick }) => (
    <button onClick={onClick} className="arrow-button">
      <IoIosArrowBack style={{ color: "red", fontSize: "24px" }} />
    </button>
  );

  const NextArrow = ({ onClick }) => (
    <button onClick={onClick} className="arrow-button">
      <IoIosArrowForward style={{ color: "red", fontSize: "24px" }} />
    </button>
  );

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots) => (
      <div>
        <ul style={{ display: "flex", justifyContent: "center" }}>{dots}</ul>
      </div>
    ),
    customPaging: () => <></>,
  };

  return (
    <div className="flex-container">
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-4xl font-semibold mb-6">Recursos</h1>

      <nav className="bg-blue-500">
        <br />
        <Link
          to="/resources/create"
          onClick={() => localStorage.setItem("type", "Material")}
          className="bg-blue-500 text-white px-4 py-2 mr-5 rounded mb-4 inline-block"
        >
          Crear Material
        </Link>
        <Link
          to="/resources/create"
          onClick={() => localStorage.setItem("type", "Personal")}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 inline-block"
        >
          Crear Personal
        </Link>
      </nav>

      <h1 className="text-2xl font-semibold mb-3">TABLA DE MATERIALES</h1>
      <div className="slider-container">
        <Slider {...settings}>
          {resources &&
            resources
              .filter((resource) => resource.type === "Material")
              .map((resource) => (
                <div key={resource.id} className="px-4">
                  <div className="bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-semibold mb-3">
                      {resource.name}
                    </h1>
                    <p>Cantidad: {resource.quantity}</p>
                    <p>Unidad: {resource.unit}</p>
                    <p>Costo por Unidad: {resource.costPerUnit}</p>
                    <div className="text-center mt-4">
                      <Link
                        to={`/resources/details/${resource.id}`}
                        onClick={() =>
                          localStorage.setItem("type", "Material")
                        }
                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </Slider>
      </div>

      <h1 className="text-2xl font-semibold mt-3 mb-3">TABLA DE PERSONAL</h1>
      <div className="slider-container">
        <Slider {...settings}>
          {resources &&
            resources
              .filter((resource) => resource.type === "Personal")
              .map((resource) => (
                <div key={resource.id} className="px-4">
                  <div className="bg-white shadow-md rounded-lg">
                    <h1 className="text-2xl font-semibold mb-3">
                      {resource.name}
                    </h1>
                    <p>Rol: {resource.role}</p>
                    <p>Pago por hora: {resource.costPerUnit}</p>
                    <div className="text-center mt-4">
                      <Link
                        to={`/resources/details/${resource.id}`}
                        onClick={() =>
                          localStorage.setItem("type", "Personal")
                        }
                        className="inline-block bg-blue-500 text-white px-4 py-2 rounded mr-2"
                      >
                        Detalles
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
        </Slider>
      </div>
    </div>
    </div>
  );
};

export default ResourceIndex;
