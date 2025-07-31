# To-Do List App - School Project

> A comprehensive, web-based to-do list application built with modern technologies for efficient task management and productivity enhancement. This project enables users to manage their daily tasks with advanced features like categorization, priority levels, drag-and-drop reordering, and sharing functionality.

![Project Status](https://img.shields.io/badge/Status-In%20Development-yellow)
![Phase](https://img.shields.io/badge/Phase-2%20Complete-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Ivan-Keli/To-Do-List.git
cd To-Do-List

# Quick setup (runs both frontend and backend)
npm install
npm run dev
```

**📖 For detailed setup instructions, see [SETUP.md](docs/SETUP.md)**

## 🎯 Project Overview

This Todo List application is a full-stack web solution designed to help users manage their daily tasks efficiently. Built as a school project, it demonstrates modern web development practices and comprehensive feature implementation.

### Key Highlights
- **Full-Stack Architecture**: React frontend with Node.js/Express backend
- **Database Integration**: PostgreSQL for robust data persistence  
- **Modern UI/UX**: Responsive design with dark/light theme support
- **Advanced Features**: Search, filtering, categorization, and priority management
- **Phase-Based Development**: Structured development approach with clear milestones

## ✨ Features

### ✅ **Phase 1 (MVP) - COMPLETED**
- Create, read, update, delete tasks
- Mark tasks as complete/incomplete
- Priority levels (High, Medium, Low)
- Database persistence

### ✅ **Phase 2 (Enhanced) - COMPLETED**
- Category management with color coding
- Due date tracking with visual indicators
- Advanced search and filtering
- Dark/light theme toggle
- Task statistics dashboard

### 🚧 **Phase 3 (Advanced) - IN PROGRESS**
- Drag and drop task reordering
- Export functionality (JSON/CSV)
- Secure task list sharing
- Performance optimizations

**📋 For complete feature documentation, see [FEATURES.md](docs/FEATURES.md)**

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for utility-first styling
- **React Hook Form** for form management
- **Lucide React** for modern icons
- **Date-fns** for date handling

### Backend  
- **Node.js** with Express framework
- **PostgreSQL** database
- **CORS** for cross-origin requests
- **Environment configuration** with dotenv

### Development Tools
- **Concurrently** for running multiple servers
- **Nodemon** for auto-restart during development

## 📁 Project Structure

```
todo-app/
├── frontend/          # React application
├── backend/           # Node.js/Express API
├── docs/             # Documentation
│   ├── API.md        # API reference
│   ├── FEATURES.md   # Feature documentation  
│   └── SETUP.md      # Setup instructions
├── shared/           # Shared types and constants
└── package.json      # Root package configuration
```

```
todo-app/
├── frontend/
│   ├── public/
│   │   ├── favicon.ico   
│   │   └── manifest.json
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/
│   │   │   │   ├── Button.jsx
│   │   │   │   ├── Input.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Select.jsx
│   │   │   │   └── Badge.jsx
│   │   │   ├── layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Layout.jsx
│   │   │   ├── tasks/
│   │   │   │   ├── TaskItem.jsx
│   │   │   │   ├── TaskForm.jsx
│   │   │   │   ├── TaskList.jsx
│   │   │   │   ├── TaskFilters.jsx
│   │   │   │   └── TaskStats.jsx
│   │   │   ├── categories/
│   │   │   │   └── CategoryManager.jsx
│   │   │   └── features/
│   │   │       └── SearchBar.jsx
│   │   ├── hooks/
│   │   │   └── useDebounce.js
│   │   ├── contexts/
│   │   │   ├── TaskContext.jsx
│   │   │   ├── ThemeContext.jsx
│   │   │   └── CategoryContext.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   ├── taskService.js
│   │   │   └── categoryService.js
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── index.html
│   └── .env.local
├── backend/
│   ├── routes/
│   │   ├── tasks.js
│   │   ├── categories.js
│   │   ├── share.js
│   │   └── export.js
│   ├── controllers/
│   │   ├── taskController.js
│   │   ├── categoryController.js
│   │   ├── shareController.js
│   │   └── exportController.js
│   ├── models/
│   │   ├── Task.js
│   │   ├── Category.js
│   │   └── SharedList.js
│   ├── middleware/
│   │   ├── cors.js
│   │   ├── validation.js
│   │   ├── errorHandler.js
│   │   └── rateLimit.js
│   ├── utils/
│   │   ├── database.js
│   │   ├── exportHelpers.js
│   │   ├── searchHelpers.js
│   │   ├── validation.js
│   │   └── tokenGenerator.js
│   ├── config/
│   │   ├── database.js
│   │   ├── server.js
│   │   └── constants.js
│   ├── migrations/
│   │   ├── 001_create_categories.sql
│   │   ├── 002_create_tasks.sql
│   │   └── 003_create_shared_lists.sql
│   ├── seeds/
│   │   └── sample_data.js
│   ├── tests/
│   │   ├── tasks.test.js
│   │   ├── categories.test.js
│   │   └── share.test.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── shared/
│   ├── types/
│   │   ├── Task.js
│   │   ├── Category.js
│   │   └── ApiResponse.js
│   └── constants/
│       ├── priorities.js
│       └── statusCodes.js
├── docs/
│   ├── API.md
│   ├── SETUP.md
│   └── FEATURES.md
├── .gitignore
├── README.md
├── docker-compose.yml (optional)
└── package.json (root)
```

## 🚦 Development Status

### Current Progress
- **Phase 1**: ✅ Complete (100%)
- **Phase 2**: ✅ Complete (100%)  
- **Phase 3**: 🚧 In Progress (30%)

### Live Servers
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3001
- **Database**: PostgreSQL on localhost:5432

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [SETUP.md](docs/SETUP.md) | Complete setup and installation guide |
| [FEATURES.md](docs/FEATURES.md) | Detailed feature specifications and usage |
| [API.md](docs/API.md) | API endpoints and integration guide |

## 🎓 Academic Context

This project demonstrates:
- **Software Engineering Principles**: Requirement analysis, system design, implementation
- **Modern Web Development**: Full-stack JavaScript development
- **Database Design**: Relational database modeling and optimization
- **User Experience**: Responsive design and accessibility
- **Project Management**: Agile methodology with phase-based delivery

### Stakeholder Analysis
- **Primary Users**: Students, professionals, anyone needing task management
- **Development Team**: Full-stack developers, UI/UX designers
- **Academic Reviewers**: Instructors evaluating technical implementation

### Methodology
**Agile Development with Iterative Prototyping**
- Phase-based development approach
- Regular testing and feedback incorporation
- User-centered design principles
- Continuous integration and deployment

## 🔧 Development

### Prerequisites
- Node.js (v16+)
- PostgreSQL (v12+)
- Git

### Quick Commands
```bash
# Start both servers
npm run dev

# Frontend only
cd frontend && npm run dev

# Backend only  
cd backend && npm run dev

# Database setup
cd backend && npm run setup
```

## 🧪 Testing

### Current Testing Status
- ✅ Manual testing across all major browsers
- ✅ API endpoint testing with sample data
- ✅ Cross-device responsive testing
- 🚧 Automated testing (planned)

### Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Ivan Keli**
- GitHub: [@Ivan-Keli](https://github.com/Ivan-Keli)
- Project: [To-Do-List](https://github.com/Ivan-Keli/To-Do-List)

## 🙏 Acknowledgments

- Built as part of software engineering coursework
- Inspired by modern productivity applications
- Thanks to the open-source community for the tools and libraries

---

## 📞 Support

If you encounter any issues or have questions:

1. **Check Documentation**: Review [SETUP.md](docs/SETUP.md) for common solutions
2. **API Issues**: Consult [API.md](docs/API.md) for endpoint details
3. **Feature Questions**: See [FEATURES.md](docs/FEATURES.md) for functionality details
4. **Create Issue**: Open an issue on GitHub for bugs or feature requests

---

**📌 Note**: This is an active development project. Features and documentation are continuously updated. Check the [GitHub repository](https://github.com/Ivan-Keli/To-Do-List) for the latest updates.
