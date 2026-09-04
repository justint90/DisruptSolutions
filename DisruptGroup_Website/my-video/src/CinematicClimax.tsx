import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

export const CinematicClimax: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const burstRadius = interpolate(frame, [0, 40], [100, 800]);
  const burstOpacity = interpolate(frame, [0, 40], [0.85, 0]);

  const coreScale = interpolate(Math.sin(frame * 0.15), [-1, 1], [0.9, 1.2]);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        backgroundColor: "#06070a",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        opacity: sceneOpacity,
      }}
    >
      {/* Background Energy Grid */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.25) 0%, rgba(2, 132, 199, 0.15) 40%, transparent 70%),
            linear-gradient(to right, rgba(0, 242, 254, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 242, 254, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 60px 60px, 60px 60px",
        }}
      />

      {/* Radiant Shockwave Burst */}
      <div
        style={{
          position: "absolute",
          width: burstRadius * 2,
          height: burstRadius * 2,
          borderRadius: "50%",
          border: "3px solid #00f2fe",
          boxShadow: "0 0 60px #00f2fe, inset 0 0 60px #0284c7",
          opacity: burstOpacity,
        }}
      />

      {/* Outer Glow Shield */}
      <div
        style={{
          position: "absolute",
          width: 650,
          height: 650,
          borderRadius: "50%",
          border: "2px solid rgba(0, 242, 254, 0.4)",
          boxShadow: "0 0 40px rgba(0, 242, 254, 0.25)",
          transform: `scale(${coreScale})`,
        }}
      />

      {/* High-Energy Pulse Core */}
      <div
        style={{
          position: "absolute",
          width: 180,
          height: 180,
          borderRadius: "50%",
          background: "radial-gradient(circle, #00f2fe 0%, #0284c7 50%, transparent 75%)",
          boxShadow: "0 0 60px rgba(0, 242, 254, 0.8), 0 0 120px rgba(2, 132, 199, 0.5)",
          transform: `scale(${coreScale})`,
        }}
      />
    </div>
  );
};
