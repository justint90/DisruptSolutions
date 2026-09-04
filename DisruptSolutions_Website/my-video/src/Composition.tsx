import React from "react";
import { Composition, Sequence } from "remotion";
import { CyberGenesis } from "./CyberGenesis";
import { EngineeringPillars } from "./EngineeringPillars";
import { ScaleMatrix } from "./ScaleMatrix";
import { CinematicClimax } from "./CinematicClimax";

export const DisruptCinematic: React.FC = () => {
  return (
    <div
      style={{
        position: "relative",
        width: 1920,
        height: 1080,
        backgroundColor: "#07080d",
        overflow: "hidden",
      }}
    >
      {/* Phase 1: Genesis & Brand Awakening */}
      <Sequence from={0} durationInFrames={60} name="Phase 1: Genesis">
        <CyberGenesis />
      </Sequence>

      {/* Phase 2: Core Engineering Pillars */}
      <Sequence from={60} durationInFrames={80} name="Phase 2: Pillars">
        <EngineeringPillars />
      </Sequence>

      {/* Phase 3: Scale Matrix & Telemetry */}
      <Sequence from={140} durationInFrames={60} name="Phase 3: Scale Matrix">
        <ScaleMatrix />
      </Sequence>

      {/* Phase 4: Climax & Call to Action */}
      <Sequence from={200} durationInFrames={40} name="Phase 4: Climax">
        <CinematicClimax />
      </Sequence>
    </div>
  );
};

export const MyComposition = () => {
  return (
    <Composition
      id="DisruptCinematic"
      component={DisruptCinematic}
      durationInFrames={240}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
