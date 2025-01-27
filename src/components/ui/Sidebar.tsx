"use client";

import { useState } from "react";
import {
  FaHome,
  FaChartLine,
  FaUsers,
  FaFileAlt,
  FaCog,
  FaSignOutAlt,
  FaChevronLeft,
  FaChevronRight,
  FaParachuteBox,
  FaCoins,
} from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import { useClerk } from "@clerk/nextjs";

interface NavItemProps {
  href: string;
  icon: JSX.Element;
  text: string;
  logout?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({
  href,
  icon,
  text,
  logout = false,
}) => {
  const { signOut } = useClerk();

  return logout ? (
    <div
      onClick={() => signOut({ redirectUrl: "/" })}
      className="cursor-pointer"
    >
      <div className="flex items-center p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
        {icon}
        <span className="ml-3">{text}</span>
      </div>
    </div>
  ) : (
    <Link href={href}>
      <div className="flex items-center p-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
        {icon}
        <span className="ml-3">{text}</span>
      </div>
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`fixed top-0 left-0 h-screen p-4 bg-white dark:bg-gray-800 ${
        isOpen ? "w-64" : "w-20"
      } transition-width duration-300`}
    >
      <div className="flex items-center justify-between">
        {isOpen ? (
          <Image
            src="/logo.png"
            alt="Muebleria EDSI"
            className="h-auto w-auto"
            height={100}
            width={100}
          />
        ) : (
          <Image
            src="/Es.png"
            alt="Muebleria EDSI"
            className="h-6 w-auto"
            height={30}
            width={30}
          />
        )}
        <button
          className="text-gray-900 dark:text-gray-100"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaChevronLeft size={24} /> : <FaChevronRight size={24} />}
        </button>
      </div>
      <nav className="mt-8 space-y-2">
        <NavItem
          href="/comenunca"
          icon={<FaHome size={40} />}
          text={isOpen ? "Inicio" : ""}
        />

        <NavItem
          href="/comenunca/clientes"
          icon={<FaUsers size={40} />}
          text={isOpen ? "Clientes" : ""}
        />

        <NavItem
          href="/comenunca/orders"
          icon={<FaChartLine size={40} />}
          text={isOpen ? "Ventas" : ""}
        />
        <NavItem
          href="/comenunca/proveedores"
          icon={<FaParachuteBox size={40} />}
          text={isOpen ? "Proveedores" : ""}
        />
        <NavItem
          href="/comenunca/compras"
          icon={<FaCoins size={40} />}
          text={isOpen ? "Compras" : ""}
        />

        <NavItem
          href="/comenunca/informes"
          icon={<FaFileAlt size={40} />}
          text={isOpen ? "Informes" : ""}
        />
      </nav>
      <div className="mt-auto">
        <NavItem
          href=""
          icon={<FaSignOutAlt size={40} />}
          text={isOpen ? "Cerrar Sesión" : ""}
          logout={true}
        />
      </div>
    </div>
  );
};

export default Sidebar;
