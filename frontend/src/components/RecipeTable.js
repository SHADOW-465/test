/**
 * Recipe Table Component with search, pagination, and detail view
 */
import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { recipeAPI } from '../services/api';
import RecipeDetailDrawer from './RecipeDetailDrawer';

const RecipeTable = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  // Search and filter states
  const [searchFilters, setSearchFilters] = useState({
    title: '',
    cuisine: '',
    calories: '',
    total_time: '',
    rating: ''
  });
  const [cuisines, setCuisines] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Load cuisines on component mount
  useEffect(() => {
    const loadCuisines = async () => {
      try {
        const response = await recipeAPI.getCuisines();
        setCuisines(response.data);
      } catch (err) {
        console.error('Error loading cuisines:', err);
      }
    };
    loadCuisines();
  }, []);

  // Load recipes when page, rowsPerPage, or filters change
  useEffect(() => {
    loadRecipes();
  }, [page, rowsPerPage, searchFilters]);

  const loadRecipes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const currentPage = page + 1; // API uses 1-based pagination
      const hasFilters = Object.values(searchFilters).some(filter => filter !== '');
      
      let response;
      if (hasFilters) {
        // Clean filters - remove empty values
        const cleanFilters = Object.fromEntries(
          Object.entries(searchFilters).filter(([_, value]) => value !== '')
        );
        response = await recipeAPI.searchRecipes(cleanFilters, currentPage, rowsPerPage);
      } else {
        response = await recipeAPI.getRecipes(currentPage, rowsPerPage);
      }
      
      setRecipes(response.data.recipes);
      setTotalCount(response.data.pagination.total);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error('Error loading recipes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setPage(0); // Reset to first page when filters change
  };

  const handleRowClick = (recipe) => {
    setSelectedRecipe(recipe);
    setDrawerOpen(true);
  };

  const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatTime = (minutes) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const extractServingNumber = (serves) => {
    if (!serves) return 'N/A';
    const match = serves.match(/(\d+)/);
    return match ? match[1] : serves;
  };

  if (loading && recipes.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Recipe Management
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            placeholder="Search by title..."
            value={searchFilters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
            size="small"
          />
          <Tooltip title="Toggle Filters">
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              color={showFilters ? 'primary' : 'default'}
            >
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Filters */}
      {showFilters && (
        <Paper sx={{ p: 2, mb: 3 }}>
          <Box display="flex" gap={2} flexWrap="wrap" alignItems="center">
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Cuisine</InputLabel>
              <Select
                value={searchFilters.cuisine}
                onChange={(e) => handleFilterChange('cuisine', e.target.value)}
                label="Cuisine"
              >
                <MenuItem value="">All Cuisines</MenuItem>
                {cuisines.map((cuisine) => (
                  <MenuItem key={cuisine} value={cuisine}>
                    {cuisine}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Calories"
              placeholder="e.g., >500, <300, =400"
              value={searchFilters.calories}
              onChange={(e) => handleFilterChange('calories', e.target.value)}
              size="small"
              sx={{ width: 150 }}
            />

            <TextField
              label="Total Time (min)"
              placeholder="e.g., >60, <30, =45"
              value={searchFilters.total_time}
              onChange={(e) => handleFilterChange('total_time', e.target.value)}
              size="small"
              sx={{ width: 150 }}
            />

            <TextField
              label="Rating"
              placeholder="e.g., >4.0, <3.0, =4.5"
              value={searchFilters.rating}
              onChange={(e) => handleFilterChange('rating', e.target.value)}
              size="small"
              sx={{ width: 150 }}
            />
          </Box>
        </Paper>
      )}

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Cuisine</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Total Time</TableCell>
              <TableCell>Serves</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recipes.map((recipe) => (
              <TableRow
                key={recipe._id}
                hover
                onClick={() => handleRowClick(recipe)}
                sx={{ cursor: 'pointer' }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {truncateText(recipe.title)}
                  </Typography>
                </TableCell>
                <TableCell>
                  {recipe.cuisine && (
                    <Chip label={recipe.cuisine} size="small" variant="outlined" />
                  )}
                </TableCell>
                <TableCell>
                  {recipe.rating ? (
                    <Box display="flex" alignItems="center" gap={1}>
                      <Rating
                        value={recipe.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary">
                        {recipe.rating.toFixed(1)}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      N/A
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatTime(recipe.total_time)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {extractServingNumber(recipe.serves)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Tooltip title="View Details">
                    <IconButton size="small">
                      <ExpandMoreIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        rowsPerPageOptions={[15, 25, 50]}
        component="div"
        count={totalCount}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleRowsPerPageChange}
        labelRowsPerPage="Results per page:"
      />

      {/* Recipe Detail Drawer */}
      <RecipeDetailDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        recipe={selectedRecipe}
      />
    </Box>
  );
};

export default RecipeTable;
