import { useEffect, useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import LangCurrencyModal from "../Lang&Currency/LangCurrencyModal";
import TrusonXBot from "../assets/truson-x-bot.png";
import TrusonFinCen from "../assets/truson-fin-cen.png";
import TrusonPackage from "../assets/truson-package.png";
import TrusonBuySell from "../assets/truson-Buy-Sell.png";

import "bootstrap-icons/font/bootstrap-icons.css";
import "../styles/mini-header.css";
import "../styles/blogs.css";

const blogSlides = [
  {
    id: "bot-wallet",
    kicker: "Introducing",
    accent: "TrusonXchanger",
    mediaTitle: "Bot Wallet",
    mediaImage: TrusonXBot,
    mediaAlt: "TrusonXchanger bot wallet",
    link: "/Xgolden",
    title: "Introducing the Bot Wallet: Simpler, Smarter, and Built for You",
    description:
      "Discover the new TrusonXchanger Bot Wallet - a faster, safer way to buy packages, reinvest profits, and support your team directly from one secure wallet.",
    date: "12 Nov 2025 3:17 pm",
  },
  {
    id: "fin-cen",
    kicker: "Announcing",
    accent: "Truson",
    mediaTitle: "FinCen",
    mediaImage: TrusonFinCen,
    mediaAlt: "Truson FinCen",
    link: "/FinCen",
    title: "FinCen Compliance: Clearer, Stronger, and Ready for Growth",
    description:
      "Stay ahead with our updated compliance flow designed to keep your funds protected and your operations seamless.",
    date: "02 Dec 2025 10:45 am",
  },
  {
    id: "free-package",
    kicker: "Introducing",
    accent: "Free",
    mediaTitle: "Package",
    mediaImage: TrusonPackage,
    mediaAlt: "Truson free package",
    link: "/FreePackage",
    title: "Start Faster with the Free Package: Simple, Secure, and Smooth",
    description:
      "Kickstart your journey with an easy onboarding flow, built-in guidance, and trusted security from day one.",
    date: "18 Jan 2026 8:00 am",
  },
  {
    id: "golden-buy-sell",
    kicker: "Introducing",
    accent: "Golden",
    mediaTitle: "Buy & Sell",
    mediaImage: TrusonBuySell,
    mediaAlt: "Truson buy and sell",
    link: "/GoldenBuySell",
    title: "Golden Buy & Sell: Faster Trades with Smarter Controls",
    description:
      "Trade confidently with improved pricing, instant fills, and a cleaner experience tailored for serious traders.",
    date: "05 Feb 2026 6:30 pm",
  },
];

function Blogs() {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % blogSlides.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="blogs-page">
      <Navbar
        expanded={expanded}
        onToggle={(nextExpanded) => setExpanded(nextExpanded)}
        collapseOnSelect
        bg="dark"
        sticky="top"
        variant="dark"
        expand="lg"
        className="py-3 shadow-sm nav-header"
        style={{}}
      >
        <Container fluid="lg">
          <Navbar.Brand
            as={NavLink}
            to="/"
            className="fs-3 fw-bold container-nav"
            style={{}}
          >
            TrusonXchanger
          </Navbar.Brand>

          {/* this is for hamburger button*/}
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto mb-2 mb-lg-0">
              <Nav.Link
                as={NavLink}
                to="/Spot"
                className="fw-medium nav-instant-green"
                onClick={() => setExpanded(false)}
              >
                Spot
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/Futures"
                className="fw-medium nav-instant-green"
                onClick={() => setExpanded(false)}
              >
                Futures
              </Nav.Link>
              <Nav.Link
                as={NavLink}
                to="/Support"
                className="fw-medium nav-instant-green"
                onClick={() => setExpanded(false)}
              >
                Support
              </Nav.Link>
            </Nav>
            {/* Right side items */}
            <Nav className="d-flex flex-column flex-lg-row gap-3">
              <LangCurrencyModal />

              <Button
                variant="success"
                size="md"
                as={NavLink}
                to="/login"
                className="px-4 fw-medium"
                onClick={() => setExpanded(false)}
              >
                Login
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <div className="blogs-hero">
        <Container fluid="xl">
          <div className="blogs-carousel">
            <div
              className="blogs-track"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {blogSlides.map((slide) => (
                <div className="blogs-slide" key={slide.id}>
                  <NavLink
                    to={slide.link}
                    className="blogs-card-link"
                    aria-label={`Open ${slide.title}`}
                  >
                    <article
                      className="blogs-card blogs-card--media"
                      style={{ "--media-image": `url(${slide.mediaImage})` }}
                      aria-hidden="true"
                    />
                  </NavLink>

                  <NavLink to={slide.link} className="blogs-card-link">
                    <article className="blogs-card blogs-card--content">
                      <h3 className="blogs-title">{slide.title}</h3>
                      <p className="blogs-description">{slide.description}</p>
                      <p className="blogs-date">{slide.date}</p>
                    </article>
                  </NavLink>
                </div>
              ))}
            </div>

            <div className="blogs-dots">
              {blogSlides.map((slide, index) => (
                <button
                  key={slide.id}
                  type="button"
                  className={`blogs-dot ${
                    index === activeIndex ? "active" : ""
                  }`}
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}

export default Blogs;
