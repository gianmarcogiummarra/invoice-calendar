import React from "react";
import { monthNames } from "../../common/definitions";
import { IMonthsData } from "../../common/types";
import {
  addMonthsToArray,
  getIndexesBetweenSelection,
  getMultiSelectIndexes,
  removeMonthsFromArray,
} from "../../common/utils";
import { getMonthsData } from "../../services/data";
import { MonthBox } from "../MonthBox/MonthBox";

interface IInvoiceCalendarProps {
  source: string;
}

export const InvoiceCalendar: React.FC<IInvoiceCalendarProps> = ({
  source,
}) => {
  const [months, setMonths] = React.useState<IMonthsData[]>([]);
  const [maxAmount, setMaxAmount] = React.useState(0);
  const [monthsToShow, setMonthsToShow] = React.useState<IMonthsData[]>([]);
  const [multiSelectFirstMonth, setMultiSelectFirstMonth] =
    React.useState<number>();
  const [isMouseDown, setIsMouseDown] = React.useState(false);
  const [beingSelectedCount, setBeingSelectedCount] = React.useState(0);
  const [currentlyFocusedIndex, setCurrentlyFocusedIndex] =
    React.useState<number>();
  const [networkError, setNetworkError] = React.useState(false);

  React.useEffect(() => {
    getMonthsData(source)
      .then((monthsData) => {
        setMaxAmount(Math.max(...monthsData.map((month) => month.importo)));
        setMonths(monthsData);
      })
      .catch((error) => {
        console.error(error);
        setNetworkError(true);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateMonthsToShow = (
    monthIndexesToAdd: number[] = [],
    monthIndexesToRemove: number[] = []
  ) => {
    // remove months to remove
    const monthsToKeep = removeMonthsFromArray(
      monthsToShow,
      monthIndexesToRemove
    );
    // add newly selected months
    let newMonths = addMonthsToArray(months, monthsToKeep, monthIndexesToAdd);

    // update state
    setMonthsToShow(newMonths);
    setMultiSelectFirstMonth(undefined);
  };

  const onMonthMouseDown = (monthIndex: number) => {
    setIsMouseDown(true);

    // set current month as first selected
    const newMonths = [
      ...months.map((month) => ({
        ...month,
        isFirstSelected: monthIndex === month.index,
        isLastSelected: false,
      })),
    ];
    setMonths(newMonths);
    setMultiSelectFirstMonth(monthIndex);
  };

  const onMonthMouseUp = React.useCallback(
    (monthIndex: number) => {
      setIsMouseDown(false);

      // set current month as last selected
      const newMonths = [
        ...months?.map((month) => ({
          ...month,
          isFirstSelected: false,
          isLastSelected: monthIndex === month.index,
        })),
      ];

      setMonths(newMonths);

      if (multiSelectFirstMonth === monthIndex) {
        // just one month clicked
        if (
          monthsToShow.length === 1 &&
          monthsToShow.find((month) => monthIndex === month.index)
        ) {
          // if the selected month was selected, unselect it
          updateMonthsToShow([], [...Array(monthNames.length).keys()]);
        } else {
          // mark as selected
          updateMonthsToShow(
            [monthIndex],
            [...Array(monthNames.length).keys()]
          );
        }
      } else {
        // multiple selection with mouse over multiple elements
        const { indexesToRemove, firstMonth, lastMonth } =
          getMultiSelectIndexes(monthIndex, multiSelectFirstMonth);

        const monthsBetweenSelection = getIndexesBetweenSelection(
          firstMonth ?? 0,
          lastMonth
        );

        updateMonthsToShow(monthsBetweenSelection, indexesToRemove);
      }

      setCurrentlyFocusedIndex(undefined);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [multiSelectFirstMonth, monthsToShow]
  );

  return (
    <div
      className="container"
      onMouseUp={(event) => {
        // handle only left-click
        if (event.button !== 0) {
          return;
        }

        setIsMouseDown(false);
      }}
    >
      {!networkError ? (
        <>
          <div className="calendar">
            {months?.map((month, index) => {
              const isSelected = !!monthsToShow.find(
                (month) => month.name === monthNames[index]
              );

              return (
                <div key={index}>
                  <MonthBox
                    title={monthNames[index]}
                    month={month}
                    maxAmount={maxAmount}
                    isSelected={isSelected}
                    onMonthMouseDown={() => onMonthMouseDown(index)}
                    onMonthMouseUp={() => onMonthMouseUp(index)}
                    isMouseDown={isMouseDown}
                    setBeingSelectedCount={setBeingSelectedCount}
                    currentlyFocusedIndex={currentlyFocusedIndex}
                    setCurrentlyFocusedIndex={setCurrentlyFocusedIndex}
                    firstSelectedIndex={multiSelectFirstMonth}
                  />
                </div>
              );
            })}
          </div>
          <div>
            <p className="hint">
              {isMouseDown ? (
                beingSelectedCount === 1 ? (
                  "Trascina per selezionare un intervallo di mesi"
                ) : beingSelectedCount > 1 ? (
                  "Rilascia il mouse per confermare la selezione"
                ) : (
                  <br />
                )
              ) : (
                <br />
              )}
            </p>
          </div>
          <div>
            <ul>
              {monthsToShow?.map((month, index) => {
                return (
                  <li key={index}>
                    {month.name}: {month.documenti} doc., importo:{" "}
                    {month.importo}
                  </li>
                );
              })}
            </ul>
          </div>
        </>
      ) : (
        <h1>C'è stato un problema di rete. Riprovare più tardi.</h1>
      )}
    </div>
  );
};
