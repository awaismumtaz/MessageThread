# MessageThread Project Documentation

## Project Overview

The MessageThread application is a simple message thread system with a .NET Core backend and React frontend. Users can post messages, view all messages in a thread, reply to specific messages, and delete messages.

## Architecture Decisions

### Backend (.NET Core)

1. **Database Storage**: 
   - Using SQLite database with Entity Framework Core for data persistence.
   - The database file is stored locally with the application.
   - Simple and lightweight, suitable for this demonstration application.

2. **Entity Framework Core**:
   - Code-first approach for database modeling and migrations.
   - ApplicationDbContext manages database interactions.
   - EF Core provides an abstraction layer over raw SQL.
   - Self-referencing relationships for message replies.

3. **Service Layer Pattern**:
   - Implemented a MessageService that handles business logic.
   - This separates concerns and makes the code more maintainable.
   - Service classes are registered as scoped (one instance per request).

4. **RESTful API Design**:
   - Followed RESTful conventions for API endpoints.
   - Proper HTTP status codes are used in the responses.
   - Async/await pattern used throughout for better performance.
   - Specialized endpoints for message replies.

5. **CORS Configuration**:
   - Set up CORS to allow requests from the frontend running on localhost:3000.

6. **JSON Serialization**:
   - Configured to handle circular references using ReferenceHandler.IgnoreCycles.
   - Ensures proper serialization of parent-child message relationships.

### Frontend (React)

1. **Component Structure**:
   - Created reusable components (Message, MessageForm, Header).
   - Pages directory for main application views.
   - Recursive component rendering for nested replies.

2. **State Management**:
   - Using React's built-in useState and useEffect hooks for managing state.
   - For more complex applications, a state management library like Redux could be added.
   - Recursive state updates for managing nested reply threads.

3. **Service Layer**:
   - Created a messageService to handle API calls.
   - Centralizes API logic and error handling.
   - Dedicated methods for managing replies.

4. **Styling Approach**:
   - Component-specific CSS files for better organization.
   - Global styles in index.css for shared styling.
   - Visual differentiation between top-level messages and replies.

## Message Threading Implementation

1. **Data Model**:
   - Self-referencing relationship in the Message model.
   - Each message can have a ParentId (null for top-level messages).
   - Messages can have multiple replies (children).

2. **API Design**:
   - GET /api/messages - Retrieves top-level messages with their replies.
   - GET /api/messages/{id} - Retrieves a specific message with its replies.
   - GET /api/messages/{id}/replies - Retrieves only the replies for a specific message.
   - POST /api/messages/{id}/reply - Creates a reply to a specific message.
   - DELETE /api/messages/{id}?deleteReplies=true - Deletes a message and optionally its replies.

3. **UI Implementation**:
   - Indented, visually distinct reply messages.
   - Expandable/collapsible reply threads.
   - Inline reply forms within each message.
   - Recursive component rendering for unlimited reply depth.

## Technical Stack

### Backend
- ASP.NET Core 8
- Entity Framework Core with SQLite
- C#
- RESTful API

### Frontend
- React 19
- Vite 6
- React Router 7
- Axios for HTTP requests

## Future Improvements

1. **Authentication**:
   - Add user authentication to attribute messages to specific users.
   - Implement authorization for editing/deleting only one's own messages.

2. **Advanced Database Features**:
   - Add indexes for better performance.
   - Implement soft delete functionality.
   - Optimize query performance for deeply nested threads.

3. **Real-time Updates**:
   - Implement SignalR or WebSockets for real-time message updates.
   - Live notifications for new replies to user's messages.

4. **Message Editing**:
   - Add functionality to edit existing messages.
   - Track edit history.

5. **Advanced Features**:
   - Message formatting (markdown support)
   - User profiles with avatars
   - Read receipts
   - Message reactions/likes

6. **Testing**:
   - Unit tests for backend services and controllers
   - End-to-end tests for frontend components
   - Load testing for message threads with many replies

## Deployment Considerations

1. **Backend**: 
   - Can be deployed to Azure App Service, AWS Elastic Beanstalk, or similar services.
   - Docker containerization for consistent environments.
   - For production, consider migrating to a more robust database (SQL Server, PostgreSQL).

2. **Frontend**:
   - Build for production and host on Azure Static Web Apps, Netlify, Vercel, or similar services.
   - Environment configuration for different deployment environments.

## Development Setup

See the README.md file for detailed setup instructions. 