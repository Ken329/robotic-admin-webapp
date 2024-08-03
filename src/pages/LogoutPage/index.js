import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { makeSelectToken } from "../../redux/slices/app/selector";
import { appApi } from "../../redux/slices/app/api";
import { resetApp } from "../../redux/slices/app";
import { logout } from "../../services/auth";
import Spin from "../../components/Spin";
import userpool from "../../utils/userpool";

const LogoutPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const hasLoggedOut = useRef(false);

  const user = userpool.getCurrentUser();
  const token = useSelector(makeSelectToken());

  const handleLogout = async () => {
    if (hasLoggedOut.current) return;
    hasLoggedOut.current = true;

    if (user) {
      user.signOut();
    }

    await logout(token);
    dispatch(appApi.util.resetApiState());
    dispatch(resetApp());
    setIsLoading(false);
    navigate("/admin/login", { replace: true });
  };

  useEffect(() => {
    if (token) {
      handleLogout();
    } else {
      navigate("/admin/login", {
        replace: true,
        state: { unauthorized: location?.state?.unauthorized ? true : false },
      });
    }
  }, [token, location]);

  return isLoading ? <Spin /> : null;
};

export default LogoutPage;
