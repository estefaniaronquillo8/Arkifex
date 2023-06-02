import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleRegister } from "../../services/user.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";

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
    const { response, success, error, notificationType } = await handleRegister(data);
    if (success){
      showNotification(success, notificationType);
    }
    
    if (error){
      showNotification(error, notificationType);
    }

    if (response?.status === 200){
      navigate("/login");
    }
  } 

 
  return (
    <div className="min-h-screen py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20 w-[450px]">
          <form
            onSubmit={handleSubmit(async (data) => await registerHandler(data))}
          >
            <h1 className="mb-6 text-2xl font-bold text-center">Registro</h1>
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
              <span className="text-center">
                ¿Ya tienes cuenta?
                <a
                  href="/login"
                  className="text-blue-800 underline underline-offset-2 px-1"
                >
                  Ingresa
                </a>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
