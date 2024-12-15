import PropTypes from "prop-types";

export const Vector = ({ className }) => {
  return (
    <>
      <img className={className} alt="Decorative vector graphic" />
      <div aria-label="rating-component">
        <></>
      </div>
    </>
  );
};

Vector.propTypes = {
  className: PropTypes.string,
};

export default Vector;
