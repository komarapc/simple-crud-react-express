import {
  response200,
  response500,
  ResponseData,
  responseError,
  responseSuccess,
} from "@/lib/utils";
import { Book, data as bookMockupData } from "./books.mock";
import { faker } from "@faker-js/faker";

const findAll = async (): Promise<ResponseData> => {
  try {
    return response200({ data: bookMockupData });
  } catch (error) {
    return {
      statusCode: 500,
      statusMessage: "INTERNAL_SERVER_ERROR",
      success: false,
    };
  }
};

const findById = async (id: string): Promise<ResponseData> => {
  try {
    const book = bookMockupData.find((item) => item.id === id);
    if (!book) return responseError({ errCode: 404 });
    return response200({ data: book });
  } catch (error) {
    return response500();
  }
};

const store = async (data: Book): Promise<ResponseData> => {
  try {
    data.id = crypto.randomUUID();
    data.price.currency = "USD";
    data.publishedDate = faker.date.past();
    bookMockupData.push(data);
    return responseSuccess({ code: 201, data });
  } catch (error) {
    return response500();
  }
};

const update = async (id: string, data: Book) => {
  try {
    if (id !== data.id) return responseError({ errCode: 403 });
    const findBook = bookMockupData.find((book) => book.id === id);
    if (!findBook) return responseError({ errCode: 404 });
    Object.assign(findBook, data);
    return responseSuccess({ code: 200, data });
  } catch (error) {
    return response500();
  }
};

const deleteMany = async (data: Book[]): Promise<ResponseData> => {
  try {
    let totalDeleted: number = 0;
    data.forEach((book) => {
      const index = bookMockupData.findIndex((b) => b.id === book.id);
      if (index !== -1) {
        bookMockupData.splice(index, 1);
        totalDeleted += 1;
      }
    });
    if (!totalDeleted)
      return responseError({ errCode: 404, message: "Failed" });
    return responseSuccess({ code: 200, data: { affectedRows: totalDeleted } });
  } catch (error) {
    return response500();
  }
};

const deleteSingle = async (id: string): Promise<ResponseData> => {
  try {
    const index = bookMockupData.findIndex((book) => book.id === id);
    if (index === -1) return responseError({ errCode: 404 });
    bookMockupData.splice(index, 1);
    return responseSuccess({ code: 200 });
  } catch (error) {
    return response500();
  }
};

export { findAll, findById, store, update, deleteMany, deleteSingle };
