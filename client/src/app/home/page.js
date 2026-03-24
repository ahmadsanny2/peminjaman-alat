import Navbar from "@/components/Navbar/page";
import Hero from "./hero-section/page";
import Why from "./why-section/page";
import Feature from "./main-feature-section/page";
import LevelUser from "./level-user-section/page";
import Footer from "./footer/page";
import Workflow from "./workflow-section/page";

const HomePage = () => {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Why />
      <Feature />
      <LevelUser />
      <Workflow />
      <Footer />
    </div>
  );
};

export default HomePage;
