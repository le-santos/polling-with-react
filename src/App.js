import React, { useState } from "react";
import ReactPolling from "react-polling";
import ForecastTitle from "./Components/DailyForecastList/ForecastTitle";
import ForecastList from "./Components/DailyForecastList/ForecastList";
import AppHeader from "./Components/Layout/AppHeader";
import AppFooter from "./Components/Layout/AppFooter";
import Form from "./Components/LocationForm/Form";

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [locationName, setLocationName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [geoData, setGeoData] = useState({ lat: "", lon: "" });
  const [pollingState, setPollingState] = useState(false);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;
  const part = "hourly,minutely";
  const url = `${process.env.REACT_APP_API_URL}?lat=${geoData.lat}&lon=${geoData.lon}&exclude=${part}&appid=${apiKey}&units=metric`;

  // Needs better validation here to avoid wrong data input!

  const sendInputData = (geoData) => {
    if (geoData.lat && geoData.lon) {
      setGeoData(geoData);
      setPollingState(true);
    }
  };

  const isPolling = pollingState && (
    <ReactPolling
      url={url}
      interval={30000}
      retryCount={2}
      onSuccess={(response) => {
        setWeatherData(response.daily);
        setLocationName(response.timezone);
        return true;
      }}
      onFailure={(error) => console.log(error)}
      method={"GET"}
      render={({ startPolling, stopPolling, isPolling }) => {
        if (isPolling) {
          return (
            <React.Fragment>
              <ForecastTitle
                title={"5-day weather forecast for " + locationName}
              />
              <ForecastList weatherData={weatherData} />
            </React.Fragment>
          );
        } else {
          return <div> No more weather today! Bye!</div>;
        }
      }}
    />
  );

  return (
    <div className="App">
      <AppHeader />
      <main style={{ padding: "56px 0 30px" }}>
        <Form
          latitude={latitude}
          longitude={longitude}
          setLatitude={setLatitude}
          setLongitude={setLongitude}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          getWeather={sendInputData}
        />
        {isPolling}
      </main>
      <AppFooter />
    </div>
  );
}

export default App;
