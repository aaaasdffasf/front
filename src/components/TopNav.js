// TopNav.js
import React from 'react';
import { IconButton, InputBase, Badge, Avatar } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Notifications as NotificationsIcon, Settings as SettingsIcon } from '@mui/icons-material';
import './TopNav.css';

const TopNav = () => {
  return (
    <div className="topnav">
      {/* 햄버거 메뉴 아이콘 */}
      <div className="topnav-left">
        <IconButton>
          <MenuIcon />
        </IconButton>

        {/* 검색 창 */}
        <div className="search-bar">
          <SearchIcon />
          <InputBase
            placeholder="Type any cryptocurrency..."
            inputProps={{ 'aria-label': 'search' }}
          />
        </div>
      </div>

      {/* 오른쪽 아이콘들 */}
      <div className="topnav-right">
        <IconButton>
          <Badge badgeContent={3} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton>
          <SettingsIcon />
        </IconButton>
        
      </div>
    </div>
  );
};

export default TopNav;
