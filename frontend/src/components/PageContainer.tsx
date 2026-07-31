// frontend/src/components/PageContainer.tsx

import React, { ReactNode } from 'react';
import { Container, Box, Typography, Breadcrumbs, Link } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface PageContainerProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  breadcrumbs?: { label: string; href?: string }[];
}

export const PageContainer: React.FC<PageContainerProps> = ({
  title,
  subtitle,
  children,
  breadcrumbs,
}) => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2 }}
        >
          {breadcrumbs.map((crumb, idx) =>
            crumb.href ? (
              <Link key={idx} underline="hover" color="inherit" href={crumb.href}>
                {crumb.label}
              </Link>
            ) : (
              <Typography key={idx} sx={{ color: 'text.primary' }}>
                {crumb.label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      {title && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
      )}

      {children}
    </Container>
  );
};
