# FlashRoad

FlashRoad is a web application built using Node.js, Express.js, and MongoDB that allows users to buy and sell random items. It features multi-vendor support, stock management, banning system, and automatic stock updates upon order placement. Users are authenticated using JWT (JSON Web Tokens) for secure access.

## Features

- **Multi-vendor Support**: Sellers can list their products on the platform, manage their stock, and receive orders.
- **Banning System**: Admins can ban users who violate the platform's rules or engage in suspicious activities (Admin feature coming soon).
- **Stock Management**: Vendors can manage the availability of their items, and stock counts will automatically update when an order is placed.
- **Automatic Stock Update**: When an order is placed, the stock of the purchased items will automatically update.
- **JWT Authentication**: Secure login and user authentication using JWT tokens.
- **Admin Board**: Admin functionality for managing users and other operations (Coming soon).

## Tech Stack

- **Node.js**: JavaScript runtime for building server-side applications.
- **Express.js**: Web framework for Node.js to simplify routing and handling requests.
- **MongoDB**: NoSQL database for storing user and product data.
- **JWT**: Authentication method using JSON Web Tokens to ensure secure access.

## Installation

To get started with FlashRoad, follow the instructions below to clone the repository and install dependencies.

### Prerequisites

- Node.js (version 14 or above)
- MongoDB (either local setup or cloud database such as MongoDB Atlas)

### Steps to Run Locally

1. **Clone the Repository**  
   Clone this repository to your local machine using the following command:
   
   ```bash
   git clone https://github.com/surya-d-naidu/FlashRoad.git
   ```

2. **Install Dependencies**  
   Navigate to the project folder and install all necessary dependencies by running:

   ```bash
   cd FlashRoad
   npm install
   ```

3. **Set Up Environment Variables**  
   Create a `.env` file in the root of the project and configure your environment variables. Here are the basic required variables:

   ```
   MONGO_URI=mongodb://localhost:27017/flashroad   # MongoDB URI
   JWT_SECRET=your_jwt_secret_key                 # JWT Secret for encoding/decoding tokens
   PORT=5000                                      # Port for the app to run on
   ```

4. **Run the Development Server**  
   Start the development server by running the following command:

   ```bash
   npm run dev
   ```

   This will start the application in development mode and you can access it via `http://localhost:5000`.

### Running Tests

You can run the test suite using:

```bash
npm test
```

### Deployment

To deploy this application, you'll need to:

- Set up a cloud MongoDB service (e.g., MongoDB Atlas) and update the `MONGO_URI` in the `.env` file.
- Deploy the application on platforms like Heroku, AWS, or DigitalOcean.
- Set up environment variables for production deployment.

## API Documentation

Below is an overview of the API routes that are available in the application:

### Authentication

- **POST /api/auth/login**: User login (returns a JWT token).
- **POST /api/auth/register**: Register a new user (requires email, password, and user role).

### Users

- **GET /api/user/:id**: Get user details (requires JWT token).
- **PUT /api/user/:id**: Update user information (requires JWT token).
- **DELETE /api/user/:id**: Delete user (requires JWT token).

### Vendors

- **POST /api/vendor/product**: Add a new product (requires JWT token).
- **GET /api/vendor/products**: View all products for a particular vendor (requires JWT token).
- **PUT /api/vendor/product/:id**: Update a product's details (requires JWT token).
- **DELETE /api/vendor/product/:id**: Remove a product (requires JWT token).

### Orders

- **POST /api/orders**: Create an order (requires JWT token).
- **GET /api/orders/:id**: Get order details (requires JWT token).

### Products

- **GET /api/products**: List all available products.
- **GET /api/products/:id**: Get details of a specific product.

### Stock Management

- The stock for each product is automatically updated when an order is placed. Vendors can view the stock count for each product under their vendor dashboard.

## Admin Features (Coming Soon)

- **User Management**: Admins will be able to view and manage users.
- **Banning System**: Admins will have the ability to ban users who violate the platform’s policies.

## Contributing

We welcome contributions to FlashRoad! If you'd like to contribute, please fork the repository and submit a pull request.

### Steps to Contribute:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Make your changes and commit them: `git commit -am 'Add new feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Submit a pull request.

## License

FlashRoad is open-source and available under the MIT License.

## Contact

For any questions or issues, feel free to open an issue in this repository, or contact us at [illustraton23@gmail.com].

```

### Changes and Updates:
1. **Admin Board**: The Admin board is mentioned as a feature "coming soon" since it's not yet implemented.
2. **API Structure**: I've reflected the API structure based on the routes provided, such as `authRoutes`, `orderRoutes`, `userRoutes`, `vendorRoutes`, and `frontendRoutes`.
3. **Environment Variables**: Clarified that users need to set up the `.env` file with `MONGO_URI` and `JWT_SECRET`.
