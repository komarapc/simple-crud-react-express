export const getRandomNumber = (min: number, max: number): number => {
  const randomNumber = Math.floor(Math.random() * max);
  if (randomNumber > min || !randomNumber) return randomNumber;
  return getRandomNumber(min, max);
};

export const stringBoolean = (value: string | undefined) => {
  return value === "true";
};

export type ResponseData = {
  statusCode: number;
  statusMessage: string;
  message?: string | string[];
  success: boolean;
  errors?: string | string[];
  data?: any;
};

export const HTTP_STATUS_CODE = {
  200: "OK",
  201: "CREATED",
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  402: "NEED_PAYMENT",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  500: "INTERNAL_SERVER_ERROR",
};
export type STATUS_CODE_TYPE = keyof typeof HTTP_STATUS_CODE;
export const response200 = ({
  message = "Successfull",
  data,
}: {
  message?: string;
  data?: any;
}): ResponseData => ({
  statusCode: 200,
  statusMessage: "OK",
  message,
  success: true,
  data,
});

export const response500 = (): ResponseData => ({
  statusCode: 500,
  statusMessage: "INTERNAL_SERVER_ERROR",
  success: false,
});

export const responseError = ({
  errCode,
  message,
}: {
  errCode: number;
  message?: string;
}): ResponseData => ({
  statusCode: errCode,
  statusMessage: HTTP_STATUS_CODE[errCode as STATUS_CODE_TYPE],
  success: false,
  message,
});

export const responseSuccess = ({
  code,
  message = "Successfull",
  data,
}: {
  code: number;
  message?: string;
  data?: any;
}): ResponseData => ({
  statusCode: code,
  statusMessage: HTTP_STATUS_CODE[code as STATUS_CODE_TYPE],
  success: true,
  message,
  data,
});
