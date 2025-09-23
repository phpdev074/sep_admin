/* eslint-disable */

import { useState, useCallback } from 'react';

import { Box, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemAvatar, ListItemText, Chip } from '@mui/material';
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
import { api, API_BASE_URL } from '../../api/url'
import React from 'react';

// ----------------------------------------------------------------------

interface File {
  file: string;
  type: string;
  _id: string;
}

interface Post {
  voteUsers: any;
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
  fileType: string;
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

export function UserTableRow({ row, selected, onSelectRow, onDeletePost }: UserTableRowProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editContent, setEditContent] = useState(row.content);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [openVotedUsersModal, setOpenVotedUsersModal] = useState(false);

  const handleCloseEditModal = () => {
    handleClosePopover();
    setOpenEditModal(false)
  };
  const handleOpenEditModal = () => setOpenEditModal(true);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [newImageFile, setNewImageFile] = useState(null);

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      setNewImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setPreviewImage(previewUrl);
    }
  };

  const handleOpenImageModal = (src: any) => {
    setSelectedImage(src);
    setOpenImageModal(true);
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImage(null);
  };

  const handleOpenVotedUsersModal = () => {
    console.log("Opening voted users modal...");
    console.log("Row votes:", row?.votes);
    console.log("File type:", row?.fileType);
    setOpenVotedUsersModal(true);
  };

  const handleCloseVotedUsersModal = () => {
    setOpenVotedUsersModal(false);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => setEditContent(e.target.value);

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
      <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="md">
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
            {row?.files?.[0]?.type === 'video' ? (
              <Box
                component="video"
                src={`${API_BASE_URL}${row?.files?.[0]?.file}`}
                controls
                preload="metadata"
                onError={(e) => {
                  const target = e.target as HTMLVideoElement;
                  target.style.display = 'none';
                }}
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: 2,
                  boxShadow: 2,
                  border: '2px solid #1976d2',
                  cursor: 'pointer',
                  transition: 'transform 0.4s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.3)',
                    zIndex: 1,
                  },
                  '&::-webkit-media-controls': {
                    display: 'none',
                  },
                }}
              />
            ) : (
              <Avatar
                src={`${API_BASE_URL}${row?.files?.[0]?.file}`}
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
            )}
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
            {(() => {
              // Check if any file is an image
              const hasImageFile = row?.files?.some(file => file.type === 'image');

              const fields = [
                { icon: 'mdi:tag-outline', label: 'Category', value: (typeof row?.categoryId === 'object' ? row?.categoryId?.name : row?.categoryId) || 'N/A', isClickable: false, onClick: undefined },
                { icon: 'mdi:earth', label: 'Country', value: row?.country && row?.country.trim() !== '' ? row?.country : 'N/A', isClickable: false, onClick: undefined },
                { icon: 'mdi:account', label: 'Name', value: row?.userId?.name || 'N/A', isClickable: false, onClick: undefined },
                ...(row.startTime ? [{
                  icon: 'mdi:clock-start',
                  label: 'Start Time',
                  value: format(new Date(row?.startTime), 'PPpp'),
                  isClickable: false,
                  onClick: undefined
                }] : []),
                ...(row.endTime ? [{
                  icon: 'mdi:clock-end',
                  label: 'End Time',
                  value: format(new Date(row?.endTime), 'PPpp'),
                  isClickable: false,
                  onClick: undefined
                }] : []),
                ...(row.duration ? [{
                  icon: 'mdi:timer-outline',
                  label: 'Duration',
                  value: `${row?.duration} seconds`,
                  isClickable: false,
                  onClick: undefined
                }] : []),
                // Only include eye icon field if there are no image files
                ...(!hasImageFile ? [{
                  icon: 'mdi:eye-outline',
                  label: row?.fileType === 'poll' ? 'Voted Users' : 'Video Count',
                  value: row?.fileType === 'poll'
                    ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" color="text.primary">
                          {/* Debug: Log the actual votes data */}
                          {(() => {
                            console.log('Votes data:', row?.votes);
                            console.log('Votes length:', row?.votes?.length);
                            console.log('Votes type:', typeof row?.votes);
                            return row?.votes?.length ?? 0;
                          })()}
                        </Typography>
                        {(row?.votes?.length ?? 0) > 0 && (
                          <Chip
                            label="View List"
                            size="small"
                            variant="outlined"
                            clickable
                            onClick={handleOpenVotedUsersModal}
                            sx={{
                              fontSize: '0.7rem',
                              height: '20px',
                              borderRadius: '10px',
                              backgroundColor: 'rgba(25, 118, 210, 0.08)',
                              borderColor: '#1976d2',
                              color: '#1976d2',
                              '&:hover': {
                                backgroundColor: 'rgba(25, 118, 210, 0.12)',
                                borderColor: '#1565c0',
                              }
                            }}
                          />
                        )}
                      </Box>
                    )
                    : row?.videoCount ?? 0,
                  isClickable: false,
                  onClick: undefined,
                }] : []),
                // {
                //   icon: 'mdi:thumb-up-outline',
                //   label: 'Votes',
                //   value: row?.votes?.length ?? 0,
                //   isClickable: row?.fileType === 'poll' && (row?.votes?.length ?? 0) > 0,
                //   onClick: row?.fileType === 'poll' && (row?.votes?.length ?? 0) > 0 ? handleOpenVotedUsersModal : undefined,
                // },
                {
                  icon: 'mdi:calendar-plus',
                  label: 'Created At',
                  value: format(new Date(row?.createdAt), 'PP'),
                  isClickable: false,
                  onClick: undefined
                },
              ];

              return fields.map((field, idx) => (
                <Box key={idx} display="flex" alignItems="center" gap={1}>
                  <Iconify icon={field.icon} width={20} color="text.secondary" />
                  <Typography variant="subtitle2" color="text.secondary">
                    {field.label}:
                  </Typography>
                  <Box
                    sx={{
                      gridColumn: 'span 2',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {React.isValidElement(field.value) ? (
                      field.value
                    ) : (
                      <Typography
                        variant="body2"
                        color={field.isClickable ? 'primary.main' : 'text.primary'}
                        sx={{
                          cursor: field.isClickable ? 'pointer' : 'default',
                          textDecoration: field.isClickable ? 'underline' : 'none',
                          '&:hover': field.isClickable ? {
                            color: 'primary.dark'
                          } : {}
                        }}
                        onClick={field.onClick || undefined}
                      >
                        {String(field.value)}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ));
            })()}
          </Box>
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseEditModal} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Voted Users Modal */}

      <Dialog
        open={openVotedUsersModal}
        onClose={handleCloseVotedUsersModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
          👥 Voted Users ({row?.voteUsers?.length ?? 0})
        </DialogTitle>

        <DialogContent dividers sx={{ p: 0 }}>
          {row?.votes?.length > 0 ? (
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
              {row?.voteUsers?.map((vote: any, index: number) => (
                <ListItem
                  key={vote._id || index}
                  sx={{
                    borderBottom: index < row.votes.length - 1 ? '1px solid #f0f0f0' : 'none',
                    py: 2
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={vote?.image ? `${API_BASE_URL}${vote.image}` : undefined}
                      sx={{ width: 50, height: 50 }}
                    >
                      {vote?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" fontWeight="bold">
                        {vote?.name || 'Unknown User'}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {vote?.email || 'No email'}
                        </Typography>
                        {vote?.option && (
                          <Typography variant="caption" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            {/* Voted for: {row?.votes?.option.name} */}
                          </Typography>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary">
                No votes yet
              </Typography>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button onClick={handleCloseVotedUsersModal} color="primary" variant="outlined">
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
                src={`${API_BASE_URL}${row?.files?.[0]?.file}`}
                sx={{
                  width: '120%',
                  height: '120%',
                }}
              />
            </Box>
          </Box>
        </TableCell>

        <TableCell>{row?.fileType || 'N/A'}</TableCell>

        <TableCell>{row?.content.slice(0, 30) || 'N/A'}</TableCell>

        <TableCell>{row?.userId?.name || 'N/A'}</TableCell>

        <TableCell>{format(new Date(row?.createdAt), 'PP')}</TableCell>

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