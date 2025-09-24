# Recipe Management System - Project Structure

## MERN Stack Implementation

```
recipe-management-system/
├── backend/                    # Express.js + MongoDB Backend
│   ├── config/
│   │   └── database.js         # MongoDB connection configuration
│   ├── models/
│   │   └── Recipe.js           # MongoDB Recipe model with Mongoose
│   ├── routes/
│   │   └── recipes.js          # API routes for recipe operations
│   ├── scripts/
│   │   └── seedData.js         # Script to parse JSON and seed MongoDB
│   ├── package.json            # Backend dependencies
│   ├── server.js               # Express server setup
│   └── env.example             # Environment variables template
│
├── frontend/                   # React Frontend
│   ├── public/
│   │   └── index.html          # HTML template
│   ├── src/
│   │   ├── components/
│   │   │   ├── RecipeTable.js      # Main table component with search/filter
│   │   │   └── RecipeDetailDrawer.js # Recipe detail view drawer
│   │   ├── services/
│   │   │   └── api.js              # API service for backend communication
│   │   ├── App.js                  # Main React app component
│   │   └── index.js                # React entry point
│   └── package.json            # Frontend dependencies
│
├── US_recipes_null.Pdf.json    # Source recipe data (JSON format)
├── Recipes Assessment.txt      # Project requirements document
├── README.md                   # Comprehensive documentation
├── PROJECT_STRUCTURE.md        # This file
└── setup.sh                    # Setup script for easy installation
```

## Key Features Implemented

### Backend (Express.js + MongoDB)
- ✅ RESTful API with pagination and sorting
- ✅ Advanced search with multiple filters
- ✅ MongoDB schema with proper indexing
- ✅ Data parsing with NaN value handling
- ✅ Security middleware (Helmet, CORS, Rate Limiting)
- ✅ Comprehensive error handling

### Frontend (React + Material-UI)
- ✅ Responsive recipe table with search
- ✅ Advanced filtering (title, cuisine, calories, time, rating)
- ✅ Pagination with customizable results per page (15-50)
- ✅ Recipe detail drawer with comprehensive information
- ✅ Star rating display
- ✅ Nutrition information table
- ✅ Time breakdown with expandable details
- ✅ Modern Material-UI design

### Data Processing
- ✅ JSON data parsing and cleaning
- ✅ NaN value handling and validation
- ✅ Batch processing for large datasets
- ✅ MongoDB seeding script

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recipes` | Get paginated recipes (sorted by rating) |
| GET | `/api/recipes/search` | Search recipes with filters |
| GET | `/api/recipes/:id` | Get specific recipe by ID |
| GET | `/api/recipes/cuisines/list` | Get all available cuisines |
| GET | `/health` | Health check endpoint |

## Quick Start

1. **Setup**: Run `./setup.sh` (Linux/Mac) or follow manual setup in README
2. **Backend**: `cd backend && npm run seed && npm run dev`
3. **Frontend**: `cd frontend && npm start`
4. **Access**: Open http://localhost:3000

## Technologies Used

- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Frontend**: React, Material-UI, Axios, React Query
- **Tools**: npm, nodemon, CORS, Helmet, Rate Limiting
