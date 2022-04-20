import LoggerService from "../logger/LoggerService.js";
import * as mongoDBConnection from "./connection.js";

export const DatabaseConnect = () => {
  mongoDBConnection.init(function (err, db) {
    if (err) {
      LoggerService.error(err.message);
    }
  });
};
