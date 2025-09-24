/**
 * Recipe routes for the API
 */
const express = require('express');
const { body, query, validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation errors',
      errors: errors.array()
    });
  }
  next();
};

// Parse numeric filter helper
const parseNumericFilter = (filterValue) => {
  if (!filterValue) return null;
  
  const match = filterValue.match(/^(>=|<=|>|<|=)?(\d+(?:\.\d+)?)$/);
  if (!match) return null;
  
  const operator = match[1] || '=';
  const value = parseFloat(match[2]);
  
  return { operator, value };
};

// GET /api/recipes - Get all recipes with pagination and sorting
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  handleValidationErrors
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Get total count
    const total = await Recipe.countDocuments(query);
    
    // Get recipes with pagination, sorted by rating (descending)
    const recipes = await Recipe.find(query)
      .sort({ rating: -1, _id: 1 }) // Sort by rating desc, then by _id for consistency
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Calculate pagination info
    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;
    
    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages,
          hasNext,
          hasPrev
        }
      }
    });
    
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/recipes/search - Search recipes with filters
router.get('/search', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('calories').optional().matches(/^(>=|<=|>|<|=)?\d+(?:\.\d+)?$/).withMessage('Invalid calories filter format'),
  query('total_time').optional().matches(/^(>=|<=|>|<|=)?\d+(?:\.\d+)?$/).withMessage('Invalid total_time filter format'),
  query('rating').optional().matches(/^(>=|<=|>|<|=)?\d+(?:\.\d+)?$/).withMessage('Invalid rating filter format'),
  handleValidationErrors
], async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Calories filter
    if (req.query.calories) {
      const caloriesFilter = parseNumericFilter(req.query.calories);
      if (caloriesFilter) {
        const { operator, value } = caloriesFilter;
        const caloriesQuery = {};
        caloriesQuery[`nutrients.calories`] = { $regex: `\\b${value}\\b` };
        
        // For more precise filtering, we could extract numeric values
        // For now, using regex to match the number in the calories string
        query.$and = query.$and || [];
        query.$and.push(caloriesQuery);
      }
    }
    
    // Title filter (partial match, case insensitive)
    if (req.query.title) {
      query.title = { $regex: req.query.title, $options: 'i' };
    }
    
    // Cuisine filter (exact match)
    if (req.query.cuisine) {
      query.cuisine = req.query.cuisine;
    }
    
    // Total time filter
    if (req.query.total_time) {
      const timeFilter = parseNumericFilter(req.query.total_time);
      if (timeFilter) {
        const { operator, value } = timeFilter;
        const timeQuery = {};
        
        switch (operator) {
          case '>=':
            timeQuery.$gte = value;
            break;
          case '<=':
            timeQuery.$lte = value;
            break;
          case '>':
            timeQuery.$gt = value;
            break;
          case '<':
            timeQuery.$lt = value;
            break;
          default: // equals
            timeQuery.$eq = value;
        }
        
        query.total_time = timeQuery;
      }
    }
    
    // Rating filter
    if (req.query.rating) {
      const ratingFilter = parseNumericFilter(req.query.rating);
      if (ratingFilter) {
        const { operator, value } = ratingFilter;
        const ratingQuery = {};
        
        switch (operator) {
          case '>=':
            ratingQuery.$gte = value;
            break;
          case '<=':
            ratingQuery.$lte = value;
            break;
          case '>':
            ratingQuery.$gt = value;
            break;
          case '<':
            ratingQuery.$lt = value;
            break;
          default: // equals
            ratingQuery.$eq = value;
        }
        
        query.rating = ratingQuery;
      }
    }
    
    // Get total count
    const total = await Recipe.countDocuments(query);
    
    // Get recipes with pagination and sorting
    const recipes = await Recipe.find(query)
      .sort({ rating: -1, _id: 1 })
      .skip(skip)
      .limit(limit)
      .lean();
    
    // Calculate pagination info
    const pages = Math.ceil(total / limit);
    const hasNext = page < pages;
    const hasPrev = page > 1;
    
    res.json({
      success: true,
      data: {
        recipes,
        pagination: {
          page,
          limit,
          total,
          pages,
          hasNext,
          hasPrev
        }
      }
    });
    
  } catch (error) {
    console.error('Error searching recipes:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/recipes/:id - Get a specific recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    res.json({
      success: true,
      data: recipe
    });
    
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/recipes/cuisines/list - Get all available cuisines
router.get('/cuisines/list', async (req, res) => {
  try {
    const cuisines = await Recipe.distinct('cuisine', { cuisine: { $ne: null } });
    
    res.json({
      success: true,
      data: cuisines.sort()
    });
    
  } catch (error) {
    console.error('Error fetching cuisines:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;
