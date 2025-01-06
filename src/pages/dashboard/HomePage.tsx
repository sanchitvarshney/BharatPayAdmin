import { FiUsers, FiSettings } from "react-icons/fi";
import { IoLocationSharp } from "react-icons/io5";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Banner Image */}
      <div 
        className="w-full h-[250px] bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/80 to-purple-600/80">
          <div className="flex flex-col justify-center items-center h-full text-center px-4">
            <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Welcome to Admin Dashboard</h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl">
              Manage your application with powerful tools and real-time analytics
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow container mx-auto px-4 py-12 overflow-auto"> {/* Added flex-grow and overflow-auto */}
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-800 font-bold mb-4">Manage Your App Effectively</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This is your admin dashboard where you can manage users, view locations, and configure settings.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
              <FiUsers className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">User Management</h3>
            <p className="text-gray-600">Manage user accounts, permissions, and roles with ease.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mb-4">
              <IoLocationSharp className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Analytics</h3>
            <p className="text-gray-600">Track and manage locations with ease, view locations.</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 transition duration-300 hover:shadow-xl">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
              <FiSettings className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Settings</h3>
            <p className="text-gray-600">Configure system settings and customize your dashboard.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
