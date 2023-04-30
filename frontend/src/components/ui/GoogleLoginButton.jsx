import { useCallback } from "react";
import { AiOutlineGoogle } from "react-icons/ai";
import { Button } from "flowbite-react";

const GoogleLoginButton = () => {
  const openGoogleLoginPage = useCallback(() => {
    const googleAuthUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const redirectUri = "auth/login/google/";

    const scope = [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" ");

    const params = {
      response_type: "code",
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      redirect_uri: `${import.meta.env.VITE_BACKEND_URL}${redirectUri}`,
      prompt: "select_account",
      access_type: "offline",
      scope,
    };

    const urlParams = new URLSearchParams(params).toString();

    window.location.href = `${googleAuthUrl}?${urlParams}`;
  }, []);

  return (
    <Button
      onClick={openGoogleLoginPage}
      className="transition-colors"
      size={"xs"}
    >
      <div className="flex items-center gap-1">
        <AiOutlineGoogle size={18} />
        Login
      </div>
    </Button>
  );
};

export default GoogleLoginButton;
