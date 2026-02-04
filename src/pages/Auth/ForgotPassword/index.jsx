import { Typography, Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../context/Auth";
import { auth } from "../../../config/firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const { Title, Paragraph } = Typography;
const { Item } = Form;

const initialState = { email: "" };
const ForgotPassword = () => {
  const { dispatch } = useAuth();

  const [state, setState] = useState(initialState);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ Add this state

  const navigate = useNavigate();

  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleForgotPassword = () => {
    let { email } = state;

    setIsProcessing(true);

    sendPasswordResetEmail(auth, email)
      .then(() => {
        window.toastify("Password reset email sent", "success");
        navigate("/auth/login");
      })
      .catch((error) => {
        console.error(error);
        window.toastify("Something went wrong.Please try again", "error");
      })
      .finally(() => {
        setIsProcessing(false);
      });
  };
  return (
    <main className="auth flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container">
        <div className="card px-3 py-4 mx-auto w-full max-w-[400px] bg-white shadow-2xl rounded-xl animate-slideUp">
          <Title level={1} className="text-center !text-gray-800">
            RESET PASSWORD
          </Title>
          <Paragraph className="text-center !mt-4">
            Remember Password?
            <Link to="/auth/register"> Login </Link>
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

            <Button
              type="primary"
              className="
    !h-10 !px-6 !rounded-lg !font-medium
      h-11 px-8 text-base font-medium
                bg-gradient-to-r from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                shadow-md hover:shadow-lg hover:scale-[1.02]
                transition-all duration-300
              "
              size="large"
              block
              htmlType="submit"
              onClick={handleForgotPassword}
            >
              Send Email
            </Button>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default ForgotPassword;
