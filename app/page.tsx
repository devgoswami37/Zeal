import Header from "./components/header"
import HeroSlider from "./components/hero-slider"
import CollectionsSlider from "./components/collections-slider"
import FeatureCards from "./components/feature-cards"
import FeatureBoxes from "./components/feature-boxes"
import FourWaySection from "./components/four-way-section"
import ShopTheLookSection from "./components/shop-the-look-section"
import SaleTimer from "./components/sale-timer"
import SustainabilitySection from "./components/sustainability-section"

export default function Home() {
  return (
    <>
      <Header />
      <div className="pt-[108px] md:pt-24">
        <HeroSlider />
        <CollectionsSlider />
        <FeatureCards />
        <FourWaySection />
        <FeatureBoxes />
        <SustainabilitySection />
        <ShopTheLookSection />
        <SaleTimer />
      </div>
    </>
  )
}