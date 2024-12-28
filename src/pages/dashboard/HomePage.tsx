import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">

      {/* Banner Image */}
      <div className="w-full h-64 bg-cover bg-center">
        <div className="flex justify-center items-center w-full h-full bg-black bg-opacity-50">
          <h1 className="text-white text-4xl font-bold">Welcome to Admin Dashboard</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center mt-8">
        <h2 className="text-2xl text-gray-800 font-semibold mb-4">Manage Your App Effectively</h2>
        <p className="text-lg text-gray-600 text-center mb-6">
          This is your admin dashboard where you can manage users, view reports, and configure settings.
        </p>
        
        {/* <button className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-200">
          Get Started
        </button> */}
      </div>
      
    </div>
  );
};

export default HomePage;
