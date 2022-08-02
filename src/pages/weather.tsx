import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ICoordinate, IFiveDaysForecast, ILanguage, IUnit } from "../routes";

interface Props {
  city: string;
  unit: IUnit;
  coordinate: ICoordinate;
  lang: ILanguage;
  fiveDaysForecast: IFiveDaysForecast[];
  setFiveDaysForecast: React.Dispatch<React.SetStateAction<IFiveDaysForecast[]>>
}

export default function Weather({ city, unit, coordinate, lang, fiveDaysForecast, setFiveDaysForecast }: Props){

  
  const [weather,setWeather] = useState<string>('');
  const [temp,setTemp] = useState<number>(0);
  const [maxTemp,setMaxTemp] = useState<number>(0);
  const [minTemp,setMinTemp] = useState<number>(0);
  const [icon, setIcon] = useState('');

  //montando url da api openweather
  const units = unit.unit;
  const language = lang.lang;
  const API_KEY = import.meta.env.VITE_WEATHER_KEY;

  const url =`http://api.openweathermap.org/data/3.0/onecall?lat=${coordinate.lat}&lon=${coordinate.lng}&units=${units}&appid=${API_KEY}&lang=${language}`
  
  console.log(units)
  useEffect(()=>{
    const getWeather =async () => {
      const res = await fetch(url).then(data => data.json()).catch(err=>console.log(err));

      // console.log(res);
      setWeather(res.current.weather[0].description);
      setTemp(parseInt(res.current.temp));
      setMaxTemp(parseInt(res.daily[0].temp.max));
      setMinTemp(parseInt(res.daily[0].temp.min));
      setIcon(res.current.weather[0].icon);

      //pegando a previsão dos próximos 5 dias
      const forcastArray: IFiveDaysForecast[] = [];
      res.daily.forEach((value: any, i: number) => {
        if(i > 0 && i <= 5){
          //console.log(value)
          const forcast = {
            dayName: {
              day: new Date(value.dt * 1000).toLocaleDateString('pt-br',{day: '2-digit'  }),
              week: new Date(value.dt * 1000).toLocaleDateString('pt-br',{weekday: 'short'}),
              month: new Date(value.dt * 1000).toLocaleDateString('pt-br',{month: 'short'}),
          
            },
            icon: value.weather[0].icon,
            dayMax: parseInt(value.temp.max),
            dayMin: parseInt(value.temp.min),
            description: value.weather[0].description
          }
          forcastArray.push(forcast)
        }
      });
      setFiveDaysForecast(forcastArray);
      console.log(fiveDaysForecast); 
    }
    getWeather();
  },[unit, lang])

  return (
    <section className="flex flex-col items-center gap-1 max-w-[44.375rem] md:min-w-[40rem] text-white">
      <h1 className="font-bold text-3xl text-center uppercase md:text-5xl">{city}</h1>
      <span className="text-sm first-letter:uppercase text-center md:text-xl">{weather}</span>
      <div className="flex items-center">
        <span className="text-5xl md:text-6xl">{temp}°</span>
        {icon !== '' ? 
          <img src={`http://openweathermap.org/img/wn/${icon}@2x.png`} alt="" 
          
            className="w-14 h-14 md:w-24 md:h-24"
          />
          : ''}
      </div>
      <div className="flex text-xl gap-2 md:text-xl">
        <span className="uppercase font-bold">Max:</span>
        <span>{maxTemp}°</span>
        <span className="uppercase font-bold">Min:</span>
        <span>{minTemp}°</span>
      </div>
      <Link to={'/5dias'}
        className="text-center underline underline-offset-2"
      >Ver previsão para os próximos 5 dias</Link>
    </section>
  )
}