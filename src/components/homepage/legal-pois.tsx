"use client";
import type { ReactNode } from "react";

const LegalPointsOfInterest = ({
  pointsOfInterest,
}: {
  pointsOfInterest: { title: string; content: ReactNode }[];
}) => {
  if (pointsOfInterest?.length === 0 || !pointsOfInterest) return null;
  return pointsOfInterest.map(({ title, content }) => (
    <div key={title}>
      <h2>{title}</h2>
      {content}
    </div>
  ));
};

export default LegalPointsOfInterest;
