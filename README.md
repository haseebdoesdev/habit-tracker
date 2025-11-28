# AI-Powered Habit Tracker

A full-stack habit tracking application with AI-powered suggestions and party/guild features.

## Team Members

| Member | Responsibilities |
|--------|------------------|
| **Haseeb** | Authentication, Analytics, Party Management, Accountability |
| **Nouman** | Habits, AI Integration, Party Goals, Dashboard |
| **Omamah** | Logging, Calendar Integration, Party Features, Forms |

## Tech Stack

- **Frontend**: React.js, React Router, Tailwind CSS, Recharts
- **Backend**: FastAPI (Python)
- **Database**: PostgreSQL with SQLAlchemy ORM
- **AI**: Google Gemini API
- **Calendar**: Google Calendar API

## Project Structure

```
habit-tracker/
├── backend/
│   ├── app/
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── controllers/     # Business logic
│   │   ├── routers/         # API endpoints
│   │   ├── middleware/      # Auth middleware
│   │   └── utils/           # Helper utilities
│   ├── alembic/             # Database migrations
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── context/         # React contexts
│   │   ├── services/        # API services
│   │   └── utils/           # Helper functions
│   └── package.json
│
└── README.md
```

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- PostgreSQL 14+

### Database Setup

1. Install PostgreSQL on your machine
2. Create a new database:
   ```sql
   CREATE DATABASE habit_tracker;
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # Mac/Linux
   source venv/bin/activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your `.env` file:
   ```bash
   copy env.example .env   # Windows
   cp env.example .env     # Mac/Linux
   ```

5. Edit `.env` with your values:
   - Database URL
   - JWT secret key
   - Gemini API key
   - Google Calendar credentials

6. Run database migrations:
   ```bash
   alembic upgrade head
   ```

7. Start the backend server:
   ```bash
   uvicorn app.main:app --reload
   ```

   The API will be available at http://localhost:8000

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will be available at http://localhost:5173

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Development Workflow

### For Each Team Member

1. **Find your files**: Look for files marked with your name (e.g., `[HASEEB]`)
2. **Read the TODOs**: Each file has TODO comments explaining what to implement
3. **Implement step by step**: Follow the TODOs in order
4. **Test your work**: Use the API docs to test endpoints

### Understanding the TODO Format

```python
# TODO: [Action to take in plain English]
# WHY: [Educational explanation of why this is needed]
# APPROACH: [High-level strategy - how to think about it]
# SECURITY: [Security considerations if applicable]
```

### Recommended Order of Implementation

#### Haseeb (Start Here)
1. `backend/app/config.py` - Environment configuration
2. `backend/app/database.py` - Database connection
3. `backend/app/models/user.py` - User model
4. `backend/app/utils/security.py` - Password hashing & JWT (with Nouman)
5. `backend/app/controllers/auth_controller.py` - Auth logic
6. `backend/app/routers/auth.py` - Auth endpoints
7. `frontend/src/context/AuthContext.jsx` - Auth state
8. `frontend/src/components/Auth/Login.jsx` - Login form

#### Nouman (After Auth is Working)
1. `backend/app/models/habit.py` - Habit model
2. `backend/app/schemas/habit.py` - Habit validation
3. `backend/app/controllers/habit_controller.py` - Habit logic
4. `backend/app/routers/habits.py` - Habit endpoints
5. `frontend/src/services/habitService.js` - Habit API calls
6. `frontend/src/components/Dashboard/Dashboard.jsx` - Main dashboard

#### Omamah (After Habits are Working)
1. `backend/app/models/log.py` - Log model
2. `backend/app/schemas/log.py` - Log validation
3. `backend/app/controllers/log_controller.py` - Log logic
4. `backend/app/routers/logs.py` - Log endpoints
5. `frontend/src/components/Habits/CreateHabit.jsx` - Create habit form
6. `frontend/src/components/Habits/HabitList.jsx` - Habit list view

## Security Reminders

1. **Never commit** `.env` files or secrets
2. **Always hash** passwords before storing
3. **Validate all** input with Pydantic schemas
4. **Use JWT tokens** for authentication
5. **Check permissions** before allowing actions

## Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add: description of what you added"

# Push and create PR
git push origin feature/your-feature-name
```

## Need Help?

1. Check the TODO comments in your assigned files
2. Look at the API docs at http://localhost:8000/docs
3. Review related files to understand patterns
4. Ask your team members!

## License

This project is for educational purposes (semester project).

