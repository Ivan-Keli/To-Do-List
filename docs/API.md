# API Reference - Todo List Application

This document provides comprehensive information about the RESTful API endpoints, request/response formats, and integration guidelines for the Todo List application.

## 🌐 Base URL

```
Local Development: http://localhost:3001
API Base Path: /api
```

## 🔐 Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible during development.

**Future Implementation**: JWT-based authentication will be added for user-specific data protection.

## 📋 API Overview

### Available Resources
- **Tasks**: Core task management operations
- **Categories**: Category management for task organization
- **Health**: System health and status checks
- **Export**: Data export functionality (planned)
- **Share**: Task sharing features (planned)

### Response Format

All API responses follow a consistent JSON format:

```json
{
  "success": true,
  "data": {...},
  "message": "Operation completed successfully",
  "timestamp": "2025-07-31T12:00:00.000Z"
}
```

### Error Format

Error responses include detailed information:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title is required",
    "details": {...}
  },
  "timestamp": "2025-07-31T12:00:00.000Z"
}
```

## 📝 Task Endpoints

### GET /api/tasks

Retrieve tasks with optional filtering and search.

#### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search` | string | Search in title, description, tags | `?search=meeting` |
| `category` | integer | Filter by category ID | `?category=1` |
| `priority` | string | Filter by priority level | `?priority=high` |
| `completed` | boolean | Filter by completion status | `?completed=false` |
| `overdue` | boolean | Filter overdue tasks | `?overdue=true` |
| `limit` | integer | Number of results (default: 100) | `?limit=20` |
| `offset` | integer | Pagination offset | `?offset=20` |

#### Request Example

```bash
GET /api/tasks?search=project&priority=high&completed=false
```

#### Response Example

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "priority": "high",
      "is_completed": false,
      "due_date": "2025-08-05T10:00:00.000Z",
      "order_index": 0,
      "tags": ["documentation", "project"],
      "category_id": 2,
      "created_at": "2025-07-31T08:00:00.000Z",
      "updated_at": "2025-07-31T08:00:00.000Z",
      "category": {
        "id": 2,
        "name": "Work",
        "color": "#10B981"
      }
    }
  ],
  "message": "Tasks retrieved successfully",
  "total": 1,
  "timestamp": "2025-07-31T12:00:00.000Z"
}
```

### POST /api/tasks

Create a new task.

#### Request Body

```json
{
  "title": "Complete project documentation",
  "description": "Write comprehensive API documentation",
  "priority": "high",
  "due_date": "2025-08-05T10:00:00.000Z",
  "category_id": 2,
  "tags": ["documentation", "project"]
}
```

#### Required Fields
- `title` (string): Task title (1-255 characters)

#### Optional Fields
- `description` (string): Task description
- `priority` (string): Priority level (`high`, `medium`, `low`)
- `due_date` (string): ISO 8601 date string
- `category_id` (integer): Valid category ID
- `tags` (array): Array of string tags

#### Response Example

```json
{
  "success": true,
  "data": {
    "id": 15,
    "title": "Complete project documentation",
    "description": "Write comprehensive API documentation",
    "priority": "high",
    "is_completed": false,
    "due_date": "2025-08-05T10:00:00.000Z",
    "order_index": 14,
    "tags": ["documentation", "project"],
    "category_id": 2,
    "created_at": "2025-07-31T12:00:00.000Z",
    "updated_at": "2025-07-31T12:00:00.000Z"
  },
  "message": "Task created successfully",
  "timestamp": "2025-07-31T12:00:00.000Z"
}
```

### PUT /api/tasks/:id

Update an existing task.

#### Path Parameters
- `id` (integer): Task ID

#### Request Body
Same as POST /api/tasks, but all fields are optional.

#### Response Example
```json
{
  "success": true,
  "data": {
    "id": 15,
    "title": "Updated task title",
    "description": "Updated description",
    "priority": "medium",
    "is_completed": false,
    "due_date": "2025-08-10T10:00:00.000Z",
    "order_index": 14,
    "tags": ["updated", "task"],
    "category_id": 1,
    "created_at": "2025-07-31T12:00:00.000Z",
    "updated_at": "2025-07-31T12:30:00.000Z"
  },
  "message": "Task updated successfully",
  "timestamp": "2025-07-31T12:30:00.000Z"
}
```

### DELETE /api/tasks/:id

Delete a task.

#### Path Parameters
- `id` (integer): Task ID

#### Response Example
```json
{
  "success": true,
  "data": null,
  "message": "Task deleted successfully",
  "timestamp": "2025-07-31T12:35:00.000Z"
}
```

### PATCH /api/tasks/:id/complete

Toggle task completion status.

#### Path Parameters
- `id` (integer): Task ID

#### Request Body
```json
{
  "is_completed": true
}
```

#### Response Example
```json
{
  "success": true,
  "data": {
    "id": 15,
    "title": "Complete project documentation",
    "is_completed": true,
    "updated_at": "2025-07-31T12:40:00.000Z"
  },
  "message": "Task completion status updated",
  "timestamp": "2025-07-31T12:40:00.000Z"
}
```

### PATCH /api/tasks/reorder

Reorder multiple tasks (for drag & drop functionality).

#### Request Body
```json
{
  "tasks": [
    {"id": 1, "order_index": 0},
    {"id": 3, "order_index": 1},
    {"id": 2, "order_index": 2}
  ]
}
```

#### Response Example
```json
{
  "success": true,
  "data": [
    {"id": 1, "order_index": 0, "updated_at": "2025-07-31T12:45:00.000Z"},
    {"id": 3, "order_index": 1, "updated_at": "2025-07-31T12:45:00.000Z"},
    {"id": 2, "order_index": 2, "updated_at": "2025-07-31T12:45:00.000Z"}
  ],
  "message": "Tasks reordered successfully",
  "timestamp": "2025-07-31T12:45:00.000Z"
}
```

## 📂 Category Endpoints

### GET /api/categories

Retrieve all categories.

#### Response Example
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Personal",
      "color": "#3B82F6",
      "created_at": "2025-07-31T08:00:00.000Z",
      "updated_at": "2025-07-31T08:00:00.000Z"
    },
    {
      "id": 2,
      "name": "Work",
      "color": "#10B981",
      "created_at": "2025-07-31T08:00:00.000Z",
      "updated_at": "2025-07-31T08:00:00.000Z"
    }
  ],
  "message": "Categories retrieved successfully",
  "timestamp": "2025-07-31T12:00:00.000Z"
}
```

