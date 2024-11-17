import { useState, useEffect, useCallback } from 'react';

function Theme() {
    const [theme, setTheme] = useState('light'); // Default theme is light

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light'; // default to light if not set
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    // Function to apply the theme globally
    const applyTheme = useCallback((theme) => {
        if (theme === 'dark') {
            document.body.classList.add('bg-gray-900', 'text-white');
            document.body.classList.remove('bg-white', 'text-gray-900');
        } else {
            document.body.classList.add('bg-white', 'text-gray-900');
            document.body.classList.remove('bg-gray-900', 'text-white');
            document.body.classList.remove('bg-gray-800', 'text-white');

        }
    }, []);

    // Handle theme change
    const handleThemeChange = (event) => {
        const selectedTheme = event.target.value;
        setTheme(selectedTheme);
        applyTheme(selectedTheme);
        localStorage.setItem('theme', selectedTheme);
    };

    return (
        <div className="p-5 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Theme</h2>
            <div className="space-y-2">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="theme"
                        value="light"
                        className="mr-2"
                        checked={theme === 'light'}
                        onChange={handleThemeChange}
                        aria-label="Light theme"
                    />
                    Light
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name="theme"
                        value="dark"
                        className="mr-2"
                        checked={theme === 'dark'}
                        onChange={handleThemeChange}
                        aria-label="Dark theme"
                    />
                    Dark
                </label>
            </div>
        </div>
    );
}

export default Theme;
