import { ConfigProvider } from "antd";
import { useLocation } from 'react-router-dom';
import Routes from "./pages/Routes";
import ScreenLoader from "./components/Misc/ScreenLoader";
import { useAuth } from "./context/Auth";
import Header from './components/Header/Navbar'
import Footer from './components/Footer'

const App = () => {
  const { isAppLoading } = useAuth();
  const location = useLocation();
  const showHeaderFooter = !isAppLoading && !location.pathname.startsWith('/auth');

  return (
    <div className="min-h-screen flex flex-col">
      {showHeaderFooter && <Header />}
      <ConfigProvider
        theme={{
          token: { 
            colorPrimary: "#1890ff",  // Professional blue
            colorInfo: "#1890ff",
            colorSuccess: "#52C41A",
            colorWarning: "#FAAD14",
          },
          components: { Button: { controlOutlineWidth: 0 } },
        }}
      >
        <div className="flex-1">
          {!isAppLoading ? <Routes /> : <ScreenLoader />}
        </div>
      </ConfigProvider>
      {showHeaderFooter && <Footer />}
    </div>
  );
};

export default App;
