import { useState } from 'react';
import { Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { ExpandMoreOutlined, ChevronRightOutlined } from '@mui/icons-material';
import NavigationItem from './NavigationItem';
import type { NavigationSectionProps } from './types';

const NavigationSection: React.FC<NavigationSectionProps> = ({ section, collapsed, onItemClick }) => {
  const [expanded, setExpanded] = useState(true);

  const Icon = section.icon;

  if (collapsed) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, py: 1 }}>
        {section.items.map((item) => (
          <NavigationItem key={item.id} item={item} collapsed onItemClick={onItemClick} />
        ))}
      </Box>
    );
  }

  return (
    <Box sx={{ my: 1 }}>
      <ListItemButton
        onClick={() => setExpanded(!expanded)}
        sx={{
          px: 2,
          py: 1,
          mx: 1,
          borderRadius: 1,
        }}
      >
        <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
          <Icon fontSize="small" />
        </ListItemIcon>
        <ListItemText
          primary={section.title}
          primaryTypographyProps={{
            fontSize: '0.8125rem',
            fontWeight: 600,
            color: 'text.secondary',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        />
        {expanded ? (
          <ExpandMoreOutlined sx={{ fontSize: 16 }} />
        ) : (
          <ChevronRightOutlined sx={{ fontSize: 16 }} />
        )}
      </ListItemButton>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <List component="div" disablePadding sx={{ pl: 1 }}>
          {section.items.map((item) => (
            <NavigationItem key={item.id} item={item} collapsed={false} onItemClick={onItemClick} />
          ))}
        </List>
      </Collapse>
    </Box>
  );
};

export default NavigationSection;
