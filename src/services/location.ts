export async function getCityFromCoordinates(lat: number, lng: number): Promise<string> {
  console.log('Getting city name for coordinates:', { lat, lng });
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`
  );
  const data = await response.json();
  
  const cityComponent = data.results[0]?.address_components.find(
    (component: any) => component.types.includes('locality')
  );
  
  const cityName = cityComponent?.long_name || 'Unknown City';
  console.log('Found city:', cityName);
  return cityName;
}
