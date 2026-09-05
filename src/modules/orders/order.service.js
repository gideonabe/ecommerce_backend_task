import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";

const orderInclude = {
  items: {
    select: {
      id: true,
      quantity: true,
      price: true,
      product: { select: { id: true, name: true, imageUrl: true } },
    },
  },
};

const serializeOrder = (order) => ({
  ...order,
  totalAmount: order.totalAmount.toString(),
  items: order.items.map((item) => ({
    ...item,
    price: item.price.toString(),
  })),
});

export const createOrder = async (userId, items) => {
  const productIds = items.map((item) => item.productId);
  if (new Set(productIds).size !== productIds.length) {
    throw new AppError("Each product may only appear once in an order.", 422);
  }

  const order = await prisma.$transaction(async (tx) => {
    const products = await tx.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, stock: true },
    });

    if (products.length !== items.length) {
      throw new AppError("One or more products were not found.", 404);
    }

    const productsById = new Map(products.map((product) => [product.id, product]));
    let totalAmount = new Prisma.Decimal(0);
    const orderItems = [];

    for (const item of items) {
      const product = productsById.get(item.productId);
      if (product.stock < item.quantity) {
        throw new AppError(`Insufficient stock for product ${item.productId}.`, 409);
      }
      totalAmount = totalAmount.plus(product.price.mul(item.quantity));
      orderItems.push({ productId: product.id, quantity: item.quantity, price: product.price });
    }

    for (const item of orderItems) {
      const updated = await tx.product.updateMany({
        where: { id: item.productId, stock: { gte: item.quantity } },
        data: { stock: { decrement: item.quantity } },
      });
      if (updated.count !== 1) {
        throw new AppError("Stock changed while placing the order. Please retry.", 409);
      }
    }

    return tx.order.create({
      data: {
        userId,
        totalAmount,
        items: { create: orderItems },
      },
      include: orderInclude,
    });
  });

  return serializeOrder(order);
};

export const listOrders = async ({ userId, isAdmin }) => {
  const orders = await prisma.order.findMany({
    where: isAdmin ? undefined : { userId },
    orderBy: { createdAt: "desc" },
    include: orderInclude,
  });
  return orders.map(serializeOrder);
};

export const getOrder = async ({ id, userId, isAdmin }) => {
  const order = await prisma.order.findFirst({
    where: isAdmin ? { id } : { id, userId },
    include: orderInclude,
  });
  if (!order) throw new AppError("Order not found.", 404);
  return serializeOrder(order);
};

export const payOrder = async (id, userId) => {
  const order = await prisma.order.findFirst({ where: { id, userId } });
  if (!order) throw new AppError("Order not found.", 404);
  if (order.status !== "PENDING") throw new AppError("Only pending orders can be paid.", 409);
  const updated = await prisma.order.update({ where: { id }, data: { status: "PAID" }, include: orderInclude });
  return serializeOrder(updated);
};

export const cancelOrder = async ({ id, userId, isAdmin }) => {
  const order = await prisma.order.findFirst({
    where: isAdmin ? { id } : { id, userId },
    include: { items: true },
  });
  if (!order) throw new AppError("Order not found.", 404);
  if (!["PENDING", "PAID"].includes(order.status)) {
    throw new AppError("This order can no longer be cancelled.", 409);
  }

  const cancelled = await prisma.$transaction(async (tx) => {
    for (const item of order.items) {
      await tx.product.update({ where: { id: item.productId }, data: { stock: { increment: item.quantity } } });
    }
    return tx.order.update({ where: { id }, data: { status: "CANCELLED" }, include: orderInclude });
  });
  return serializeOrder(cancelled);
};

export const updateOrderStatus = async (id, status) => {
  const order = await prisma.order.findUnique({ where: { id } });
  if (!order) throw new AppError("Order not found.", 404);

  const allowedTransitions = {
    PENDING: ["PAID", "CANCELLED"],
    PAID: ["PROCESSING", "CANCELLED"],
    PROCESSING: ["SHIPPED"],
    SHIPPED: ["DELIVERED"],
    DELIVERED: [],
    CANCELLED: [],
  };
  if (!allowedTransitions[order.status].includes(status)) {
    throw new AppError(`Cannot change order status from ${order.status} to ${status}.`, 409);
  }

  const updated = await prisma.order.update({ where: { id }, data: { status }, include: orderInclude });
  return serializeOrder(updated);
};
