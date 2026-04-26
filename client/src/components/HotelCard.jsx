import { Link } from 'react-router-dom'
import { assets } from '../assets'

const HotelCard = ({ room }) => {
    return (
        <Link to={'/rooms/' + room.id} onClick={() => scrollTo(0, 0)} key={room.id} className='w-full max-w-sm bg-white rounded-xl overflow-hidden shadow-[0px_4px_4px_rgba(0,0,0,0.05)] flex flex-col'>
            <img src={room.image[0]} alt="" className='w-full h-48 object-cover' />
            <div className='p-4 pt-5 flex flex-col flex-grow'>
                <div className='flex items-center justify-between'>
                    <p className='font-playfair text-xl font-medium text-gray-800'>{room.hotel.name}</p>
                    <div className='flex items-center gap-1'>
                        <img src={assets.star} alt="star-icon" className='h-4' /> 4.5
                    </div>
                </div>
                <div className='flex items-center gap-1 text-sm line-clamp-2'>
                    <img src={assets.location} alt="location-icon" className='h-4 shrink-0' />
                    <span>{room.address}</span>
                </div>
                <div className='flex items-center justify-between mt-auto'>
                    <p><span className='text-xl text-gray-800'>${room.pricePerNight}</span>/night</p>
                    <button className='px-4 py-2 text-sm font-medium border border-gray-300 rounded hover:bg-gray-50 transition-all cursor-pointer'>Book Now</button>
                </div>
            </div>
        </Link>
    )
}

export default HotelCard