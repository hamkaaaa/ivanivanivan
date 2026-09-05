import { supabase } from "../config/supabaseClient.js";

export const TransactionModel = {
  async create(payload) {
    const { customer_id } = payload;
    if (!customer_id) {
      throw new Error("customer_id is required");
    }

    // 1. Verify customer exists
    const { data: customer, error: custErr } = await supabase
      .from("customers")
      .select("*")
      .eq("id", customer_id)
      .single();

    if (custErr || !customer) {
      throw new Error(`Customer with ID '${customer_id}' not found`);
    }

    // 2. Normalize items array
    let itemsInput = payload.items;
    if (!itemsInput && payload.product_id) {
      itemsInput = [
        {
          product_id: payload.product_id,
          quantity: payload.quantity || 1,
        },
      ];
    }

    if (!Array.isArray(itemsInput) || itemsInput.length === 0) {
      throw new Error("Transaction must contain at least one item");
    }

    // 3. Validate products and stock
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of itemsInput) {
      const qty = parseInt(item.quantity, 10);
      if (isNaN(qty) || qty <= 0) {
        throw new Error("Quantity must be a positive integer");
      }

      const { data: product, error: prodErr } = await supabase
        .from("products")
        .select("*")
        .eq("id", item.product_id)
        .single();

      if (prodErr || !product) {
        throw new Error(`Product with ID '${item.product_id}' not found`);
      }

      if (product.stock < qty) {
        throw new Error(
          `Insufficient stock for product '${product.name}'. Available: ${product.stock}, Requested: ${qty}`
        );
      }

      const itemPrice = Number(product.price);
      totalPrice += itemPrice * qty;

      validatedItems.push({
        product_id: product.id,
        product_name: product.name,
        currentStock: product.stock,
        quantity: qty,
        price: itemPrice,
      });
    }

    // 4. Create transaction record
    const { data: transaction, error: txErr } = await supabase
      .from("transactions")
      .insert([{ customer_id, total_price: totalPrice }])
      .select()
      .single();

    if (txErr) throw txErr;

    // 5. Insert transaction items and update product stock
    const insertedItems = [];
    for (const item of validatedItems) {
      const { data: itemData, error: itemErr } = await supabase
        .from("transaction_items")
        .insert([
          {
            transaction_id: transaction.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.price,
          },
        ])
        .select()
        .single();

      if (itemErr) throw itemErr;

      // Deduct stock
      const newStock = item.currentStock - item.quantity;
      const { error: stockErr } = await supabase
        .from("products")
        .update({ stock: newStock })
        .eq("id", item.product_id);

      if (stockErr) throw stockErr;

      insertedItems.push({
        ...itemData,
        product_name: item.product_name,
        subtotal: item.price * item.quantity,
      });
    }

    return {
      ...transaction,
      customer,
      items: insertedItems,
    };
  },

  async getAll() {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id, total_price, created_at,
        customers ( id, name, email, phone ),
        transaction_items (
          id, quantity, price,
          products ( id, name, sku )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from("transactions")
      .select(
        `
        id, total_price, created_at,
        customers ( id, name, email, phone, address ),
        transaction_items (
          id, quantity, price,
          products ( id, name, sku, description )
        )
      `
      )
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },
};
