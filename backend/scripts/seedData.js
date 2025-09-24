/**
 * Script to parse JSON data and seed MongoDB with recipe data
 */
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const Recipe = require('../models/Recipe');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

const parseNumericValue = (value) => {
  if (value === 'NaN' || value === 'null' || value === null || value === undefined) {
    return null;
  }
  if (typeof value === 'string') {
    const num = parseFloat(value);
    return isNaN(num) ? null : num;
  }
  return value;
};

const cleanRecipeData = (recipeData) => {
  const cleaned = { ...recipeData };
  
  // Clean numeric fields
  cleaned.rating = parseNumericValue(cleaned.rating);
  cleaned.prep_time = parseNumericValue(cleaned.prep_time);
  cleaned.cook_time = parseNumericValue(cleaned.cook_time);
  cleaned.total_time = parseNumericValue(cleaned.total_time);
  
  // Clean string fields
  const stringFields = ['cuisine', 'title', 'description', 'serves', 'URL', 'Country_State', 'Contient'];
  stringFields.forEach(field => {
    if (cleaned[field] === 'NaN' || cleaned[field] === 'null' || cleaned[field] === null) {
      cleaned[field] = null;
    } else if (typeof cleaned[field] === 'string') {
      cleaned[field] = cleaned[field].trim() || null;
    }
  });
  
  // Map field names to match schema
  cleaned.url = cleaned.URL;
  cleaned.country_state = cleaned.Country_State;
  cleaned.continent = cleaned.Contient;
  
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
  
  // Remove original field names
  delete cleaned.URL;
  delete cleaned.Country_State;
  delete cleaned.Contient;
  
  return cleaned;
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Recipe.deleteMany({});
    console.log('Cleared existing recipe data');
    
    // Read JSON file
    const jsonFilePath = process.env.JSON_FILE_PATH || path.join(__dirname, '../../US_recipes_null.Pdf.json');
    console.log(`Reading JSON file: ${jsonFilePath}`);
    
    if (!fs.existsSync(jsonFilePath)) {
      throw new Error(`JSON file not found: ${jsonFilePath}`);
    }
    
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    console.log(`Loaded ${Object.keys(jsonData).length} recipes from JSON`);
    
    // Process and insert recipes
    const recipes = [];
    let processedCount = 0;
    let errorCount = 0;
    
    for (const [recipeId, recipeData] of Object.entries(jsonData)) {
      try {
        if (!recipeData || typeof recipeData !== 'object') {
          console.warn(`Skipping invalid recipe data for ID: ${recipeId}`);
          errorCount++;
          continue;
        }
        
        const cleanedData = cleanRecipeData(recipeData);
        
        // Skip if no title (required field)
        if (!cleanedData.title) {
          console.warn(`Skipping recipe without title: ${recipeId}`);
          errorCount++;
          continue;
        }
        
        recipes.push(cleanedData);
        processedCount++;
        
        if (processedCount % 1000 === 0) {
          console.log(`Processed ${processedCount} recipes...`);
        }
        
      } catch (error) {
        console.error(`Error processing recipe ${recipeId}:`, error.message);
        errorCount++;
      }
    }
    
    // Insert recipes in batches
    const batchSize = 1000;
    let insertedCount = 0;
    
    for (let i = 0; i < recipes.length; i += batchSize) {
      const batch = recipes.slice(i, i + batchSize);
      await Recipe.insertMany(batch, { ordered: false });
      insertedCount += batch.length;
      console.log(`Inserted batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(recipes.length / batchSize)} (${insertedCount}/${recipes.length} recipes)`);
    }
    
    console.log('\n=== Seeding Complete ===');
    console.log(`Total recipes in JSON: ${Object.keys(jsonData).length}`);
    console.log(`Successfully processed: ${processedCount}`);
    console.log(`Errors encountered: ${errorCount}`);
    console.log(`Inserted into database: ${insertedCount}`);
    
    // Create indexes for better performance
    await Recipe.collection.createIndex({ rating: -1 });
    await Recipe.collection.createIndex({ cuisine: 1 });
    await Recipe.collection.createIndex({ title: 'text', description: 'text' });
    await Recipe.collection.createIndex({ total_time: 1 });
    console.log('Database indexes created');
    
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase, cleanRecipeData };
