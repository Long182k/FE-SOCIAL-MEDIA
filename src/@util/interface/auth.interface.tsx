import { SCREEN_MODE } from "../constant/constant";

export interface LoginFormProp {
  onSwitchMode: (mode: SCREEN_MODE) => void;
}

export interface ErrorResponseData {
  message: string;
}
