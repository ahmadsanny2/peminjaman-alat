import Navbar from "@/components/Navbar/page";
import Hero from "./hero-section/page";
import Why from "./why-section/page";
import Feature from "./main-feature/page";

const HomePage = () => {
  return (
    <div className="">
      <Navbar />
      <Hero />
      <Why />
      <Feature />
    </div>
  );
};

export default HomePage;
