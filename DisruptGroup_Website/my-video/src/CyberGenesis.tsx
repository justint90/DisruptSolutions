import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

export const CyberGenesis: React.FC = () => {
  const frame = useCurrentFrame();

  // HUD circle rotations
  const hudRotate = interpolate(frame, [0, 60], [0, 120]);
  const hudInnerRotate = interpolate(frame, [0, 60], [0, -200]);
  const hudOuterRotate = interpolate(frame, [0, 60], [0, 60]);

  // Pulse & glow intensity
  const glowPulse = interpolate(
    Math.sin(frame * 0.15),
    [-1, 1],
    [0.8, 1.25]
  );

  // Fade out transition at the end of scene (frames 50 to 60)
  const sceneOpacity = interpolate(frame, [50, 60], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

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
      {/* 3D Perspective Cyber Grid */}
      <div
        style={{
          position: "absolute",
          inset: -120,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 242, 254, 0.09) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 242, 254, 0.09) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `perspective(500px) rotateX(55deg) translateY(${frame * 2}px)`,
          opacity: 0.85,
        }}
      />

      {/* Deep Radial Backlight */}
      <div
        style={{
          position: "absolute",
          width: 900,
          height: 900,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 242, 254, 0.22) 0%, rgba(2, 132, 199, 0.12) 45%, transparent 70%)",
          transform: `scale(${glowPulse})`,
          filter: "blur(50px)",
        }}
      />

      {/* Outer Holographic Reticle Ring */}
      <div
        style={{
          position: "absolute",
          width: 720,
          height: 720,
          borderRadius: "50%",
          border: "1px dashed rgba(0, 242, 254, 0.25)",
          transform: `rotate(${hudOuterRotate}deg)`,
        }}
      />

      {/* Mid Holographic Reticle Ring */}
      <div
        style={{
          position: "absolute",
          width: 540,
          height: 540,
          borderRadius: "50%",
          border: "2px solid rgba(2, 132, 199, 0.3)",
          borderTopColor: "rgba(0, 242, 254, 0.85)",
          borderBottomColor: "rgba(0, 242, 254, 0.85)",
          transform: `rotate(${hudRotate}deg)`,
          boxShadow: "0 0 30px rgba(0, 242, 254, 0.15)",
        }}
      />

      {/* Inner Fast-Spin Reticle */}
      <div
        style={{
          position: "absolute",
          width: 380,
          height: 380,
          borderRadius: "50%",
          border: "1px dotted rgba(0, 242, 254, 0.5)",
          borderLeftColor: "rgba(0, 242, 254, 0.95)",
          borderRightColor: "rgba(0, 242, 254, 0.95)",
          transform: `rotate(${hudInnerRotate}deg)`,
        }}
      />

      {/* Central Kinetic Energy Core */}
      <div
        style={{
          position: "absolute",
          width: 140,
          height: 140,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0, 242, 254, 0.85) 0%, rgba(2, 132, 199, 0.3) 60%, transparent 80%)",
          boxShadow: "0 0 50px rgba(0, 242, 254, 0.6), 0 0 100px rgba(2, 132, 199, 0.4)",
          transform: `scale(${glowPulse})`,
        }}
      />
    </div>
  );
};
