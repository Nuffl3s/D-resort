import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MapComponent from '../components/Map';


function AboutUsPage() {
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
                        <h1 className="text-[20px] font-bold">Welcome to D.Yasay Resort!</h1>
                        <p className="text-[16px]">
                            Located in the beautiful town of Opol, Misamis Oriental, Philippines, our resort is your perfect escape to paradise.
                            Enjoy the breathtaking ocean views and relax in our cozy accommodations, whether you’re here to unwind on the sandy beaches or explore the local culture,
                            D. Yasay Beach Resort promises a memorable and enjoyable stay. Come and create unforgettable memories with us!
                        </p>
                    </div>
                </div>
                <div className="max-w-[1200px] mx-auto mt-10">
                    <MapComponent showViewMapButton={false} />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default AboutUsPage;
