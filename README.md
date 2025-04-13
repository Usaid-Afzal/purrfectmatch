# Animal Adoption Website

A full-stack animal adoption platform integrating multiple API endpoints for user authentication, pet listing management, and buyer interactions. This project leverages several third-party services to provide a seamless experience for both pet seekers and administrators.

## Overview

This project is designed to simplify the process of pet adoption by enabling users to browse and interact with pet listings, manage favorites, and communicate with pet owners. Key integrations include:
- **Google OAuth:** For streamlined social login.
- **PostMark:** For sending transactional and notification emails.
- **Cloudinary:** For handling multimedia content such as pet images and videos.

Security is a primary focus, with robust JWT-based authentication ensuring safe registration and login processes. RESTful endpoints support multimedia uploads, comprehensive error handling, and administrative operations.

## Features

- **User Authentication & Authorization**
  - Secure registration and login with JWT-based authentication.
  - Seamless social login via Google OAuth integration.

- **Pet Listing Management**
  - Create, update, and delete pet listings.
  - Multimedia support (images and videos) powered by Cloudinary.

- **Buyer Interactions**
  - Manage favorites for pet listings.
  - In-app messaging and email notifications through PostMark.
  - Robust RESTful endpoints to support interactive buyer-seller communication.

- **Administrative Controls**
  - Dashboard for managing users, pet listings, and site configurations.
  - Comprehensive error handling and logging for smooth administration.

- **API Testing & Documentation**
  - Extensive API testing carried out using Postman.
  - Detailed API documentation provided to assist with integration and further development.

## Technology Stack

- **Backend:** RESTful API with secure endpoints for user authentication and content management.
- **Authentication:** JSON Web Tokens (JWT) for secure and stateless authentication.
- **Third-Party Services:**
  - **Google OAuth:** For social sign-in.
  - **PostMark:** For transactional email services.
  - **Cloudinary:** For cloud-based media management.
- **Testing:** Postman collections for comprehensive API testing and validation.

## Installation

Follow these steps to set up the project locally:

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
2. **Install Dependencies:**
```bash
npm install
```
3. **Configure Environment Variables: Create a .env file in the both frontend and backend directories and add the following:**
Backend env
```Backend env
PORT=5000
MONGOURI= your_mongo_api_key
JWT_SECRET=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
POSTMARK_API_KEY=your_postmark_api_key
CLOUDINARY_URL=your_cloudinary_url
```
Frontend env
```Frontend env
VITE_OPENCAGE_API_KEY=your_API_Key
VITE_API_URL=http://localhost:5000
```
Replace the placeholder values with your actual credentials.

Run Database Migrations (if applicable):
```bash
npm run migrate
```

Start the Server:
```bash
npm start
```
The server will start on the port specified in the .env file (default: 3000).

## API Documentation
Detailed documentation for each endpoint is available in the `/docs` folder. The API documentation covers:
- **User Endpoints:** Registration, login, and authentication.
- **Pet Listing Endpoints:** Create, update, retrieve, and delete pet listings.
- **Interaction Endpoints:** Favorites management, messaging, and notifications.
- **Admin Endpoints:** Management of users and listings, including comprehensive error handling.

## Testing
Comprehensive API testing has been conducted using Postman. A Postman collection is included in the repository for easy testing:
- **Importing the Collection:** Open Postman and import the file located at `/postman/AnimalAdoptionCollection.json`.
- **Running Tests:** Ensure the local server is running and execute the tests to validate endpoint functionality and error management.
  
## Error Handling
The application uses robust error handling strategies to manage:
- **Input Validation:** Detailed validation errors for user inputs.
- **Authentication Failures:** Clear error responses for unauthorized or forbidden actions.
- **System Errors:** General error catching with logging for debugging and maintenance.


## Contributing
Contributions are welcome! Please follow these guidelines:
1. Fork the repository and create a new branch for your feature or bug fix.
2. Follow existing code style and structure.
3. Update the documentation as needed.
4. Write tests for any new features or changes.
5. Submit a pull request with a clear description of your changes.
