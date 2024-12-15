import "../App.css";
import "../index.css";

function Home() {
  const images = [
    { src: "/images/image1.jpeg", alt: "Image 1" },
    { src: "/images/image2.jpg", alt: "Image 2" },
    { src: "/images/image3.jpg", alt: "Image 3" },
    { src: "/images/image4.jpg", alt: "Image 4" },
    { src: "/images/image5.jpg", alt: "Image 5" },
    { src: "/images/image6.jpg", alt: "Image 6" },
    { src: "/images/image7.jpg", alt: "Image 7" },
    { src: "/images/image8.jpeg", alt: "Image 8" },
    { src: "/images/image9.jpg", alt: "Image 9" },
    { src: "/images/image10.jpg", alt: "Image 10" },
    { src: "/images/image11.jpg", alt: "Image 11" },
    { src: "/images/image12.jpg", alt: "Image 12" },
  ];

  return (
    <div className="home">
      <div className="columnResponsive">
        {images.map((image, index) => (
          <div className="imageContainer" key={index}>
            <div className="flex">
              <h6>artistDisplayName</h6>
              <h6 className="greyColor">medium</h6>
              <h6 className="greyColor">objectDate</h6>
            </div>
            <div className="relative">
              <img src={image.src} alt={image.alt} />
              <div className="title-container">
                <h2 className="textShadow">title</h2>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
