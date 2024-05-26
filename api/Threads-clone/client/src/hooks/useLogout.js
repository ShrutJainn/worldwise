import axios from "axios";
import toast from "react-hot-toast";
import { useSetRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";

function useLogout() {
  const setUser = useSetRecoilState(userAtom);
  async function logout() {
    try {
      const { data } = await axios.post("/api/users/logout");
      if (data.error) {
        return toast.error(data.error);
      }
      setUser(null);
      localStorage.removeItem("user-threads");
    } catch (error) {
      console.log(error);
    }
  }
  return logout;
}

export default useLogout;
