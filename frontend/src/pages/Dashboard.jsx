import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Dashboard() {

  const context = useContext(AuthContext);

  // Prevent crash if AuthContext is missing
  if (!context) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-red-500 text-lg">
          Error: AuthContext is not available. Did you wrap App with AuthProvider?
        </p>
      </div>
    );
  }

  const { user, logout, loading } = context;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-gray-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gray-100 p-10">

      <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow">

        <h1 className="text-3xl font-bold mb-4">
          Welcome {user?.name || "Student"}
        </h1>

        <p className="mb-6 text-gray-600">
          Student Admission Portal
        </p>

        <div className="flex gap-4">

          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Apply Now
          </Link>

          <Link
            to="/my-application"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            My Application
          </Link>

          {user && (
            <button
              onClick={logout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Logout
            </button>
          )}

        </div>

      </div>

    </div>

  );
}

export default Dashboard;