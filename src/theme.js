// theme.js 파일
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // 기본 파란색
    },
    secondary: {
      main: '#dc004e', // 기본 빨간색
    },
    error: {
      main: '#f44336', // 오류 색상 (빨강)
    },
    warning: {
      main: '#ff9800', // 경고 색상 (주황)
    },
    info: {
      main: '#2196f3', // 정보 색상 (파랑)
    },
    success: {
      main: '#4caf50', // 성공 색상 (초록)
    },
    background: {
      default: '#f5f5f5', // 기본 배경 색상 (밝은 회색)
      paper: '#ffffff', // 카드나 종이 배경 색상 (흰색)
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
    button: {
      textTransform: 'none', // 버튼 텍스트 대문자 변환 비활성화
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px', // 버튼의 둥근 모서리
          padding: '8px 16px',
        },
        containedPrimary: {
          backgroundColor: '#1976d2',
          color: '#ffffff',
          '&:hover': {
            backgroundColor: '#115293',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1976d2', // AppBar 기본 배경색
          color: '#ffffff',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '16px',
          borderRadius: '12px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        },
      },
    },
  },
});

export default theme;