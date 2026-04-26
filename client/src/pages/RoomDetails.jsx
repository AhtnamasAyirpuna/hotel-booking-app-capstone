import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { assets, facilityIcons } from '../assets'
import { getAuth } from 'firebase/auth'

const RoomDetails = () => {
    const { id } = useParams();
    const [room, setRoom] = useState(null);
    const [mainImage, setMainImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [checkInDate, setCheckInDate] = useState("");
    const [checkOutDate, setCheckOutDate] = useState("");
    const [checking, setChecking] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL || "";

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const res = await fetch(`${API_URL}/api/rooms/${id}`);
                if (!res.ok) {
                    throw new Error("Room not found");
                }

                const data = await res.json();
                setRoom(data)
                setMainImage(data.image?.[0])
            } catch (error) {
                console.error("Error loading room:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRoom();
    }, [id, API_URL]);

    if (loading) {
        return <p className="pt-40 text-center">Loading room...</p>;
    }

    if (!room) {
        return <p className="pt-40 text-center">Room not found</p>;
    }

    const handleBooking = async (e) => {
        e.preventDefault();

        if (!checkInDate || !checkOutDate) {
            alert("Please select dates");
            return;
        }

        try {
            setChecking(true);

            //to check availability
            const availabilityRes = await fetch(
                `${API_URL}/api/rooms/check/${id}?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}`
            );

            const availabilityData = await availabilityRes.json();

            if (!availabilityData.available) {
                alert("Room is not available for selected dates");
                return;
            }

            const auth = getAuth();
            const user = auth.currentUser;

            if (!user) {
                alert("Please login to book");
                return
            }

            const token = await user.getIdToken();

            //create booking
            const bookingRes = await fetch(
                `${API_URL}/api/bookings`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        roomId: id,
                        checkInDate,
                        checkOutDate
                    })
                }
            );

            const bookingData = await bookingRes.json();

            if (!bookingRes.ok) {
                throw new Error(bookingData.message || "Booking failed");
            }

            alert("Booking successful");

            console.log("Booking created:", bookingData);

        } catch (error) {
            console.error(error);
            alert("Error checking availability");
        } finally {
            setChecking(false);
        }
    };

    return (
        <div className='py-28 md:py-35 px-4 md:px-16 lg:px-24 xl:px-32'>
            {/* Room Details */}
            <div className='flex flex-col md:flex-row items-start md:items-center gap-2'>
                <h1 className='text-3xl md:text-4xl font-playfair'>{room.hotel.name}</h1>
            </div>
            {/* Room Address */}
            <div>
                <img src={assets.location} alt="location-icon" className='h-4' />
                <span>{room.address}</span>
            </div>
            {/* Room Images */}
            <div className='flex flex-col lg:flex-row mt-6 gap-6'>
                <div className='lg:w-1/2 w-full'>
                    <img src={mainImage} alt="Room Image" className='w-full rounded-xl shadow-lg object-cover' />
                </div>
                <div className='grid grid-cols-2 gap-4 lg:w-1/2 w-full'>
                    {room?.image.length > 1 && room.image.map((image, index) => (
                        <img onClick={() => setMainImage(image)}
                            key={index} src={image} alt="Room Image"
                            className={`w-full rounded-xl shadow-md object-cover cursor-pointer ${mainImage === image && 'outline-3 outline-orange-500'}`} />
                    ))}
                </div>
            </div>
            {/* Room Highlights */}
            <div className='flex flex-col md:flex-row md:justify-between mt-10'>
                <div className='flex flex-col'>
                    <h1 className='text-3xl md:text-4xl font-playfair'>Experience luxury like never before</h1>
                    <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                        {room.amenities.map((item, index) => (
                            <div key={index} className='flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100'>
                                <img src={facilityIcons[item]} alt={item} className='w-5 h-5' />
                                <p className='text-xs'>{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
                {/* Room Price */}
                <p className='text-2xl font-medium'>${room.pricePerNight}/night</p>
            </div>
            {/* Check in check out form */}
            <form onSubmit={handleBooking} className='flex flex-col md:flex-row items-start md:items-center justify-between bg-white shadow-[0px_0px_20px_rgba(0,0,0,0.15)] p-6 rounded-xl mx-auto mt-16 max-w-6xl'>

                <div className='flex flex-col flex-wrap md:flex-row items-start md:items-center gap-4 md:gap-10 text-gray-500'>

                    <div className='flex flex-col'>
                        <label htmlFor="checkInDate" className='font-medium'>Check-In</label>
                        <input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                    <div className='flex flex-col'>
                        <label htmlFor="checkOutDate" className='font-medium'>Check-Out</label>
                        <input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} className='w-full rounded border border-gray-300 px-3 py-2 mt-1.5 outline-none' required />
                    </div>
                    <div className='w-px h-15 bg-gray-300/70 max-md:hidden'></div>
                </div>

                <button type='submit' className='bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-white rounded-md max-md:w-full max-md:mt-6 md:px-25 py-3 md:py-4 text-base cursor-pointer'>
                    {checking ? "Checking..." : "Book now"}
                </button>
            </form>

            <div className='max-w-3xl border-y border-gray-300 my-15 py-10 text-gray-500'>
                The rooms displayed are subject to availability and may change without prior notice. Availability is determined at the time of booking confirmation, and we encourage guests to complete their reservations promptly to secure their preferred accommodation.
            </div>

        </div>
    )
}

export default RoomDetails