import CityItem from "./CityItem";
import Message from "./Message";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import cityAtom from "../atoms/cityAtom";

function CityList() {
  // const { cities, isLoading } = useCities();
  // if (isLoading) return <Spinner />;
  const [cities, setCities] = useRecoilState(cityAtom);
  const [isLoading, setIsLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("worldwise-user")).token;

  useEffect(() => {
    async function getCities() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_URL}/places/getPlaces`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setCities(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    getCities();
  }, [setCities, token]);

  if (isLoading) return <Spinner />;

  if (!isLoading && !cities.length)
    return (
      <Message message="Add your first city by clicking on a city on the map" />
    );

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

export default CityList;
