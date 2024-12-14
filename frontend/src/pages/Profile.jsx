import "../App.css";

function Profile() {
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
    <div className="profile columnResponsive">
      {images.map((image, index) => (
        <div className="imageContainer" key={index}>
          <img src={image.src} alt={image.alt} />
        </div>
      ))}
    </div>
  );
}

export default Profile;
