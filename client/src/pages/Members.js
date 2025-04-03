import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Members.css";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editId, setEditId] = useState(null); // Track editing member ID
  const [showModal, setShowModal] = useState(false); // Toggle modal

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/members");
      setMembers(res.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };

  const addMember = async () => {
    if (!name || !email) return alert("Please fill all fields");
    try {
      await axios.post("http://localhost:5000/api/members/add", { name, email });
      fetchMembers();
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  const deleteMember = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/members/delete/${id}`);
      fetchMembers();
    } catch (error) {
      console.error("Error deleting member:", error);
    }
  };

  // Open edit modal with existing member details
  const openEditModal = (member) => {
    setEditId(member._id);
    setName(member.name);
    setEmail(member.email);
    setShowModal(true);
  };

  // Submit edited member details
  const editMember = async () => {
    if (!name || !email) return alert("Please fill all fields");
    try {
      await axios.put(`http://localhost:5000/api/members/edit/${editId}`, { name, email });
      fetchMembers();
      setShowModal(false);
      setEditId(null);
      setName("");
      setEmail("");
    } catch (error) {
      console.error("Error editing member:", error);
    }
  };

  return (
    <div className="members-container">
      <h2>👥 Members</h2>
      <div className="add-member-form">
        <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <button onClick={addMember}> Add Member</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member._id}>
              <td>{member.memberId}</td>
              <td>{member.name}</td>
              <td>{member.email}</td>
              <td>
                <button className="edit-btn" onClick={() => openEditModal(member)}>Edit</button>
                <button className="delete-btn" onClick={() => deleteMember(member._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Member</h3>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button onClick={editMember}> Save</button>
            <button className="close-btn" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
