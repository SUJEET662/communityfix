import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import IssuesPreview from "../components/IssuesPreview";
import CommunityPreview from "../components/CommunityPreview";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";

const Home = () => {
  return (
    <div className="home-page">
      <Hero />
      <Features />
      <IssuesPreview />
      <HowItWorks />
      <CommunityPreview />
      <Testimonials />
    </div>
  );
};

export default Home;
