import Image from "next/image";

const AboutMe = () => {
  return (
    <section
      id="sobreMi"
      className="overflow-hidden max-h-screen xl:h-[600px] lg:h-[500px] sm:h-[500px] h-[600px] sm:flex-row w-screen relative flex max-w-full flex-col "
    >
      <div className="lg:w-[30%] sm:w-[50%] w-full sm:h-full h-[30%] bg-[#393839] flex justify-center sm:items-center relative">
        <Image
          src="/about.webp"
          alt="Imagen 3"
          width={500}
          height={400}
          className="absolute sm:w-full w-[55%] lg:left-24 sm:left-20 sm:top-auto top-16 rounded-lg"
        />
      </div>
      <div className="sm:w-[70%] w-full bg-[#DC5F00] bg-[url('/diseño-horizontal.svg')] flex items-center justify-center sm:h-auto h-[70%]">
        <div className="text-gray-200 lg:ml-[10%] sm:ml-[30%] xl:max-w-[600px] max-w-[480px] sm:m-0 sm:mr-10 mx-10 sm:mt-0 mt-10">
          <h3 className="text-2xl mb-9 sm:text-start text-center">
            Sobre nosotros
          </h3>
          <p className="lg:leading-9 lg:text-[16px] text-sm">
            Aquí podrás seguir el estado de tu pedido. Por favor, ingresa tu RUT y el número de pedido.
          </p>
          <p className="lg:leading-9 lg:text-[16px] text-sm">
            ¡Te acompañamos en todo el proceso desde la toma de medidas hasta la
            instalación de tus proyectos!
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutMe;
