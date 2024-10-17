import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Header from '../components/Header';
import Footer from '../components/Footer';

function TermsAndConditionPage() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => {
            setLoading(false);
        }, 2000); 
        return () => clearTimeout(timer);
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <div className="flex-grow page">
                <div className="max-w-[1200px] mx-auto mt-10">
                    <div className="text-justify space-y-2">
                        <h1 className="text-[30px] font-bold">Terms & Conditions</h1>
                        <ol className="list-decimal text-[16px] space-y-3 ml-6">
                            <li>Booking and Reservations: All reservations must be confirmed with a deposit. Cancellations made within 48 hours of the booking date will incur a fee.</li>
                            <li>Check-In/Check-Out: Check-in time is 2:00 PM, and check-out time is 12:00 PM. Early check-in and late check-out are subject to availability and may incur additional charges.</li>
                            <li>Guest Responsibilities: Guests are responsible for their personal belongings. The resort is not liable for any loss or damage.</li>
                            <li>Use of Facilities: Guests must follow all safety guidelines and instructions when using resort facilities.</li>
                            <li>Any damage caused by guests will be charged accordingly.</li>
                            <li>Conduct: We expect all guests to behave respectfully towards other guests and staff. Any disruptive behavior may result in eviction from the resort without a refund.</li>
                            <li>Pets: Pets are allowed on the resort premises.</li>
                            <li>Changes to Terms: The resort reserves the right to modify these terms and conditions at any time without prior notice.</li>
                        </ol>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default TermsAndConditionPage;
