import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../../utils/Firebase';
import { authDataContext } from '../context/AuthContext';
import { userDataContext } from '../context/UserContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { IoEye, IoEyeOutline } from 'react-icons/io5';
import Loading from '../components/Loading';

import Logo from "../assets/logo.png";
import google from '../assets/google.png';

function Registration() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { serverUrl } = useContext(authDataContext);
  const { getCurrentUser } = useContext(userDataContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/registration`,
        { name, email, password },
        { withCredentials: true }
      );
      toast.success("User Registration Successful");
      getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("User Registration Failed");
    } finally {
      setLoading(false);
    }
  };

  const googleSignup = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      const user = response.user;
      const idToken = await user.getIdToken(); // ✅ Get secure token

      // Send token to backend
      const result = await axios.post(
        `${serverUrl}/api/auth/googlelogin`,
        { idToken },
        { withCredentials: true }
      );

      toast.success("Google Sign-In Successful");
      getCurrentUser();
      navigate("/");
    } catch (error) {
      console.error("Google Sign-In Failed:", error);
      toast.error("Google Sign-In Failed");
    }
  };

  return (
    <div className='w-[100vw] h-[100vh] bg-gradient-to-l from-[#141414] to-[#0c2025] text-white flex flex-col items-center justify-start'>
      {/* Header */}
      <div className='w-full h-[80px] flex items-center px-8 gap-2 cursor-pointer' onClick={() => navigate("/")}>
        <img className='w-[40px]' src={Logo} alt="Logo" />
        <h1 className='text-[22px] font-sans'>BotCart</h1>
      </div>

      {/* Title */}
      <div className='w-full h-[100px] flex flex-col items-center justify-center gap-2'>
        <span className='text-[25px] font-semibold'>Registration Page</span>
        <span className='text-[16px]'>Welcome to BotCart, Place your order</span>
      </div>

      {/* Form Card */}
      <div className='max-w-[600px] w-[90%] h-[500px] bg-[#00000025] border border-[#96969635] backdrop:blur-2xl rounded-lg shadow-lg flex items-center justify-center'>
        <form onSubmit={handleSignup} className='w-[90%] h-[90%] flex flex-col items-center justify-start gap-5'>
          
          {/* Google Login */}
          <div
            className='w-full h-[50px] bg-[#42656cae] rounded-lg flex items-center justify-center gap-3 cursor-pointer'
            onClick={googleSignup}
          >
            <img src={google} alt="Google" className='w-[20px]' />
            Registration with Google
          </div>

          <div className='w-full flex items-center justify-center gap-2 text-[#969696] text-sm'>
            <div className='w-[40%] h-[1px] bg-[#96969635]'></div>
            OR
            <div className='w-[40%] h-[1px] bg-[#96969635]'></div>
          </div>

          {/* Input Fields */}
          <div className='w-full flex flex-col items-center justify-center gap-4 relative'>
            <input
              type="text"
              placeholder='UserName'
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent px-4 font-semibold placeholder-white placeholder-opacity-80 shadow-lg'
            />
            <input
              type="email"
              placeholder='Email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className='w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent px-4 font-semibold placeholder-white placeholder-opacity-80 shadow-lg'
            />
            <input
              type={show ? "text" : "password"}
              placeholder='Password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full h-[50px] border-2 border-[#96969635] rounded-lg bg-transparent px-4 font-semibold placeholder-white placeholder-opacity-80 shadow-lg'
            />
            {show ? (
              <IoEye className='absolute right-4 top-[155px] w-5 h-5 cursor-pointer' onClick={() => setShow(false)} />
            ) : (
              <IoEyeOutline className='absolute right-4 top-[155px] w-5 h-5 cursor-pointer' onClick={() => setShow(true)} />
            )}
          </div>

          {/* Submit Button */}
          <button type="submit" className='w-full h-[50px] bg-[#6060f5] rounded-lg mt-3 font-semibold text-lg flex items-center justify-center'>
            {loading ? <Loading /> : "Create Account"}
          </button>

          <p className='text-sm'>
            Already have an account?{" "}
            <span className='text-[#5555f6cf] font-semibold cursor-pointer' onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registration;
