import React from "react";
import { IMonthsData } from "../../common/types";
import { getIndexesBetweenSelection } from "../../common/utils";
import { Content } from "./Content";
import { Title } from "./Title";

interface IMonthBoxProps {
  title: string;
  month: IMonthsData;
  maxAmount: number;
  isSelected: boolean;
  isMouseDown: boolean; // global mouse down state
  onMonthMouseDown: () => void;
  onMonthMouseUp: () => void;
  setBeingSelectedCount: React.Dispatch<React.SetStateAction<number>>;
  setCurrentlyFocusedIndex: React.Dispatch<
    React.SetStateAction<number | undefined>
  >;
  currentlyFocusedIndex?: number;
  firstSelectedIndex?: number;
}

export const MonthBox: React.FC<IMonthBoxProps> = ({
  title,
  month,
  maxAmount,
  isSelected,
  isMouseDown,
  currentlyFocusedIndex,
  firstSelectedIndex,
  onMonthMouseDown,
  onMonthMouseUp,
  setBeingSelectedCount,
  setCurrentlyFocusedIndex,
}) => {
  const [isBeingSelected, setIsBeingSelected] = React.useState(false);

  React.useEffect(() => {
    if (!isMouseDown) {
      setIsBeingSelected(false);
    }
  }, [isMouseDown]);

  React.useEffect(() => {
    if (
      currentlyFocusedIndex != null &&
      firstSelectedIndex != null &&
      Math.abs(currentlyFocusedIndex - firstSelectedIndex) >= 0
    ) {
      const monthsBetweenSelection = getIndexesBetweenSelection(
        firstSelectedIndex,
        currentlyFocusedIndex
      );

      if (!monthsBetweenSelection.includes(month.index)) {
        setIsBeingSelected(false);
      }
    }
  }, [firstSelectedIndex, currentlyFocusedIndex, month.index]);

  const incrementBeingSelectedCount = () => {
    setBeingSelectedCount((count: number) => count + 1);
  };

  const decrementBeingSelectedCount = () => {
    setBeingSelectedCount((count: number) => Math.max(0, count - 1));
  };

  React.useEffect(() => {
    if (!isBeingSelected) {
      decrementBeingSelectedCount();
    } else {
      incrementBeingSelectedCount();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBeingSelected]);

  const handleMouseDown = (event: React.MouseEvent) => {
    // handle only left-click
    if (event.button !== 0) {
      return;
    }

    setIsBeingSelected(true);
    onMonthMouseDown();
  };

  const handleMouseUp = (event: React.MouseEvent) => {
    // handle only left-click
    if (event.button !== 0) {
      return;
    }

    setIsBeingSelected(false);
    onMonthMouseUp();
  };

  const handleMouseEnter = (event: React.MouseEvent) => {
    // handle only left-click
    if (event.button !== 0) {
      return;
    }

    setIsBeingSelected(isMouseDown);

    if (isMouseDown) {
      setCurrentlyFocusedIndex(month.index);
    }
  };

  return (
    <>
      <div
        className={`box text-selection-none ${isSelected ? "clicked-box" : ""}`}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseEnter={handleMouseEnter}
      >
        <Title text={title} />
        <Content
          amount={month.importo}
          numOfDocs={month.documenti}
          maxAmount={maxAmount}
          isSelected={isSelected}
        />
      </div>
      <div
        className={`being-selected-box ${isBeingSelected ? "visible" : ""}`}
      ></div>
    </>
  );
};
