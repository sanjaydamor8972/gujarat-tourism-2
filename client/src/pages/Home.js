import { useEffect, useState } from "react";
import axios from "axios";

function Home() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/places")
      .then(res => setPlaces(res.data));
  }, []);

  return (
    <div>
      <h1>Gujarat Tourism</h1>
      {places.map((p) => (
        <div key={p._id}>
          <h2>{p.name}</h2>
          <p>{p.location}</p>
          <img src={p.image} width="200" alt="" />
        </div>
      ))}
    </div>
  );
}

export default Home;