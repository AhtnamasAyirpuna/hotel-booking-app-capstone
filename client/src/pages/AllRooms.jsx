import { useNavigate, useSearchParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { assets, facilityIcons } from '../assets';

const AllRooms = () => {

    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [rooms, setRooms] = useState([]);
    const [loading, setLoading] = useState(true);

    const city = searchParams.get("city") || "all";
    const checkInDate = searchParams.get("checkInDate");
    const checkOutDate = searchParams.get("checkOutDate");
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                let url = `${API_URL}/api/rooms`;

                if (checkInDate && checkOutDate) {
                    url = `${API_URL}/api/rooms/search?city=${city}&checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
                }

                const res = await fetch(url);
                const data = await res.json()
                setRooms(data);
                console.log("Fetching:", url);
            } catch (error) {
                console.error("Error loading rooms:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRooms();
    }, [API_URL, city, checkInDate, checkOutDate]);

    if (loading) {
        return <p className='pt-40 text-center'>Loading rooms...</p>
    }

    if (!rooms.length) {
        return <p className='pt-40 text-center'>No rooms available</p>
    }

    return (
        <div className='flex flex-col-reverse lg:flex-row items-start justify-between pt-28 md:pt-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            <div>
                <div className='flex flex-col items-start text-left'>
                    <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
                    <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Find the room that fits your style and create lasting memories.</p>
                </div>

                {rooms.map((room) => (
                    <div key={room.id} className='flex flex-col md:flex-row items-start py-10 gap-6 border-b border-gray-300 last:border-0'>
                        <img onClick={() => { navigate(`/rooms/${room.id}`); scrollTo(0, 0) }}
                            src={room.image[0]} alt="hotel-img" title='View Room Details' className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
                        <div className='md:w-1/2 flex flex-col gap-2'>
                            <p className='text-gray-500'>{room.hotel.city}</p>
                            <p onClick={() => { navigate(`/rooms/${room.id}`); scrollTo(0, 0) }} className='text-gray-800 text-3xl font-playfair cursor-pointer'>{room.hotel.name}</p>
                            <div className='flex items-center gap-1 text-gray-500 mt-2 text-sm'>
                                <img src={assets.location} alt="location-icon" className='h-4' />
                                <span>{room.address}</span>
                            </div>
                            {/* Room Amenitites */}
                            <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                                {room.amenities.map((item, index) => (
                                    <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70'>
                                        <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                        <p className='text-xs'>{item}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Room Price per Night */}
                            <p className='text-xl font-medium text-gray-700'>${room.price_per_night} /night</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default AllRooms