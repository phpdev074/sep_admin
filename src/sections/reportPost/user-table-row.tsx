

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
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { format } from 'date-fns';
import { api,API_BASE_URL } from '../../api/url'

// ----------------------------------------------------------------------

interface File {
  file: string;
  type: string;
  _id: string;
}

interface Post {
  _id: string;
  userId: string;
  categoryId: string;
  content: string;
  files: File[];
  fileType: string;
  createdAt: string;
  reason: string;
  count: string;
  image: string;
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
  // files: string;
  files: File[];
  // status: string;
  // company: string;
  // avatarUrl: string;
  // isVerified: boolean; 
  content: string;
  createdAt: string;
};

type UserTableRowProps = {
  row: Post;
  selected: boolean;
  onSelectRow: () => void;
  onDeletePost: (id: string) => void;
};

export function UserTableRow({ row, selected, onSelectRow,onDeletePost  }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editContent, setEditContent] = useState(row.content);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleCloseEditModal = () => setOpenEditModal(false);
  const handleOpenEditModal = () => setOpenEditModal(true);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditContent(e.target.value);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string); 
      };
      reader.readAsDataURL(file); 
    }
  };

  const handleSubmitEdit = () => {
    
    console.log('Content:', editContent);
    console.log('Selected Image:', selectedImage);
    handleCloseEditModal(); 
  };

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);



  const handleDelete = useCallback(async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete the post");
    if (confirmed) {
      try {
        const response = await api.delete(`/api/post/deleteReportPost?id=${id}`);
        onDeletePost(id);
      } catch (error) {
        console.error("Error deleting post:", error);
        
      }
    }
  }, [onDeletePost]);
  


  return (
    <>

<Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
      <DialogTitle>Edit Post</DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

          {/* Displaying Image */}
          <Box display="flex" justifyContent="center">
            <Avatar
              src={selectedImage || `${API_BASE_URL}${row.files?.[0]?.file}`}  
              alt="Post Image"
              variant="rounded"
              sx={{ width: 120, height: 120 }}
            />
          </Box>

          {/* File Input to change image */}
          <Button variant="outlined" component="label">
            Change Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              hidden
            />
          </Button>

          {/* Editable Content */}
          <TextField
            label="Content"
            multiline
            rows={4}
            value={editContent}
            onChange={handleContentChange}
            fullWidth
            variant="outlined"
          />

          {/* Created At Information */}
          <Box>
            <Typography variant="body2" color="text.secondary">
              Created At:
            </Typography>
            {/* <Typography variant="body1">
              {format(new Date(row.createdAt), 'PPpp')}
            </Typography> */}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleCloseEditModal}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleSubmitEdit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>


      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
         <TableCell padding="checkbox">    {/* eslint-disable-line */}

        </TableCell>

        <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar src={`${API_BASE_URL}${row.files?.[0]?.file}`} />

          </Box>
        </TableCell>

        {/* <TableCell>{row.reason}</TableCell> */}

        <TableCell>{row.reason}</TableCell>

        <TableCell>{row.count}</TableCell>

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
          <MenuItem onClick={handleOpenEditModal}>
            
            Edit
          </MenuItem>

          <MenuItem onClick={() => handleDelete(row?._id)} sx={{ color: 'error.main' }}>
            
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
