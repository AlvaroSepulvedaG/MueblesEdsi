import React from "react";
import Image from "next/image";

const Gallery = () => {
  return (
    <section id="galeria">
      <div className="container mx-auto py-8 h-[1000px] lg:block hidden">
        <h2 className="text-center text-3xl font-bold mb-6">
          Nuestros Proyectos
        </h2>
        <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[800px]">
          <div className="col-span-2 row-span-2 relative">
            <Image
              src="/cocina1.webp"
              alt="Imagen 1"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="col-span-1 row-span-1 relative">
            <Image
              src="/cocina2.webp"
              alt="Imagen 2"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="col-span-1 row-span-1 relative">
            <Image
              src="/instalation.webp"
              alt="Imagen 3"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="col-span-2 row-span-1 relative">
            <Image
              src="/desk.webp"
              alt="Imagen 4"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto py-8 h-full lg:hidden block">
        <h2 className="text-center sm:text-3xl text-2xl font-bold mb-6">
          Nuestros Proyectos
        </h2>
        <div className="flex flex-col gap-4 mx-5 h-full">
          <div className="aspect-video relative">
            <Image
              src="/cocina1.webp"
              alt="Imagen 1"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="w-full aspect-video relative">
            <Image
              src="/cocina2.webp"
              alt="Imagen 2"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
          <div className="w-full aspect-video relative">
            <Image
              src="/instalation.webp"
              alt="Imagen 3"
              layout="fill"
              objectFit="cover"
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Gallery;
