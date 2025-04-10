import React, { useState, useEffect } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // Add carousel styles
import img1 from "../../src/Assets/images/FisrtImage.jpg"
import img2 from "../../src/Assets/images/SecondImg.jpg";
import img3 from "../../src/Assets/images/thirdimg.jpg";

const HomeCarousel = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth); // Track window width

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth); // Update window width on resize
    };

    window.addEventListener("resize", handleResize); // Add event listener for resize

    return () => {
      window.removeEventListener("resize", handleResize); // Clean up event listener
    };
  }, []);

  const isMobile = windowWidth <= 768; // Check if screen width is mobile

  return (
    <Carousel
      showThumbs={false} // Hide thumbnails
      autoPlay={true} // Enable auto play
      infiniteLoop={true} // Loop the carousel
      interval={3000} // Interval time between slides
      showIndicators={false} // Hide indicators
      transitionTime={300} // Transition time
      // renderArrowPrev={() => null} // Disable previous button
      // renderArrowNext={() => null} // Disable next button
      showStatus={false}
    >
      <div>
        <img
          src={img1}
          alt="Slide 1"
          style={{
            objectFit: "cover",
            height: isMobile ? "250px" : "600px", // Adjust height for mobile
            width: "98%",
            borderRadius: "20px",
          }}
        />
      </div>
      <div>
        <img
          src={img2}
          alt="Slide 2"
          style={{
            objectFit: "cover",
            height: isMobile ? "250px" : "600px", // Adjust height for mobile
            width: "98%",
            borderRadius: "20px",
          }}
        />
      </div>
      <div>
        <img
          src={img3}
          alt="Slide 3"
          style={{
            objectFit: "cover",
            height: isMobile ? "250px" : "600px", // Adjust height for mobile
            width: "98%",
            borderRadius: "20px",
          }}
        />
      </div>
    </Carousel>
  );
};

export default HomeCarousel;
