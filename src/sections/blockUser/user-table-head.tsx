import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './utils';

// ----------------------------------------------------------------------

type UserTableHeadProps = {
  orderBy: string;
  rowCount: number;
  numSelected: number;
  order: 'asc' | 'desc';
  onSort: (id: string) => void;
  headLabel: Record<string, any>[];
  onSelectAllRows: (checked: boolean) => void;
};

export function UserTableHead({
  order,
  onSort,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onSelectAllRows,
}: UserTableHeadProps) {
  return (
    <TableHead>
      <TableRow
        sx={{
          '& .MuiTableCell-root': {
            padding: {
              xs: '8px 4px',  // Mobile: smaller padding
              sm: '16px 8px', // Small screens: medium padding
              md: '16px',     // Desktop: default padding
            },
            fontSize: {
              xs: '0.75rem',  // Mobile: smaller font
              sm: '0.875rem', // Small screens: medium font
              md: '1rem',     // Desktop: default font
            },
            fontWeight: 600,
            backgroundColor: 'background.neutral',
          },
        }}
      >
        {/* Checkbox Column - Hidden on mobile */}
        <TableCell 
          padding="checkbox"
          sx={{
            display: {
              xs: 'none',     // Hidden on mobile
              sm: 'table-cell' // Visible on small screens and up
            }
          }}
        >
          {/* <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              onSelectAllRows(event.target.checked)
            }
          /> */}
        </TableCell>

        {headLabel.map((headCell) => {
          // Determine if this column should be hidden on mobile
          const isHiddenOnMobile = headCell.id === 'title'; // Title is shown in image column on mobile
          
          return (
            <TableCell
              key={headCell.id}
              align={headCell.align || 'left'}
              sortDirection={orderBy === headCell.id ? order : false}
              sx={{ 
                width: headCell.width, 
                minWidth: {
                  xs: headCell.id === 'image' ? 120 : headCell.id === 'price' ? 60 : headCell.id === 'description' ? 100 : headCell.minWidth,
                  sm: headCell.id === 'image' ? 150 : headCell.id === 'price' ? 80 : headCell.id === 'description' ? 150 : headCell.minWidth,
                  md: headCell.minWidth,
                },
                maxWidth: {
                  xs: headCell.id === 'description' ? 100 : 'none',
                  sm: headCell.id === 'description' ? 150 : 'none',
                  md: headCell.id === 'description' ? 300 : 'none',
                },
                display: isHiddenOnMobile ? {
                  xs: 'none',     // Hidden on mobile
                  sm: 'table-cell' // Visible on small screens and up
                } : 'table-cell',
                // Responsive text adjustments
                ...(headCell.id === 'image' && {
                  '& .MuiTableSortLabel-root': {
                    fontSize: {
                      xs: '0.7rem',
                      sm: '0.8rem',
                      md: '1rem',
                    }
                  }
                })
              }}
            >
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
                sx={{
                  '& .MuiTableSortLabel-icon': {
                    fontSize: {
                      xs: '1rem',
                      sm: '1.25rem',
                      md: '1.5rem',
                    }
                  },
                  flexDirection: {
                    xs: 'column',   // Stack icon below text on mobile
                    sm: 'row',      // Side by side on larger screens
                  },
                  '& .MuiTableSortLabel-iconDirectionAsc, & .MuiTableSortLabel-iconDirectionDesc': {
                    marginLeft: {
                      xs: 0,
                      sm: '4px',
                    },
                    marginTop: {
                      xs: '2px',
                      sm: 0,
                    }
                  }
                }}
              >
                {/* Responsive label text */}
                <Box
                  component="span"
                  sx={{
                    display: {
                      xs: headCell.mobileLabel ? 'none' : 'inline', // Hide if mobile label exists
                      sm: 'inline'
                    }
                  }}
                >
                  {headCell.label}
                </Box>
                {/* Mobile-specific shorter labels */}
                {headCell.mobileLabel && (
                  <Box
                    component="span"
                    sx={{
                      display: {
                        xs: 'inline',
                        sm: 'none'
                      }
                    }}
                  >
                    {headCell.mobileLabel}
                  </Box>
                )}
                
                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          );
        })}
      </TableRow>
    </TableHead>
  );
}
