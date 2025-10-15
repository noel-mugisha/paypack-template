# Paypack TypeScript Backend Template

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A modern, secure, and production-ready TypeScript starter template for integrating the **Paypack** payment gateway into a Node.js application. This template includes a complete, end-to-end payment flow with secure webhook validation.

## Features

-   **Modern Tech Stack:** Built with TypeScript, Express.js, and Prisma for a robust, type-safe, and scalable foundation.
-   **Secure by Design:** Includes critical webhook signature validation to protect your endpoint from fraudulent requests.
-   **Centralized Paypack Service:** All Paypack logic is abstracted into a clean, reusable service, separating payment logic from business logic.
-   **Database Ready:** Uses Prisma with a pre-configured SQLite database for easy setup. The schema can be easily switched to PostgreSQL or MySQL.
-   **Request Validation:** Uses `zod` to validate all incoming API requests, ensuring data integrity and preventing common errors.
-   **Ready-to-Use API:** Provides clear API endpoints for creating an order and initiating a payment.
-   **Professional Structure:** Organized into a clean and understandable project structure (controllers, services, routes, etc.).

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or later)
-   [npm](https://www.npmjs.com/) (or your preferred package manager)
-   A [Paypack Merchant Account](https://paypack.rw/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/paypack-ts-template.git
    cd paypack-ts-template
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    -   Rename the `.env.example` file to `.env`.
    -   Open the `.env` file and fill in your actual Paypack credentials. You can get these from your Paypack merchant dashboard.
    ```dotenv
    # .env

    # Database URL (defaults to a local SQLite file)
    DATABASE_URL="file:./prisma/dev.db"

    # Paypack API Credentials
    PAYPACK_CLIENT_ID="YOUR_CLIENT_ID"
    PAYPACK_CLIENT_SECRET="YOUR_CLIENT_SECRET"

    # Paypack Webhook Secret - CRITICAL FOR SECURITY
    PAYPACK_WEBHOOK_SECRET="YOUR_WEBHOOK_SECRET_FROM_PAYPACK"
    ```

4.  **Set up the database:**
    This command will create your SQLite database file and generate the Prisma client based on your schema.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The server will start on `http://localhost:3000`.

## API Usage & Testing

The easiest way to test the API is by using the provided Postman collection.

### Using the Postman Collection

1.  **Import the Files:**
    -   Import the `Paypack-API-Template.postman_collection.json` file into your Postman collections.
    -   Import the `Paypack-Template-Local.postman_environment.json` file into your Postman environments.
2.  **Select the Environment:** Make sure the **"Paypack Template Local"** environment is active in the top-right corner of Postman.
3.  **Run the Requests:** Execute the requests in order:
    1.  **`1. Create Order`**: This will create a pending order in the database and automatically save its ID to an environment variable.
    2.  **`2. Initiate Payment`**: This will use the saved ID to trigger the payment process for that order.

### Webhook Testing

To receive webhooks on your local machine, you need to expose your local server to the internet.

1.  **Run a tunneling service** like `ngrok`:
    ```bash
    ngrok http 3000
    ```
2.  **Configure your Webhook URL** in your Paypack dashboard. Copy the `https://...` URL from `ngrok` and append the webhook path:
    `https://<your-ngrok-url>.ngrok-free.app/api/webhooks/paypack`
3.  Ensure the webhook in your dashboard is set to **Production** and **Active**.

## Project Structure

/src
|-- controllers/ # Handles HTTP request/response cycle
|-- routes/ # Defines API endpoints
|-- services/ # Contains core business and payment logic
|-- validation/ # Zod schemas for request validation
|-- index.ts # Main server entry point

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

For more info, contact @noelmugisha332@gmail.com