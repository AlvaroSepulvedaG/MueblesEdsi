import { useEffect } from "react";
import { Button } from "@/components/ui/button";

interface ModalProps {
  isVisible: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  closeText?: string;
  autoCloseDuration?: number;
  children?: React.ReactNode; // Tiempo en milisegundos para el cierre automático
}

export const Modal = ({
  isVisible,
  title = "Alerta",
  message,
  onClose,
  closeText = "Cerrar",
  autoCloseDuration,
  children,
}: ModalProps) => {
  useEffect(() => {
    if (isVisible && autoCloseDuration) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDuration);

      // Limpiar el temporizador si el componente se desmonta o si el modal se cierra antes
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCloseDuration, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[90%] max-w-md">
        {title && <h2 className="text-xl font-semibold mb-4">{title}</h2>}
        <p className="mb-6">{message}</p>
        <div className="flex justify-between">
          {children}

          <Button onClick={onClose} className="bg-[#DC5F00] mt-4">
            {closeText}
          </Button>
        </div>
      </div>
    </div>
  );
};
