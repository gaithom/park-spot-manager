
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParking } from "@/context/parking";

const Index = () => {
  const { user } = useParking();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page for public users, dashboard if logged in
    if (user.isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/home");
    }
  }, [user.isLoggedIn, navigate]);

  return null; // This component just redirects
};

export default Index;
