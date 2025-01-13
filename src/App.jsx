import "./App.css";
import Routes from "./routes";
import { useAuth } from "./hooks/useAuth";
import { Toaster } from "react-hot-toast";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const { isInitialized } = useAuth();

  if (!isInitialized) return <LoadingScreen />;
  return (
    <>
      <Toaster position="top-right" duration={3000} containerClassName="z-50" />
      <Routes />
    </>
  );
}

export default App;
