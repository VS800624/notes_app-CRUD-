import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      
      {/* Big 404 */}
      <h1 className="text-9xl font-extrabold text-indigo-600 tracking-widest">
        404
      </h1>

      {/* Divider */}
      <div className="bg-indigo-600 h-1 w-24 my-6 rounded"></div>

      {/* Message */}
      <h2 className="text-3xl font-semibold text-gray-800 mb-2">
        Page Not Found
      </h2>

      <p className="text-gray-600 text-center max-w-md mb-6">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="px-6 py-3 text-white bg-indigo-600 rounded-lg shadow-md 
                   hover:bg-indigo-700 transition duration-300 ease-in-out"
      >
        Go Back Home
      </Link>

    </div>
  );
};

export default NotFound;
