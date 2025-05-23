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
import Grid from '@mui/material/Unstable_Grid2';
import { Icon } from '@iconify/react';

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
  // userId: string;
  // categoryId: string;
  content: string;
  files: File[];
  fileType: string;
  country: string;
  createdAt: string;
  image: string;
  updatedAt: string;
  __v: number;
  options: any[];
  votes: any[];
  location: {
    type: string;
    coordinates: [number, number];
  };
  videoCount: string;
  startTime: string;
  endTime: string;
  duration: string;
  watchedUsers: string;
  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
  categoryId: {
    name: string;
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
  userId: {
    _id: string;
    name: string;
    username: string;
    email: string;
  };
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

  const [openImageModal, setOpenImageModal] = useState(false);

  const handleCloseEditModal = () => {
    handleClosePopover();
    setOpenEditModal(false) 
  } ;
  const handleOpenEditModal = () => setOpenEditModal(true);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState(null);

  const handleImageChange = (e:any) => {
    const file = e.target.files[0]; 
    if (file) {
      setNewImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };  

const handleOpenImageModal = (src:any) => {
  setSelectedImage(src);
  setOpenImageModal(true);
};

const handleCloseImageModal = () => {
  setOpenImageModal(false);
  setSelectedImage(null);
};


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
        const response = await api.delete(`/api/post?id=${id}`);
        onDeletePost(id);
      } catch (error) {
        console.error("Error deleting post:", error);
        
      }
    }
  }, [onDeletePost]);
  


  return (
    <>

{/* <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
    📝 Edit Post
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
      <input
        type="file"
        accept="image/*"
        id="post-image-upload"
        style={{ display: 'none' }}
        onChange={handleImageChange}
      />
      <label htmlFor="post-image-upload" style={{ cursor: 'pointer' }}>
        <Avatar
          src={previewImage || `${API_BASE_URL}${row.files?.[0]?.file}`}
          alt="Post Image"
          variant="rounded"
          sx={{
            width: 160,
            height: 160,
            mb: 1,
            border: '2px dashed #1976d2',
            boxShadow: 2,
            transition: '0.3s',
            '&:hover': {
              opacity: 0.8,
            },
          }}
        />
      </label>
      <Typography variant="caption" color="text.secondary">
        Click image to change
      </Typography>
    </Box>

    
    <TextField
      label="Content"
      multiline
      rows={3}
      value={editContent}
      onChange={handleContentChange}
      fullWidth
      variant="outlined"
      sx={{ mb: 3 }}
    />

    
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
        { icon: 'mdi:tag-outline', label: 'Category', value: row.categoryId.name },
        { icon: 'mdi:earth', label: 'Country', value: row.country || 'N/A' },
        // { icon: 'mdi:file-outline', label: 'File Type', value: row.fileType },
        { icon: 'mdi:account', label: 'Name', value: row.userId.name || 'N/A' },
        // { icon: 'mdi:video-outline', label: 'Video Count', value: row.videoCount ?? 0 },
        // {
        //   icon: 'mdi:map-marker',
        //   label: 'Location',
        //   value: `Lng: ${row.location?.coordinates?.[0] ?? 'N/A'}, Lat: ${row.location?.coordinates?.[1] ?? 'N/A'}`,
        // },
        row.startTime && {
          icon: 'mdi:clock-start',
          label: 'Start Time',
          value: format(new Date(row.startTime), 'PPpp'),
        },
        row.endTime && {
          icon: 'mdi:clock-end',
          label: 'End Time',
          value: format(new Date(row.endTime), 'PPpp'),
        },
        row.duration && {
          icon: 'mdi:timer-outline',
          label: 'Duration',
          value: `${row.duration} seconds`,
        },
        {
          icon: 'mdi:eye-outline',
          label: 'Watched Users',
          value: row.watchedUsers?.length ?? 0,
        },
        {
          icon: 'mdi:thumb-up-outline',
          label: 'Votes',
          value: row.votes?.length ?? 0,
        },
        {
          icon: 'mdi:calendar-plus',
          label: 'Created At',
          value: format(new Date(row.createdAt), 'PP'),
        },
        // {
        //   icon: 'mdi:calendar-edit',
        //   label: 'Updated At',
        //   value: format(new Date(row.updatedAt), 'PP'),
        // },
      ]
      .filter((field): field is { icon: string; label: string; value: any } => Boolean(field))  
        .map((field, idx) => (
          <Box key={idx} display="flex" alignItems="center" gap={1}>
            <Iconify icon={field.icon} width={20} color="text.secondary" />
            <Typography variant="subtitle2" color="text.secondary">
              {field.label}:
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ gridColumn: 'span 2' }}>
              {field.value}
            </Typography>
          </Box>
        ))}
    </Box>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
    <Button onClick={handleCloseEditModal} color="primary" variant="outlined">
      Cancel
    </Button>
    <Button
      variant="contained"
      color="success"
      onClick={handleSubmitEdit}
      disabled={editContent === row.content && !newImageFile}
    >
      Save
    </Button>
  </DialogActions>
</Dialog> */}

<Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="sm">
  <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
    👁️ View Post
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
    {/* Display Image */}
    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
      <Avatar
        src={`${API_BASE_URL}${row.files?.[0]?.file}`}
        alt="Post Image"
        variant="rounded"
        sx={{
          width: 160,
          height: 160,
          boxShadow: 2,
          border: '2px solid #1976d2',
          cursor: 'pointer',
                transition: 'transform 0.4s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.3)',
                  zIndex: 1,
                },
        }}
      />
    </Box>

    {/* Content Display */}
    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
      Content:
    </Typography>
    <Typography variant="body1" mb={3}>
      {row.content || 'N/A'}
    </Typography>

    {/* Info Grid */}
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
        { icon: 'mdi:tag-outline', label: 'Category', value: row.categoryId?.name || row.categoryId },
        { icon: 'mdi:earth', label: 'Country', value: row.country && row.country.trim() !== '' ? row.country : 'N/A' },
        { icon: 'mdi:account', label: 'Name', value: row.userId?.name || 'N/A' },
        row.startTime && {
          icon: 'mdi:clock-start',
          label: 'Start Time',
          value: format(new Date(row.startTime), 'PPpp'),
        },
        row.endTime && {
          icon: 'mdi:clock-end',
          label: 'End Time',
          value: format(new Date(row.endTime), 'PPpp'),
        },
        row.duration && {
          icon: 'mdi:timer-outline',
          label: 'Duration',
          value: `${row.duration} seconds`,
        },
        {
          icon: 'mdi:eye-outline',
          label: 'Watched Users',
          value: row.watchedUsers?.length ?? 0,
        },
        {
          icon: 'mdi:thumb-up-outline',
          label: 'Votes',
          value: row.votes?.length ?? 0,
        },
        {
          icon: 'mdi:calendar-plus',
          label: 'Created At',
          value: format(new Date(row.createdAt), 'PP'),
        },
      ]
        .filter((field): field is { icon: string; label: string; value: any } => Boolean(field))
        .map((field, idx) => (
          <Box key={idx} display="flex" alignItems="center" gap={1}>
            <Iconify icon={field.icon} width={20} color="text.secondary" />
            <Typography variant="subtitle2" color="text.secondary">
              {field.label}:
            </Typography>
            <Typography variant="body2" color="text.primary" sx={{ gridColumn: 'span 2' }}>
              {field.value}
            </Typography>
          </Box>
        ))}
    </Box>
  </DialogContent>

  <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
    <Button onClick={handleCloseEditModal} color="primary" variant="outlined">
      Close
    </Button>
  </DialogActions>
</Dialog>







<TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
  <TableCell padding="checkbox">{/* eslint-disable-line */}</TableCell>

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
      onClick={() => handleOpenImageModal(`${API_BASE_URL}${row.files?.[0]?.file}`)}
    >
         <Avatar
        src={`${API_BASE_URL}${row.files?.[0]?.file}`}
        sx={{
          width: '120%',
          height: '120%',
        }}
      />
      </Box>
    </Box>
  </TableCell>

  <TableCell>{row.content || 'N/A'}</TableCell>

  <TableCell>{row.userId.name || 'N/A'}</TableCell>

  <TableCell>{format(new Date(row.createdAt), 'PP')}</TableCell>

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
          
            View Details
          </MenuItem>

          <MenuItem onClick={() => handleDelete(row?._id)} sx={{ color: 'error.main' }}>
            {/* <Iconify icon="solar:trash-bin-trash-bold" /> */}
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
