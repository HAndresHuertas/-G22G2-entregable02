import axios from 'axios'
import { useEffect, useState } from 'react'
import './App.css'
import Loader from './components/Loader'
import WeatherCard from './components/WeatherCard'

const API_KEY = "cbbe5e925227b4183d83735d4b7003c7"

function App() {

  const [coords, setCoords] = useState()
  const [weather, setWeather] = useState()
  const [temps, setTemps] = useState()
  const [isCelsius, setIsCelsius] = useState(true)

  const success = (pos) => {

    const newCoords = {
      lat: pos.coords.latitude,
      lon: pos.coords.longitude
    }
    setCoords(newCoords)
  }

  const newCallAPISearch = (cityName) => {
    const URL = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}`
    axios.get(URL)
      .then(res => {
        setCoords(res.data.coord)
        setWeather(res.data)
      })
      .catch(err => alert(`Not found "${cityName}", try with other place`))
  }

  const changeUnitTemp = () => setIsCelsius(!isCelsius)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success)

  }, []);

  useEffect(() => {
    if (coords) {

      const URL2 = `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}`

      axios.get(URL2)
        .then(res => {
          setTimeout(() => {
            setWeather(res.data)
            const celsius = (res.data.main.temp - 273.15).toFixed(2)
            const fahrenheit = (celsius * (9 / 15) + 32).toFixed(2)
            const newtemps = { celsius, fahrenheit }
            setTemps(newtemps)
          }, 1000)
        })
        .catch(err => console.log(err))
    }
  }, [coords]);



  return (
    <div className="App">
      {
        weather ? (
          <WeatherCard weather={weather} temps={temps} isCelsius={isCelsius} changeUnitTemp={changeUnitTemp} newCallAPISearch={newCallAPISearch} />) : <Loader />
      }
    </div>
  )
}

export default App
