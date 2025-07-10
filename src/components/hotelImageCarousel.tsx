'use client';

import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export default function HotelImagesCarousel({ images }: Readonly<{ images: string[] }>) {
  return (
    <div className="max-w-7xl mx-auto mb-12">
      <Carousel
        showThumbs={false}
        infiniteLoop={true}
        showStatus={false}
        autoPlay={true}
        interval={3000}
        className="rounded-2xl overflow-hidden shadow-lg"
      >
        {images.map((img, i) => (
          <div key={"img_"+i} className="h-[600px] bg-gray-200">
            <img
              src={img}
              alt={`Hotel view ${i + 1}`}
              className="h-full w-full object-cover"
              loading="eager"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}
