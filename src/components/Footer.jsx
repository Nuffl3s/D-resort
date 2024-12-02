
import { useNavigate } from 'react-router-dom';


function Footer() {
    const navigate = useNavigate();

    const handleAboutUs = () => {
        navigate('/about-us');
    };

    const handleTerms = () => {
        navigate('/terms');
    };
    return (
        <footer className="bg-gradient-to-r from-[#1089D3] to-[#12B1D1] mt-20">
                <div className="mx-auto w-full max-w-screen-xl p-4 py-6 lg:py-8">
                    <div className="md:flex md:justify-between">
                        <div className="mb-6 md:mb-0">
                            <a className="flex items-center">
                                <img className="h-8 me-3" src='./src/assets/logo.png' alt="logo" />
                                <span className="self-center bg-clip-text text-transparent bg-white text-[30px] font-bold font-lemon cursor-pointer">D.Yasay Resort</span>
                            </a>
                        </div>
                        <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-2">
                            <div>
                                <h2 className="mb-4 text-sm font-bold text-white uppercase">Contact us</h2>
                                <ul className="text-white font-medium">
                                    <li className="mb-4">
                                        <a className="hover:underline">+63 917 708 4368</a>
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h2 className="mb-4 text-sm font-bold text-white uppercase ">Other information</h2>
                                <ul className="text-white font-medium">
                                    <li className="mb-4">
                                        <a href="#" className="hover:underline" onClick={handleAboutUs}>About us</a>
                                    </li>
                                    <li>
                                        <a href="#" className="hover:underline" onClick={handleTerms}>Terms &amp; Conditions</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <hr className="my-6 border-white sm:mx-auto lg:my-8" />
                    <div className="sm:flex sm:items-center justify-center">
                        <span className="text-sm sm:text-center text-white">© 2024 <a className="hover:underline">D.Yasay Resort™</a>. All Rights Reserved.</span>
                    </div>
                </div>
        </footer>
    );
}

export default Footer;
