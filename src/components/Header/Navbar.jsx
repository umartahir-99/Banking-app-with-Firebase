import { Link, useNavigate } from "react-router-dom";
import { Button, Space, Drawer } from "antd";
import { useState } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useAuth } from "../../context/Auth";
const Navbar = () => {
  const { isAuth, handleLogout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/account", label: "Account" },
    { to: "/transactions", label: "Transactions" },
  ];

  const handleMobileNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="">
      <nav className="sticky top-0 z-50 bg-white backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 
                className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent cursor-pointer hover:scale-105 transition-transform duration-300"
                onClick={() => navigate("/")}
              >
                BANK APP
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-center space-x-8">
                <ul className="ml-10 flex items-center space-x-8 list-none">
                  {navLinks.map((link) => (
                    <li key={link.to} className="relative text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 group">
                      <Link to={link.to}>{link.label}</Link>
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 group-hover:w-full transition-all duration-300"></span>
                    </li>
                  ))}
                  <li>
                    <Space size="middle">
                      {isAuth ? (
                        <Button
                          className="!rounded !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none !text-white hover:!from-blue-600 hover:!to-blue-700 hover:!shadow-lg hover:!shadow-blue-500/50 active:!scale-95 transition-all duration-500"
                          onClick={() => {
                            handleLogout();
                            navigate("/");
                          }}
                        >
                          Logout
                        </Button>
                      ) : (
                        <>
                          <Button
                            className="!rounded !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none !text-white hover:!from-blue-600 hover:!to-blue-700 hover:!shadow-lg hover:!shadow-blue-500/50 active:!scale-95 transition-all duration-500"
                            onClick={() => navigate("/auth/login")}
                          >
                            Login
                          </Button>
                          <Button
                            className="!rounded !font-medium !bg-gradient-to-r !from-blue-500 !to-blue-600 !border-none !text-white hover:!from-blue-600 hover:!to-blue-700 hover:!shadow-lg hover:!shadow-blue-500/50 active:!scale-95 transition-all duration-500"
                            onClick={() => navigate("/auth/register")}
                          >
                            Register
                          </Button>
                        </>
                      )}
                    </Space>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button
                type="text"
                icon={<MenuOutlined />}
                onClick={() => setMobileMenuOpen(true)}
                className="!text-gray-700"
              />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title="Menu"
        placement="right"
        onClose={() => setMobileMenuOpen(false)}
        open={mobileMenuOpen}
        className="md:hidden"
        closeIcon={<CloseOutlined />}
      >
        <div className="flex flex-col space-y-4">
          {navLinks.map((link) => (
            <Button
              key={link.to}
              type="text"
              block
              className="!text-left !h-auto !py-3 !text-gray-700 hover:!text-blue-600"
              onClick={() => handleMobileNavClick(link.to)}
            >
              {link.label}
            </Button>
          ))}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {isAuth ? (
              <Button
                type="primary"
                block
                className="!bg-gradient-to-r !from-blue-500 !to-blue-600"
                onClick={() => {
                  handleLogout();
                  navigate("/");
                  setMobileMenuOpen(false);
                }}
              >
                Logout
              </Button>
            ) : (
              <>
                <Button
                  type="primary"
                  block
                  className="!bg-gradient-to-r !from-blue-500 !to-blue-600"
                  onClick={() => handleMobileNavClick("/auth/login")}
                >
                  Login
                </Button>
                <Button
                  type="default"
                  block
                  className="!border-blue-600 !text-blue-600 hover:!bg-blue-50"
                  onClick={() => handleMobileNavClick("/auth/register")}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default Navbar
