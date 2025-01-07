const Hero = () => {
  return (
    <section className="overflow-hidden max-h-screen h-screen relative bg-[url('/hero.png')]">
      <div className="mx-auto mt-16 max-w-screen-xl px-4 py-32 flex flex-col h-screen items-center justify-end text-gray-200 ">
        <div className="flex flex-col items-center gap-6">
          <h1 className="text-7xl">Muebles a medida</h1>
          <h3 className="text-3xl">Diseño único para cada espacio</h3>
        </div>
      </div>
    </section>
  );
};

export default Hero;
