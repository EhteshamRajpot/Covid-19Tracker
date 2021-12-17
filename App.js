import './App.css';
import React, {useEffect, useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import 'bootstrap';
import InfoBox from "./InfoBox";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Table from "./Table";
import {sortData} from "./util";
import LineGraph from "./LineGraph";
import Map from "./Map";
import "leaflet/dist/leaflet.css";


function App() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState("WorldWide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] =
        useState({ lat: 34.80746, lng: -40.4796});
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then(response => response.json())
            .then(data => {
                setCountryInfo(data);
            });
    },[]);

    useEffect(()=> {
            const getCountriesData = async () => {
               await fetch("https://disease.sh/v3/covid-19/countries")
                   .then((response) => response.json())
                   .then((data) => {
                       const countries= data.map((country) => (
                           {
                               name: country.country,
                               value: country.countryInfo.iso2
                           }));
                       const sortedData = sortData(data);
                       setTableData(sortedData);
                       setMapCountries(data);
                       setCountries(countries);
                   });
            };

            getCountriesData();

    },[]);

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;
        setCountry(countryCode);

        const url = countryCode === "WorldWide"
            ? "https://disease.sh/v3/covid-19/all"
            : `https://disease.sh/v3/covid-19/countries/${countryCode}`

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);

                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };
            console.log("info>>>", countryInfo)
  return (
          <>
            <marquee style={{backgroundColor: "black", color: "white", height: "60px"}}><h1>Ehtesham Rajpot <span style={{color: "orange"}}>✌</span> <span style={{color: "orange"}}>🔥</span> MERN Stack Web Developer, Digital Marketing Expert & E-Commerce Specialist Working as Top Rated Freelancer</h1></marquee>
            <div className="App">
                <div className={"app_left"}>
                    <div className={"app_header"}>
                        <h1>COVID-19 TRACKER</h1>
                            <FormControl className={"app_dropdown"}>
                                <Select variant={"outlined"} value={country} onChange={onCountryChange}>
                                    <MenuItem value="WorldWide">Worldwide</MenuItem>
                                    {
                                        countries.map((country)=>(
                                            <MenuItem value={country.value}>{country.name}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                    </div>
                    <div className={"app_stats"} >
                        <InfoBox title={"CoronaVirus Cases"} cases={countryInfo.todayCases} total={countryInfo.cases}/>
                        <InfoBox title={"Recovered"} cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
                        <InfoBox title={"Deaths"} cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
                    </div>
                    <Map
                        countries={mapCountries}
                    center={mapCenter}
                    zoom={mapZoom}
                    />

                </div>
                <Card className="app_right">
                    <CardContent>
                        <h3>Live Cases by Country</h3>
                        <Table countries={tableData}></Table>
                        <h3>World wide new cases</h3>
                        <LineGraph/>
                    </CardContent>
                </Card>
            </div>
        </>
  );
}

export default App;
