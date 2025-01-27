"use client";

import { useEffect } from "react";

interface ScriptProps {
  src: string; // URL del script externo
  async?: boolean; // Cargar de forma asíncrona
  defer?: boolean; // Diferir la carga
  initFunction?: () => void; // Función de inicialización
}

const Script: React.FC<ScriptProps> = ({ src, async = false, defer = false, initFunction }) => {
  useEffect(() => {
    if (initFunction) {
      initFunction();
    }
  }, [initFunction]);

  return (
    <script src={src} async={async} defer={defer} />
  );
};

export default Script;
