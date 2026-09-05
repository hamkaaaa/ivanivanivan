# Sales API (Modul Praktikum BAB II)

RESTful API backend dibangun menggunakan **Node.js**, **Express.js**, dan **Supabase**.

## Fitur & Endpoint

### 1. Categories (`/api/categories`)
- `POST /api/categories` - Tambah kategori baru (`{ "name": "Elektronik" }`)
- `GET /api/categories` - Ambil daftar semua kategori
- `GET /api/categories/:id` - Ambil detail kategori berdasarkan ID
- `PUT /api/categories/:id` - Update kategori (`{ "name": "Elektronik & Gadget" }`)
- `DELETE /api/categories/:id` - Hapus kategori

### 2. Customers (`/api/customers`)
- `POST /api/customers` - Tambah customer baru (`{ "name": "Budi", "email": "budi@email.com", "phone": "0812...", "address": "..." }`)
- `GET /api/customers` - Ambil semua customer
- `GET /api/customers/:id` - Ambil detail customer berdasarkan ID
- `PUT /api/customers/:id` - Update data customer
- `DELETE /api/customers/:id` - Hapus customer

### 3. Products (`/api/products`)
- `POST /api/products` - Tambah produk baru (`{ "sku": "PRD-002", "name": "Laptop", "description": "...", "category_id": "...", "price": 8500000, "stock": 25 }`)
- `GET /api/products` - Ambil semua produk
- `GET /api/products/:id` - Ambil produk berdasarkan ID (termasuk relasi data kategori)
- `PUT /api/products/:id` - Update produk
- `DELETE /api/products/:id` - Hapus produk

### 4. Transactions (`/api/transactions`)
- `POST /api/transactions` - Buat transaksi baru (otomatis memotong stok produk)
  - **Body Example:**
    ```json
    {
      "customer_id": "uuid-customer",
      "items": [
        {
          "product_id": "uuid-product",
          "quantity": 2
        }
      ]
    }
    ```
- `GET /api/transactions` - Ambil histori semua transaksi (lengkap dengan data customer & item produk)
- `GET /api/transactions/:id` - Ambil detail 1 transaksi berdasarkan ID

## Panduan Penyiapan

1. Jalankan `npm install` di terminal.
2. Buat tabel database di Supabase SQL Editor menggunakan skema berikut:

```sql
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table customers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text,
  address text
);

create table products (
  id uuid primary key default gen_random_uuid(),
  sku text unique,
  name text not null,
  description text,
  category_id uuid references categories(id),
  price numeric(12,2) default 0,
  stock integer default 0
);

create table transactions (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references customers(id) on delete cascade,
  total_price numeric(12,2) not null,
  created_at timestamptz default now()
);

create table transaction_items (
  id uuid primary key default gen_random_uuid(),
  transaction_id uuid references transactions(id) on delete cascade,
  product_id uuid references products(id) on delete restrict,
  quantity integer not null,
  price numeric(12,2) not null
);
```

3. Dapatkan `SUPABASE_URL` dan `SUPABASE_KEY` (anon public key) dari **Project Settings -> Data API / API Keys** di Supabase.
4. Masukkan kunci tersebut ke dalam file `.env`.
5. Jalankan server lokal: `npm run dev` (menggunakan nodemon) atau `npm start`.
