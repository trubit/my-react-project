import { Container } from "react-bootstrap";
import "../styles/SecondSectionHomePage.css";
import { Link } from "react-router-dom";
import TrusonBuySell from "../assets/truson-Buy-Sell.png";
import TrusonFinCen from "../assets/truson-fin-cen.png";
import TrusonPackage from "../assets/truson-package.png";
import TrusonXBot from "../assets/truson-x-bot.png";

function SecondSectionHomePage() {
  const cards = [
    { image: TrusonBuySell, link: "/GoldenBuySell" },
    { image: TrusonFinCen, link: "/FinCen" },
    { image: TrusonPackage, link: "/FreePackage" },
    { image: TrusonXBot, link: "/Xgolden" },
  ];

  return (
    <div className="recent-updates-section">
      <Container fluid="xxl">
        <div className="text-center mb-5">
          <p className="transform-text">TRANSFORM YOUR CRYPTO INVESTMENTS</p>
          <h2 className="updates-title">Recent Updates</h2>
        </div>

        {/* Horizontal scroll – only images */}
        <div className="cards-container">
          {cards.map((card, index) => (
            <Link key={index} to={card.link} className="card-link-wrapper">
              {" "}
              {/*dynamic per card*/}
              <div className="card-wrapper">
                <img
                  src={card.image}
                  alt={`Update ${index + 1}`}
                  className="card-image"
                />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  );
}

export default SecondSectionHomePage;
