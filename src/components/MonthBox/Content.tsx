import React from "react";

interface IContentProps {
  amount: number;
  numOfDocs: number;
  maxAmount: number;
  isSelected: boolean;
}

export const Content: React.FC<IContentProps> = ({
  amount,
  numOfDocs,
  maxAmount,
  isSelected,
}) => {
  const height = `${Number((100 * amount) / maxAmount).toFixed(0)}%`;

  return (
    <div className="content">
      <div className="invoice-indicator" style={{ height }}></div>
      <div
        className={`selected-indicator ${isSelected ? "selected" : ""}`}
      ></div>
      <div className="info-container">
        <p className="doc-number">{numOfDocs} doc.</p>
        <p className="amount">{amount} €</p>
      </div>
    </div>
  );
};
