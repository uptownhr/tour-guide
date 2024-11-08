import React, { useEffect, useState } from 'react'
import { generateCityFacts } from './services/openai'
import { getCityFromCoordinates } from './services/location'

function App() {
  const [currentCity, setCurrentCity] = useState<string>('')
  const [isTracking, setIsTracking] = useState(false)
  const [currentFact, setCurrentFact] = useState<string>('')

  useEffect(() => {
    console.log('App mounted, checking for geolocation support');
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          console.log('Got user position:', {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          const city = await getCityFromCoordinates(
            position.coords.latitude,
            position.coords.longitude
          )
          setCurrentCity(city)
          const fact = await generateCityFacts(city)
          setCurrentFact(fact)
          console.log('Starting text-to-speech for fact');
          speak(fact)
        },
        (error) => {
          console.error('Error getting location:', error.message)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser')
    }
  }, [])

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    console.log('Speaking text:', text);
    window.speechSynthesis.speak(utterance)
  }

  const toggleTracking = () => {
    const newTrackingState = !isTracking;
    console.log('Tracking state changed to:', newTrackingState);
    setIsTracking(newTrackingState)
  }

  return (
    <div>
      <h1>Tour Guide</h1>
      <p>Your AI-powered tour guide</p>
      {currentCity && <h2>Current City: {currentCity}</h2>}
      {currentFact && <p>{currentFact}</p>}
      <button onClick={toggleTracking}>
        {isTracking ? 'Stop Tour Guide' : 'Start Tour Guide'}
      </button>
    </div>
  )
}

export default App
