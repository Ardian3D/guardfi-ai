import { HeroLight } from "@/components/landing/HeroLight";
import { SolutionsLight } from "@/components/landing/SolutionsLight";
import { FeaturesLight } from "@/components/landing/FeaturesLight";
import { IntegrationsLight } from "@/components/landing/IntegrationsLight";
import { HowItWorksLight } from "@/components/landing/HowItWorksLight";
import { PricingLight } from "@/components/landing/PricingLight";

export default function LandingPage() {
  return (
    <>
      <HeroLight />
      <SolutionsLight />
      <FeaturesLight />
      <IntegrationsLight />
      <HowItWorksLight />
      <PricingLight />
    </>
  );
}
