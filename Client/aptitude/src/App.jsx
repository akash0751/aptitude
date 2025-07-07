import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import OtpVerificationPage from "./pages/OtpVerificationPage";

import EmailComponent from "./pages/EmailComponent";
import SetNewPasswordPage from "./pages/SetNewPasswordPage";
import AddPost from "./pages/AddPost";
import AddProfile from "./pages/AddProfile";
import YourProfile from "./pages/UserProfile";
import ForgotOTP from "./pages/ForgotOtp";

const App = () => {


  return(
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/addPost" element={<AddPost />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/otpVerificationPage" element={<OtpVerificationPage />} />
        <Route path ="otpVerify" element={<ForgotOTP />} />
        <Route path="/email" element={<EmailComponent />} />
        <Route path="/setNewPassworedPage" element={<SetNewPasswordPage />} />
        <Route path="/addProfile" element={<AddProfile />} />
        <Route path= "/myProfile" element={<YourProfile />} />
      </Routes>
    </Router>
  );
}

export default App;