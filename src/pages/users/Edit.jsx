import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import { toast } from 'react-toastify';

function UserEdit() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchUser = async (id) => {
    try {
      const response = await axios.get(
        `http://localhost:3001/api/users/edit/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setUsername(response.data.user.username);
      setEmail(response.data.user.email);
    } catch (error) {
      localStorage.setItem('errorMessage', error.response.data.message);
      navigate('/users');
    }
  };

  useEffect(() => {
    if (!username) {
      fetchUser(id);
    }
  }, [id, navigate]);

  const saveUserChanges = async (id, username, email) => {
    try {
      await axios.put(
        `http://localhost:3001/api/users/edit/${id}`,
        { username, email },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.setItem('successMessage', 'Usuario actualizado correctamente');
      navigate('/users');
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveUserChanges(id, username, email);
  };

  return (
    <div>
      <h2>Edit User</h2>
      {username && (
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
          </label>
          <label>
            Email:
            <input
              type="text"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}

export default UserEdit;
