// src/App.js

import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MainPage from './pages/MainPage';
import { AuthProvider } from './context/AuthContext';
import { ImageProvider } from './context/ImageContext'; // ImageProvider import 추가
import theme from './theme';
import QuestionsPage from './pages/QuestionsPage';
import PrivateRoute from './components/PrivateRoute';
import AlertsPage from './pages/AlertsPage';
import AnalysisPage from './pages/AnalysisPage';
import HistoryPage from './pages/HistoryPage';
import SolutionsPage from './pages/SolutionsPage';
import MistakeNotePage from './pages/MistakeNotePage';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <ImageProvider> {/* ImageProvider import 및 사용 */}
          <Router>
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />

              <Route element={<PrivateRoute />}>
                <Route path="/questions/:year/:month" element={<QuestionsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/analysis" element={<AnalysisPage />} />
                <Route path="/history" element={<HistoryPage />} />

                {/* 일반 문제 풀이 */}
                <Route path="/solutions/:year/:month/:number" element={<SolutionsPage />} />

                {/* 오답 문제 풀이 */}
                <Route path="/solutions/:year/:month/:number/mistake" element={<SolutionsPage />} />
                
                <Route path="/mistake/:year/:month" element={<MistakeNotePage />} />
              </Route>
            </Routes>
          </Router>
        </ImageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
