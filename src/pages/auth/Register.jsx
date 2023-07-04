import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleRegister } from "../../services/user.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { BsFillBuildingsFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const { showNotification } = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const registerHandler = async (data) => {
    const { response, success, error, notificationType } = await handleRegister(
      data
    );
    if (success) {
      showNotification(success, notificationType);
    }

    if (error) {
      showNotification(error, notificationType);
    }

    if (response?.status === 200) {
      navigate("/login");
    }
  };
  return (
    <div className="w-full h-screen flex flex-col md:flex-row-reverse">
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
        <img
          src="src/assets/Register.gif"
          className="w-full h-full object-cover rounded-lg filter contrast-500 gif-with-relief"
          alt="Background"
        />
        <div className="absolute top-[75%] left-[38%] flex flex-col">
          <h1 className="text-3xl text-white font-bold my-4">
            Un paso mas...
          </h1>
        </div>
      </div>

      <div className="w-full md:w-1/2 h-full bg-[#F5F5F5] flex flex-col p-10 justify-between items-center">
        <h1 className="w-full max-w-[500px] mx-auto text-xl text-black font-bold mr-auto">
          <BsFillBuildingsFill className="inline-block mr-3 mb-1 react-icons-gi text-3xl" />
          Arkifex
        </h1>
        <div className="w-full flex flex-col max-w-[500px] ">
          <div className="w-full flex flex-col mb-2">
            <h3 className="text-2xl font- mb-2">Inicia Sesion</h3>
            <p className="text-base mb-2">
              Bienvenid@ Ingresa tus datos aqui!!
            </p>
          </div>
          <div>
          <form
            onSubmit={handleSubmit(async (data) => await registerHandler(data))}
          >
            <div className="mb-4">
              <label
                htmlFor="name"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Nombres
              </label>
              <input
                type="text"
                id="name"
                placeholder="Nombres"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("name", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres.",
                  },
                })}
              />
              {errors.name && (
                <p className="text-red-800">{errors.name.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastname"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Apellidos
              </label>
              <input
                type="text"
                id="lastname"
                placeholder="Apellidos"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("lastname", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 2,
                    message: "El apellido debe tener al menos 2 caracteres.",
                  },
                })}
              />
              {errors.lastname && (
                <p className="text-red-800">{errors.lastname.message}</p>
              )}
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                placeholder="Correo Electrónico"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                {...register("email", {
                  required: "El campo es requerido.",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Ingrese una dirección de correo válida.",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-800">{errors.email.message}</p>
              )}
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                placeholder="Contraseña"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                {...register("password", {
                  required: "El campo es requerido.",
                  minLength: {
                    value: 6,
                    message: "La contraseña debe tener al menos 6 caracteres.",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-800">{errors.password.message}</p>
              )}
            </div>
            <div className="flex flex-col items-center justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full mb-4"
              >
                Registrarse
              </button>
              
            </div>
          </form>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <p className="text-sm font-normal text-black">
          ¿Ya tienes cuenta?
            <span className="font-semibold underline underline-offset-2 cursor-pointer">
              <a
                href="/login"
                className="text-blue-800 underline underline-offset-2 px-1"
              >
                Inicia Sesión!
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;