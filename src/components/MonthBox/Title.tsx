import React from "react";

interface ITitleProps {
  text: string;
}

export const Title: React.FC<ITitleProps> = ({ text }) => {
  return (
    <div className="title">
      <span>{text}</span>
    </div>
  );
};
