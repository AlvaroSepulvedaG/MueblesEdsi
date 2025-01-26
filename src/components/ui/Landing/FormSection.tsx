"use client";

import React, { useState, useRef } from "react";
import { RegionesYcomunas } from "@/app/data/regiones"; 
import emailjs from "@emailjs/browser";

const TestForm = () => {
  const form = useRef<HTMLFormElement>(null);

  // Estado para manejar la selección de región y comuna
  const [regionSeleccionada, setRegionSeleccionada] = useState("");
  const [comunasFiltradas, setComunasFiltradas] = useState<string[]>([]);
  const [alertVisible, setAlertVisible] = useState(false);

  const sendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.current) {
      emailjs
        .sendForm(
          "service_2qvcgtd",
          "template_w3sbrnh",
          form.current,
          "Tf_7Z5zKz5N9PdZTt"
        )
        .then(
          () => {
            setAlertVisible(true); // Mostrar la alerta
            setTimeout(() => setAlertVisible(false), 3000); // Alerta de éxito
            form.current?.reset();
          },
          (error) => {
            alert("Error al enviar el mensaje. Por favor, inténtalo de nuevo."); // Alerta de error
            console.log("FAILED...", error.text);
          }
        );
    }
  };

  // Función para manejar el cambio en la selección de la región
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value;
    setRegionSeleccionada(region);

    // Filtrar las comunas correspondientes a la región seleccionada
    const regionData = RegionesYcomunas.regiones.find(
      (r) => r.NombreRegion === region
    );
    setComunasFiltradas(regionData ? regionData.comunas : []);
  };

  return (
    <div className="bg-transparent p-8 h-[600px] text-white sm:w-3/5 w-full flex flex-col justify-center lg:mr-36 m-0">
      <h2 className="text-center text-2xl font-semibold mb-6">Contáctanos</h2>
      <form ref={form} onSubmit={sendEmail} className="space-y-4">
        {alertVisible && (
          <div className="bg-green-500 text-white p-4 rounded-lg mb-4 text-center">
            ¡Mensaje enviado con éxito!
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Nombre"
            name="user_name"
            required
            className="p-3 bg-transparent rounded-3xl outline-none border-2"
          />
          <input
            type="text"
            placeholder="Apellido"
            name="user_lastname"
            required
            className="p-3 bg-transparent rounded-3xl outline-none border-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="email"
            name="user_email"
            required
            placeholder="Correo"
            className="p-3 bg-transparent rounded-3xl outline-none border-2"
          />
          <input
            type="tel"
            name="user_phone"
            required
            placeholder="Teléfono"
            className="p-3 bg-transparent rounded-3xl outline-none border-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select
            className="p-3 bg-transparent rounded-3xl outline-none border-2"
            required
            name="user_region"
            value={regionSeleccionada}
            onChange={handleRegionChange}
          >
            <option value="" className="text-black">
              Selecciona una región
            </option>
            {RegionesYcomunas.regiones.map((region, index) => (
              <option
                key={index}
                value={region.NombreRegion}
                className="text-black"
              >
                {region.NombreRegion}
              </option>
            ))}
          </select>
          <select
            className="p-3 bg-transparent rounded-3xl outline-none border-2"
            required
            name="user_comuna"
          >
            <option value="" className="text-black">
              Selecciona una comuna
            </option>
            {comunasFiltradas.map((comuna, index) => (
              <option key={index} value={comuna} className="text-black">
                {comuna}
              </option>
            ))}
          </select>
        </div>
        <textarea
          name="message"
          required
          placeholder="Escribe tu mensaje..."
          className="p-3 bg-transparent rounded-3xl w-full h-32 outline-none border-2"
        ></textarea>
        <button
          type="submit"
          value="Send"
          className="w-full py-3 bg-white text-orange-500 font-bold rounded-full hover:bg-gray-100"
        >
          Enviar
        </button>
      </form>
    </div>
  );
};

export default TestForm;
