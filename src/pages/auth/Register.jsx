import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { handleRegister } from "../../services/auth.api.routes";

const Register = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit((data) => handleRegister(data, navigate))}
        className="bg-white shadow-md w-[500px] rounded px-8 pt-6 pb-8 mb-4"
      >
        <h1 className="mb-6 text-2xl font-bold text-center">Registro</h1>
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="username"
            placeholder="Nombre de Usuario"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register("username", {
              required: "El campo es requerido.",
              minLength: {
                value: 4,
                message:
                  "El nombre de usuario debe tener al menos 4 caracteres.",
              },
            })}
          />
          {errors.username && (
            <p className="text-red-800">{errors.username.message}</p>
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
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Registrarse
        </button>
      <span className="pl-4">¿Ya tienes cuenta? <a href="/login" className="text-blue-800 underline underline-offset-2" >Ingresa</a></span>
      </form>

    </div>
  );
};

export default Register;
