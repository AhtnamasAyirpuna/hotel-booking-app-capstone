import { useEffect, useState } from 'react'
import Title from '../components/Title'
import { assets } from '../assets';
import { getAuth } from "firebase/auth"

const MyBookings = () => {
    const [bookings, setBookings] = useState([])
    const [editingBooking, setEditingBooking] = useState(null);
    const [newCheckIn, setNewCheckIn] = useState("");
    const [newCheckOut, setNewCheckOut] = useState("");
    const API_URL = import.meta.env.VITE_API_URL || "";
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (!user) {
                console.log("User not logged in yet");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const token = await user.getIdToken();

                const res = await fetch(`${API_URL}/api/bookings/my`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (!res.ok) {
                    console.error("Backend error:", data);
                    setBookings([]);
                    setLoading(false);
                    return;
                }
                setBookings(Array.isArray(data) ? data : []);

            } catch (error) {
                console.error("Error booking booking:", error);
            } finally {
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [API_URL]);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Cancel this booking?")) return;

        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            await fetch(`${API_URL}/api/bookings/${bookingId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setBookings(prev => prev.filter(b => b.id !== bookingId));

        } catch (error) {
            console.error(error);
            alert("Failed to cancel booking")
        }
    };

    const handleUpdate = async (bookingId) => {
        try {
            const auth = getAuth();
            const token = await auth.currentUser.getIdToken();

            if (!newCheckIn || !newCheckOut) {
                alert("Please select both dates");
                return;
            }

            if (new Date(newCheckOut) <= new Date(newCheckIn)) {
                alert("Invalid dates. Check-out must be after check in");
                return;
            }

            const res = await fetch(`${API_URL}/api/bookings/${bookingId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    checkInDate: newCheckIn,
                    checkOutDate: newCheckOut
                })
            });

            const data = await res.json();

            if (!res.ok) {
                alert(data.message || "Failed to update booking");
                return;
            }

            setEditingBooking(null);
            setNewCheckIn("");
            setNewCheckOut("");

            setBookings(prev =>
                prev.map(b =>
                    b.id === bookingId
                        ? { ...b, checkInDate: newCheckIn, checkOutDate: newCheckOut, totalPrice: data.totalPrice }
                        : b
                )
            );

        } catch (error) {
            console.error(error)
            alert("Failed to update booking");
        }
    };

    if (loading) {
        return <p className='pt-40 text-center'>Loading your bookings...</p>
    }

    if (!bookings.length) {
        return <p className='pt-40 text-center'>No bookings found</p>
    }

    return (
        <div className='py-28 md:pb-35 md:pt-32 px-4 md:px-16 lg:px-24 xl:px-32'>
            <Title title='My Bookings' subTitle='Easily manage your past, current and upcoming hotel reservations in one place. Plan your trips seamlessly with just a few clicks.' align='left' />

            <div className='max-w-5xl mt-8 w-full text-gray-800'>

                <div className='hidden md:grid md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 font-medium text-base py-3'>
                    <div className='w-1/3'>Hotels</div>
                    <div className='w-1/3'>Date & Timings</div>
                    <div className='text-right'>Actions</div>
                </div>

                {Array.isArray(bookings) && bookings.map((booking) => (
                    <div key={booking.id} className='grid grid-cols-1 md:grid-cols-[3fr_2fr_1fr] w-full border-b border-gray-300 py-6 first:border-t'>
                        {/* Hotel Details */}
                        <div className='flex flex-col md:flex-row'>
                            <img src={booking.room?.image?.[0]} alt="hotel-img" className='min-md:w-44 rounded shadow object-cover' />
                            <div className='flex flex-col gap-1.5 max-md:mt-3 min-md:ml-4'>
                                <p className='font-playfair text-2xl'>{booking.room?.hotel?.name ?? "Hotel unavailable"}</p>
                                <div className='flex items-center gap-1 text-sm text-gray-500'>
                                    <img src={assets.location} alt="location-icon" className='h-4' />
                                    <span>{booking.address}</span>
                                </div>
                                <p className='text-base'>Total: ${booking.totalPrice}</p>
                            </div>
                        </div>
                        {/* Date and Timing */}
                        <div className='flex flex-col md:flex-row md:items-center md:gap-12 mt-3 gap-4'>
                            <div>
                                <p>Check-In:</p>
                                <p className='text-gray-500 text-sm'>
                                    {new Date(booking.checkInDate).toDateString()}
                                </p>
                            </div>
                            <div>
                                <p>Check-Out:</p>
                                <p className='text-gray-500 text-sm'>
                                    {new Date(booking.checkOutDate).toDateString()}
                                </p>
                            </div>
                        </div>
                        {/* {Actions column} */}
                        <div className='flex md:justify-end items-center gap-3 mt-4 md:mt-0'>
                            <button onClick={() => setEditingBooking(booking)} className='px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600'>
                                Update
                            </button>
                            <button onClick={() => handleCancel(booking.id)} className='px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600'>
                                Cancel
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            {editingBooking && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                    <div className="bg-white p-6 rounded w-80">

                        <h3 className="font-medium mb-3">Change Dates</h3>

                        <input
                            type="date"
                            onChange={(e) => setNewCheckIn(e.target.value)}
                            className="border p-2 w-full mb-3"
                        />

                        <input
                            type="date"
                            onChange={(e) => setNewCheckOut(e.target.value)}
                            className="border p-2 w-full mb-4"
                        />

                        <div className="flex justify-between">

                            <button
                                onClick={() => setEditingBooking(null)}
                                className="px-3 py-1 border rounded"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={() => handleUpdate(editingBooking.id)}
                                className="px-3 py-1 bg-blue-600 text-white rounded"
                            >
                                Save
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    )
}

export default MyBookings