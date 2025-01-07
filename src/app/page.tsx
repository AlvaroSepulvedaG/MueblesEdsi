import AboutMe from "../components/ui/Landing/AboutMe";
import Contact from "@/components/ui/Landing/Contact";
import Gallery from "../components/ui/Landing/Gallery";
import Hero from "../components/ui/Landing/Hero";
import Navbar from "../components/ui/Landing/Navbar";
import Services from "@/components/ui/Landing/Services";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <AboutMe />
      <Services />
      <Gallery />
      <Contact />
    </>
  );
}
