import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Issues from "./pages/Issues";
import Report from "./pages/Report";
import Community from "./pages/Community";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardRouter from "./components/DashboardRouter";
import PrivateRoute from "./components/PrivateRoute";



function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/community" element={<Community />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/report" element={<Report />} />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <DashboardRouter />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
