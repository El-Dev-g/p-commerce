# Curated Finds - Admin Dashboard & Backend

This project serves as the central admin dashboard and API backend for the "Curated Finds" e-commerce store.

## Architecture Overview

This application is one half of a modern, headless e-commerce architecture.

1.  **Admin Dashboard (This Project)**: Serves as the internal control panel for managing products, orders, customers, and viewing AI-powered analytics. It is also the **authoritative API backend** that serves data to the storefront.
2.  **Storefront (Separate Project)**: This is the public-facing website that customers interact with. It is a separate Next.js application that consumes data from the API endpoints provided by this admin project.

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the Development Server**:
    ```bash
    npm run dev
    ```
    The admin dashboard will be available at [http://localhost:9002](http://localhost:9002).

## Storefront Project Setup

To create the customer-facing storefront, you should use a duplicate of this project and modify it as follows:

1.  **Remove Admin-Specific Code**: In the storefront project, delete the entire `src/app/admin` directory and any unnecessary AI flows from `src/ai/dev.ts` that are only for admin purposes (e.g., `analyze-refunds`, `detect-fraud`).

2.  **Build Public Pages**: Create the necessary pages for a customer journey, such as a home page, product listing pages, a shopping cart, and a checkout flow.

3.  **Consume APIs**: Modify the storefront's pages to fetch data from this admin dashboard's API endpoints. You will need to configure the storefront with the URL of this deployed admin project.

    **Example (in the storefront project):**

    ```javascript
    // src/app/products/page.tsx - in the storefront project

    async function getProducts() {
      // Fetch data from the admin project's API
      const res = await fetch('http://localhost:9002/api/v1/products');
      const data = await res.json();
      return data.products;
    }

    export default async function ProductsPage() {
      const products = await getProducts();
      // ... render products
    }
    ```

## Available API Endpoints for Storefront

This admin project exposes the following public endpoints for the storefront to use:

*   `GET /api/v1/products`: Get a list of all products.
*   `GET /api/v1/products/[id]`: Get details for a single product.
*   `POST /api/v1/orders`: Submit a new order from the checkout.
*   `GET /api/v1/pages`: Get a list of all static pages for the footer.
*   `GET /api/v1/pages/[slug]`: Get content for a specific static page.
*   `/api/genkit/...`: Endpoints for AI flows like `searchProducts` are automatically exposed by Genkit.
