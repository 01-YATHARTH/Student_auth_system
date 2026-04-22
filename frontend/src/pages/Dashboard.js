import React, { useEffect } from "react";
import axios from "axios";

function Dashboard() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          "https://student-auth-system-b8k8.onrender.com/api/me",
          {
            headers: {
              Authorization: token,
            },
          }
        );

        console.log(res.data);
      } catch (err) {
        console.log("Error fetching data");
      }
    };

    fetchData();
  }, []);

  return <h2>Dashboard</h2>;
}

export default Dashboard;