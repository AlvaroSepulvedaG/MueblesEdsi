import React from "react";
import MapSection from "@/components/ui/Landing/MapSection";
import TestForm from "@/components/ui/Landing/FormSection";

const Contact = () => {
  return (
    <section
      id="contacto"
      className="overflow-hidden lg:h-[800px] h-full w-screen relative flex lg:flex-row flex-col max-w-full"
    >
      <div className="bg-[#393839] lg:w-[70%] w-full h-full flex lg:flex-row flex-col justify-center items-center">
        <TestForm />
      </div>
      <div className="lg:bg-[#DC5F00] lg:bg-[url('/diseño-horizontal.svg')] lg:w-[30%] w-full relative">
        <div className="lg:absolute h-full -left-52 lg:-left-52 top-44 z-50">
          <MapSection />
        </div>
      </div>
    </section>
  );
};

export default Contact;
