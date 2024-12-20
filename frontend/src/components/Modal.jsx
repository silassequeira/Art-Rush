import PropTypes from "prop-types";
import "../App.css";
import "../index.css";

function Modal({ children }) {
  return <div className="modal-content">{children}</div>;
}

Modal.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Modal;
