# Recipe Management System - MERN Stack

A comprehensive recipe management system built with the MERN stack (MongoDB, Express.js, React, Node.js) that allows users to browse, search, and view detailed information about thousands of recipes.

## 🚀 Quick Start

```bash
# Clone and setup
git clone <repository-url>
cd recipe-management-system

# Run setup script (Linux/Mac)
./setup.sh

# Or setup manually:
# Backend
cd backend && npm install && cp env.example .env
# Frontend  
cd ../frontend && npm install

# Start the application
# Terminal 1: Backend
cd backend && npm run seed && npm run dev

# Terminal 2: Frontend
cd frontend && npm start
```

Visit http://localhost:3000 to see the application!

## Features

### Backend (Express.js + MongoDB)
- **RESTful API** with pagination, sorting, and advanced search
- **MongoDB** for scalable data storage
- **Data parsing** with NaN value handling
- **Rate limiting** and security middleware
- **Comprehensive search** with multiple filters

### Frontend (React + Material-UI)
- **Responsive table** with recipe listings
- **Advanced search and filtering** by title, cuisine, calories, time, and rating
- **Pagination** with customizable results per page (15-50)
- **Detail drawer** with comprehensive recipe information
- **Star ratings** display
- **Nutrition information** table
- **Time breakdown** with expandable details

## API Endpoints

### Get All Recipes
```
GET /api/recipes?page=1&limit=10
```
Returns paginated recipes sorted by rating (descending).

### Search Recipes
```
GET /api/recipes/search?title=pizza&cuisine=Italian&calories=>500&total_time=<60&rating=>4.0&page=1&limit=10
```
Search recipes with multiple filters:
- `title`: Partial text match (case-insensitive)
- `cuisine`: Exact match
- `calories`: Numeric comparison (e.g., `>500`, `<300`, `=400`)
- `total_time`: Numeric comparison in minutes
- `rating`: Numeric comparison (0-5 scale)

### Get Recipe by ID
```
GET /api/recipes/:id
```

### Get Available Cuisines
```
GET /api/recipes/cuisines/list
```

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Configuration:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/recipe_management
   JSON_FILE_PATH=../US_recipes_null.Pdf.json
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB:**
   - Local: Ensure MongoDB is running on your system
   - Atlas: Use your MongoDB Atlas connection string

5. **Seed the database:**
   ```bash
   npm run seed
   ```

6. **Start the server:**
   ```bash
   npm run dev
   ```

   The API will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`

## Database Schema

### Recipe Collection
```javascript
{
  _id: ObjectId,
  cuisine: String,
  title: String,
  rating: Number (0-5),
  prep_time: Number (minutes),
  cook_time: Number (minutes),
  total_time: Number (minutes),
  description: String,
  ingredients: [String],
  instructions: [String],
  nutrients: {
    calories: String,
    carbohydrateContent: String,
    cholesterolContent: String,
    fiberContent: String,
    proteinContent: String,
    saturatedFatContent: String,
    sodiumContent: String,
    sugarContent: String,
    fatContent: String,
    unsaturatedFatContent: String
  },
  serves: String,
  url: String,
  country_state: String,
  continent: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Usage

### Searching Recipes
1. Use the search bar to find recipes by title
2. Click the filter icon to access advanced filters
3. Apply filters for cuisine, calories, cooking time, and rating
4. Results update automatically as you type

### Viewing Recipe Details
1. Click on any recipe row to open the detail drawer
2. View comprehensive information including:
   - Full description and rating
   - Time breakdown (prep, cook, total)
   - Complete ingredient list
   - Step-by-step instructions
   - Detailed nutrition information
   - Source URL

### Pagination
- Use the pagination controls at the bottom
- Customize results per page (15, 25, or 50)
- Navigate through pages using the arrow buttons

## Data Processing

The system includes robust data processing capabilities:

- **NaN Value Handling**: Automatically converts 'NaN', 'null', and invalid values to proper null values
- **Data Validation**: Ensures data integrity before database insertion
- **Batch Processing**: Efficiently processes large datasets in batches
- **Error Handling**: Comprehensive error logging and recovery

## API Testing

### Using curl
```bash
# Get all recipes (first page)
curl "http://localhost:5000/api/recipes?page=1&limit=10"

# Search for Italian recipes with high rating
curl "http://localhost:5000/api/recipes/search?cuisine=Italian&rating=>4.0"

# Search for quick recipes
curl "http://localhost:5000/api/recipes/search?total_time=<30"
```

### Health Check
```bash
curl "http://localhost:5000/health"
```

## Production Deployment

### Environment Variables
Set the following environment variables for production:
- `NODE_ENV=production`
- `MONGODB_URI=your_production_mongodb_uri`
- `FRONTEND_URL=your_production_frontend_url`

### Build Frontend
```bash
cd frontend
npm run build
```

### Start Production Server
```bash
cd backend
npm start
```

## Technologies Used

### Backend
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - API protection
- **Morgan** - HTTP request logger

### Frontend
- **React** - UI library
- **Material-UI** - Component library
- **Axios** - HTTP client
- **React Query** - Data fetching and caching
- **React Router** - Client-side routing

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
