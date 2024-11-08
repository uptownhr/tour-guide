import React, { useEffect, useState } from 'react'
import { getCityFacts, getAdditionalFact } from './services/cityFacts'
import { getCityFromCoordinates } from './services/location'

function App() {
  const [currentCity, setCurrentCity] = useState<string>('')
  const [isTracking, setIsTracking] = useState(false)
  const [currentFact, setCurrentFact] = useState<string>('')
  const [factHistory, setFactHistory] = useState<string[]>([])

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
        },
        (error) => {
          console.error('Error getting location:', error.message)
        }
      )
    } else {
      console.error('Geolocation is not supported by this browser')
    }
  }, [])

  useEffect(() => {
    let timeoutId: number;
    
    if (isTracking && currentCity) {
      const startTour = async () => {
        // First time starting the tour
        if (factHistory.length === 0) {
          const { facts, tourGuideSpeech } = await getCityFacts(currentCity);
          setFactHistory(facts);
          if (tourGuideSpeech) {
            setCurrentFact(tourGuideSpeech);
            speak(tourGuideSpeech, () => {
              timeoutId = window.setTimeout(getFact, 1000);
            });
          } else {
            getFact();
          }
        } else {
          getFact();
        }
      };

      const getFact = async () => {
        const fact = await getAdditionalFact(currentCity, factHistory);
        if (!factHistory.includes(fact)) {
          setCurrentFact(fact);
          setFactHistory(prev => [...prev, fact]);
          console.log('Starting text-to-speech for fact');
          speak(fact, () => {
            timeoutId = window.setTimeout(getFact, 1000); // Small delay after speech ends
          });
        }
      };

      startTour();
    }
    
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId)
      }
      window.speechSynthesis.cancel()
    }
  }, [isTracking, currentCity])

  const speak = (text: string, onComplete?: () => void) => {
    const utterance = new SpeechSynthesisUtterance(text)
    console.log('Speaking text:', text);
    if (onComplete) {
      utterance.onend = onComplete;
    }
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
      {currentFact && <p>Current fact: {currentFact}</p>}
      <div>
        <h3>Fact History:</h3>
        <ul>
          {factHistory.map((fact, index) => (
            <li key={index}>{fact}</li>
          ))}
        </ul>
      </div>
      <button onClick={toggleTracking}>
        {isTracking ? 'Stop Tour Guide' : 'Start Tour Guide'}
      </button>
    </div>
  )
}

export default App