### POST /api/categories

Create a new category.

#### Request Body
```json
{
  "name": "Project Tasks",
  "color": "#8B5CF6"
}
```

#### Required Fields
- `name` (string): Category name (1-100 characters, unique)

#### Optional Fields
- `color` (string): Hex color code (default: #3B82F6)

#### Response Example
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Project Tasks",
    "color": "#8B5CF6",
    "created_at": "2025-07-31T12:50:00.000Z",
    "updated_at": "2025-07-31T12:50:00.000Z"
  },
  "message": "Category created successfully",
  "timestamp": "2025-07-31T12:50:00.000Z"
}
```

### PUT /api/categories/:id

Update an existing category.

#### Path Parameters
- `id` (integer): Category ID

#### Request Body
```json
{
  "name": "Updated Category Name",
  "color": "#F59E0B"
}
```

#### Response Example
```json
{
  "success": true,
  "data": {
    "id": 5,
    "name": "Updated Category Name",
    "color": "#F59E0B",
    "created_at": "2025-07-31T12:50:00.000Z",
    "updated_at": "2025-07-31T12:55:00.000Z"
  },
  "message": "Category updated successfully",
  "timestamp": "2025-07-31T12:55:00.000Z"
}
```

### DELETE /api/categories/:id

Delete a category. Tasks in this category will have their category_id set to null.

#### Path Parameters
- `id` (integer): Category ID

#### Response Example
```json
{
  "success": true,
  "data": null,
  "message": "Category deleted successfully",
  "timestamp": "2025-07-31T13:00:00.000Z"
}
```

## 🏥 Health & Status Endpoints

### GET /health

Check system health and status.

#### Response Example
```json
{
  "status": "OK",
  "timestamp": "2025-07-31T13:05:00.000Z",
  "uptime": "2h 30m 45s",
  "version": "1.0.0"
}
```

### GET /api/test

Test database connectivity.

#### Response Example
```json
{
  "success": true,
  "message": "Database connected successfully",
  "timestamp": "2025-07-31T13:05:00.000Z"
}
```

### GET /api/stats

Get API usage statistics.

#### Response Example
```json
{
  "success": true,
  "data": {
    "total_tasks": 25,
    "completed_tasks": 15,
    "active_tasks": 10,
    "total_categories": 4,
    "overdue_tasks": 2
  },
  "message": "Statistics retrieved successfully",
  "timestamp": "2025-07-31T13:05:00.000Z"
}
```

## 🚀 Planned Endpoints (Phase 3)

### Export Endpoints

#### GET /api/tasks/export

Export tasks in various formats.

**Planned Query Parameters:**
- `format`: Export format (`json`, `csv`, `pdf`)
- `filter`: Apply current filters to export
- `date_range`: Export tasks within date range

### Share Endpoints

#### POST /api/share/create

Create a shareable link for tasks.

**Planned Request Body:**
```json
{
  "task_ids": [1, 2, 3],
  "expires_in": "7d",
  "password": "optional_password"
}
```

#### GET /api/share/:token

Access shared task list.

**Planned Response:**
- Read-only task data
- Share metadata
- Access logging

## 🔧 Error Handling

### HTTP Status Codes

| Code | Description | When Used |
|------|-------------|-----------|
| 200 | OK | Successful GET, PUT, PATCH |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Invalid request data |
| 404 | Not Found | Resource doesn't exist |
| 422 | Unprocessable Entity | Validation errors |
| 500 | Internal Server Error | Server errors |

### Error Response Examples

#### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Task title is required",
    "details": {
      "field": "title",
      "value": "",
      "constraint": "required"
    }
  },
  "timestamp": "2025-07-31T13:10:00.000Z"
}
```

