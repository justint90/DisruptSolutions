import React from "react";
import {
  interpolate,
  useCurrentFrame,
} from "remotion";

export const ScaleMatrix: React.FC = () => {
  const frame = useCurrentFrame();

  const sceneOpacity = interpolate(frame, [0, 8, 52, 60], [0, 1, 1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const warpSpeed = interpolate(frame, [0, 60], [0, 800]);
  const tunnelRotate = frame * 2.5;

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
      {/* Hyper-Speed Warp Lines */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.18) 0%, transparent 70%),
            repeating-linear-gradient(90deg, transparent, transparent 40px, rgba(0, 242, 254, 0.05) 40px, rgba(0, 242, 254, 0.05) 42px)
          `,
          transform: `scale(${1 + frame * 0.012}) translateY(${warpSpeed % 100}px)`,
        }}
      />

      {/* Rotating Tunnel Reticles */}
      <div
        style={{
          position: "absolute",
          width: 850,
          height: 850,
          borderRadius: "50%",
          border: "2px solid rgba(0, 242, 254, 0.3)",
          boxShadow: "0 0 80px rgba(0, 242, 254, 0.3), inset 0 0 80px rgba(2, 132, 199, 0.3)",
          transform: `scale(${1 + frame * 0.015}) rotate(${tunnelRotate}deg)`,
        }}
      />

      <div
        style={{
          position: "absolute",
          width: 600,
          height: 600,
          borderRadius: "50%",
          border: "1px dashed rgba(56, 189, 248, 0.4)",
          transform: `rotate(${-tunnelRotate * 1.5}deg)`,
        }}
      />

      {/* Kinetic Radial Radar Scan */}
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: `conic-gradient(from ${frame * 6}deg, rgba(0, 242, 254, 0.25), transparent 60%)`,
          border: "1px solid rgba(0, 242, 254, 0.4)",
        }}
      />
    </div>
  );
};
