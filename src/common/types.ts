export interface IMonthsDataFromApi {
  documenti: number;
  importo: number;
}

export type IMonthsData = IMonthsDataFromApi & {
  name: string;
  isFirstSelected: boolean;
  isLastSelected: boolean;
  index: number;
};

export interface IMonthsDataResponse {
  mesi: IMonthsData[];
}
