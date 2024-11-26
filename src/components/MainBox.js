//MainBox.js

import { Box } from '@mui/material';

const MainBox = ({ 
  children, 
  backgroundColor = 'white', 
  flexDirection = 'row', 
  p = 1, 
  mx = 2, 
  borderRadius = 3, 
  height = 'auto', 
  width = '100%', 
  boxShadow = 3 // 그림자 추가
}) => {
  return (
    <Box
      sx={{
        backgroundColor,
        borderRadius,
        textAlign: 'center',
        p,
        mx,
        display: 'flex',
        flexDirection,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        height,
        width,
        flexGrow: 1,
        boxShadow, // 그림자 추가
      }}
    >
      {children}
    </Box>
  );
};

export default MainBox;
