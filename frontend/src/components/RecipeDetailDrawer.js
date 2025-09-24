/**
 * Recipe Detail Drawer Component
 */
import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
  AccessTime as TimeIcon,
  Restaurant as RestaurantIcon,
  LocalDining as ServingIcon
} from '@mui/icons-material';

const RecipeDetailDrawer = ({ open, onClose, recipe }) => {
  const [expanded, setExpanded] = useState(false);

  if (!recipe) return null;

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} minutes`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
  };

  const extractServingNumber = (serves) => {
    if (!serves) return 'N/A';
    const match = serves.match(/(\d+)/);
    return match ? match[1] : serves;
  };

  const getNutritionValue = (nutrients, key) => {
    if (!nutrients || !nutrients[key]) return 'N/A';
    return nutrients[key];
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: { xs: '100%', sm: '500px', md: '600px' },
          maxWidth: '90vw'
        }
      }}
    >
      <Box sx={{ p: 3, height: '100%', overflow: 'auto' }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box flex={1}>
            <Typography variant="h5" component="h2" gutterBottom>
              {recipe.title}
            </Typography>
            {recipe.cuisine && (
              <Chip
                label={recipe.cuisine}
                color="primary"
                variant="outlined"
                icon={<RestaurantIcon />}
                sx={{ mb: 2 }}
              />
            )}
          </Box>
          <IconButton onClick={onClose} size="large">
            <CloseIcon />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Description */}
        {recipe.description && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Description
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {recipe.description}
            </Typography>
          </Box>
        )}

        {/* Rating */}
        {recipe.rating && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Rating
            </Typography>
            <Box display="flex" alignItems="center" gap={2}>
              <Rating
                value={recipe.rating}
                precision={0.1}
                size="large"
                readOnly
              />
              <Typography variant="h6" color="primary">
                {recipe.rating.toFixed(1)}/5.0
              </Typography>
            </Box>
          </Box>
        )}

        {/* Time Information */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <TimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Time Information
          </Typography>
          <Accordion expanded={expanded === 'time'} onChange={handleAccordionChange('time')}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body1">
                Total Time: {formatTime(recipe.total_time)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box display="flex" flexDirection="column" gap={1}>
                <Typography variant="body2">
                  <strong>Prep Time:</strong> {formatTime(recipe.prep_time)}
                </Typography>
                <Typography variant="body2">
                  <strong>Cook Time:</strong> {formatTime(recipe.cook_time)}
                </Typography>
                <Typography variant="body2">
                  <strong>Total Time:</strong> {formatTime(recipe.total_time)}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* Servings */}
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <ServingIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Servings
          </Typography>
          <Typography variant="body1">
            {extractServingNumber(recipe.serves)} people
          </Typography>
        </Box>

        {/* Ingredients */}
        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Ingredients
            </Typography>
            <List dense>
              {recipe.ingredients.map((ingredient, index) => (
                <ListItem key={index} sx={{ py: 0.5 }}>
                  <ListItemText
                    primary={ingredient}
                    primaryTypographyProps={{ variant: 'body2' }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Instructions */}
        {recipe.instructions && recipe.instructions.length > 0 && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Instructions
            </Typography>
            <List>
              {recipe.instructions.map((instruction, index) => (
                <ListItem key={index} sx={{ alignItems: 'flex-start' }}>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography variant="subtitle2" color="primary" component="span">
                          Step {index + 1}:
                        </Typography>
                        <Typography variant="body2" component="span" sx={{ ml: 1 }}>
                          {instruction}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}

        {/* Nutrition Information */}
        {recipe.nutrients && (
          <Box mb={3}>
            <Typography variant="h6" gutterBottom>
              Nutrition Information
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Nutrient</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Calories</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'calories')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Carbohydrates</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'carbohydrateContent')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Cholesterol</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'cholesterolContent')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Fiber</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'fiberContent')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Protein</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'proteinContent')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Saturated Fat</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'saturatedFatContent')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sodium</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'sodiumContent')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Sugar</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'sugarContent')}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Fat</TableCell>
                    <TableCell align="right">{getNutritionValue(recipe.nutrients, 'fatContent')}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* URL */}
        {recipe.url && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Source
            </Typography>
            <Typography
              variant="body2"
              component="a"
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                color: 'primary.main',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline'
                }
              }}
            >
              View Original Recipe
            </Typography>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default RecipeDetailDrawer;
