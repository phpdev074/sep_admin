import { useState, useCallback } from 'react';

import { Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { toast } from 'react-toastify';
import { api, deleteUser, API_BASE_URL } from 'src/api/url';
// ----------------------------------------------------------------------


interface Post {
  _id: string;
  userId: string;
  categoryId: string;
  postReport: string;
  userReport: string;
  content: string;
  files: File[];
  fileType: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  options: any[];
  votes: any[];
  location: {
    type: string;
    coordinates: [number, number];
  };
}


export type UserProps = {
  _id: string;
  name: string;
  role: string;
  // status: string;
  // company: string;
  // avatarUrl: string;
  // isVerified: boolean; 
  email: string;
  gender: string;
  phone: string;
  dob: string;
  bio: string;
  username: string;
  image: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onDelete: (userId: string) => void;
};





export function UserTableRow({ row, selected, onSelectRow, onDelete }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this user?");

    if (confirmed) {
      try {
        const response = await api.delete('/api/deleteAccount', {
          data: { id }
        });


        if (response.status === 200) {
          onDelete(id);
          toast.success('User deleted successfully');
        } else {
          toast.error('Failed to delete user');
        }
      } catch (error) {
        toast.error('Error deleting user');
      }
    }
  }, [onDelete]);


  const handleBlock = useCallback(async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to block this user")
    if (confirmed) {
      const response = await api.post(`/admin/blockUserByadmin?id=${id}`)
    }
    setOpenPopover(null);
  }, [])

  const handleOpenDetailsModal = () => {
    setOpenDetailsModal(true);
    handleClosePopover();
  };

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false);
  };


  return (
    <>

      <Dialog open={openDetailsModal} onClose={handleCloseDetailsModal} fullWidth maxWidth="sm">
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          👤 User Details
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            overflowY: 'auto',
            maxHeight: '600px',
            '&::-webkit-scrollbar': { display: 'none' },
            scrollbarWidth: 'none',
            px: 3,
            py: 4,
          }}
        >

          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
            <Avatar
              alt={row?.name}
              src={row?.image ? `${API_BASE_URL}${row?.image}` : undefined}
              sx={{
                width: 100,
                height: 100,
                mb: 1,
                border: '2px solid #1976d2',
                boxShadow: 2,
                transition: 'transform 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.2)', // Slightly enlarges the avatar on hover
                },
              }}
            />
            <Typography variant="h6" fontWeight="medium">
              {row?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {row?.email}
            </Typography>
          </Box>


          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 2fr',
              gap: 2,
              backgroundColor: '#f5f5f5',
              borderRadius: 2,
              p: 3,
              boxShadow: 1,
            }}
          >
            {[
              { icon: 'ic:baseline-phone', label: 'Phone', value: row?.phone },
              { icon: 'mdi:account', label: 'Username', value: row?.username || 'Not provided' },
              { icon: 'ic:round-male', label: 'Gender', value: row?.gender },
              { icon: 'mdi:information-outline', label: 'Bio', value: row?.bio || 'Not provided' },
              { icon: 'mdi:security', label: 'Role', value: row?.role },
              {
                icon: 'mdi:cake-variant',
                label: 'Date of Birth',
                value: row?.dob
                  ? new Date(row?.dob).toLocaleDateString('en-GB', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })
                  : 'Not provided',
              },
            ].map((field, idx) => (
              <Box key={idx} display="flex" alignItems="center" gap={1}>
                <Iconify icon={field.icon} width={20} color="text.secondary" />
                <Typography variant="subtitle2" color="text.secondary" sx={{ minWidth: 100 }}>
                  {field?.label}:
                </Typography>
                <Typography variant="body2" color="text.primary" sx={{ gridColumn: 'span 2' }}>
                  {field?.value}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>


        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseDetailsModal} color="primary" variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">            {/*eslint-disable-line */}

        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row?.name} src={row?.image ? `${API_BASE_URL}${row?.image}` : undefined} />

          </Box>
        </TableCell>

        <TableCell>{row?.name}</TableCell>

        <TableCell>{row?.gender}</TableCell>

        <TableCell>{row?.role}</TableCell>

        <TableCell align="center">
          {row?.email}
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleOpenDetailsModal}>

            View Details
          </MenuItem>

          <MenuItem
            onClick={() => handleDelete(row?._id)}
          >

            Delete
          </MenuItem>
          <MenuItem onClick={() => handleBlock(row?._id)} sx={{ color: 'error.main' }}>

            Block
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
