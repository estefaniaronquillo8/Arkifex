import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { handleLogin } from "../../services/user.api.routes";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { BsFillBuildingsFill } from "react-icons/bs";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { showNotification } = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const loginHandler = async (data) => {
    const { response, success, error, notificationType } = await handleLogin(
      data
    );

    if (success) {
      showNotification(success, notificationType);
      localStorage.setItem("token", response.token);
      navigate("/users");
    }

    if (error) {
      showNotification(error, notificationType);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row-reverse">
      <div className="w-full md:w-1/2 h-1/2 md:h-full relative">
        <img
          src="src/assets/Logingif.gif"
          className="w-full h-full object-cover"
          alt="Background"
        />
        <div className="absolute top-[14%] left-[20%] flex flex-col">
          <h1 className="text-3xl text-white font-bold my-4">
            El cambio empieza por ti...
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
              onSubmit={handleSubmit(async (data) => await loginHandler(data))}
            >
              <div className="mb-1 ">
                <label
                  htmlFor="email"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Correo Electrónico"
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
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
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className="block text-gray-700 text-sm font-bold mb-1"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Contraseña"
                  className="w-full text-black py-2 my-2 bg-transparent border-b border-black outline-none focus:outline-none"
                  {...register("password", {
                    required: "El campo es requerido.",
                    minLength: {
                      value: 6,
                      message:
                        "La contraseña debe tener al menos 6 caracteres.",
                    },
                  })}
                />
                {errors.password && (
                  <p className="text-red-800">{errors.password.message}</p>
                )}
              </div>
              <div className="w-full flex flex-col my-2">
                <button
                  type="submit"
                  className="w-full text-white my-2 font-semibold bg-black rounded-md p-4 text-center flex items-center justify-center"
                >
                  Ingresar
                </button>

                <Link to="/register">
                  <button
                    type="button"
                    className="w-full text-black my-2 font-semibold bg-white border-2 border-black rounded-md p-3 text-center flex items-center justify-center"
                  >
                    Crear Cuenta
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <p className="text-sm font-normal text-black">
            ¿Aún no tienes una cuenta?
            <span className="font-semibold underline underline-offset-2 cursor-pointer">
              <a
                href="/register"
                className="text-blue-800 underline underline-offset-2 px-1"
              >
                Registrate aqui!
              </a>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;