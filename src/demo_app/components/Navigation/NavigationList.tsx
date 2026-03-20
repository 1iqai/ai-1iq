import { Fragment } from 'react';
import { Divider, List } from '@mui/material';
import { NAVIGATION_CONFIG } from '../../config/navigation.config';
import NavigationSection from './NavigationSection';
import type { NavigationListProps } from './types';

const NavigationList: React.FC<NavigationListProps> = ({ role, collapsed, onItemClick }) => {
  // If no role, don't show any sections
  if (!role) {
    return null;
  }

  const sections = NAVIGATION_CONFIG.filter((section) => section.roles.includes(role));

  return (
    <List sx={{ px: 0, py: 1 }}>
      {sections.map((section, index) => (
        <Fragment key={section.id}>
          <NavigationSection section={section} collapsed={collapsed} onItemClick={onItemClick} />
          {index < sections.length - 1 && <Divider sx={{ my: 1, mx: 2 }} />}
        </Fragment>
      ))}
    </List>
  );
};

export default NavigationList;
