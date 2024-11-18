import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar'; // Import AdminSidebar here
import Theme from '../components/Theme';

function Settings() {
    const [profilePicture, setProfilePicture] = useState('/path/to/default-profile-picture.jpg');
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false); // State to show enlarged image modal

    // Load profile picture, displayName, and username from localStorage on component mount
    useEffect(() => {
        const savedProfilePicture = localStorage.getItem('profilePicture');
        const savedDisplayName = localStorage.getItem('displayName');
        const savedUsername = localStorage.getItem('username');
        
        if (savedProfilePicture) {
            setProfilePicture(savedProfilePicture);
        }
        if (savedDisplayName) {
            setDisplayName(savedDisplayName);
        }
        if (savedUsername) {
            setUsername(savedUsername);
        }
    }, []);

    // Function to extract initials from display name
    const getInitials = (name) => {
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
        return initials;
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            // Convert the file to base64
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setProfilePicture(imageUrl);
                localStorage.setItem('profilePicture', imageUrl); // Save to localStorage
            };

            reader.readAsDataURL(file);
        }
    };

    const handleDisplayNameChange = (event) => {
        setDisplayName(event.target.value);
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
    };

    const saveChanges = () => {
        // Save displayName, username to localStorage
        localStorage.setItem('displayName', displayName);
        localStorage.setItem('username', username);
        // Close modal
        setShowEditModal(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Handle actions in the dropdown menu
    const handleDropdownAction = (action) => {
        // Close the dropdown first
        setIsDropdownOpen(false);

        if (action === 'change') {
            document.getElementById('profile-picture-input').click(); // Trigger the file input
        } else if (action === 'remove') {
            setProfilePicture('/path/to/default-profile-picture.jpg');
            localStorage.removeItem('profilePicture');
        } else if (action === 'see') {
            setShowImageModal(true); // Show the enlarged image modal
        }
    };

    // Close the modal for enlarged image
    const closeImageModal = () => {
        setShowImageModal(false);
    };

    return (
        <div className="flex">
            {/* Pass profilePicture as a prop to AdminSidebar */}
            <AdminSidebar profilePicture={profilePicture} displayName={displayName} />

            {/* Main Content */}
            <div className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-6">Settings</h1>

                {/* Navigation Tabs */}
                <div className="space-y-6">
                    {/* My Account Section */}
                    <div className="p-5 rounded-lg shadow-lg bg-white">
                        <div className="flex items-center justify-between mb-6">
                            {/* Profile Picture and Name */}
                            <div className="flex items-center space-x">
                                {profilePicture === '/path/to/default-profile-picture.jpg' ? (
                                    <div className="w-20 h-20 bg-gray-400 text-white flex items-center justify-center rounded-full font-bold">
                                        {getInitials(displayName)}
                                    </div>
                                ) : (
                                    <img
                                        src={profilePicture}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                )} 
                                
                                {/* Edit pencil */}
                                <div className="relative left-[-30px] top-[25px]">
                                    <img
                                        src="./src/assets/edit.png"
                                        className="w-[32px] h-[32px] bg-gray-100 shadow-sm rounded-[50%] p-2 cursor-pointer hover:bg-white"
                                        onClick={toggleDropdown}
                                    />

                                    {isDropdownOpen && (
                                        <div className="absolute top-[35px] left-[5px] bg-white shadow-lg rounded-lg w-[200px] p-2">
                                            <ul>
                                                <li
                                                    className="cursor-pointer text-gray-800 hover:bg-gray-200 p-2 rounded"
                                                    onClick={() => handleDropdownAction('see')}
                                                >
                                                    See Profile Picture
                                                </li>
                                                <li
                                                    className="cursor-pointer text-gray-800 hover:bg-gray-200 p-2 rounded"
                                                    onClick={() => setShowEditModal(true)}
                                                >
                                                    Change Profile Picture
                                                </li>
                                                <li
                                                    className="cursor-pointer text-gray-800 hover:bg-gray-200 p-2 rounded"
                                                    onClick={() => handleDropdownAction('remove')}
                                                >
                                                    Remove Profile Picture
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-semibold text-gray-800">{displayName}</h1>
                            </div>

                            {/* Edit User Profile Button */}
                            <button
                                onClick={() => setShowEditModal(true)}
                                className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white font-medium px-4 py-2 rounded-lg"
                            >
                                Edit User Profile
                            </button>
                        </div>

                        {/* Editable Fields */}
                        <div className="p-6 bg-gray-100 rounded-md">
                            <div className="space-y-4">
                                {/* Display Name */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Display Name</h3>
                                        <p className="text-gray-600">{displayName}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white font-medium px-4 py-2 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                </div>
                                {/* Username */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800">Username</h3>
                                        <p className="text-gray-600">{username}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(true)} // Show modal for editing
                                        className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white font-medium px-4 py-2 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Theme Section */}
                    <Theme />

                    {/* Change Password Section */}
                    <div className="p-5 rounded-lg shadow-lg bg-white">
                        <h2 className="text-2xl font-semibold mb-4">Change Password</h2>
                        <div className="space-y-4">
                            {/* Select Account */}
                            <div>
                                <label
                                    htmlFor="select-account"
                                    className="block text-lg font-medium mb-2"
                                >
                                    Select Account
                                </label>
                                <select
                                    id="select-account"
                                    className="w-full border rounded-lg p-2"
                                >
                                    <option value="personal">Select</option>
                                    <option value="work">Admin</option>
                                    <option value="other">Employee</option>
                                </select>
                            </div>

                            {/* Current Password */}
                            <div>
                                <label
                                    htmlFor="current-password"
                                    className="block text-lg font-medium mb-2"
                                >
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    id="current-password"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Enter current password"
                                />
                            </div>

                            {/* New Password */}
                            <div>
                                <label
                                    htmlFor="new-password"
                                    className="block text-lg font-medium mb-2"
                                >
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="new-password"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Enter new password"
                                />
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label
                                    htmlFor="confirm-password"
                                    className="block text-lg font-medium mb-2"
                                >
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirm-password"
                                    className="w-full border rounded-lg p-2"
                                    placeholder="Confirm new password"
                                />
                            </div>

                            {/* Change Password Button */}
                            <button
                                className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white font-medium px-6 py-3 rounded-lg mt-4"
                            >
                                Change Password
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Enlarged Image */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative bg-white p-6 rounded-lg shadow-lg">
                        {/* Check if profile picture is available */}
                        {profilePicture === '/path/to/default-profile-picture.jpg' ? (
                            // Show initials if no image
                            <div className="w-[500px] h-[500px] bg-gray-400 text-white flex items-center justify-center rounded-full font-bold text-[50px]">
                                {getInitials(displayName)}
                            </div>
                        ) : (
                            // Show image if available
                            <img
                                src={profilePicture}
                                alt="Enlarged Profile"
                                className="w-[200px] h-[200px] object-cover rounded-full"
                            />
                        )}
                        
                        {/* Close button */}
                        <button
                            onClick={closeImageModal}
                            className="absolute top-4 right-4 bg-white text-black rounded-full p-2"
                        >
                            <img src="src/assets/close.png" className="w-5 h-5" alt="Close" />
                        </button>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
                        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>

                        {/* Profile Picture Input */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                            />
                        </div>

                        {/* Display Name Input */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={handleDisplayNameChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Username Input */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                className="w-full p-2 border border-gray-300 rounded-lg"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveChanges}
                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Settings;
