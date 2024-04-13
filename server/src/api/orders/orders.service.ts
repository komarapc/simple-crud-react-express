import { faker } from "@faker-js/faker";
import {
  response200,
  response500,
  ResponseData,
  responseError,
  responseSuccess,
} from "@/lib/utils";
import { Orders, ordersMockupData } from "./orders.mock";

const findAll = async (): Promise<ResponseData> => {
  try {
    const data = ordersMockupData.map((order) => {
      return {
        ...order,
        items: order.items.map((item) => {
          return {
            ...item,
            book: {
              id: item.book.id,
              price: {
                amount: item.book.price.amount,
                currency: item.book.price.currency,
              },
            },
          };
        }),
      };
    });
    return response200({ data: { orders: data } });
  } catch (error) {
    return response500();
  }
};

const findById = async (id: string): Promise<ResponseData> => {
  try {
    if (!id)
      return responseError({
        errCode: 400,
        message: "Parameter id is required",
      });
    const result = ordersMockupData.find((item) => item.id === id);
    if (!result) return responseError({ errCode: 404 });
    return response200({ data: result });
  } catch (error) {
    return response500();
  }
};

const store = async (order: Orders): Promise<ResponseData> => {
  try {
    order.id = crypto.randomUUID();
    order.date = faker.date.recent();
    ordersMockupData.push(order);
    return responseSuccess({ code: 201 });
  } catch (error) {
    return response500();
  }
};

const update = async (id: string, order: Orders): Promise<ResponseData> => {
  try {
    const findOrder = ordersMockupData.find((item) => item.id === id);
    if (!findOrder) return responseError({ errCode: 404 });
    Object.assign(findOrder, order);
    return response200({ data: order });
  } catch (error) {
    return response500();
  }
};

const deleteSingle = async (id: string): Promise<ResponseData> => {
  try {
    const index = ordersMockupData.findIndex((item) => item.id === id);
    if (index === -1) return responseError({ errCode: 404 });
    ordersMockupData.splice(index, 1);
    return response200({ message: "Deleted" });
  } catch (error) {
    return response500();
  }
};

const deleteMany = async (orders: Orders[]): Promise<ResponseData> => {
  let affectedRows = 0;
  try {
    orders.forEach((order) => {
      const index = ordersMockupData.findIndex((item) => item.id === order.id);
      if (index !== -1) {
        ordersMockupData.splice(index, 1);
        affectedRows += 1;
      }
    });
    if (!affectedRows)
      return responseError({ errCode: 404, message: "No rows affected" });

    return responseSuccess({ code: 200 });
  } catch (error) {
    return response500();
  }
};

export { findAll, findById, store, update, deleteSingle, deleteMany };
