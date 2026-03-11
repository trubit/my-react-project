import LiveCryptoHomePage from "../Components/LiveCryptoHomePage";
import LogoRotatingSection from "../Components/logoRotationSection";
import "../styles/FirstSectionHome.css";
import { Card } from "react-bootstrap";

const FirstSectionHome = () => {
  return (
    <Card className="home-page bg-dark text-white min-vh-100 d-flex flex-column">
      <div
        className="arbitrage-section text-center position-relative d-flex flex-column align-items-center
       justify-content-center flex-grow-1"
      >
        <LogoRotatingSection />
        {/* Headline */}
        <h1 className="display-4 fw-bold mb-3">
          First CEX to feature{" "}
          <span className="arbitrage-headline">arbitrage trading</span>
        </h1>

        {/* Description */}
        <p className="fs-5 mb-5">
          Trade cryptocurrencies across different exchanges through
          Trusonxchanger Arbitrage Trading feature
          <br />
          and enjoy the benefits of price differentials between different
          exchanges.
        </p>
      </div>

      {/* LiveCryptoHomePage Integrated Below (in same background) */}
      <div className="live-crypto-section bg-dark py-5">
        <LiveCryptoHomePage />
      </div>
    </Card>
  );
};

export default FirstSectionHome;
