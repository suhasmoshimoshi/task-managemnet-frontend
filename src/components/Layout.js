import { useEffect , useState } from 'react';
import Navbar from './Navbar';




const Layout = ({ children }) => {



  return (
    <div className="min-h-screen bg-black text-white">
    <Navbar />
      <main className=" mx-auto ">
        {children}
      </main>
    </div>
  );
};

export default Layout;