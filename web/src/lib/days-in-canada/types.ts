export type Trip = {
  id: string;
  left: string;
  returned: string | null;
  destination: string;
  daysOutside: number | null;
};

/** Authorized temporary resident time in Canada before PR (visitor, worker, student). */
export type PrePrPeriod = {
  id: string;
  from: string;
  to: string;
};

export type ParsedTrip = {
  left: string | null;
  returned: string | null;
  route: string;
  destination: string;
};

export type AppState = {
  signingDate: string;
  prDate: string;
  prePrCredit: boolean;
  prePrPeriods: PrePrPeriod[];
  trips: Trip[];
};

export const STORAGE_KEY = "days-in-canada-v1";

export const DEFAULT_STATE: AppState = {
  signingDate: "",
  prDate: "",
  prePrCredit: false,
  prePrPeriods: [],
  trips: [],
};
