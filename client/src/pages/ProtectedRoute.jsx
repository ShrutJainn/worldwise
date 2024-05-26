import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

function ProtectedRoute({ children }) {
  const user = useRecoilValue(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/");
  }, [user, navigate]);
  return user ? children : null;
}

export default ProtectedRoute;
