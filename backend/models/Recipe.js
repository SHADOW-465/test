/**
 * Recipe model for MongoDB
 */
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  cuisine: {
    type: String,
    trim: true,
    index: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    index: true
  },
  prep_time: {
    type: Number,
    min: 0
  },
  cook_time: {
    type: Number,
    min: 0
  },
  total_time: {
    type: Number,
    min: 0,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [{
    type: String,
    trim: true
  }],
  instructions: [{
    type: String,
    trim: true
  }],
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
  serves: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    trim: true
  },
  country_state: {
    type: String,
    trim: true
  },
  continent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
recipeSchema.index({ rating: -1 });
recipeSchema.index({ cuisine: 1 });
recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ total_time: 1 });

// Virtual for extracting numeric calories value
recipeSchema.virtual('calories_numeric').get(function() {
  if (this.nutrients && this.nutrients.calories) {
    const match = this.nutrients.calories.match(/(\d+)/);
    return match ? parseInt(match[1]) : null;
  }
  return null;
});

// Static method to clean and validate recipe data
recipeSchema.statics.cleanData = function(data) {
  const cleaned = { ...data };
  
  // Clean numeric values
  const numericFields = ['rating', 'prep_time', 'cook_time', 'total_time'];
  numericFields.forEach(field => {
    if (cleaned[field] === 'NaN' || cleaned[field] === 'null' || cleaned[field] === null) {
      cleaned[field] = null;
    } else if (typeof cleaned[field] === 'string') {
      const num = parseFloat(cleaned[field]);
      cleaned[field] = isNaN(num) ? null : num;
    }
  });
  
  // Clean string fields
  const stringFields = ['cuisine', 'title', 'description', 'serves', 'url', 'country_state', 'continent'];
  stringFields.forEach(field => {
    if (cleaned[field] === 'NaN' || cleaned[field] === 'null' || cleaned[field] === null) {
      cleaned[field] = null;
    } else if (typeof cleaned[field] === 'string') {
      cleaned[field] = cleaned[field].trim() || null;
    }
  });
  
  // Clean arrays
  if (cleaned.ingredients && Array.isArray(cleaned.ingredients)) {
    cleaned.ingredients = cleaned.ingredients.filter(ing => ing && ing.trim());
  }
  
  if (cleaned.instructions && Array.isArray(cleaned.instructions)) {
    cleaned.instructions = cleaned.instructions.filter(inst => inst && inst.trim());
  }
  
  // Clean nutrients
  if (cleaned.nutrients && typeof cleaned.nutrients === 'object') {
    const cleanNutrients = {};
    Object.keys(cleaned.nutrients).forEach(key => {
      const value = cleaned.nutrients[key];
      if (value && value !== 'NaN' && value !== 'null') {
        cleanNutrients[key] = value;
      }
    });
    cleaned.nutrients = Object.keys(cleanNutrients).length > 0 ? cleanNutrients : null;
  }
  
  return cleaned;
};

// Instance method to get formatted response
recipeSchema.methods.toJSON = function() {
  const obj = this.toObject();
  obj.calories_numeric = this.calories_numeric;
  return obj;
};

module.exports = mongoose.model('Recipe', recipeSchema);
