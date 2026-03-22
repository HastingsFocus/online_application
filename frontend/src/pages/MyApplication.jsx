import { useEffect, useState } from "react";
import API from "../services/api";

function MyApplication() {

  const [application, setApplication] = useState(null);

  useEffect(() => {

    const fetchApplication = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await API.get(
          "/applications/my",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setApplication(res.data);

      } catch (error) {

        console.error(error);

      }

    };

    fetchApplication();

  }, []);

  if (!application) {

    return <div className="text-center mt-20">
      No application submitted yet
    </div>;

  }

  return (

    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 shadow rounded">

      <h2 className="text-2xl font-bold mb-4">
        My Application
      </h2>

      <p><b>Name:</b> {application.fullName}</p>
      <p><b>Program:</b> {application.program?.name}</p>
      <p><b>Status:</b> {application.status}</p>
      <p><b>Total Points:</b> {application.totalPoints}</p>

    </div>

  );
}

export default MyApplication;