import { useState, useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar'; // Import AdminSidebar here
import Theme from '../components/Theme';
import { applyTheme, saveTheme } from '../components/themeHandlers';


function Settings() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [profilePicture, setProfilePicture] = useState('/path/to/default-profile-picture.jpg');
    const [displayName, setDisplayName] = useState('');
    const [username, setUsername] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false); // State to show enlarged image modal

    useEffect(() => {
    const savedTheme = localStorage.getItem('isDarkMode');
    if (savedTheme) {
        setIsDarkMode(JSON.parse(savedTheme)); // Apply saved theme
    }
}, []);


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

    const getInitials = (name) => {
        const nameParts = name.split(' ');
        const initials = nameParts.map(part => part.charAt(0).toUpperCase()).join('');
        return initials;
    };

    const handleProfileImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onloadend = () => {
                const imageUrl = reader.result;
                setProfilePicture(imageUrl);
                localStorage.setItem('profilePicture', imageUrl);
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
        localStorage.setItem('displayName', displayName);
        localStorage.setItem('username', username);
        setShowEditModal(false);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleDropdownAction = (action) => {
        setIsDropdownOpen(false);

        if (action === 'change') {
            document.getElementById('profile-picture-input').click();
        } else if (action === 'remove') {
            setProfilePicture('/path/to/default-profile-picture.jpg');
            localStorage.removeItem('profilePicture');
        } else if (action === 'see') {
            setShowImageModal(true);
        }
    };

    const closeImageModal = () => {
        setShowImageModal(false);
    };

    useEffect(() => {
        const theme = applyTheme();
        setIsDarkMode(theme);
    }, []);

    const toggleDarkMode = (enabled) => {
        setIsDarkMode(enabled);
        saveTheme(enabled);
    };

    return (
        <div className={`flex bg-gray-100 dark:bg-[#111827]`}>
            <AdminSidebar profilePicture={profilePicture} displayName={displayName} />

            <div className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-6 text-black dark:text-[#e7e6e6]">SETTINGS</h1>

                <div className="space-y-6">
                    <div className="p-5 rounded-lg shadow-lg bg-white dark:bg-[#374151]">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center">
                                {profilePicture === '/path/to/default-profile-picture.jpg' ? (
                                    <div className="w-20 h-20 flex items-center justify-center rounded-full font-bold text-black bg-gray-300 dark:text-[#e7e6e6] dark:bg-[gray-400]">
                                        {getInitials(displayName)}
                                    </div>
                                ) : (
                                    <img
                                        src={profilePicture}
                                        alt="Profile"
                                        className="w-20 h-20 rounded-full object-cover"
                                    />
                                )}
                                
                                <div className="relative left-[-30px] top-[25px]">
                                    <img
                                        src="./src/assets/edit.png"
                                        className="w-[32px] h-[32px] bg-gray-100 shadow-sm rounded-full p-2 cursor-pointer hover:bg-white"
                                        onClick={toggleDropdown}
                                    />
                                    {isDropdownOpen && (
                                        <div className="absolute top-[35px] left-[5px] bg-white dark:bg-[#374151] dark:border-gray-600 dark:border bo shadow-lg rounded-lg w-[200px] p-2">
                                            <ul>
                                                <li
                                                    className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded"
                                                    onClick={() => handleDropdownAction('see')}
                                                >
                                                    See Profile Picture
                                                </li>
                                                <li
                                                    className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded"
                                                    onClick={() => setShowEditModal(true)}
                                                >
                                                    Change Profile Picture
                                                </li>
                                                <li
                                                    className="cursor-pointer text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 p-2 rounded"
                                                    onClick={() => handleDropdownAction('remove')}
                                                >
                                                    Remove Profile Picture
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <h1 className="text-2xl font-semibold text-gray-800 dark:text-[#e7e6e6]">{displayName}</h1>
                            </div>

                            <button
                                onClick={() => setShowEditModal(true)}
                                className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white font-medium px-4 py-2 rounded-lg"
                            >
                                Edit User Profile
                            </button>
                        </div>

                        <div className="p-6 rounded-md bg-gray-100 dark:bg-[#1f2937]">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-[#e7e6e6]">Display Name</h3>
                                        <p className="text-md font-normal text-gray-600 dark:text-gray-100">{displayName}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white font-medium px-4 py-2 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-800 dark:text-[#e7e6e6]">Username</h3>
                                        <p className="text-md font-normal text-gray-600 dark:text-gray-100">{username}</p>
                                    </div>
                                    <button
                                        onClick={() => setShowEditModal(true)}
                                        className="bg-[#70b8d3] hover:bg-[#62c5e9] text-white font-medium px-4 py-2 rounded-lg"
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Theme isDarkMode={isDarkMode} onToggleTheme={toggleDarkMode}/>

                    {/* Change Password Section */}
                </div>
            </div>

            {/* Modal for Enlarged Image */}
            {showImageModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="relative dark:bg-[#303030] bg-white p-6 rounded-lg shadow-lg">
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
                    <div className="p-6 rounded-lg shadow-lg w-[400px] dark:bg-[#1f2937] bg-white">
                        <h2 className="text-xl font-semibold mb-4 dark:text-[#e7e6e6] text-black">Edit Profile</h2>

                        {/* Profile Picture Input */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2 dark:text-[#e7e6e6] text-black">Profile Picture</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleProfileImageChange}
                                className="block w-full text-sm text-gray-900 border dark:border-gray-600 dark:bg-[#1f2937] bg-gray-50 border-gray-300 rounded-lg cursor-pointer focus:outline-none"
                            />
                        </div>

                        {/* Display Name Input */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2 dark:text-[#e7e6e6] text-black">Display Name</label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={handleDisplayNameChange}
                                className="w-full p-2 border dark:bg-[#1f2937] dark:text-[#e7e6e6] bg-gray-100 text-black border-gray-400 rounded-lg"
                            />
                        </div>

                        {/* Username Input */}
                        <div className="mb-4">
                            <label className="block text-lg font-medium mb-2 dark:text-[#e7e6e6] text-black">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={handleUsernameChange}
                                className="w-full p-2 border dark:bg-[#1f2937] dark:text-[#e7e6e6] bg-gray-100 text-black border-gray-400 rounded-lg"
                            />
                        </div>

                        {/* Buttons */}
                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg mr-2 dark:text-[#e7e6e6]"
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
