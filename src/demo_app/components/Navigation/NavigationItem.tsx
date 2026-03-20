import { ListItemButton, ListItemIcon, ListItemText, Tooltip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import type { NavigationItemProps } from './types';

const NavigationItem: React.FC<NavigationItemProps> = ({ item, collapsed, onItemClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const Icon = item.icon;
  const isActive = location.pathname === item.path;

  const handleClick = () => {
    navigate(item.path);
    onItemClick?.();
  };

  const button = (
    <ListItemButton
      onClick={handleClick}
      selected={isActive}
      sx={{
        minHeight: 48,
        justifyContent: collapsed ? 'center' : 'initial',
        px: 2.5,
        borderRadius: 1,
        mx: 1,
        my: 0.5,
      }}
    >
      <ListItemIcon
        sx={{
          minWidth: 0,
          mr: collapsed ? 0 : 2,
          justifyContent: 'center',
          color: isActive ? 'primary.main' : 'text.secondary',
        }}
      >
        <Icon fontSize="small" />
      </ListItemIcon>
      {!collapsed && (
        <ListItemText
          primary={item.title}
          primaryTypographyProps={{
            fontSize: '0.875rem',
            fontWeight: isActive ? 600 : 500,
            color: isActive ? 'primary.main' : 'text.primary',
          }}
        />
      )}
    </ListItemButton>
  );

  if (collapsed) {
    return (
      <Tooltip title={item.title} placement="right" arrow>
        {button}
      </Tooltip>
    );
  }

  return button;
};

export default NavigationItem;
