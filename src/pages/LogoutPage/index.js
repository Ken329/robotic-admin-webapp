import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetApp } from "../../redux/slices/app";
import { logout } from "../../services/auth";
import userpool from "../../utils/userpool";

const LogoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleLogout = async () => {
      const user = userpool.getCurrentUser();
      if (user) {
        user.signOut();
      }

      const token = JSON.parse(localStorage.getItem("token"));

      if (token) {
        await logout(token?.accessToken);
      }

      dispatch(resetApp());
      navigate("/login", { replace: true });
    };

    handleLogout();
  }, []);

  return null;
};

export default LogoutPage;
