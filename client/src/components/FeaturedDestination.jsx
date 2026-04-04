import HotelCard from './HotelCard'
import Title from './Title'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

const FeaturedDestination = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch(`${API_URL}/api/rooms`);
                const data = await res.json();
                setRooms(data.slice(0, 4));
            } catch (error) {
                console.error("Error loading rooms:", error);
            }
        };
        fetchRooms();
    }, [API_URL]);

    return (
        <div className='flex flex-col items-center px-6 md:px-16 lg:px-24 bg-slate-50 py-20'>
            <Title title='Featured Destination' subTitle='Experience our exclusive picks of stunning stays crafted for luxury and lasting impressions.' />
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-20 w-full max-w-7xl'>
                {rooms.map((room, index) => (
                    <HotelCard key={room.id} room={room} index={index} />
                ))}


            </div>
            <button onClick={() => { navigate('/rooms'); scrollTo(0, 0) }} className='my-16 px-4 py-2 text-sm font-medium border border-gray-300 rounded bg-white hover:bg-gray-50 transition-all cursor-pointer'>
                View All Destinations
            </button>
        </div>
    )
}

export default FeaturedDestination