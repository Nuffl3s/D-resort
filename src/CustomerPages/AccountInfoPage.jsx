import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import api from "../api";

function AccountInfoPage() {
    const [accountData, setAccountData] = useState({
        fullName: "",
        email: "",
        phoneNumber: "",
    });
    const [logs, setLogs] = useState([]); // Original data
    const [groupedLogs, setGroupedLogs] = useState([]); // Filtered and sorted data
    const [unitType, setUnitType] = useState("Cottage"); // Unit type filter
    const [sortOption, setSortOption] = useState("recent"); // Sort option
    const navigate = useNavigate();

    // Fetch account details and reservation logs
    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountRes = await api.get("/customer/details/");
                setAccountData({
                    fullName: accountRes.data.name,
                    email: accountRes.data.email,
                    phoneNumber: accountRes.data.phone_number,
                });

                const reservationRes = await api.get("/reservations/");
                setLogs(reservationRes.data);
            } catch (error) {
                console.error("Error fetching account or reservation data:", error);
            }
        };
        fetchData();
    }, []);

    // Group, filter, and sort logs
    useEffect(() => {
        const filteredLogs = logs.filter(
            (log) => log.unit_type.toLowerCase() === unitType.toLowerCase()
        );

        const grouped = filteredLogs.reduce((acc, reservation) => {
            const key = reservation.unit_name;
            if (!acc[key]) {
                acc[key] = { ...reservation, reservations: [reservation] };
            } else {
                acc[key].reservations.push(reservation);
            }
            return acc;
        }, {});

        const sortedGroups = Object.values(grouped).sort((a, b) => {
            if (sortOption === "recent") {
                return (
                    new Date(b.reservations[0].date_of_reservation) -
                    new Date(a.reservations[0].date_of_reservation)
                );
            } else if (sortOption === "most_reserved") {
                return b.reservations.length - a.reservations.length;
            }
            return 0;
        });

        setGroupedLogs(sortedGroups);
    }, [logs, sortOption, unitType]);

    const handleBookAgain = (reservation) => {
        const { unit_name, unit_type } = reservation;
        const resolvedUnitType = unit_type || "cottage"; // Default fallback to 'cottage'

        if (!unit_name) {
            console.error("Missing unit_name in reservation:", reservation);
            alert("Unable to fetch unit details. Please try again.");
            return;
        }

        api.get(`/${resolvedUnitType.toLowerCase()}s/?name=${unit_name}`)
            .then((response) => {
                if (!response.data || response.data.length === 0) {
                    console.error("No unit details found for the reservation:", reservation);
                    alert("Failed to fetch unit details. Please try again.");
                    return;
                }

                const unitDetails = response.data[0];
                navigate("/payment", {
                    state: {
                        unit: {
                            name: unitDetails.name,
                            capacity: unitDetails.capacity,
                            custom_prices: unitDetails.custom_prices,
                            image_url: unitDetails.image_url,
                            description: unitDetails.description || "No description available",
                        },
                        selectedDate: new Date(reservation.date_of_reservation),
                    },
                });
            })
            .catch((error) => {
                console.error("Error fetching unit details:", error);
                alert("Failed to fetch unit details. Please try again.");
            });
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const handleCheckAvailability = (unitName) => {
        navigate(`/calendar/${unitName}`);
    };

    const handleUnitTypeChange = (e) => {
        setUnitType(e.target.value);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Header />
            <div className="flex-1">
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
                    <h1 className="text-4xl font-bold text-center mb-6">Account Information</h1>

                    {/* Account Information */}
                    <div className="p-6 bg-gray-100 rounded-lg shadow-sm mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Personal Details</h2>
                        <div className="space-y-3 text-lg">
                            <p>
                                <strong className="font-medium">Full Name:</strong> {accountData.fullName}
                            </p>
                            <p>
                                <strong className="font-medium">Email:</strong> {accountData.email}
                            </p>
                            <p>
                                <strong className="font-medium">Phone Number:</strong> {accountData.phoneNumber}
                            </p>
                        </div>
                    </div>

                    {/* Sorting Controls */}
                    <div className="flex items-center space-x-6 mb-8">
                        <div>
                            <label className="text-lg font-semibold block mb-1">
                                Sort Reservations:
                            </label>
                            <select
                                value={sortOption}
                                onChange={handleSortChange}
                                className="border border-gray-300 rounded-lg p-2"
                            >
                                <option value="recent">Recent Reservations</option>
                                <option value="most_reserved">Most Reserved</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-lg font-semibold block mb-1">
                                Unit Type:
                            </label>
                            <select
                                value={unitType}
                                onChange={handleUnitTypeChange}
                                className="border border-gray-300 rounded-lg p-2"
                            >
                                <option value="Cottage">Cottage</option>
                                <option value="Lodge">Lodge</option>
                            </select>
                        </div>
                    </div>

                    {/* Reservations Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {groupedLogs.length > 0 ? (
                            groupedLogs.map((reservationGroup, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-lg shadow-md border border-gray-200 transition-transform hover:scale-105"
                                >
                                    <img
                                        src={reservationGroup.image_url || "/default-image.jpg"}
                                        alt={reservationGroup.unit_name}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                    />
                                    <div className="p-4">
                                        <h3 className="text-xl font-semibold mb-2">
                                            {reservationGroup.unit_name}
                                        </h3>
                                        <p className="text-gray-600 mb-2">
                                            <strong>Reservations:</strong>{" "}
                                            {reservationGroup.reservations.length} times
                                        </p>
                                        <p className="text-gray-600 mb-2">
                                            <strong>Last Reserved:</strong>{" "}
                                            {reservationGroup.reservations[0].date_of_reservation}
                                        </p>
                                        <p className="text-gray-600">
                                            <strong>Total Price:</strong> ₱
                                            {reservationGroup.reservations.reduce(
                                                (total, res) => total + parseFloat(res.total_price || 0),
                                                0
                                            )}
                                        </p>
                                        <div className="flex space-x-4 mt-4">
                                            <button
                                                onClick={() =>
                                                    handleBookAgain(reservationGroup.reservations[0])
                                                }
                                                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
                                            >
                                                Book Again
                                            </button>
                                            <button
                                                onClick={() =>
                                                    handleCheckAvailability(reservationGroup.unit_name)
                                                }
                                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md shadow"
                                            >
                                                Check Availability
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No reservations found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AccountInfoPage;
