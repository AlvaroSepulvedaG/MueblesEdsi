import React from 'react';

const MapSection = () => {
  return (
    <div className="w-full h-full z-50 relative">
      <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1978.9146204261315!2d-70.54046351731608!3d-33.47211130308502!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662d1e2b95d69eb%3A0xd68b99953fcd634b!2sMuebles%20EDSI!5e0!3m2!1ses-419!2scl!4v1727225570093!5m2!1ses-419!2scl" className='2xl:w-[600px] xl:w-[550px] lg:w-[500px] w-full h-[450px]' loading="lazy"></iframe>
    </div>
  );
};

export default MapSection;