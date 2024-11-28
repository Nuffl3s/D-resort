import { useState } from 'react';
import BookingModal from '../Modal/BookingModal';
import ViewModal from '../Modal/ViewModal';
import Sidebar from '../components/EmployeeSidebar';
import CalendarEventModal from '../Modal/CalendarEventModal';

function EmployeeReservation () {
    const [modalBookingOpen, setModalBookingOpen] = useState(false);
    const [modalCalendarEventOpen, setModalCalendarEventOpen] = useState(false);
    const [selectedType, setSelectedType] = useState(""); 
    const [selectedDateRange, setSelectedDateRange] = useState("Last 30 days"); 
    const [dropdownOpen, setDropdownOpen] = useState(false); 
    const [dateDropdownOpen, setDateDropdownOpen] = useState(false);
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [sortOption, setSortOption] = useState(""); 
    const [sortOrder] = useState("asc"); 
    const [isViewModalOpen, setViewModalOpen] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

     // sample
     const bookings = [
        { id: 1, name: "Sablelo", type: 'Cottage', status: 'Pending', transaction: '2024-10-01', checkIn: '2024-10-01', checkOut: '2024-10-05', price: '300'},
        { id: 2, name: "Kenneth", type: 'Lodge', status: 'Checked in', transaction: '2024-10-01', checkIn: '2024-10-10', checkOut: '2024-10-15', price: '300' },
        { id: 3, name: "Angelo", type: 'Cottage', status: 'Checked out', transaction: '2024-10-01', checkIn: '2024-10-01', checkOut: '2024-10-05', price: '300' },
        { id: 4, name: "Yasay", type: 'Lodge', status: 'Checked in', transaction: '2024-10-01', checkIn: '2024-10-10', checkOut: '2024-10-15', price: '300' },
        { id: 5, name: "Flient", type: 'Cottage', status: 'Checked in', transaction: '2024-10-01', checkIn: '2024-10-01', checkOut: '2024-10-05', price: '300' },
        { id: 6, name: "Bacalso", type: 'Lodge', status: 'Pending', transaction: '2024-10-01', checkIn: '2024-10-10', checkOut: '2024-10-15', price: '300' },
        { id: 7, name: "Eman", type: 'Cottage', status: 'Checked out', transaction: '2024-10-01', checkIn: '2024-10-01', checkOut: '2024-10-05', price: '300' },
        { id: 8, name: "Daganato", type: 'Lodge', status: 'Checked out', transaction: '2024-10-01', checkIn: '2024-10-10', checkOut: '2024-10-15', price: '300' },
        { id: 9, name: "Martian", type: 'Cottage', status: 'Checked in', transaction: '2024-10-01', checkIn: '2024-10-01', checkOut: '2024-10-05', price: '300' },
        { id: 10, name: "Pookie", type: 'Lodge', status: 'Pending', transaction: '2024-10-01', checkIn: '2024-10-10', checkOut: '2024-10-15', price: '300' },
    ];
    

     // Function to handle type selection
     const handleTypeChange = (type) => {
        setSelectedType(type); // Update selected type
        setDropdownOpen(false); // Close dropdown
    };

    // Function to handle date selection
    const handleChange = (label) => {
        setSelectedDateRange(label); // Update selected date range
        setDateDropdownOpen(false); // Close dropdown
    };

    const sortBookings = (bookings) => {
        const sortedBookings = [...bookings]; // Create a copy of the bookings array
    
        if (sortOption) {
            sortedBookings.sort((a, b) => {
                let comparison = 0;
                switch (sortOption) {
                    case "Name":
                        comparison = a.name.localeCompare(b.name);
                        break;
                    case "Status":
                        comparison = a.status.localeCompare(b.status);
                        break;
                    case "Price":
                        comparison = a.price - b.price; 
                        break;
                    default:
                        break;
                }
                return sortOrder === "asc" ? comparison : -comparison;
            });
        }
        return sortedBookings;
    };

    
    // Filter bookings based on selected type
    const filteredBookings = selectedType
        ? bookings.filter(booking => booking.type === selectedType) 
        : bookings; 

        const bookingData = {
        image: "./src/assets/sample2.jpg",
        propertyName: "Luxury Villa",
        price: "$1500",
        capacity: "Good for 10 persons",
        customer: {
            name: "John Doe",
            email: "johndoe@example.com",
            phone: "+123456789",
            checkIn: "2023-10-01",
            checkOut: "2023-10-10",
        },
    };

    // Sa view ni na button
    const handleViewClick = () => {
        setSelectedBooking(bookingData); // Set the selected booking data
        setViewModalOpen(true);
    };

    const handleCloseModal = () => {
        setViewModalOpen(false);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div id="dashboard" className="p-7 pl-10 flex-1 h-screen overflow-y-auto">
                <h1 className="text-4xl font-bold mb-4">RESERVATION</h1>

                <div className="bg-white rounded-md w-full mt-5 relative">
                    <div className="bg-white rounded-md shadow-md p-6">
                        <h1 className="text-[25px] font-semibold mb-4 uppercase">Reservation List</h1>

                        <div className="w-full flex justify-between mb-5">
                            <button
                                onClick={() => setModalCalendarEventOpen(true)}
                                className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] shadow px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                            >Calendar Events
                            </button>
                            <button
                                onClick={() => setModalBookingOpen(true)}
                                className="flex items-center gap-1 bg-[#70b8d3] hover:bg-[#09B0EF] shadow px-4 py-2 rounded-md text-white font-semibold tracking-wide cursor-pointer"
                            >Book
                            </button>
                            
                            <CalendarEventModal isOpen={modalCalendarEventOpen} onClose={() => setModalCalendarEventOpen(false)} />
                            <BookingModal isOpen={modalBookingOpen} onClose={() => setModalBookingOpen(false)} />
                        </div>
                        
                        <div className="flex flex-column sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between mb-4">
                            <div className="flex space-x-2 items-center">
                                {/* Type Dropdown Button */}
                                <div className="relative">
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)} 
                                        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none font-medium rounded-md text-sm px-3 py-1.5"
                                        type="button"
                                    >
                                        {selectedType || "Select Type"} 
                                        <svg
                                            className={`w-2.5 h-2.5 ms-2.5 transform transition-transform ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 4 4 4-4"
                                            />
                                        </svg>
                                    </button>

                                    {/* Type Dropdown menu */}
                                    {dropdownOpen && (
                                        <div className="absolute z-20 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
                                            <ul className="p-3 space-y-1 text-sm text-gray-700">
                                                {['Cottage', 'Lodge'].map((label, index) => (
                                                    <li key={index}>
                                                        <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => handleTypeChange(label)}>
                                                            <span className="w-full ms-2 text-sm font-medium text-gray-900">{label}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                                <li>
                                                    <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => handleTypeChange("")}>
                                                        <span className="w-full ms-2 text-sm font-medium text-gray-900">All</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setDateDropdownOpen(!dateDropdownOpen)} // Toggle date dropdown
                                        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none font-medium rounded-md text-sm px-3 py-1.5"
                                        type="button"
                                    >
                                        {selectedDateRange} {/* Reflect selected date range */}
                                        <svg
                                            className={`w-2.5 h-2.5 ms-2.5 transform transition-transform ${dateDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 4 4 4-4"
                                            />
                                        </svg>
                                    </button>

                                    {/* Date Dropdown menu */}
                                    {dateDropdownOpen && (
                                        <div className="absolute z-20 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
                                            <ul className="p-3 space-y-1 text-sm text-gray-700">
                                                {['Today', 'Last day', 'Last 7 days', 'Last 30 days', 'Last month', 'Last year'].map((label, index) => (
                                                    <li key={index}>
                                                        <div className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer" onClick={() => handleChange(label)}>
                                                            <input
                                                                id={`filter-radio-example-${index + 1}`}
                                                                type="radio"
                                                                name="filter-radio"
                                                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
                                                            />
                                                            <label
                                                                htmlFor={`filter-radio-example-${index + 1}`}
                                                                className="w-full ms-2 text-sm font-medium text-gray-900"
                                                            >
                                                                {label}
                                                            </label>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <button
                                        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                        className="inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none font-medium rounded-md text-sm px-3 py-1.5"
                                        type="button"
                                    >
                                        {sortOption || "Sort By"}
                                        <svg
                                            className={`w-2.5 h-2.5 ms-2.5 transform transition-transform ${sortDropdownOpen ? 'rotate-180' : 'rotate-0'}`}
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 10 6"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="m1 1 4 4 4-4"
                                            />
                                        </svg>
                                    </button>

                                    {sortDropdownOpen && (
                                        <div className="absolute z-20 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow">
                                            <ul className="p-3 space-y-1 text-sm text-gray-700">
                                                {['Name', 'Status', 'Price'].map((option) => (
                                                    <li key={option}>
                                                        <div
                                                            className="flex items-center p-2 rounded hover:bg-gray-100 cursor-pointer"
                                                            onClick={() => {
                                                                setSortOption(option);
                                                                setSortDropdownOpen(false); 
                                                            }}
                                                        >
                                                            <span className="w-full ms-2 text-sm font-medium text-gray-900">{option}</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-500"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search"
                                    className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-white focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Search for items"
                                />
                            </div>
                        </div>
                        
    
                        <div className="max-h-[600px] overflow-y-auto">
                            <table className="w-full text-sm text-left text-gray-500">
                                <thead className="sticky top-0 text-xs text-gray-700 uppercase bg-gray-100 z-10">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">No.</th>
                                        <th scope="col" className="px-6 py-3">Name</th>
                                        <th scope="col" className="px-6 py-3">Type</th>
                                        <th scope="col" className="px-6 py-3">Transaction date</th>
                                        <th scope="col" className="px-6 py-3">Check In</th>
                                        <th scope="col" className="px-6 py-3">Check Out</th>
                                        <th scope="col" className="px-6 py-3">Price</th>
                                        <th scope="col" className="px-6 py-3">Status</th>
                                        <th scope="col" className="px-6 py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortBookings(filteredBookings).map((booking) => (
                                        <tr key={booking.id} className="border-b hover:bg-gray-50">
                                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{booking.id}</th>
                                            <td className="px-6 py-4">{booking.name}</td>
                                            <td className="px-6 py-4">{booking.type}</td>
                                            <td className="px-6 py-4">{booking.transaction}</td>
                                            <td className="px-6 py-4">{booking.checkIn}</td>
                                            <td className="px-6 py-4">{booking.checkOut}</td>
                                            <td className="px-6 py-4">{booking.price}</td>
                                            <td className="px-6 py-4">
                                                <span className={`${booking.status === 'Checked in' ? 'bg-[#51e633]' : 
                                                                booking.status === 'Checked out' ? 'bg-[#FF6767]' :
                                                                booking.status === 'Pending' ? 'bg-[#fdbc60]' :
                                                                'bg-transparent'} px-2 py-2 rounded text-white`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 space-x-2">
                                                <button className="bg-[#1089D3] hover:bg-[#3d9fdb] p-2 rounded-full">
                                                    <img src="./src/assets/edit.png" className="w-4 h-4 filter brightness-0 invert" alt="Edit" />
                                                </button>
                                                <button className="bg-[#FFC470] hover:bg-[#f8b961] p-2 rounded-full" onClick={handleViewClick}>
                                                    <img src="./src/assets/view.png" className="w-4 h-4 filter brightness-0 invert" alt="View" />
                                                </button>
                                                <button className="bg-[#FF6767] hover:bg-[#f35656] p-2 rounded-full">
                                                    <img src="./src/assets/delete.png" className="w-4 h-4 filter brightness-0 invert" alt="Delete" />
                                                </button>
                                            </td>
                                            <ViewModal 
                                                isOpen={isViewModalOpen} 
                                                onClose={handleCloseModal} 
                                                booking={selectedBooking} 
                                            />
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default EmployeeReservation;