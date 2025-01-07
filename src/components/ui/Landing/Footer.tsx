import Image from "next/image";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="flex flex-col md:flex-row items-center justify-between bg-gray-100 p-4 md:px-16 px-4 rounded-lg shadow-lg  w-full lg:pt-0 pt-8 absolute">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Image
          src="/logo.png"
          alt="Muebleria EDSI"
          className="h-16 w-auto"
          width="400"
          height="300"
        />
      </div>

      {/* Center content */}
      <div className="text-center my-4 md:my-0 md:flex-grow">
        <h3 className="text-xl font-bold mb-2">Muebles EDSI</h3>
        <p className="text-sm">+596 945 023 20</p>
        <p className="text-sm">contacto@mueblesedsi.cl</p>
        <p className="text-sm">Las Parcelas 8840, Peñalolen</p>
      </div>

      {/* Instagram link */}
      <div className="flex-shrink-0">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-800 hover:text-pink-600 transition-colors"
        >
          <FaInstagram className="text-3xl" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
