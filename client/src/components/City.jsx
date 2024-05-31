import { useParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import BackButton from "./BackButton";
import axios from "axios";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function City() {
  const { id } = useParams();
  const [city, setCity] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("worldwise-user")).token;

  useEffect(() => {
    async function fetchPlace() {
      setIsLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_APP_URL}/places/${id}`,
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        setCity(data.place);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchPlace();
  }, [id, token]);
  // const [searchParams, setSearchParams] = useSearchParams();

  const { cityName, emoji, date, notes } = city;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <BackButton />
    </div>
  );
}

export default City;
