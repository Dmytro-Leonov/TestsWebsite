import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

function Login() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error(error);
      navigate("/");
    } else if (token) {
      localStorage.setItem("token", token);
      window.location.href = "/";
    } else {
      navigate("/");
    }
  }, [searchParams, navigate]);

  return <>Verifying your login...</>;
}

export default Login;
