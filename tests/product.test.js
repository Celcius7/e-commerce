const request = require("supertest");
const app = require("../app");
const mongoose = require("mongoose");
const Product = require("../models/productModel");

describe("Product API", () => {
  beforeAll(async () => {
    const DB = process.env.MONGODB_URI.replace(
      "<PASSWORD>",
      process.env.DATABASE_PASSWORD
    );
    await mongoose.connect(DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterEach(async () => {
    await Product.deleteMany();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("should create a new product", async () => {
    const productData = {
      name: "Product 1",
      description: "Product description",
      price: 9.99,
      variants: [
        { name: "Variant 1", sku: "123", additionalCost: 1.99, stockCount: 10 },
        { name: "Variant 2", sku: "456", additionalCost: 0.99, stockCount: 5 },
      ],
    };

    const response = await request(app)
      .post("/v1/products")
      .send(productData)
      .expect(201);

    const product = await Product.findById(response.body._id);
    expect(product).toBeTruthy();
    expect(product.name).toBe(productData.name);
    expect(product.variants.length).toBe(productData.variants.length);
  });

  it("should retrieve all products", async () => {
    await Product.create([
      { name: "Product 1", description: "Description 1", price: 9.99 },
      { name: "Product 2", description: "Description 2", price: 14.99 },
    ]);

    const response = await request(app).get("/v1/products").expect(200);

    expect(response.body.length).toBe(2);
  });

  it("should retrieve a product by ID", async () => {
    const product = await Product.create({
      name: "Product 1",
      description: "Description 1",
      price: 9.99,
    });

    const response = await request(app)
      .get(`/v1/products/get/${product._id}`)
      .expect(200);

    expect(response.body._id).toBe(product._id.toString());
    expect(response.body.name).toBe(product.name);
  });

  it("should update a product by ID", async () => {
    const product = await Product.create({
      name: "Product 1",
      description: "Description 1",
      price: 9.99,
    });

    const updatedProductData = {
      name: "Updated Product",
      description: "Updated Description",
      price: 19.99,
    };

    const response = await request(app)
      .put(`/v1/products/${product._id}`)
      .send(updatedProductData)
      .expect(200);

    expect(response.body._id).toBe(product._id.toString());
    expect(response.body.name).toBe(updatedProductData.name);

    const updatedProduct = await Product.findById(product._id);
    expect(updatedProduct.name).toBe(updatedProductData.name);
    expect(updatedProduct.description).toBe(updatedProductData.description);
    expect(updatedProduct.price).toBe(updatedProductData.price);
  });

  it("should delete a product by ID", async () => {
    const product = await Product.create({
      name: "Product 1",
      description: "Description 1",
      price: 9.99,
    });

    await request(app).delete(`/v1/products/${product._id}`).expect(200);

    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeFalsy();
  });

  it("should search products by name, description, or variant name", async () => {
    await Product.create([
      {
        name: "Product 1",
        description: "Description 1",
        price: 9.99,
        variants: [
          {
            name: "Variant A",
            sku: "123",
            additionalCost: 1.99,
            stockCount: 10,
          },
        ],
      },
      {
        name: "Product 2",
        description: "Description 2",
        price: 14.99,
        variants: [
          {
            name: "Variant B",
            sku: "456",
            additionalCost: 0.99,
            stockCount: 5,
          },
        ],
      },
    ]);

    const response = await request(app)
      .get("/v1/products/search?key=Variant")
      .expect(200);

    expect(response.body.length).toBe(2);
  });
});
