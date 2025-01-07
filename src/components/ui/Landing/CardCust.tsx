import Image from "next/image";

interface CardProps {
  id: number;
  image: string;
  title: string;
  description: string;
  isSelected: boolean;
  selectedCard: number;
  mobile: boolean;
  onClick: () => void;
  className?: string; // Añadir className opcional
}

const Card: React.FC<CardProps> = ({ image, title, description, isSelected, mobile, onClick, className }) => {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-100 ease-in-out xl:h-[250px] lg:h-[200px] md:h-[180px] sm:h-[150px] sm:px-3 ${
        isSelected ? 'w-[35vw] bg-[#DC5F00] sm:py-6' : 'sm:py-2 bg-gray-300'
      } flex-shrink-0 sm:pb-4 rounded-lg ${
        mobile ? (isSelected ? 'block' : 'hidden') : ''
      } ${className}`}
    >
      <div className={`flex sm: items-center ${isSelected ? 'sm:flex-row flex-col h-full ' : 'flex-col w-[180px]'}`}>
        <Image
          src={image}
          alt={title}
          className={`object-cover rounded-lg sm:py-4 ${isSelected ? 'xl:w-[900px] lg:w-[800px] md:w-[700px] sm:w-[600px] sm:py-0' : 'xl:w-[210px] lg:w-[170px] md:w-[160px] sm:w-[140px] w-full'}`}
          style={{ aspectRatio: isSelected ? '3 / 2' : '4 / 3' }}
          width={isSelected ? 300 : 150} // Proporciones relativas
          height={isSelected ? 150 : 100} // Ajustes relativos
        />
        <div className={`flex-col justify-around sm:flex sm:p-0 p-4 ${isSelected ? 'flex' : 'sm:flex hidden'}`}>
          <h3 className={`lg:text-lg text-sm font-bold lg:mb-2 md:mb-1 px-4 ${isSelected ? '' : ''}`}>{title}</h3>
          <p className={`px-4 lg:text-sm text-xs ${isSelected ? 'block' : 'hidden'} `}>{description}</p>
        </div>
      </div>
    </div>
  );
};

export default Card;
