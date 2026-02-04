import { Typography, Form, Input, Button } from "antd";
import { Link } from "react-router-dom";
import { useState } from "react";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, firestore } from "../../../config/firebase";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

const { Title, Paragraph } = Typography;
const { Item } = Form;

const initialState = { name: "", email: "", password: "", confirmPassword: "" };
const Register = () => {
  const [state, setState] = useState(initialState);
  const handleChange = (e) =>
    setState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleRegister = () => {
    let { name, email, password, confirmPassword } = state;

    name = name.trim();
    if (name.length < 3) {
      return window.toastify("Please enter your name", "error");
    }
    if (!window.isValidEmail(email)) {
      return window.toastify("Please enter your valid email", "error");
    }
    if (password.length < 6) {
      return window.toastify("Password must be atleast 6 characters", "error");
    }
    if (confirmPassword !== password) {
      return window.toastify("Password not match", "error");
    }
    

    const userData = {  name, email, status: "active", role: "Customer",};

    setIsProcessing(true);

    



    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        console.log('userCredential', userCredential)
        console.log('user', user)
        userData.uid = user.uid;
        await createUserProfile(userData)
          window.toastify("A new account has been succesfully created", "success");
          await signOut(auth);
          window.location.href = "/auth/login";
      }) 
      .catch((error) => {
        console.log(error)
        const errorCode = error.code;
        setIsProcessing(false);
        if(errorCode === "auth/email-already-in-use"){
          return window.toastify("Email already in use", "error");
        }


        window.toastify("Something went wrong while creating a new user")
      })
     
  };

  const createUserProfile = async(userData)=>{
    
      const user = userData
      user.createdAt = serverTimestamp()

        try {
      await setDoc(doc(firestore, "users", user.uid),user);
    
      window.toastify("User profile has been successfully created", "success");
    } catch (e) {
    console.error("Error adding document: ", e);
      window.toastify("User profile not created", "error");
    
    }finally{
    
      setIsProcessing(false);
    }

  }

const [isProcessing, setIsProcessing] = useState(false);
  return (
    <main className="auth flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
       <div className="container">
        <div className="card px-3 py-4 mx-auto w-full max-w-[400px] bg-white shadow-2xl rounded-xl animate-slideUp">
          <Title level={1} className="text-center !text-gray-800">
            REGISTER
          </Title>
          <Paragraph className="text-center">
            Already have an account?<Link to="/auth/login">Login</Link>
          </Paragraph>

          <Form layout="vertical">
            <Item label="Full Name" required>
              <Input
                type="text"
                size="large"
                placeholder="Enter your full name"
                name="name"
                onChange={handleChange}
              />
            </Item>
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
                type="text"
                size="large"
                placeholder="Enter your password"
                name="password"
                onChange={handleChange}
              />
            </Item>
            <Item label="Confirm Password" required>
              <Input.Password
                type="text"
                size="large"
                placeholder="Enter your password again"
                name="confirmPassword"
                onChange={handleChange}
              />
            </Item>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={isProcessing}
              onClick={handleRegister}
               className="
    !h-10 !px-2 !rounded-lg !font-medium
         h-11 px-8 text-base font-medium
                bg-gradient-to-r from-blue-500 to-blue-600
                hover:from-blue-600 hover:to-blue-700
                shadow-md hover:shadow-lg hover:scale-[1.02]
                transition-all duration-300
              "
            >
              Create Account
            </Button>
          </Form>
        </div>
      </div>
    </main>
  );
};

export default Register;
