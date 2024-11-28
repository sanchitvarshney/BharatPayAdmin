import { useState } from 'react';

const UserProfile = () => {
  // Sample user data
  const [user, setUser] = useState({
    name: 'John Doe',
    username: '@johndoe',
    email: 'johndoe@example.com',
    mobile: '+1234567890',
    bio: 'Software Developer | Tech Enthusiast | Blogger',
    profilePicture: 'https://www.w3schools.com/w3images/avatar2.png',
    is2faActive: false,
  });

  // Modal and form states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [is2faActive, setIs2faActive] = useState(user.is2faActive);

  // Form states for editing profile
  const [newName, setNewName] = useState(user.name);
  const [newEmail, setNewEmail] = useState(user.email);
  const [newMobile, setNewMobile] = useState(user.mobile);
  const [newBio, setNewBio] = useState(user.bio);

  // Form states for changing password
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Toggle 2FA
  const toggle2FA = () => {
    setIs2faActive(!is2faActive);
    alert(`2FA has been ${!is2faActive ? 'enabled' : 'disabled'}`);
  };

  // Handle Edit Profile form submission
  const handleEditProfileSubmit = (e:any) => {
    e.preventDefault();
    setUser({
      ...user,
      name: newName,
      email: newEmail,
      mobile: newMobile,
      bio: newBio,
    });
    setIsEditModalOpen(false);
  };

  // Handle Change Password form submission
  const handleChangePasswordSubmit = (e:any) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
    } else {
      alert('Password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
      setIsChangePasswordModalOpen(false);
    }
  };

  return (
    <div className=" bg-gray-100 flex justify-center items-center p-4">
      <div className="bg-white w-full p-6 rounded-lg shadow-lg h-screen">
        {/* Profile Picture */}
        <div className="flex justify-center mb-6">
          <img
            src={user.profilePicture}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-gray-200"
          />
        </div>

        {/* Profile Info */}
        <div className="text-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">{user.name}</h2>
          <p className="text-sm text-gray-500">{user.username}</p>
        </div>

        {/* User Info */}
        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Mobile:</span>
            <span className="text-gray-800">{user.mobile}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-600">Bio:</span>
            <span className="text-gray-800">{user.bio}</span>
          </div>
        </div>

        {/* Edit Profile, Change Password, Toggle 2FA */}
        <div className="space-x-2 text-center mb-6 pt-20">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="bg-blue-500 text-white py-2 px-6 rounded-full hover:bg-blue-600 transition duration-200"
          >
            Edit Profile
          </button>
          <button
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="bg-green-500 text-white py-2 px-6 rounded-full hover:bg-green-600 transition duration-200"
          >
            Change Password
          </button>
          <button
            onClick={toggle2FA}
            className={`py-2 px-6 rounded-full ${
              is2faActive ? 'bg-red-500' : 'bg-yellow-500'
            } text-white hover:bg-opacity-90 transition duration-200`}
          >
            {is2faActive ? 'Disable 2FA' : 'Enable 2FA'}
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Profile</h2>
            <form onSubmit={handleEditProfileSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600">Name</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600">Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600">Mobile</label>
                <input
                  type="text"
                  value={newMobile}
                  onChange={(e) => setNewMobile(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600">Bio</label>
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                //   rows="4"
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {isChangePasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Change Password</h2>
            <form onSubmit={handleChangePasswordSubmit}>
              <div className="mb-4">
                <label className="block text-gray-600">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-600">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setIsChangePasswordModalOpen(false)}
                  className="py-2 px-4 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
