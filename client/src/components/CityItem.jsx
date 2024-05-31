import axios from "axios";
import { useCities } from "../contexts/CitiesContext";
import styles from "./CityItem.module.css";
import { Link } from "react-router-dom";
import { useRecoilState } from "recoil";
import cityAtom from "../atoms/cityAtom";
import toast from "react-hot-toast";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

function CityItem({ city }) {
  const { currentCity, deleteCity } = useCities();
  const [cities, setCities] = useRecoilState(cityAtom);
  const { cityName, emoji, createdAt: date, _id: id, position } = city;
  const token = JSON.parse(localStorage.getItem("worldwise-user")).token;
  async function handleDeleteCity(e) {
    e.preventDefault();
    try {
      const { data } = await axios.delete(
        `${import.meta.env.VITE_APP_URL}/places/delete/${id}`,
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      setCities(cities.filter((city) => city._id !== id));
      toast.success(data.message);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <li>
      <Link
        className={`${styles.cityItem} ${
          id === currentCity.id ? styles["cityItem--active"] : ""
        }`}
        to={`${id}?lat=${position[0].lat}&lng=${position[0].lng}`}
      >
        <span className={styles.emoji}>{emoji}</span>
        <h3 className={styles.name}>{cityName}</h3>
        <time className={styles.date}>{formatDate(date)}</time>
        <button className={styles.deleteBtn} onClick={handleDeleteCity}>
          &times;
        </button>
      </Link>
    </li>
  );
}

export default CityItem;
