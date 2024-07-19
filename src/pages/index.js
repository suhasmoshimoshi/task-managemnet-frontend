"use client"
import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import Login from './login';
import Dashboard from './dashboard';
import Header from '@/components/Navbar'; // Adjust the path as per your project structure

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if localStorage is available
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      {isLoggedIn && <Header />} {/* Render header only if logged in */}
      {isLoggedIn ? <Dashboard /> : <Login />} {/* Render Dashboard if logged in, otherwise render Login */}
    </>
  );
}
