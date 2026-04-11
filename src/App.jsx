import { Routes, Route, useLocation } from "react-router-dom";

import MainHeader from "./header-navigation/main-header";

import Home from "./pages/home";
import Login from "./pages/login";
import ForgotPassword from "./pages/forgot-password";
import Signup from "./pages/signup";
import ResetPassword from "./pages/reset-password";

import Artbitrage from "./pages/arbitrage";
import Subscription from "./pages/subscription";
import Trade from "./pages/trade";
import Contact from "./pages/contact";

import Terms from "./pages/terms";

import Dashborad from "./pages/Dashboard";

import Blogs from "./Blogs-page/blogs";
import BlogUpdate from "./Components/BlogUpdate";
import BlogDetail from "./Blogs-page/blog-detail";

import Spot from "./Crypto-Trade/Spot";
import Futures from "./Crypto-Trade/Futures";

import Support from "./Components/Support";

import "./App.css";

// Main app router and top-level layout.
const App = () => {
  const location = useLocation();

  const hideHeaderRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/terms",
    "/Dashboard",
    "/trade",
    "/Blogs",
    "/BlogUpdate",
    "/Spot",
    "/Futures",
    "/Support",

    //add any other auth pages here
  ];

  const hideHeader =
    hideHeaderRoutes.includes(location.pathname) ||
    location.pathname.startsWith("/blogs/");

  return (
    <>
      {!hideHeader && <MainHeader />} {/* this line hides it automatically*/}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/Dashboard" element={<Dashborad />} />
        <Route path="/arbitrage" element={<Artbitrage />} />
        <Route path="/subscription" element={<Subscription />} />
        <Route path="/trade" element={<Trade />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/Blogs" element={<Blogs />} />
        <Route path="/BlogUpdate" element={<BlogUpdate />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
        <Route path="/Spot" element={<Spot />} />
        <Route path="/Futures" element={<Futures />} />
        <Route path="/Support" element={<Support />} />
      </Routes>
    </>
  );
};

export default App;
