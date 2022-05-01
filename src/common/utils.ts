import { monthNames } from "./definitions";
import { IMonthsData } from "./types";

/**
 * returns a the array of months between the selections
 */
export const getIndexesBetweenSelection = (start: number, end: number) => {
  return [...Array(Math.abs(end - start) + 1).keys()].map(
    (n) => n + Math.min(start, end)
  );
};

/**
 * returns a the array of months between the selections
 */
export const getIndexesAfterSelection = (end: number, arrayLength: number) => {
  return [...Array(arrayLength - end - 1).keys()].map((n) => n + end + 1);
};

/**
 * @returns a duplicate-free version of the array with the new element
 */
export const arrayWithNewElement = (
  existingElements: IMonthsData[],
  newElement: IMonthsData
) => {
  return Array.from(new Set([...existingElements, newElement]));
};

/**
 *
 * @param monthsToShow
 * @param monthIndexesToRemove
 * @returns the array not containing the months to be removed
 */
export const removeMonthsFromArray = (
  monthsToShow: IMonthsData[],
  monthIndexesToRemove: number[]
) => {
  return [...monthsToShow]
    .filter((month) =>
      monthIndexesToRemove.every((index) => month.index !== index)
    )
    .sort((a, b) => a.index - b.index);
};

/**
 *
 * @param months
 * @param newMonths
 * @param monthIndexesToAdd
 * @returns
 */
export const addMonthsToArray = (
  months: IMonthsData[],
  newMonths: IMonthsData[],
  monthIndexesToAdd: number[]
) => {
  let newMonthsClone = [...newMonths];
  monthIndexesToAdd.forEach((monthIndex) => {
    const monthToAdd = {
      ...months[monthIndex],
    };
    // if month is not already in the array
    if (!newMonthsClone.find((month) => month.index === monthIndex)) {
      newMonthsClone = arrayWithNewElement(newMonthsClone, monthToAdd).sort(
        (a, b) => a.index - b.index
      );
    }
  });

  return newMonthsClone;
};

export const getMultiSelectIndexes = (
  monthIndex: number,
  multiSelectFirstMonth?: number
) => {
  let firstMonth = multiSelectFirstMonth;
  let lastMonth = monthIndex;
  if (multiSelectFirstMonth && multiSelectFirstMonth >= monthIndex) {
    firstMonth = monthIndex;
    lastMonth = multiSelectFirstMonth;
  }

  const monthsBeforeSelection = [...Array(firstMonth).keys()];
  const monthsAfterSelection = getIndexesAfterSelection(
    lastMonth,
    monthNames.length
  );
  const indexesToRemove = [...monthsBeforeSelection, ...monthsAfterSelection];

  return { indexesToRemove, firstMonth, lastMonth };
};
