import { useNavigate } from "react-router-dom";
import styles from "./User.module.css";
import axios from "axios";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const url = import.meta.env.VITE_APP_URL;
function User() {
  const user = useRecoilValue(userAtom);
  const username =
    user.username.charAt(0).toUpperCase() + user.username.slice(1);
  const navigate = useNavigate();

  async function handleLogout() {
    await axios.post(`${url}/users/logout`);
    localStorage.removeItem("worldwise-user");
    navigate("/");
  }

  return (
    <div className={styles.user}>
      {/* <img src={user?.avatar} alt={user.name} /> */}
      <span>Welcome, {username}</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default User;
