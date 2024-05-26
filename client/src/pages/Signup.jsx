import { useNavigate } from "react-router-dom";
import PageNav from "../components/PageNav";
import styles from "./Login.module.css";
import Button from "../components/Button";
import axios from "axios";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useForm } from "react-hook-form";

export default function Signup() {
  // PRE-FILL FOR DEV PURPOSES
  const setUser = useSetRecoilState(userAtom);
  const { register, handleSubmit } = useForm();

  const url = import.meta.env.VITE_APP_URL;
  const navigate = useNavigate();

  async function onSubmit(inputData) {
    try {
      const { data } = await axios.post(url + "/users/signup", inputData);
      localStorage.setItem("worldwise-user", JSON.stringify(data.user));
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
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.row}>
          <label htmlFor="email">Full Name</label>
          <input type="username" id="username" {...register("name")} />
        </div>
        <div className={styles.row}>
          <label htmlFor="email">Email</label>
          <input type="username" id="username" {...register("email")} />
        </div>
        <div className={styles.row}>
          <label htmlFor="email">Username</label>
          <input type="username" id="username" {...register("username")} />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" {...register("password")} />
        </div>

        <div>
          <Button type="primary">Login</Button>
        </div>
      </form>
    </main>
  );
}
