"use client";

import { useState,ChangeEvent,FormEvent } from "react";
import { Card,CardHeader,CardTitle,CardDescription,CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CloudIcon,MapPinIcon,ThermometerIcon } from "lucide-react";

interface WeatherData {
    temerature:number;
    descripition: string;
    location:string;
    unit:string;
}
export default function Weatherwidget(){
    const [location,setLocation] =useState<string>("");
    const [weather,setWeather] =useState<WeatherData | null>(null);
    const [error,setError] =useState<string |null>(null);
    const [isLoading, setIsLoading] =useState<boolean>(false);

    const handleSearch =async(e:FormEvent<HTMLFormElement>)=> {
        e.preventDefault();

        const trimedLocation =location.trim();
        if(trimedLocation === "") {
            setError("Please Enter a valid Location.");
            setWeather(null);
            return;
        }
        setIsLoading(true);
        setError(null);

        try{
        const respone = await fetch(
            `http://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimedLocation}`
        );
        if(!respone.ok){
            throw new Error("City not found.");
        }
        const data = await respone.json();
        const WeatherData: WeatherData = {
            temerature:data.current.temp_c,
            descripition:data.current.condition.text,
            location:data.location.name,
            unit:"C",
        };
        setWeather(WeatherData);
        }catch(error){
          setError("City is not found.Please try again.");
          setWeather(null);
        }finally{
            setIsLoading(false);
        }
    };
    function getTemperatureMessage(temerature:number,unit:string):string {
        if(unit == "C") {
            if(temerature < 0){
                return`It's freezing at ${temerature}°C! Bundle up!`;
            }else if(temerature < 10){
                return `It'squit cold at ${temerature}°C. Wear warm clothes.`;
            }else if(temerature < 20){
                return `The temperture is ${temerature}°C. Comfortable for a light jacket.`;
            }else if(temerature < 30) {
                return `It's a pleasant ${temerature}°C.Enjoy the nice weather!`;
            }else {
                return `It's hot at ${temerature}°C. Stay hydrated!`;
            }
        }else {
            return `${temerature}°${unit}`;
        }
    }
    function getWeatherMessage(descripition:string):string {
        switch(descripition.toLocaleLowerCase()){
            case "sunny":
            return "It's  beautiful sunny day!";
            case "partly cloudy":
                return " Expect some clouds and sunshine.";
                case "cloudy":
                    return "It's cloudy today.";
                case "overCast":
                    return " The sky is overcast.";
                    case "rain":
                        return "Don't forget your umbrellal It's raining.";
                        case "thuderstorm":
                            return "Thunderstorms are expected today.";
                            case "snow":
                                return "Bundle up! It's snowing.";
                                case "mist":
                                    return "It's misty outside.";
                                   case "fog":
                                    return "Be careful, there's fog outside";
                                    default:
                                        return descripition;
        }
    }

    function getLocationMessage (location:string):string{
        const  currentHour =new Date().getHours();
        const isNight = currentHour >= 18 || currentHour < 6;
         return `${location} ${isNight ? "at Night" : "During the Day"}`;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            <Card className="w-full max-w-md-auto text-center">
                <CardHeader>
                    <CardTitle> weather Widget</CardTitle>
                    <CardDescription> Search for the current weather conditions in your city.</CardDescription>
                </CardHeader>
                <CardContent>
                <form onSubmit={handleSearch} className="flex items-center gap-2">
                    <input
                    type ="text"
                    placeholder="Enter a city name"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}/>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Loading..." : "Search"}
                    </Button>
                </form>
                {error && <div className="mt-4 text-red-500">{error}</div>}
                {weather &&(
              <div className="mt-4 grid gap-2">
                <div className="flex items-center gap-2">
                    <ThermometerIcon className="w-6 h-6"/>
                    {getTemperatureMessage(weather.temerature,weather.unit)}
                </div>
                <div className="flex items-center gap-2">
                    <CloudIcon className="w-6 h-6"/>
                    {getWeatherMessage(weather.descripition)}
                </div>
                <div className="flex items-center gap-2">
                    <MapPinIcon className="w-6 h-6"/>
                    {getLocationMessage(weather.location)}
                </div>
              </div>
                )}
                </CardContent>
            </Card>
        </div>
    )
}