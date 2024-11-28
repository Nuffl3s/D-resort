// utils/themeHandler.js
export const applyTheme = () => {
    const savedTheme = localStorage.getItem('isDarkMode');
    const isDarkMode = savedTheme ? JSON.parse(savedTheme) : false;

    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }

    return isDarkMode;
};

export const saveTheme = (isDarkMode) => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    document.documentElement.classList.toggle('dark', isDarkMode);
};
