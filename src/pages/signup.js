"use client"
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import routes from "../routes"
import { auth, googleAuthProvider } from '../../firebaseConfig';
import { signInWithPopup } from 'firebase/auth';

export default function SignupPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Clear errors when user types
    setErrors({});
  }, [firstName, lastName, email, password, confirmPassword]);

  const validateForm = () => {
    let formErrors = {};
    if (!firstName) formErrors.firstName = 'First name is required';
    if (!lastName) formErrors.lastName = 'Last name is required';
    if (!email) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Email is invalid';
    if (!password) formErrors.password = 'Password is required';
    else if (password.length < 6) formErrors.password = 'Password must be at least 6 characters';
    if (!confirmPassword) formErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) formErrors.confirmPassword = 'Passwords do not match';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          name: `${firstName} ${lastName}`,
          email,
          password,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}${routes.authentication.signup}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 201) {
          const data = response.data;
          toast.success(`${data.message}`);
          setTimeout(() => {
            router.push('/login'); 
          }, 2000);
        } else {
          setErrors({ form: response.data.message });
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error(error);
        setErrors({ form: 'An error occurred. Please try again.' });
        toast.error('An error occurred. Please try again.');
      }
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);
      const { user } = result;

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}${routes.authentication.google}`,
        {
          name: user.displayName,
          email: user.email,
          password: user.uid, // Use uid as password or handle it as per your logic
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem("token" , data.token)
        toast.success(`"Logged In Successfully`);
        setTimeout(() => {
          router.push('/'); 
        }, 2000);
      } else {
        setErrors({ form: response.data.message });
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      setErrors({ form: 'An error occurred. Please try again.' });
      toast.error('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md w-96 border-blue-600 border-2">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Signup</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <input
                type="text"
                placeholder="First Name"
                className={`w-full p-2 border rounded text-black ${errors.firstName ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Last Name"
                className={`w-full p-2 border rounded text-black ${errors.lastName ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
            </div>
            <div className="mb-4">
              <input
                type="email"
                placeholder="Email"
                className={`w-full p-2 border rounded text-black ${errors.email ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div className="mb-4">
              <input
                type="password"
                placeholder="Password"
                className={`w-full p-2 border rounded text-black ${errors.password ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="mb-6">
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full p-2 border rounded text-black ${errors.confirmPassword ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>
            {errors.form && <p className="text-red-500 text-sm mb-4">{errors.form}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Signup
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account? <Link href="/" className="text-blue-500">Login</Link>
            </p>
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-white text-blue-500 p-2 border border-blue-500 rounded hover:bg-blue-50"
              onClick={handleGoogleSignup}
            >
              Sign up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}