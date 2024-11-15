import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ImageProvider } from './context/ImageContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';
import theme from './theme';
import QuestionsPage from './pages/QuestionsPage';
import PrivateRoute from './components/PrivateRoute';
import AlertsPage from './pages/AlertsPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import SolutionsPage from './pages/SolutionsPage';
import RetryInventoryPage from './pages/RetryInventoryPage';
import RetryPage from './pages/RetryPage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ImageProvider>
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              <Route element={<PrivateRoute />}>
                <Route path="/questions/:year/:month" element={<QuestionsPage />} /> {/* year와 month를 경로 파라미터로 받음 */}
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/solutions/:year/:month" element={<SolutionsPage />} /> {/* year와 month 파라미터 추가 */}
                <Route path="/retryInventory" element={<RetryInventoryPage />} />
                <Route path="/retry/:year/:month" element={<RetryPage />} />
              </Route>
            </Routes>
          </Router>
        </ImageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
