import fetch from "node-fetch";

export const geocodeAddress = async (address) => {
    try {
        const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(address)}&apiKey=${process.env.GEOAPIFY_API_KEY}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data.features || data.features.length === 0) {
            return null;
        }

        const location = data.features[0].properties;

        return {
            latitude: location.lat,
            longitude: location.lon,
        };
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
};