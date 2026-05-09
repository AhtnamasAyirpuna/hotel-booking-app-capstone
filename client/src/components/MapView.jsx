import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const MapView = ({ lat, lng, title }) => {
    if (lat == null || lng == null) return null;

    return (
        <MapContainer
            center={[lat, lng]}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-[300px] rounded-xl"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[lat, lng]}>
                <Popup>{title}</Popup>
            </Marker>
        </MapContainer>
    );
};

export default MapView;