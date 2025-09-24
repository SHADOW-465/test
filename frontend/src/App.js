/**
 * Main App Component
 */
import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';
import RecipeTable from './components/RecipeTable';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f5f5f5',
        },
      },
    },
  },
});

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ flexGrow: 1 }}>
          {/* App Bar */}
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Recipe Management System
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Main Content */}
          <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
            <RecipeTable />
          </Container>
        </Box>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
