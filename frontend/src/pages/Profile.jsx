import "../App.css";
import { NavLink } from "react-router-dom";

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

  const limitedImages = images.slice(0, 5);

  return (
    <div className="profile">
      <div className="layoutGrid">
        <div className="flex spaceEvenly">
          <div className="imageContainer imgRound">
            <img src="/images/image1.jpeg" alt="Image 1" />
          </div>
          <span>username</span>
          <NavLink className="button buttonGrey" to="/editprofile">
            Edit Profile
          </NavLink>
        </div>

        <div className="flex spaceEvenly borderAround">
          <div className="flex column">
            <span className="greyColor">Art Liked</span>
            <h4>25</h4>
          </div>
          <div className="flex column">
            <span className="greyColor">Artists</span>
            <h4>25</h4>
          </div>
          <div className="flex column">
            <span className="greyColor">Favorite Art</span>
            <h4>25</h4>
          </div>
        </div>
      </div>

      <div className="flex column marginBottom">
        <div className="flex alignItemsLeft fullWidth">
          <h3>Favorite</h3>
          <span>&#9733;</span>
        </div>

        <div className="favorite restrictiveGrid">
          {limitedImages.map((image, index) => (
            <div className="imageContainer noMargin" key={index}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>

      <div className="flex column">
        <div className="flex alignItemsLeft fullWidth">
          <h3>All Saved Artworks</h3>
          <span>&#9829;</span>
        </div>
        <div className="columnResponsive">
          {images.map((image, index) => (
            <div className="imageContainer" key={index}>
              <img src={image.src} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Profile;
