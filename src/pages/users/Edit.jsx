import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../../contexts/GlobalContext";
import { handleEdit, handleUpdate } from "../../services/user.api.routes";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, setUser, showNotification } = useGlobalContext();
  const [ success, setSuccess ] = useState();
  const [ error, setError ] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      const { response, success, error } = await handleEdit(id);
      if (response?.user) {
        setUser(response.user);
      }
      setError(error);
      setSuccess(success);
    }

    fetchUser();
  }, []);

  useEffect(() => {
    if (success){
      showNotification(success, true);
    }

    if(error){
      showNotification(error, false);
    }
  }, [success, error, showNotification])

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { success, error } = await handleUpdate(id, user);
    setError(error);
    setSuccess(success);
    await new Promise((resolve) => setTimeout(resolve, 100));
    navigate('/users');
  };

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  return (
    <div>
      <h2>Edit User</h2>
      {user && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            Username:
            <input
              id="username"
              type="text"
              name="username"
              value={user.username}
              onChange={handleChange}
            />
          </label>
          <label htmlFor="email">
            Email:
            <input
              id="email"
              type="text"
              name="email"
              value={user.email}
              onChange={handleChange}
            />
          </label>
          <button type="submit">Save</button>
        </form>
      )}
    </div>
  );
}

export default UserEdit;
