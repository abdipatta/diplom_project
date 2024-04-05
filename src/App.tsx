import { useContext, useEffect } from "react";
import { AppRoutes } from "./Routes/AppRoutes";
import { getStoragedItem } from "./utils/helpers/storageHelpers";
import { AuthContext } from "./contexts/AuthContext";

function App() {
  const ctx = useContext(AuthContext);

  useEffect(() => {
    const data = getStoragedItem("LOGIN_DATA");
    if (data !== undefined) {
      ctx?.setIsAuth(true);
      ctx?.setEmail(data.email);
      ctx?.setFullName(data.fullName);
    }
  }, [ctx]);

  return <AppRoutes />;
}

export default App;
