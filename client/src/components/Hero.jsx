import { useState } from 'react'
import { assets, cities } from '../assets'
import { useNavigate } from 'react-router-dom'

const Hero = () => {
    const navigate = useNavigate();

    const [city, setCity] = useState("");
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [error, setError] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        setError("");

        if (!checkInDate || !checkOutDate) {
            alert("Please select check-in and check-out dates")
            return
        }

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        if (checkOut <= checkIn) {
            setError("Invalid date range. Check out must be after check in.");
            return;
        }

        navigate(
            `/rooms?city=${encodeURIComponent(city)}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
        )
    }
    return (
        <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url("https://www.disneytouristblog.com/wp-content/uploads/2025/11/conrad-orlando-evermore-resort-hotel-near-disney-world-2526.jpg")] bg-no-repeat bg-cover bg-center h-screen'>
            <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>Looking For A Getaway?</p>
            <h1 className='font-playfair text-2xl md:text-5xl md:text-[56px] md:leading-[56px] font-bold md:font-extrabold max-w-xl mt-4'>Your Journey Begins With Us</h1>
            <p className='max-w-130 mt-2 text-sm md:text-base'>Discover great hotels with ease. Compare prices, explore amenities, and book
                your ideal stay in just a few clicks</p>

            <form onSubmit={handleSearch} className='bg-white text-gray-500 rounded-lg px-6 py-4 mt-8 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto'>
                {error && (
                    <p className='text-red-500 text-sm mt-4'>
                        {error}
                    </p>
                )}
                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.location} alt="" className='h-4' />
                        <label htmlFor="destinationInput">Destination</label>
                    </div>
                    <select value={city} onChange={(e) => setCity(e.target.value)} className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" placeholder="All" required >
                        <option value="all">All destinations</option>
                        {cities.map((city, index) => (
                            <option value={city} key={index}>{city}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calendar} alt="" className='h-4' />
                        <label htmlFor="checkIn">Check in</label>
                    </div>
                    <input id="checkIn" type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className="rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <div>
                    <div className='flex items-center gap-2'>
                        <img src={assets.calendar} alt="" className='h-4' />
                        <label htmlFor="checkOut">Check out</label>
                    </div>
                    <input onChange={(e) => setCheckOutDate(e.target.value)} value={checkOutDate} id="checkOut" type="date" className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none" />
                </div>

                <button className='flex items-center justify-center gap-1 rounded-md bg-black py-3 px-4 text-white my-auto cursor-pointer max-md:w-full max-md:py-1' >
                    <img src={assets.search} alt="search" className='h-7' />
                    <span>Search</span>
                </button>
            </form>
        </div>
    )
}

export default Hero
