import AdminSidebar from '../components/AdminSidebar';
import Theme from '../components/Theme';

function Settings() {
    return (
        <div className="flex">
            {/* Sidebar */}
                <AdminSidebar/>
          
            {/* Main Content */}
            <div className="p-6 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-6">Settings</h1>

                {/* Navigation Tabs */}
                <div className="space-y-6">
                    {/* My Account Section */}
                    <div className="p-5 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-semibold mb-4">My Account</h2>
                        <div className="space-y-4">
                            {/* Display Name */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">Display Name</h3>
                                    <p>Mars</p>
                                </div>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                                    Edit
                                </button>
                            </div>
                            {/* Username */}
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-medium">Username</h3>
                                    <p>da_marsu</p>
                                </div>
                                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg">
                                    Edit
                                </button>
                            </div>
                        
                        </div>
                    </div>

                    {/* Theme Section */}
                    <Theme />

                    {/* Change Password Section */}
                    <div className="p-5 rounded-lg shadow-lg">
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

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;
