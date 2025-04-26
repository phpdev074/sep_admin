/* eslint-disable */

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
  reportedPostId: {
    content: string;
    files: File[];
  };
  reporterId: {
    name: string;
  }
  reportedUserId: {
    name: string;
  }
  details: string;
  timestamp: string;
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
  const [openImageModal, setOpenImageModal] = useState(false);

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditContent(e.target.value);

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files ? e.target.files[0] : null;
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setSelectedImage(reader.result as string); 
  //     };
  //     reader.readAsDataURL(file); 
  //   }
  // };

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

  const handleOpenImageModal = (src:any) => {
    setSelectedImage(src);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImage(null);
  };
  


  return (
    <>

<Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
    🚩 Reported Post
  </DialogTitle>

  <DialogContent dividers>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, px: 2, py: 3 }}>

      {/* Image */}
      <Avatar
        src={`${API_BASE_URL}${row.reportedPostId?.files?.[0]?.file}`}
        alt="Reported Post Image"
        variant="rounded"
        sx={{
          width: 140,
          height: 140,
          mx: 'auto',
          boxShadow: 2,
          border: '2px solid #d32f2f',
          cursor: 'pointer',
                transition: 'transform 0.4s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.3)',
                  zIndex: 1,
                },
        }}
      />

      {/* Post Content */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Content:</Typography>
        <Typography>{row.reportedPostId?.content || 'N/A'}</Typography>
      </Box>

      {/* Reason */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Reason:</Typography>
        <Typography>{row.reason || 'N/A'}</Typography>
      </Box>

      {/* Details */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Details:</Typography>
        <Typography>{row.details || 'N/A'}</Typography>
      </Box>

      {/* Reporter */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Reporter Name:</Typography>
        <Typography>{row.reporterId.name}</Typography>
      </Box>

      {/* Reported User */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Reported User Name:</Typography>
        <Typography>{row.reportedUserId.name}</Typography>
      </Box>

      {/* Created At */}
      <Box>
        <Typography variant="subtitle1" fontWeight="bold">Reported Time:</Typography>
        <Typography>
          {row.timestamp ? format(new Date(row.timestamp), 'PPp') : 'N/A'}
        </Typography>
      </Box>
    </Box>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'center', py: 2 }}>
    <Button onClick={handleCloseEditModal} variant="outlined" color="primary">
      Close
    </Button>
  </DialogActions>
</Dialog>




      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
         <TableCell padding="checkbox">    {/* eslint-disable-line */}

        </TableCell>

        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar src={`${API_BASE_URL}${row.files?.[0]?.file}`} />

          </Box>
        </TableCell> */}

        <TableCell component="th" scope="row">
            <Box gap={2} display="flex" alignItems="center">
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                overflow: 'visible', 
                cursor: 'pointer',
                transition: 'transform 0.4s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.3)',
                  zIndex: 1,
                },
              }}
              onClick={() => handleOpenImageModal(`${API_BASE_URL}${row.reportedPostId?.files?.[0]?.file}`)}
            >
                 <Avatar
                src={`${API_BASE_URL}${row.reportedPostId?.files?.[0]?.file}`} 
                sx={{
                  width: '100%',
                  height: '100%',
                }}
              />
              </Box>
            </Box>
          </TableCell>

        {/* <TableCell>{row.reason}</TableCell> */}

        <TableCell>{row.reason}</TableCell>

        <TableCell>{format(new Date(row.timestamp), 'PP')}</TableCell>

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
      <Dialog open={openImageModal} onClose={handleCloseImageModal} maxWidth="md" fullWidth>
              <DialogContent sx={{ p: 0, bgcolor: 'black' }}>
                <img
                  src={selectedImage || undefined}
                  alt="Post Preview"
                  style={{
                    width: '100%',
                    maxHeight: '80vh',
                    objectFit: 'contain',
                    display: 'block',
                    margin: 'auto',
                  }}
                  onClick={handleCloseImageModal}
                />
              </DialogContent>
      </Dialog>
    </>
  );
}
