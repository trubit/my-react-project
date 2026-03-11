import Trusoncoins from "../assets/trusoncoins.png";
import "../styles/logoRotationSection.css";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const logoRotatingSection = () => {
  return (
    <div className="rotating-section">
      <div className="container">
        <div className="content-wrapper">
          {/* Left Side - Trade Button */}
          <div className="left-side">
            <Button variant="success" className="trade-button" style={{}}>
              <Link
                to="/signup"
                className="  fw-medium fw-bold text-decoration-none text-white "
              >
                Trade Now
              </Link>
            </Button>
          </div>

          {/* Right Side - Rotating Logo */}
          <div className="right-side">
            <img
              src={Trusoncoins}
              alt="Truson Logo"
              className="rotating-logo"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default logoRotatingSection;
