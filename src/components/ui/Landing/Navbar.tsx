"use client";

import React, { useState } from "react";
import Image from "next/image";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai"; // Iconos de menú

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="bg-transparent absolute w-full text-gray-200">
      <nav className="z-40 relative md:px-16 px-8 py-4 flex justify-between items-center bg-transparent">
        <a className="text-3xl font-bold leading-none" href="#">
          <Image
            src="/logo-blanco.png"
            alt="Muebleria EDSI"
            className="h-16 w-auto"
            width="400"
            height="300"
          />
        </a>

        {/* Menu Desktop */}
        <ul className="hidden md:flex gap-8 text-lg">
          <li>
            <a href="#sobreMi">Sobre mi</a>
          </li>
          <li>
            <a href="#servicios">Servicios</a>
          </li>
          <li>
            <a href="#galeria">Portafolio</a>
          </li>
          <li>
            <a href="#contacto">Contacto</a>
          </li>
        </ul>

        {/* Botón de Menú para pantallas pequeñas */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className="bg-[#393839] p-2 rounded-md">
            {isOpen ? (
              <AiOutlineClose className="text-3xl" />
            ) : (
              <AiOutlineMenu className="text-3xl" />
            )}
          </button>
        </div>
      </nav>

      {/* Menú lateral para pantallas pequeñas */}
      <div
        className={`fixed top-0 left-0 w-[250px] h-full bg-[#393839] text-white transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <a className="text-3xl font-bold leading-none" href="#">
          <Image
            src="/logo-blanco.png"
            alt="Muebleria EDSI"
            className="h-16 w-auto m-8"
            width="400"
            height="300"
          />
        </a>
        <ul className="flex flex-col items-start p-6 space-y-6 text-lg">
          <li>
            <a href="#servicios" onClick={toggleMenu}>
              Sobre mi
            </a>
          </li>
          <li>
            <a href="#servicios" onClick={toggleMenu}>
              Servicios
            </a>
          </li>
          <li>
            <a href="#galeria" onClick={toggleMenu}>
              Portafolio
            </a>
          </li>
          <li>
            <a href="#contacto" onClick={toggleMenu}>
              Contacto
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
