import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

export const EngineeringPillars: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 10, 70, 80], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const node1Pulse = interpolate(Math.sin(frame * 0.2), [-1, 1], [0.8, 1.2]);
  const node2Pulse = interpolate(Math.sin(frame * 0.2 + 2), [-1, 1], [0.8, 1.2]);
  const node3Pulse = interpolate(Math.sin(frame * 0.2 + 4), [-1, 1], [0.8, 1.2]);

  const traceOffset = (frame * 6) % 100;

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
      {/* Background Matrix Grid */}
      <div
        style={{
          position: "absolute",
          inset: -50,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.15) 0%, transparent 60%),
            linear-gradient(to right, rgba(0, 242, 254, 0.06) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 242, 254, 0.06) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 50px 50px, 50px 50px",
        }}
      />

      {/* Kinetic Circuit Bus Traces */}
      <svg
        style={{
          position: "absolute",
          width: 1100,
          height: 600,
          overflow: "visible",
        }}
      >
        {/* Horizontal Bus Line */}
        <line
          x1="100"
          y1="300"
          x2="1000"
          y2="300"
          stroke="rgba(0, 242, 254, 0.25)"
          strokeWidth="2"
          strokeDasharray="8 8"
        />

        {/* Diagonal Interconnects */}
        <line x1="250" y1="300" x2="250" y2="160" stroke="rgba(0, 242, 254, 0.35)" strokeWidth="2" />
        <line x1="550" y1="300" x2="550" y2="440" stroke="rgba(0, 242, 254, 0.35)" strokeWidth="2" />
        <line x1="850" y1="300" x2="850" y2="160" stroke="rgba(0, 242, 254, 0.35)" strokeWidth="2" />

        {/* Pulsing Signal Wave */}
        <circle cx={250 + ((frame * 12) % 600)} cy="300" r="5" fill="#00f2fe" filter="drop-shadow(0 0 8px #00f2fe)" />
      </svg>

      {/* 3 Interconnected Holographic Node Spheres */}
      <div
        style={{
          position: "absolute",
          left: "22%",
          top: "28%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "2px solid #00f2fe",
          boxShadow: "0 0 35px rgba(0, 242, 254, 0.5), inset 0 0 20px rgba(0, 242, 254, 0.3)",
          transform: `scale(${node1Pulse})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "62%",
          width: 130,
          height: 130,
          borderRadius: "50%",
          border: "2px solid #38bdf8",
          boxShadow: "0 0 45px rgba(56, 189, 248, 0.5), inset 0 0 25px rgba(56, 189, 248, 0.3)",
          transform: `translate(-50%, -50%) scale(${node2Pulse})`,
        }}
      />

      <div
        style={{
          position: "absolute",
          right: "22%",
          top: "28%",
          width: 100,
          height: 100,
          borderRadius: "50%",
          border: "2px solid #00f2fe",
          boxShadow: "0 0 35px rgba(0, 242, 254, 0.5), inset 0 0 20px rgba(0, 242, 254, 0.3)",
          transform: `scale(${node3Pulse})`,
        }}
      />
    </div>
  );
};
