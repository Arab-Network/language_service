import * as winston from "winston";
let alignColorsAndTime = winston.format.combine(
  winston.format.colorize({
    all: true,
  }),

  winston.format.label({
    label: "[Language Service - API]",
  }),
  winston.format.timestamp({
    format: "YY-MM-DD HH:MM:SS",
  }),
  winston.format.printf(
    (info) =>
      ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
  )
);
let alignTime = winston.format.combine(
  winston.format.label({
    label: "[Language Service - API]",
  }),
  winston.format.timestamp({
    format: "YY-MM-DD HH:MM:SS",
  }),
  winston.format.printf(
    (info) =>
      ` ${info.label}  ${info.timestamp}  ${info.level} : ${info.message}`
  )
);
export default winston.createLogger({
  transports: [
    new winston.transports.Console({
      format: alignColorsAndTime,
    }),

    new winston.transports.File({
      filename: "error.log",
      format: alignTime,
      level: "error",
    }),
    new winston.transports.File({
      filename: "combined.log",
      format: alignTime,
    }),
  ],
});
