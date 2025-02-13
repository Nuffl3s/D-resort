import { useEffect } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import { applyTheme } from '../components/themeHandlers';

function AdminReport () {
    useEffect(() => {
        applyTheme();
    }, []);

    return (
        <div className="flex bg-gray-100 dark:bg-[#111827] ">
            <AdminSidebar />
            <div id="report" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4 dark:text-[#e7e6e6]">SALES REPORT</h1>
                <div className="bg-white p-8 rounded-md w-full border-2 border-gray-400 mt-[50px] dark:bg-[#676767]">
                    <h1 className="text-center font-semibold">No report yet</h1>
                </div>
            </div>
        </div>
    );
}

export default AdminReport;