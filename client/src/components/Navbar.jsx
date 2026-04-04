import { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { assets } from '../assets';
import { AuthContext } from '../context/AuthContext';
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import LoginModal from './LoginModal';
import SignUpModal from './SignUpModal';

const Navbar = () => {
    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' }
    ];

    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [showLogin, setShowLogin] = useState(false);
    const [showSignup, setShowSignup] = useState(false);

    const { currentUser } = useContext(AuthContext);
    const location = useLocation();

    //check this part later
    useEffect(() => {
        const isHome = location.pathname === '/';
        if (!isHome) {
            Promise.resolve().then(() => setIsScrolled(true)); //if navbar not at homepage, it will look scrolled
            return;
        }
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        handleScroll();
        return () => window.removeEventListener("scroll", handleScroll);
    }, [location.pathname]);

    useEffect(() => {
        if (currentUser) {
            currentUser.getIdToken()
                .then((idToken) => {
                    console.log("User ID Token:", idToken);
                    // You can also store it in state or send it to backend here
                })
                .catch(err => console.error("Error getting ID token:", err));
        }
    }, [currentUser]);

    return (
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>

            {/* Logo */}
            <Link to='/' className='flex items-center'>
                <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
                <p className={`text-white text-3xl font-semibold font-sans ${isScrolled ? "invert opacity-80" : "text-white"}`}>My Cozy Stay</p>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4 lg:gap-8">
                {navLinks.map((link, i) => (
                    <NavLink key={i} to={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                        {link.name}
                        <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`} />
                    </NavLink>
                ))}
            </div>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center gap-4">
                {currentUser ? (
                    <>
                        <NavLink to="/my-bookings" className={`${isScrolled ? "text-black" : "text-white"} transition-all duration-500`}>
                            My Bookings
                        </NavLink>
                        <button onClick={() => signOut(auth)} className={`${isScrolled ? "text-black" : "text-white"} transition-all duration-500`}>
                            Logout
                        </button>
                    </>
                ) : (
                    <button onClick={() => setShowLogin(true)} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                        Login
                    </button>
                )}
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 md:hidden">
                <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={assets.menu} alt="" className={`${isScrolled && "invert"} h-4`} />
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
                    <img src={assets.close} alt="close-menu" className='h-6.5' />
                </button>

                {navLinks.map((link, i) => (
                    <NavLink key={i} to={link.path} onClick={() => setIsMenuOpen(false)}>
                        {link.name}
                    </NavLink>
                ))}

                {currentUser ? (
                    <>
                        <a href="/my-bookings" onClick={() => setIsMenuOpen(false)}>
                            My Bookings
                        </a>
                        <button onClick={() => signOut(auth)} className="text-white-500">
                            Logout
                        </button>
                    </>
                ) : (
                    <button onClick={() => setShowLogin(true)} className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500">
                        Login
                    </button>
                )}
            </div>
            {showLogin && (<LoginModal onClose={() => setShowLogin(false)} switchToSignup={() => {
                setShowLogin(false);
                setShowSignup(true);
            }}
            />
            )}

            {showSignup && (<SignUpModal onClose={() => setShowSignup(false)} switchToLogin={() => {
                setShowSignup(false);
                setShowLogin(true);
            }}
            />
            )}
        </nav>
    );
}

export default Navbar;