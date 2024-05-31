import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import { useState } from "react";
import Button from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

export default function Login() {
  // PRE-FILL FOR DEV PURPOSES
  const [username, setUsername] = useState("jack@example.com");
  const [password, setPassword] = useState("qwerty");
  const setUser = useSetRecoilState(userAtom);

  const url = import.meta.env.VITE_APP_URL;
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const { data } = await axios.post(url + "/users/login", {
        username,
        password,
      });
      const { user, token } = data;
      localStorage.setItem("worldwise-user", JSON.stringify({ user, token }));
      setUser(data.user);
      toast.success(data.message);
      navigate("/app", { replace: true });
    } catch (error) {
      if (error.response.data.error) {
        toast.error(error.response.data.error);
      }
    }
  }

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Username</label>
          <input
            type="username"
            id="username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
