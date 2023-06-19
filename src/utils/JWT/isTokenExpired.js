import moment from "moment";
import { parseJwt } from "./parseJwt";

export const isTokenExpired = (token) => {
  try {
    const decodedToken = parseJwt(token);
    const expirationTime = moment.unix(decodedToken.exp);
    const currentTime = moment();

    return expirationTime.isBefore(currentTime);
  } catch (error) {
    return true;
  }
};
