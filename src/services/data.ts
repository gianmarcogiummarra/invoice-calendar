import { monthNames } from "../common/definitions";
import { IMonthsData, IMonthsDataFromApi } from "../common/types";

export const getMonthsData = (url: string): Promise<IMonthsData[]> => {
  return fetch(url)
    .then((response) => response.json())
    .then((data) =>
      data.mesi?.map((month: IMonthsDataFromApi, index: number) => {
        return {
          ...month,
          name: monthNames[index],
          isFirstSelected: false,
          isLastSelected: false,
          index,
        };
      })
    );
};
