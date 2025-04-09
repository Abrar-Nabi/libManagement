import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Members.css";
import "../styles/global.css";

const LibrarianUserManagement = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    try {
      await axios.post("http://localhost:5000/api/users/users", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Failed to add user:", error);
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const handleEdit = (user) => {
    setEditingId(user._id);
    setFormData({ name: user.name, email: user.email, password: "" });
    setShowModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      await axios.put(`http://localhost:5000/api/users/users/${editingId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
      setShowModal(false);
      setEditingId(null);
      setFormData({ name: "", email: "", password: "" });
    } catch (error) {
      console.error("Failed to update user:", error);
    }
  };

  return (
    <div className="members-container">
      <button className="float-add-btn" onClick={() => setShowAddForm(true)}>Add User</button>
      <h2>Members</h2>


{showAddForm && (
  <div className="modal">
    <div className="modal-content">
      <h3>Add New User</h3>
      <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
      <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} />
      <button onClick={async () => {
        await handleAddUser();
        setShowAddForm(false);
      }}>Add</button>
      <button className="close-btn" onClick={() => setShowAddForm(false)}>Cancel</button>
    </div>
  </div>
)}

      <table className="user-table">
  <thead>
    <tr>
      <th>Members ID</th>
      <th>Name</th>
      <th>Email</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {users.map((u) => (
      <tr key={u._id}>
        <td>{u.userId}</td>
        <td>{u.name}</td>
        <td>{u.email}</td>
        <td>
          <button className="edit-btn" onClick={() => handleEdit(u)}>Edit</button>
          <button className="delete-btn" onClick={() => handleDeleteUser(u._id)}>Delete</button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <input name="name" value={formData.name} onChange={handleChange} />
            <input name="email" value={formData.email} onChange={handleChange} />
            <input name="password" type="password" value={formData.password} onChange={handleChange} />
            <button onClick={handleUpdateUser}>Save</button>
            <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LibrarianUserManagement;
