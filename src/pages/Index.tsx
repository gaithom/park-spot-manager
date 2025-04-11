import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParking } from "@/context/parking";

const Index = () => {
  const { user } = useParking();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to dashboard if logged in, otherwise to login
    if (user.isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  }, [user.isLoggedIn, navigate]);

  return null; // This component just redirects
};

export default Index;
