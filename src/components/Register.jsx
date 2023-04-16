import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('client');

  // await - que se siga ejecutando lo de la línea mientras se hace el resto pero que se tome su tiempo en lo de la línea

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/auth/register', { username, email, password, role });
      console.log(response);
      if (response.status !== 200) {
        toast.error(response.data.message); // Muestra el mensaje devuelto por el backend como una notificación
        return;
      }

      toast.success(response.data.message);
    } catch (error) {
      // Comprueba si hay una respuesta de error personalizada
      if (error.response) {
        // Muestra el mensaje devuelto por el backend como una notificación
        toast.error(error.response.data.message);
      } else {
        // Si no hay una respuesta personalizada, muestra un mensaje genérico
        toast.error('Error al comunicarse con el servidor');
      }
    }
  };

  // e - event
  // target - HTML tag
  // value - valor del target (esto depende de que tipo de HTML tag sea el target)

  return (
    <form onSubmit={handleSubmit}>
      <h1 className='text-10xl text-red-700'>Register</h1>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
