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
    <main>
      <Header />
      <div className="pt-16">
        {/* Added padding to account for header height */}
        <HeroSlider />
        <CollectionsSlider />
        <FeatureCards />
        <FourWaySection />
        <FeatureBoxes />
        <SustainabilitySection />
        <ShopTheLookSection />
        <SaleTimer />
      </div>
    </main>
  )
}
