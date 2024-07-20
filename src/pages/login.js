import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, googleAuthProvider } from '../../firebaseConfig';
import routes from "../routes"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const router = useRouter();

  useEffect(() => {
    // Clear errors when user types
    setErrors({});
  }, [email, password]);

  const validateForm = () => {
    let formErrors = {};
    if (!email) formErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) formErrors.email = 'Email is invalid';
    if (!password) formErrors.password = 'Password is required';
    else if (password.length < 6) formErrors.password = 'Password must be at least 6 characters';
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const payload = {
          email,
          password,
        };

        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_BASE_URL}${routes.authentication.login}`,
          payload,
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.status === 200) {
          const data = response.data;
          localStorage.setItem('token', data.token); // Store actual token received from API
          toast.success('Login successful!');
          setTimeout(() => {
            router.push('/'); // Redirect to dashboard or home page
          }, 2000);
        } else {
          setErrors({ form: response.data.message }); // Set error message from API response
          toast.error(response.data.message);
        }
      } catch (error) {
        setErrors({ form: 'An error occurred. Please try again.' }); // Handle network or other errors
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
        console.log(data)
        localStorage.setItem("token" , data.token)
        toast.success(`"Logged In Successfully`);
        setTimeout(() => {
       window.location.reload()
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
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Login</h2>
          <form onSubmit={handleSubmit}>
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
            <div className="mb-6">
              <input
                type="password"
                placeholder="Password"
                className={`w-full p-2 border rounded text-black ${errors.password ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'}`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            {errors.form && <p className="text-red-500 text-sm mb-4">{errors.form}</p>}
            <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
              Login
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account? <Link href="/signup" className="text-blue-500">Signup</Link>
            </p>
          </div>
          <div className="mt-4">
            <button
              onClick={handleGoogleSignup}
              className="w-full bg-white text-blue-500 p-2 border border-blue-500 rounded hover:bg-blue-50"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
