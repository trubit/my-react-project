import FirstSectionHome from "../Homepage/FirstSectionHome";
import SecondSectionHomePage from "../Homepage/SecondSectionHomePage";
import FeaturesSection from "../Components/FeaturesSection";
import ArbitrageSection from "../Components/ArbitrageSection";

// Homepage composition.
const Home = () => {
  return (
    <>
      <FirstSectionHome />
      <SecondSectionHomePage />
      <ArbitrageSection />
      <FeaturesSection />
    </>
  );
};

export default Home;
