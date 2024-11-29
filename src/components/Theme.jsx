import PropTypes from 'prop-types'; // Import PropTypes

function Theme({ isDarkMode, onToggleTheme }) {
    const handleThemeChange = (event) => {
        const isDark = event.target.value === 'dark';
        console.log("Toggling theme to:", isDark); // Add console log to verify if the state is being toggled
        onToggleTheme(isDark);
    };
    
    return (
        <div className="p-5 rounded-lg shadow-lg bg-white dark:bg-[#374151]">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Theme</h2>
            <div className="rounded-md space-y-2 p-6 bg-gray-100 dark:bg-[#1f2937]">
                <label className="flex items-center text-gray-800 dark:text-white">
                    <input
                        type="radio"
                        name="theme"
                        value="light"
                        className="mr-2"
                        checked={!isDarkMode}
                        onChange={handleThemeChange}
                    />
                    Light
                </label>
                <label className="flex items-center text-gray-800 dark:text-white">
                    <input
                        type="radio"
                        name="theme"
                        value="dark"
                        className="mr-2"
                        checked={isDarkMode}
                        onChange={handleThemeChange}
                    />
                    Dark
                </label>
            </div>
        </div>
    );
}

Theme.propTypes = {
    isDarkMode: PropTypes.bool.isRequired, // Validate isDarkMode as a boolean
    onToggleTheme: PropTypes.func.isRequired // Validate onToggleTheme as a function
};

export default Theme;
