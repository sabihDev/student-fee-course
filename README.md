# Student Fee Management System

A fullstack web application for managing student fee records with filtering, sorting, and CSV export functionality.

## Features

- Student Management (CRUD operations)
- Display student details (name, class, phone number, fee status)
- Filter students by class, fee status, and date
- Sort by different fields (name, class, fee status)
- Fee payment recording and tracking
- Download student data as CSV
- Classes from Play Group to Class Ten
- Responsive design
- Real-time updates
- MongoDB integration
- TypeScript type safety

## Project Structure

```
project/
├── backend/          # Node.js/Express backend
│   ├── src/
│   │   ├── index.ts
│   │   ├── types.ts
│   │   └── data.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/         # React frontend
    ├── src/
    │   ├── App.tsx
    │   ├── App.css
    │   ├── main.tsx
    │   └── types.ts
    ├── index.html
    ├── package.json
    └── tsconfig.json
```

## Setup & Running

### Prerequisites

1. Install MongoDB (if not already installed):
   ```bash
   # Ubuntu
   sudo apt-get install mongodb
   # macOS
   brew install mongodb-community
   ```

2. Start MongoDB service:
   ```bash
   sudo service mongodb start  # Ubuntu
   brew services start mongodb-community  # macOS
   ```

### Backend

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your MongoDB URI and other settings
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

The backend will run on http://localhost:5000

### Frontend

1. In a new terminal, navigate to the frontend directory:
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

The frontend will run on http://localhost:5173

## API Endpoints

### Students
- `GET /api/students` - Get all students with optional filtering and sorting
  - Query parameters:
    - `class`: Filter by class
    - `feeStatus`: Filter by fee status (paid/unpaid)
    - `month`: Filter by fee payment month
    - `year`: Filter by fee payment year
    - `sortBy`: Field to sort by (name/class/feeStatus)
    - `sortOrder`: Sort order (asc/desc)

- `POST /api/students` - Create a new student
- `GET /api/students/:id` - Get student details by ID
- `PUT /api/students/:id` - Update student details
- `DELETE /api/students/:id` - Delete student and associated records

### Fee Management
- `POST /api/students/:id/fee` - Record fee payment
- `GET /api/students/:id/fee-history` - Get student's fee payment history
- `GET /api/students/export/csv` - Export student data as CSV with fee details

## Technologies Used

### Frontend:
- React 18 with TypeScript
- Vite for build tooling
- React Select for dropdowns
- Axios for API calls
- React Toastify for notifications
- CSS for responsive styling
- GitHub Pages for deployment

### Backend:
- Node.js with TypeScript
- Express for API server
- MongoDB for database
- Mongoose for ODM
- JSON2CSV for data export
- CORS for cross-origin requests
- Error handling middleware
- Type-safe controllers and models

### Development:
- ESLint for code linting
- TypeScript for type safety
- GitHub Actions for CI/CD
- Environment variables management
- Proper error handling and logging