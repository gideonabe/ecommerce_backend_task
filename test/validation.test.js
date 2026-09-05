import test from "node:test";
import assert from "node:assert/strict";
import { createProductSchema } from "../src/modules/products/product.validation.js";
import { createOrderSchema } from "../src/modules/orders/order.validation.js";

 test("product validation rejects zero price and negative stock", () => {
  assert.throws(() => createProductSchema.parse({
    name: "Keyboard",
    description: "Mechanical keyboard",
    price: 0,
    stock: -1,
  }));
});

test("order validation requires at least one item", () => {
  assert.throws(() => createOrderSchema.parse({ items: [] }));
});

test("product validation accepts a valid product", () => {
  const product = createProductSchema.parse({
    name: "Keyboard",
    description: "Mechanical keyboard",
    price: 99.99,
    stock: 10,
  });
  assert.equal(product.price, 99.99);
  assert.equal(product.stock, 10);
});
