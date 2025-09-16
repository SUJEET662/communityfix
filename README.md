# CommunityFix

CommunityFix is a platform designed to empower citizens to report local issues, such as power outages, broken streetlights, or road maintenance problems, directly to the relevant municipal departments. This full-stack application provides dashboards for administrators and department staff to efficiently manage, track, and resolve these issues.

## 🚀 Features

-   **Public Issue Reporting:** Users can easily report new issues with details like title, description, location, and photos.
-   **Role-Based Dashboards:**
    -   **Admin Dashboard:** Provides a comprehensive overview of all issues, user statistics, department performance, and analytics.
    -   **Department Dashboards (e.g., Electrical, PWD):** Staff can view and manage issues specifically assigned to their department.
-   **Issue Management:**
    -   Update issue status (e.g., Reported, In Progress, Resolved).
    -   Add notes and comments for internal communication.
    -   Track issues by status, priority, and department.
-   **User Authentication:** Secure registration and login for different user roles (public, department staff, admin).
-   **Image Uploads:** Users can attach images to their reports for better clarity.
-   **Real-time Updates:** Stay informed with a dynamic and responsive UI.

## ⚙️ Technology Stack

This project is built using a modern MERN (MongoDB, Express.js, React, Node.js) stack.

### Frontend
-   **React:** For building the user interface.
-   **Axios:** For making API requests to the backend.
-   **Tailwind CSS:** For a fast and responsive design.
-   **Recharts:** For data visualization in the dashboards.

### Backend
-   **Node.js & Express.js:** The server-side framework.
-   **MongoDB:** The NoSQL database for storing project data.
-   **Mongoose:** ODM (Object Data Modeling) for MongoDB.
-   **JSON Web Token (JWT):** For secure user authentication.
-   **Multer:** For handling multipart/form-data, primarily file uploads.

## 📦 Getting Started

Follow these steps to get a local copy of the project up and running.

### Prerequisites
-   Node.js (v14.x or later)
-   MongoDB (local or cloud instance)
-   Git

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd communityfix
    ```

2.  **Set up the backend:**
    Navigate to the `backend` folder, install dependencies, and start the server.
    ```bash
    cd backend
    npm install
    
    # Create a .env file with your environment variables
    touch .env
    ```
    Add the following to your `backend/.env` file:
    ```env
    PORT=5000
    MONGO_URI=mongodb://127.0.0.1:27017/communityfix
    JWT_SECRET=your_jwt_secret_key
    JWT_EXPIRE=30d
    ```
    Now, start the server:
    ```bash
    npm start
    ```
    The backend server should now be running at `http://localhost:5000`.

3.  **Set up the frontend:**
    Open a new terminal, navigate to the `frontend` folder, and start the client.
    ```bash
    cd ../frontend
    npm install
    
    # Create a .env file with your API URL
    touch .env
    ```
    Add the following to your `frontend/.env` file:
    ```env
    REACT_APP_API_URL=http://localhost:5000/api
    ```
    Now, start the frontend application:
    ```bash
    npm start
    ```
    The frontend should now be available at `http://localhost:3000`.

## 🤝 Contributing

We welcome contributions! Please feel free to fork the repository, open an issue, or submit a pull request.

## 📄 License

This project is licensed under the MIT License.