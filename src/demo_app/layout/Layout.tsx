import React from "react";
import Router from "../router/Routes";
import Navbar from "../components/Navbar/Navbar";

const Layout: React.FC = () => {
  return (
    <div className={`relative`}>
      <Navbar />

      <main className={`  dark:bg-bg-primary-dark  pt-16 h-full w-full o `}>
        <Router />
      </main>
    </div>
  );
};

export default Layout;
