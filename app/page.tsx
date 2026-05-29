import { SlideDeck } from "@/components/deck";
import { CoverSlide } from "@/components/slides/Cover";
import { ExecutiveSummarySlide } from "@/components/slides/ExecutiveSummary";
import { SituationSlide } from "@/components/slides/Situation";
import { MarketSlide } from "@/components/slides/Market";
import { PrioritiesSlide } from "@/components/slides/Priorities";
import { OKRsSlide } from "@/components/slides/OKRs";
import { RoadmapSlide } from "@/components/slides/Roadmap";
import { FinancialsSlide } from "@/components/slides/Financials";
import { ResourcesSlide } from "@/components/slides/Resources";
import { RisksSlide } from "@/components/slides/Risks";
import { KPIsSlide } from "@/components/slides/KPIs";
import { AsksSlide } from "@/components/slides/Asks";

export default function Page() {
  return (
    <SlideDeck customizeHref="/customize">
      <CoverSlide />
      <ExecutiveSummarySlide />
      <SituationSlide />
      <MarketSlide />
      <PrioritiesSlide />
      <OKRsSlide />
      <RoadmapSlide />
      <FinancialsSlide />
      <ResourcesSlide />
      <RisksSlide />
      <KPIsSlide />
      <AsksSlide />
    </SlideDeck>
  );
}