#### Not Found Error (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Task not found",
    "details": {
      "resource": "task",
      "id": 999
    }
  },
  "timestamp": "2025-07-31T13:10:00.000Z"
}
```

#### Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred",
    "details": null
  },
  "timestamp": "2025-07-31T13:10:00.000Z"
}
```

## 📚 Integration Examples

### JavaScript/Fetch

```javascript
// Get all tasks
const response = await fetch('http://localhost:3001/api/tasks');
const data = await response.json();

// Create a task
const newTask = await fetch('http://localhost:3001/api/tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'New Task',
    priority: 'high',
    category_id: 1
  })
});

// Update task completion
const updatedTask = await fetch(`http://localhost:3001/api/tasks/1/complete`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    is_completed: true
  })
});
```

### Axios

```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Get filtered tasks
const tasks = await api.get('/tasks', {
  params: {
    search: 'project',
    priority: 'high',
    completed: false
  }
});

// Create category
const category = await api.post('/categories', {
  name: 'New Category',
  color: '#FF5733'
});

// Delete task
await api.delete('/tasks/1');
```

### cURL Examples

```bash
# Get all tasks
curl -X GET "http://localhost:3001/api/tasks"

# Create task
curl -X POST "http://localhost:3001/api/tasks" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "New Task",
    "description": "Task description",
    "priority": "high",
    "category_id": 1
  }'

# Update task
curl -X PUT "http://localhost:3001/api/tasks/1" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "priority": "medium"
  }'

# Delete task
curl -X DELETE "http://localhost:3001/api/tasks/1"

# Toggle completion
curl -X PATCH "http://localhost:3001/api/tasks/1/complete" \
  -H "Content-Type: application/json" \
  -d '{"is_completed": true}'
```

## 🔒 Security Considerations

### Current Security Measures
- **CORS**: Configured for development origins
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Prevention**: Parameterized queries
- **Error Handling**: No sensitive information in error responses

### Future Security Enhancements
- **Authentication**: JWT-based user authentication
- **Authorization**: Role-based access control
- **Rate Limiting**: API request throttling
- **Input Sanitization**: Advanced input cleaning
- **HTTPS**: Secure transport in production

## 📊 Performance

### Response Times
- **GET /api/tasks**: < 100ms (typical)
- **POST /api/tasks**: < 200ms (typical)
- **PUT /api/tasks/:id**: < 150ms (typical)
- **DELETE /api/tasks/:id**: < 100ms (typical)

### Optimization Features
- **Database Indexes**: Optimized query performance
- **Query Optimization**: Efficient SQL queries
- **Pagination**: Large dataset handling
- **Caching**: Response caching (planned)

## 🧪 Testing

### API Testing Tools
- **Thunder Client** (VS Code extension)
- **Postman** collection available
- **cURL** commands provided
- **Automated tests** (planned)

### Test Data
Sample tasks and categories are automatically created during database setup. See [SETUP.md](SETUP.md) for initialization details.

## 📱 Frontend Integration

The API is designed to work seamlessly with the React frontend. For frontend implementation details, see [FEATURES.md](FEATURES.md).

### Service Layer
```javascript
// taskService.js example
export const taskService = {
  async getAllTasks(filters = {}) {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/tasks?${params}`);
    return response.data;
  },
  
  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  }
  
  // ... other methods
};
```

## 🔄 Versioning

### Current Version
- **API Version**: 1.0
- **Endpoint Versioning**: Not implemented (future consideration)
- **Backward Compatibility**: Maintained within major versions

### Future Versioning Strategy
- **Semantic Versioning**: Major.Minor.Patch
- **Deprecation Notices**: 6-month notice period
- **Migration Guides**: Provided for breaking changes

---

**📝 Note**: This API is currently in development. Endpoints marked as "Planned" are part of the Phase 3 roadmap and subject to change.

For setup instructions, see [SETUP.md](SETUP.md).  
For feature details, see [FEATURES.md](FEATURES.md).  
For project overview, see [README.md](../README.md).
