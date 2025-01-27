"use client";

import { useEffect } from "react";

const EmailScript = () => {

  useEffect(() => {

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    script.async = true;
    script.onload = () => {
      console.log("EmailJS script cargado");
      emailjs.init("JM98MA0bQWgBqbNoT"); // Clave pública
    };
    script.onerror = (error) => {
      console.error("Error loading EmailJS script:", error);
    };

    // Agregar el script al body
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Limpiar el script cuando el componente se desmonte
    };
  }, []);

  return null;
};

export default EmailScript;
