# Setup Guide - Todo List Application

This guide provides step-by-step instructions for setting up the Todo List application on your local development environment.

## 📋 Prerequisites

### Required Software
- **Node.js** (v16.0.0 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12.0 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/downloads)
- **Code Editor** (VS Code recommended) - [Download](https://code.visualstudio.com/)

### System Requirements
- **Operating System**: Windows 10+, macOS 10.15+, or Linux
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: At least 500MB free space
- **Network**: Internet connection for package installation

## 🚀 Installation

### 1. Clone the Repository

```bash
# Clone the project
git clone https://github.com/Ivan-Keli/To-Do-List.git

# Navigate to project directory
cd To-Do-List
```

### 2. Database Setup

#### PostgreSQL Installation and Configuration

**Windows:**
```bash
# Using chocolatey (if installed)
choco install postgresql

# Or download installer from PostgreSQL website
```

**macOS:**
```bash
# Using Homebrew
brew install postgresql
brew services start postgresql
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE todo_app;
CREATE USER todo_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE todo_app TO todo_user;

# Exit PostgreSQL
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your database credentials
# Use your preferred text editor
nano .env
```

#### Backend Environment Variables (.env)
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=todo_app
DB_USER=todo_user
DB_PASSWORD=your_password

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

#### Run Database Migrations

```bash
# Setup database tables
npm run setup

# Or manually run migrations
npm run migrate

# Seed with sample data (optional)
npm run seed
```

#### Start Backend Server

```bash
# Development mode with auto-restart
npm run dev

# Production mode
npm start
```

**Backend should now be running on http://localhost:3001**

### 4. Frontend Setup

```bash
# Navigate to frontend directory (new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Edit environment file if needed
nano .env.local
```

#### Frontend Environment Variables (.env.local)
```env
# API Configuration
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME=Todo App
VITE_APP_VERSION=1.0.0

# Development Configuration
VITE_DEV_MODE=true
```

#### Start Frontend Server

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Frontend should now be running on http://localhost:5173**

### 5. Running Both Servers Simultaneously

```bash
# From the root directory
npm install
npm run dev
```

This will start both frontend and backend servers concurrently.

## 🔧 Configuration

### Database Configuration

#### Connection Settings
- **Host**: localhost
- **Port**: 5432 (default PostgreSQL port)
- **Database**: todo_app
- **Username**: todo_user
- **Password**: Set during database setup

#### Connection Testing
```bash
# Test database connection
cd backend
npm run test:db
```

### Server Configuration

#### Port Settings
- **Backend**: 3001 (configurable in backend/.env)
- **Frontend**: 5173 (configurable in vite.config.js)
- **Database**: 5432 (PostgreSQL default)

#### CORS Configuration
The backend is configured to accept requests from:
- http://localhost:5173 (frontend development server)
- Additional origins can be added in backend/.env

## 🧪 Verification

### Health Checks

1. **Backend Health Check**
   ```bash
   curl http://localhost:3001/health
   # Expected: {"status": "OK", "timestamp": "..."}
   ```

2. **Database Connection Test**
   ```bash
   curl http://localhost:3001/api/test
   # Expected: {"message": "Database connected successfully"}
   ```

3. **Frontend Loading**
   - Open http://localhost:5173 in your browser
   - You should see the Todo App interface

### Sample Data Verification

```bash
# Check tasks endpoint
curl http://localhost:3001/api/tasks

# Check categories endpoint  
curl http://localhost:3001/api/categories
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Errors

**Error**: `Connection refused` or `database "todo_app" does not exist`

**Solutions**:
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql  # Linux
brew services list | grep postgres  # macOS

# Verify database exists
psql -U postgres -l

# Create database if missing
psql -U postgres -c "CREATE DATABASE todo_app;"
```

#### Port Already in Use

**Error**: `Port 3001 is already in use`

**Solutions**:
```bash
# Find process using port
lsof -i :3001  # macOS/Linux
netstat -ano | findstr :3001  # Windows

# Kill process or use different port
kill -9 <PID>

# Or change port in backend/.env
PORT=3002
```

#### Permission Errors

**Error**: `Permission denied` or `EACCES`

**Solutions**:
```bash
# Fix npm permissions (macOS/Linux)
sudo chown -R $(whoami) ~/.npm

# Use npx for global packages
npx <command>

# Or use sudo (not recommended)
sudo npm install
```

#### Frontend Build Errors

**Error**: Build failures or dependency issues

**Solutions**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Update dependencies
npm update
```

### Environment-Specific Issues

#### Windows Issues
- Use PowerShell or Command Prompt as Administrator
- Install Windows Build Tools if needed:
  ```bash
  npm install --global windows-build-tools
  ```

#### macOS Issues
- Install Xcode Command Line Tools:
  ```bash
  xcode-select --install
  ```

#### Linux Issues
- Install build essentials:
  ```bash
  sudo apt-get install build-essential
  ```

## 📊 Database Schema Setup

The application uses the following database structure:

### Tables Created by Migration

1. **categories**
   - id (Primary Key)
   - name (Unique)
   - color (Hex color code)
   - created_at, updated_at

2. **tasks**
   - id (Primary Key)
   - title (Required)
   - description (Optional)
   - priority (high, medium, low)
   - is_completed (Boolean)
   - due_date (Timestamp)
   - order_index (Integer for sorting)
   - tags (Array of strings)
   - category_id (Foreign Key)
   - created_at, updated_at

3. **shared_lists** (Future implementation)
   - id (Primary Key)
   - token (Unique sharing token)
   - task_ids (Array of task IDs)
   - expires_at (Timestamp)
   - created_at

### Sample Data

Default categories created:
- **Personal** (Blue - #3B82F6)
- **Work** (Green - #10B981)  
- **Shopping** (Yellow - #F59E0B)
- **Health** (Red - #EF4444)

Sample tasks with various priorities and due dates are also created.

## 🔄 Development Workflow

### Recommended Setup Process

1. **Initial Setup** (First time)
   ```bash
   git clone https://github.com/Ivan-Keli/To-Do-List.git
   cd To-Do-List
   # Follow database setup
   # Configure environment files
   npm install
   ```

2. **Daily Development**
   ```bash
   # Start both servers
   npm run dev
   
   # Or separately:
   # Terminal 1: Backend
   cd backend && npm run dev
   
   # Terminal 2: Frontend  
   cd frontend && npm run dev
   ```

3. **Testing Changes**
   - Backend changes: Server auto-restarts with nodemon
   - Frontend changes: Hot reload with Vite
   - Database changes: Run migrations manually

### IDE Configuration

#### VS Code Extensions (Recommended)
- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- PostgreSQL
- Thunder Client (API testing)
- Prettier - Code formatter
- ESLint

#### VS Code Settings
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact"
  }
}
```

## 📚 Next Steps

After successful setup:

1. **Explore Features**: See [FEATURES.md](FEATURES.md) for functionality overview
2. **API Integration**: Check [API.md](API.md) for endpoint documentation  
3. **Development**: Start building new features or fixing issues
4. **Testing**: Add your own tasks and test all functionality

## 🆘 Getting Help

If you encounter issues not covered here:

1. **Check Logs**: Look at console output for error messages
2. **GitHub Issues**: Search existing issues or create new ones
3. **Documentation**: Review [README.md](../README.md) for overview
4. **API Reference**: Consult [API.md](API.md) for backend details

---

**⚠️ Important Notes**:
- Always run both frontend and backend servers for full functionality
- Database must be running before starting the backend
- Environment files contain sensitive information - never commit them to version control
- For production deployment, additional security measures are required
