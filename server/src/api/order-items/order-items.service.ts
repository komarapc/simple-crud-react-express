import {
  response200,
  response500,
  ResponseData,
  responseError,
  responseSuccess,
} from "@/lib/utils";
import { ItemOrder, ordersMockupData } from "../orders/orders.mock";

type Props<T> = {
  orderId?: string;
  id: string;
  itemOrders?: T;
};

const findById = async ({ id, orderId }: { id: string; orderId: string }) => {
  try {
    const findOrderItems = ordersMockupData
      .find((mock) => mock.id === orderId)
      ?.items.find((item) => item.book.id === id);
    if (!findOrderItems) return responseError({ errCode: 404 });
    return response200({ data: findOrderItems });
  } catch (error) {
    return response500();
  }
};
const store = async (props: Props<ItemOrder[]>): Promise<ResponseData> => {
  const { id, itemOrders } = props;
  try {
    if (!itemOrders)
      return responseError({
        errCode: 400,
        message: "Parameter itemOrders is required",
      });
    const findOrder = ordersMockupData.find((item) => item.id === id);
    if (!findOrder) return responseError({ errCode: 404 });
    findOrder.items.push(...itemOrders);
    return response200({ data: findOrder });
  } catch (error) {
    return response500();
  }
};
const update = async (props: Props<ItemOrder>) => {
  const { orderId, id, itemOrders } = props;
  try {
    if (!itemOrders)
      return responseError({
        errCode: 400,
        message: "Parameter itemOrders is required",
      });
    const order = ordersMockupData.find((item) => item.id === orderId);
    if (!order) return responseError({ errCode: 404 });
    const item = order.items.find((item) => item.book.id === id);
    if (!item) return responseError({ errCode: 404 });
    item.quantity = itemOrders.quantity;
    item.subtotal = itemOrders.book.price.amount * itemOrders.quantity;
    return response200({ data: item });
  } catch (error) {
    return response500();
  }
};
const deleteSingle = async (
  props: Props<ItemOrder[]>
): Promise<ResponseData> => {
  const { orderId, id } = props;
  try {
    const order = ordersMockupData.find((item) => item.id === orderId);
    if (!order) return responseError({ errCode: 404 });
    const index = order.items.findIndex((item) => item.book.id === id);
    if (index === -1) return responseError({ errCode: 404 });
    order.items.splice(index, 1);
    return responseSuccess({ code: 200, message: "Deleted" });
  } catch (error) {
    return response500();
  }
};
const deleteMany = async (props: Props<ItemOrder[]>): Promise<ResponseData> => {
  const { orderId, itemOrders } = props;
  let affectedRows = 0;
  try {
    const order = ordersMockupData.find((item) => item.id === orderId);
    if (!order) return responseError({ errCode: 404 });
    if (!itemOrders)
      return responseError({
        errCode: 400,
        message: "Parameter itemOrders is required",
      });
    itemOrders.forEach((item) => {
      const index = order.items.findIndex((i) => i.book.id === item.book.id);
      if (index !== -1) {
        order.items.splice(index, 1);
        affectedRows++;
      }
    });
    return response200({ data: { affectedRows } });
  } catch (error) {
    return response500();
  }
};
export { findById, store, update, deleteSingle, deleteMany };
