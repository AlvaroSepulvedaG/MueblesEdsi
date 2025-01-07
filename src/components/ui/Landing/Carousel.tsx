"use client";
import { useState } from "react";
import {
  FaRegArrowAltCircleLeft,
  FaRegArrowAltCircleRight,
} from "react-icons/fa";
import Card from "./CardCust";

const Carousel: React.FC = () => {
  const [selectedCard, setSelectedCard] = useState(0);

  const cards = [
    {
      id: 0,
      image: "/measure.webp",
      title: "Toma de medidas",
      description:
        "Tomamos las medidas de tus espacios para que tus muebles siempre encajen a la perfección.",
    },
    {
      id: 1,
      image: "/construction.webp",
      title: "Hechos a su gusto",
      description:
        "Descríbenos el diseño que tienes en mente, nosotros nos encargamos de hacerlo realidad",
    },
    {
      id: 2,
      image: "/instalation.webp",
      title: "Entrega e instalación",
      description:
        "Una vez terminados sus muebles son entregados e instalados a domicilio para que pueda disfrutarlos.",
    },
  ];

  const handlePrevClick = () => {
    setSelectedCard((prev) => (prev === 0 ? cards.length - 1 : prev - 1));
  };

  const handleNextClick = () => {
    setSelectedCard((prev) => (prev === cards.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="max-w-full md:block hidden">
        <div className="flex items-center justify-center sm:space-x-4  relative max-w-full">
          <button
            className="absolute xl:left-20 sm:left-2 left-4 text-3xl p-2 hover:text-gray-600 z-10"
            onClick={handlePrevClick}
          >
            <FaRegArrowAltCircleLeft size={42} className="" />
          </button>
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              image={card.image}
              title={card.title}
              description={card.description}
              isSelected={selectedCard === card.id}
              selectedCard={selectedCard}
              mobile={false}
              onClick={() => setSelectedCard(card.id)}
            />
          ))}
          <button
            className="absolute xl:right-20 sm:right-2 rigth-4 text-3xl p-2 hover:text-gray-600 z-10"
            onClick={handleNextClick}
          >
            <FaRegArrowAltCircleRight size={42} className="" />
          </button>
        </div>
      </div>

      <div className="max-w-full md:hidden block">
        <div className="flex items-center justify-center sm:space-x-4  relative max-w-full">
          <button
            className="absolute p xl:left-20 sm:left-5 left-2 text-3xl p-2 hover:text-gray-600 z-10"
            onClick={handlePrevClick}
          >
            <FaRegArrowAltCircleLeft size={42} className="" />
          </button>
          {cards.map((card) => (
            <Card
              key={card.id}
              id={card.id}
              image={card.image}
              title={card.title}
              description={card.description}
              isSelected={selectedCard === card.id}
              selectedCard={selectedCard}
              mobile={true}
              onClick={() => setSelectedCard(card.id)}
              className="w-[60%] pt-4 px-4"
            />
          ))}
          <button
            className="absolute xl:right-20 sm:right-5 right-2 text-3xl p-2 hover:text-gray-600 z-10"
            onClick={handleNextClick}
          >
            <FaRegArrowAltCircleRight size={42} className="" />
          </button>
        </div>
      </div>
    </>
  );
};

export default Carousel;
