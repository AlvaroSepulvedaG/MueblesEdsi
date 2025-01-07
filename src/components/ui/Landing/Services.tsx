import Carousel from "@/components/ui/Landing/Carousel";

const Services = () => {
  return (
    <section
      id="servicios"
      className="overflow-hidden max-h-screen xl:h-[550px] sm:h-[500px] h-[500px] w-screen relative flex flex-col justify-center max-w-full"
    >
      <div className="h-[70%] flex justify-center text-2xl md:mt-20 mt-10 font-bold">
        <h3>Nuestros servicios</h3>
      </div>
      <div className="h-[30%] bg-[#393839] bg-[url('/diseño-horizontal-delgado.svg')]">
        <div className="absolute w-screen bottom-20">
          <Carousel />
        </div>
      </div>
    </section>
  );
};

export default Services;
