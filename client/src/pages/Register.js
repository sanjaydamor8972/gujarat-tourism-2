import { useState } from "react";
import axios from "axios";

function Register() {
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async () => {
    await axios.post("http://localhost:5000/api/users/register", data);
    alert("Registered");
  };

  return (
    <div>
      <input placeholder="Name" onChange={e => setData({...data, name: e.target.value})} />
      <input placeholder="Email" onChange={e => setData({...data, email: e.target.value})} />
      <input type="password" placeholder="Password" onChange={e => setData({...data, password: e.target.value})} />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default Register;