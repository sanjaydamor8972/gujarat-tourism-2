import { useEffect, useState } from "react";
import axios from "axios";

function AdminDashboard() {
  const [places, setPlaces] = useState([]);
  const [form, setForm] = useState({
    name: "",
    location: "",
    description: "",
    image: ""
  });

  const token = localStorage.getItem("token");

  const fetchPlaces = () => {
    axios.get("http://localhost:5000/api/places")
      .then(res => setPlaces(res.data));
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  const addPlace = async () => {
    await axios.post("http://localhost:5000/api/places", form, {
      headers: { Authorization: token }
    });
    fetchPlaces();
  };

  const deletePlace = async (id) => {
    await axios.delete(`http://localhost:5000/api/places/${id}`, {
      headers: { Authorization: token }
    });
    fetchPlaces();
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Add Place</h2>
      <input placeholder="Name" onChange={e => setForm({...form, name: e.target.value})} />
      <input placeholder="Location" onChange={e => setForm({...form, location: e.target.value})} />
      <input placeholder="Image URL" onChange={e => setForm({...form, image: e.target.value})} />
      <button onClick={addPlace}>Add</button>

      <h2>All Places</h2>
      {places.map(p => (
        <div key={p._id}>
          <h3>{p.name}</h3>
          <button onClick={() => deletePlace(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default AdminDashboard;