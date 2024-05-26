import { useRecoilValue } from "recoil";
import authScreenAtom from "../atoms/authScreenAtom";
import LoginCart from "../components/LoginCart";
import SignupCart from "../components/SignupCart";

function AuthPage() {
  const authScreenState = useRecoilValue(authScreenAtom);
  return <>{authScreenState === "login" ? <LoginCart /> : <SignupCart />}</>;
}

export default AuthPage;
