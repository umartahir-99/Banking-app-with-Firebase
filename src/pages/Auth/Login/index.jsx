import { Typography, Form, Input, Button } from "antd";
import { Link,useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../context/Auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../config/firebase";

const { Title, Paragraph } = Typography;
const { Item } = Form;

const initialState = { email: "", password: "" };
const Login = () => {
  const [state, setState] = useState(initialState);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleLogin = () => {
    let { email, password } = state;

    setIsProcessing(true);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        navigate("/dashboard");
        
        window.toastify("Login succesful", "success");
        console.log('user', user)
      }) 
      .catch((error) => {
        console.log(error)
        const errorCode = error.code;
          if(error.code === "auth/invalid-credential"){
          return window.toastify("Invalid email or password", "error");
        }
        window.toastify("Something went wrong while login", "error")
      })
  
  .finally(() => {
        setIsProcessing(false);
      })

  };
  const [isProcessing, setIsProcessing] = useState(false);


  return (
    <main className="auth flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container">
        <div className="card px-3 py-4 mx-auto w-full max-w-[400px] bg-white shadow-2xl rounded-xl animate-slideUp">
          <Title level={1} className="text-center !text-gray-800">
            LOGIN
          </Title>
          <Paragraph className="text-center">
            Don't have an account?
            <Link to="/auth/register"> Create an account</Link>
          </Paragraph>

          <Form layout="vertical">
            <Item label="Email" required>
              <Input
                type="text"
                size="large"
                placeholder="Enter your email"
                name="email"
                onChange={handleChange}

              />
              
            </Item>
            <Item label="Password" required>
              <Input.Password
                size="large"
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
              />
            </Item>

            <Button
                type="primary"
                className="!h-10 !px-2 !rounded-lg !font-medium
                h-11 px-8 text-base font-medium
                bg-gradient-to-r from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                shadow-md hover:shadow-lg hover:scale-[1.02]
                transition-all duration-300"
  
              size="large"
              block
              htmlType="submit"
              loading={isProcessing}
              onClick={handleLogin}
            >
              Login
            </Button>
          </Form>
            <Paragraph className="text-center !mt-4">
            Forgot Password?
            <Link to="/auth/forgot-password"> Reset Password</Link>
          </Paragraph>
        </div>
      </div>
    </main>
  );
};

export default Login;
