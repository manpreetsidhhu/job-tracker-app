
# Job Application Tracker

This is a simple MERN (MongoDB, Express.js, React, Node.js) stack application designed to help users track their job applications, manage their statuses, and view a timeline of changes. It includes user authentication and an optional resume upload feature.

## Features

* **User Authentication:** Secure registration and login using JWT (JSON Web Tokens).

* **Job Application Management:**

    * Add new job applications (Company, Role, Status).

    * View all applied jobs.

    * Filter job applications by status (Applied, Interview, Offer, Rejected).

    * Update existing job application details and status.

    * Delete job applications.

* **Status Timeline:** A dedicated view to track the history of status changes for each job application.

* **Optional Resume Upload:** Upload a resume file associated with a specific job application.

## Tech Stack

* **Frontend:**

    * **React.js:** For building the user interface.

    * **Axios:** For making HTTP requests to the backend.

    * **React Router DOM:** For client-side routing.

    * **Moment.js:** For easy date and time formatting.

    * **CSS:** Custom styling for a clean and modern look (applied within the React app, not this README).

* **Backend:**

    * **Node.js:** JavaScript runtime environment.

    * **Express.js:** Web application framework for Node.js.

    * **MongoDB:** NoSQL database for storing application data.

    * **Mongoose:** ODM (Object Data Modeling) library for MongoDB and Node.js.

    * **jsonwebtoken:** For implementing JWT-based authentication.

    * **bcryptjs:** For hashing user passwords securely.

    * **cors:** Middleware to enable Cross-Origin Resource Sharing.

    * **multer:** For handling multipart/form-data, primarily for file uploads (resumes).

## Project Structure

```

job-tracker-app/
├── job-tracker-backend/
│   ├── node\_modules/
│   ├── uploads/          \# Stores uploaded resumes (ignored by Git)
│   ├── .env              \# Environment variables (ignored by Git)
│   ├── package.json
│   ├── server.js         \# Main backend server file
│   └── ... (other backend files)
└── job-tracker-frontend/
├── node\_modules/
├── public/
├── src/
│   ├── api.js        \# Centralized API calls
│   ├── App.css       \# Global styling
│   ├── App.js        \# Main React component & routing
│   └── components/   \# React components (Auth, JobForm, JobList, JobTimeline)
├── .env.local        \# Local environment variables (ignored by Git)
├── package.json
└── ... (other frontend files)

````

## Setup and Local Development

Follow these steps to get the project running on your local machine.

### Prerequisites

* Node.js (v18 or higher recommended)

* npm (comes with Node.js)

* MongoDB (Community Server or MongoDB Atlas account)

* Git

### 1. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/manpreetsidhhu/job-tracker-app.git
cd job-tracker-app
````

### 2\. Backend Setup

Navigate into the `job-tracker-backend` directory:

```bash
cd job-tracker-backend
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `job-tracker-backend` directory with the following content:

```
MONGO_URI=mongodb://localhost:27017/jobtracker
JWT_SECRET=your_super_secret_jwt_key
```

#### Start the Backend Server

```bash
node server.js
```

The backend server will start on `http://localhost:5000`. You should see "MongoDB Connected" and "Server running on port 5000" in your terminal.

### 3\. Frontend Setup

Open a **new terminal window** and navigate into the `job-tracker-frontend` directory:

```bash
cd ../job-tracker-frontend # If you are in job-tracker-backend
# OR
# cd job-tracker-frontend # If you are in job-tracker-app root
```

#### Install Dependencies

```bash
npm install
```

#### Configure Environment Variables

For local development, your frontend will connect to your local backend. No `.env.local` file is strictly needed if you are running locally and your `src/api.js` is configured to `http://localhost:5000/api`.

#### Start the Frontend Development Server

```bash
npm start
```

The React development server will open your application in your browser, usually at `http://localhost:3000`.

## Usage

1.  **Register:** On the home page, register a new user account.

2.  **Login:** Log in with your newly created credentials.

3.  **Add Application:** Use the "Add Application" link to add new job entries. You can specify company, role, status, and optionally upload a resume.

4.  **View Applications:** The "My Applications" page displays all your tracked jobs.

5.  **Filter:** Use the status filter to narrow down your job list.

6.  **Edit/Delete:** Click "Edit" to modify job details or status, or "Delete" to remove an application.

7.  **Timeline:** Click "Timeline" on any job card to view its status change history.
