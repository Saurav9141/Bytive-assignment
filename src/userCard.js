import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaEdit,
  FaTrash,
  FaEnvelope,
  FaPhone,
  FaGlobe,
} from "react-icons/fa";
import "./userCard.css";

const UserCard = () => {
  const [users, setUsers] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
  });
  const [likedUsers, setLikedUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => setUsers(data));
  }, []);

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this card?")) {
      setUsers(users.filter((_, i) => i !== index));
    }
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setFormData(users[index]);
  };

  const handleCloseModal = () => {
    setEditingIndex(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check for a valid URL
    const urlPattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator

    if (!urlPattern.test(formData.website)) {
      alert("Please enter a valid URL.");
      return;
    }

    setUsers(
      users.map((user, i) =>
        i === editingIndex ? { ...user, ...formData } : user
      )
    );
    setEditingIndex(null);
  };

  const handleLike = (index) => {
    setLikedUsers((prevState) =>
      prevState.includes(index)
        ? prevState.filter((i) => i !== index)
        : [...prevState, index]
    );
  };

  if (users.length === 0) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="user-cards-container">
      {users.map((user, index) => (
        <div key={user.id} className="user-card">
          <div className="avatar-placeholder">
            <img
              src={`https://avatars.dicebear.com/v2/avataaars/${user?.username}.svg?options`}
              alt="Avatar"
            />
          </div>
          <div className="user-info">
            <h2>{user.name}</h2>
            <p>
              <FaEnvelope className="info-icon" /> Email:{" "}
              <a href={`mailto:${user.email}`}>{user.email}</a>
            </p>
            <p>
              <FaPhone className="info-icon" /> Phone: {user.phone}
            </p>
            <p>
              <FaGlobe className="info-icon" /> Website:{" "}
              <a
                href={`http://${user.website}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {user.website}
              </a>
            </p>
          </div>
          <div className="separator"></div>
          <div className="actions">
            <div className="action-item">
              <FaHeart
                className={`icon ${likedUsers.includes(index) ? "liked" : ""}`}
                onClick={() => handleLike(index)}
              />
            </div>
            <div className="action-item">
              <FaEdit className="icon" onClick={() => handleEdit(index)} />
            </div>
            <div className="action-item">
              <FaTrash className="icon" onClick={() => handleDelete(index)} />
            </div>
          </div>
        </div>
      ))}

      {/* Edit Modal */}
      {editingIndex !== null && (
        <div className="modal">
          <div className="modal-content">
            <h2>Basic Model</h2>
            <div className="line"></div>
            <form onSubmit={handleSubmit}>
              <label>
                <div className="sideBy">
                  <div>
                    <span className="star">*</span>
                    Name:
                  </div>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>
              <label>
                <div className="sideBy">
                  <div>
                    <span className="star">*</span>
                    Email:
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>
              <label>
                <div className="sideBy">
                  <div>
                    <span className="star">*</span>
                    Phone:
                  </div>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>
              <label>
                <div className="sideBy">
                  <div>
                    <span className="star">*</span>
                    Website:
                  </div>
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    required
                  />
                </div>
              </label>
              <div className="line"></div>
              <div className="modal-buttons">
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit">OK</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
