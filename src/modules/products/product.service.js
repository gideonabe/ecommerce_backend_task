import prisma from "../../config/prisma.js";
import AppError from "../../errors/AppError.js";

const selectProduct = {
  id: true,
  name: true,
  description: true,
  price: true,
  stock: true,
  category: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
};

const serializeProduct = (product) => ({
  ...product,
  price: product.price.toString(),
});

export const createProduct = async (data) => {
  const product = await prisma.product.create({
    data,
    select: selectProduct,
  });
  return serializeProduct(product);
};

export const listProducts = async ({ search, category, minPrice, maxPrice, page, limit, sortBy, sortOrder }) => {
  const where = {
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(category && { category: { equals: category, mode: "insensitive" } }),
    ...((minPrice !== undefined || maxPrice !== undefined) && {
      price: {
        ...(minPrice !== undefined && { gte: minPrice }),
        ...(maxPrice !== undefined && { lte: maxPrice }),
      },
    }),
  };

  const skip = (page - 1) * limit;
  const [products, total] = await prisma.$transaction([
    prisma.product.findMany({
      where,
      select: selectProduct,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: limit,
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map(serializeProduct),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getProduct = async (id) => {
  const product = await prisma.product.findUnique({ where: { id }, select: selectProduct });
  if (!product) throw new AppError("Product not found.", 404);
  return serializeProduct(product);
};

export const updateProduct = async (id, data) => {
  const product = await prisma.product.update({
    where: { id },
    data,
    select: selectProduct,
  });
  return serializeProduct(product);
};

export const deleteProduct = async (id) => {
  await prisma.product.delete({ where: { id } });
};
