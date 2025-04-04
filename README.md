# MessageThread Application

A simple message thread application with .NET Core backend and React frontend.

## Project Structure

- **Backend**: ASP.NET Core API with Entity Framework Core and SQLite
- **Frontend**: React with Vite

## Setup Instructions

### Backend (ASP.NET Core)

1. Navigate to the backend directory:
   ```
   cd Backend/MessageThread
   ```

2. The database will be automatically created when the application starts. If you need to apply migrations manually, use:
   ```
   dotnet ef database update
   ```

3. Run the project:
   ```
   dotnet run
   ```
   The API will be available at https://localhost:7114 or http://localhost:5114.

### Frontend (React + Vite)

1. Navigate to the frontend directory:
   ```
   cd Frontend/Message-Thread
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   The frontend will be available at http://localhost:3000.

## Database

The application uses SQLite with Entity Framework Core for data persistence. The database file is created automatically when the application starts and is stored in the root of the backend project as `messagethread.db`.

## API Endpoints

- `GET /api/messages` - Get all messages
- `GET /api/messages/{id}` - Get a specific message
- `POST /api/messages` - Create a new message
- `PUT /api/messages/{id}` - Update a message
- `DELETE /api/messages/{id}` - Delete a message

## Technologies Used

- **Backend**: ASP.NET Core API, Entity Framework Core, SQLite, C#
- **Frontend**: React, Vite, Axios for API calls
