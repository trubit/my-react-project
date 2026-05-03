import { Col, Container, Row } from "react-bootstrap";
import mainLogo from "../assets/mainLogo.png";
import AboutHighlightSection from "../Components/AboutHighlightSection";
import VisionMissionSection from "../components/VisionMissionSection";
import CoreValues from "../components/CoreValues";
import NewsletterSection from "../Homepage/NewsletterSection";
import NavigationSection from "../Components/NavigationSection";
import BottomBar from "../Components/BottomBar";
import "../styles/about.css";

const About = () => {
  return (
    <>
      <section className="about-hero">
        <div className="about-hero__bg-wrap" aria-hidden="true">
          <img
            src={mainLogo}
            alt=""
            className="about-hero__bg-logo about-hero__bg-logo--one"
          />
          <img
            src={mainLogo}
            alt=""
            className="about-hero__bg-logo about-hero__bg-logo--two"
          />
        </div>

        <Container fluid="xxl" className="about-hero__container">
          <Row className="justify-content-center">
            <Col xs={12} lg={11} className="text-center about-hero__content">
              <img
                src={mainLogo}
                alt="TrusonXchanger"
                className="about-hero__top-logo"
              />
              <p className="about-hero__brand">TrusonXchanger</p>
              <h1 className="about-hero__headline">
                Beyond Trading. Shaping The Future Of FinTech.
              </h1>
            </Col>
          </Row>
        </Container>
      </section>
      <AboutHighlightSection />
      <VisionMissionSection />
      <CoreValues />
      <NewsletterSection />
      <NavigationSection />
      <BottomBar />
    </>
  );
};

export default About;
