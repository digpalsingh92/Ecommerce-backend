import productModel from "../models/product.model.js";

export const createProduct = async (req, res) => {
  const { title, images, description, stock, category, price } = req.body;

  if (!title || !images || !description || !stock || !category || !price) {
    return res.status(400).json({ message: "All Fields are compuslory" });
  }
  try {
    const product = await productModel.create({
      title,
      images,
      description,
      stock,
      category,
      price,
      createdBy: req.user._id,
    });
     res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to create product", error: err.message });
  }
};

export const getAllProducts = async (req, res) => {
  try {
    const { keyword = "", category, page = 1, limit = 10 } = req.query;

    const query = {
      title: { $regex: keyword, $options: "i" }, // case-insensitive search
    };

    if (category) {
      query.category = category;
    }

    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      productModel.find(query).skip(skip).limit(Number(limit)),
      productModel.countDocuments(query),
    ]);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch product", error: err.message });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;

    const updatedProduct = await productModel.findByIdAndUpdate(
      productId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
      deletedProduct: product,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
