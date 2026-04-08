function Success() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">

        {/* ICON */}
        <div className="flex justify-center mb-4">
          <div className="bg-green-100 text-green-600 p-4 rounded-full text-4xl">
            🎉
          </div>
        </div>

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-darkText mb-2">
          Application Submitted!
        </h2>

        {/* MESSAGE */}
        <p className="text-gray-500 mb-4">
          Your application has been successfully received.
        </p>

        <p className="text-sm text-gray-400 mb-6">
          We will review your submission and notify you soon.
        </p>

        {/* ACTION BUTTON */}
        <button
          onClick={() => window.location.href = "/"}
          className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:opacity-90 transition"
        >
          Go to Home
        </button>

      </div>
    </div>
  );
}

export default Success;