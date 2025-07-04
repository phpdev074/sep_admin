/* eslint-disable */

import { useState, useCallback, ChangeEvent } from 'react';

// import Box from '@mui/material/Box';
// import Avatar from '@mui/material/Avatar';
// import Popover from '@mui/material/Popover';
// import TableRow from '@mui/material/TableRow';
// import Checkbox from '@mui/material/Checkbox';
// import MenuList from '@mui/material/MenuList';
// import TableCell from '@mui/material/TableCell';
// import IconButton from '@mui/material/IconButton';
// import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
// // import { ShowToast } from '../../helpers/ToastService';
// import { Label } from 'src/components/label';
// import { Iconify } from 'src/components/iconify';
// import { toast } from 'react-toastify';
// import { api, deleteUser } from 'src/api/url';
// ----------------------------------------------------------------------

import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import TextField from '@mui/material/TextField';
import { Iconify } from 'src/components/iconify';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { api, API_BASE_URL } from 'src/api/url';
import { CircularProgress, Tooltip, Typography } from '@mui/material';

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
  selected: boolean;
  onModification: any;
}

export type UserProps = {
  _id: string;
  image: string;
  title: string;
  description: string;
  price: string;
  // avatarUrl: string;
  // isVerified: boolean;
  email: string;
  gender: string;
  checkouturl: string;
};

type UserTableRowProps = {
  row: UserProps;
  selected: boolean;
  onSelectRow: () => void;
  onModification: any;
};

export function ProductTableRow({ row, selected, onSelectRow, onModification }: UserTableRowProps) {
  const [loading, setLoading] = useState(false);
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean[]>([]);
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<{
    image: string[];
    title: string;
    price: string;
    description: string;
    checkouturl: string;
  }>({
    image: [],
    title: '',
    price: '',
    description: '',
    checkouturl: '',
  });

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleOpenModal = () => {
    setFormData({
      image: Array.isArray(row?.image) ? row.image : [row?.image],
      title: row?.title,
      price: row?.price,
      description: row?.description,
      checkouturl: row?.checkouturl || '',
    });
    setOpenModal(true);
    handleClosePopover();
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.put(`/api/product?id=${row._id}`, formData);
      if (response.status === 200) {
        // alert('Product updated successfully');
        onModification();
        handleCloseModal();
      } else {
        // alert('Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Update failed', error);
      alert('An error occurred while updating the product.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete ?');
    if (confirmed) {
      try {
        const response = await api.delete(`/api/product?id=${id}`);
        if (response.status === 200) {
          onModification(); // <-- Refresh list after deletion
        }
      } catch (error) {
        console.error('Delete failed', error);
        alert('An error occurred while deleting the product.');
      }
    }
    setOpenPopover(null);
  }, [onModification]);


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && selectedImageIndex !== null) {
      const file = e.target.files[0];
      console.log(file, '===>>');
      setIsUploading(true);
      try {
        const response = await api.post(
          '/fileUpload',
          { files: file },
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        );
        console.log('===>>>response', response?.data?.data.urls[0]);

        const uploadedUrl = response?.data?.data.urls[0];

        if (response.status === 200) {
          setFormData((prev) => {
            const updatedImages = [...prev.image];
            updatedImages[selectedImageIndex] = uploadedUrl;
            return { ...prev, image: updatedImages };
          });

          setImageUrl(uploadedUrl);
        }

      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image. Please try again.');
      } finally {
        setIsUploading(false); // Stop loading
      }
    }
  };

  const handleAddImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setIsUploading(true);
      try {
        const files = e.target.files;
        // If you want to upload multiple files at once, create FormData for all files
        const formDataToUpload = new FormData();
        Array.from(files).forEach(file => {
          formDataToUpload.append('files', file);
        });

        const response = await api.post('/fileUpload', formDataToUpload, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.status === 200) {
          const uploadedUrls = response?.data?.data.urls || [];

          setFormData((prev) => ({
            ...prev,
            image: [...(prev.image || []), ...uploadedUrls],
          }));
        }
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload image(s). Please try again.');
      } finally {
        setIsUploading(false);
        e.target.value = ''; // Reset input
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => {
      const updatedImages = [...prev.image];
      updatedImages.splice(index, 1); // remove the selected image
      return { ...prev, image: updatedImages };
    });

    setImageUploadLoading((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });

    if (selectedImageIndex === index) {
      setSelectedImageIndex(null); // reset selection
    }
  };




  const handleChangeWrapper = (target: { name: string; value: string }) => {
    setFormData(prev => ({
      ...prev,
      [target.name]: target.value,
    }));
  };


  return (
    <>
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: {
              xs: '95%', // Mobile: 95% width
              sm: '90%', // Small screens: 90% width
              md: 500, // Medium screens and up: fixed 500px
            },
            maxWidth: 600, // Maximum width
            maxHeight: {
              xs: '90vh', // Mobile: 90% of viewport height
              sm: '85vh', // Small screens: 85% of viewport height
              md: '80vh', // Medium screens and up: 80% of viewport height
            },
            bgcolor: 'background.paper',
            boxShadow: 24,
            borderRadius: 2,
            overflow: 'hidden', // Hide overflow on container
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Scrollable Content Container */}
          <Box
            sx={{
              p: {
                xs: 2, // Mobile: 16px padding
                sm: 3, // Small screens: 24px padding
                md: 4, // Medium screens and up: 32px padding
              },
              overflowY: 'auto',
              flexGrow: 1,
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#f1f1f1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: '3px',
                '&:hover': {
                  backgroundColor: '#a8a8a8',
                },
              },
            }}
          >
            <h2
              style={{
                marginTop: 0,
                marginBottom: '16px',
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
                textAlign: 'center',
              }}
            >
              Edit Product
            </h2>

            {/* Product Image Display */}
            {/* Image Grid with click-to-edit */}
            <Box
              display="flex"
              flexWrap="wrap"
              gap={2}
              mb={0}
              sx={{
                p: 1,
                border: '1px dashed #ccc',
                borderRadius: '8px',
                justifyContent: 'flex-start',
              }}
            >
              {formData.image?.map((img, index) => (
                <Tooltip title="Click to change image" key={index}>
                  <Box
                    position="relative"
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      border:
                        selectedImageIndex === index
                          ? '2px solid blue'
                          : '1px solid #ccc',
                      flexShrink: 0,
                    }}
                  >
                    {/* Image */}
                    <Box
                      component="img"
                      src={`${API_BASE_URL}${img}`}
                      alt={`Product Image ${index}`}
                      onClick={() => {
                        setSelectedImageIndex(index);
                        document.getElementById('editImageUpload')?.click();
                      }}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />

                    {/* Loader overlay (optional if you're using imageUploadLoading) */}
                    {imageUploadLoading?.[index] && (
                      <Box
                        position="absolute"
                        top={0}
                        left={0}
                        width="100%"
                        height="100%"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        bgcolor="rgba(255,255,255,0.6)"
                      >
                        <CircularProgress size={24} />
                      </Box>
                    )}

                    {/* Remove icon */}
                    <IconButton
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation(); // prevent opening file picker
                        handleRemoveImage(index); // call your remove handler
                      }}
                      sx={{
                        position: 'absolute',
                        top: 2,
                        right: 2,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          bgcolor: 'rgba(255,255,255,1)',
                        },
                      }}
                    >
                      <Iconify icon="eva:close-fill" width={18} height={18} />
                    </IconButton>
                  </Box>
                </Tooltip>
              ))}


              {/* Add New Image Icon */}
              <Tooltip title="Add new image">
                <Box
                  onClick={() => document.getElementById('addImageUpload')?.click()}
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: 2,
                    border: '2px dashed #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      borderColor: '#007bff',
                      backgroundColor: '#f0f8ff',
                    },
                    flexShrink: 0, // Prevent icon from shrinking
                  }}
                >
                  <Iconify icon="eva:plus-fill" width={24} height={24} color="#777" />
                  <input
                    id="addImageUpload"
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={handleAddImage}
                  />
                </Box>
              </Tooltip>
            </Box>


            {/* Styled File Upload */}
            <Box display="flex" justifyContent="center" mb={3}>
              <Box
                component="label"
                htmlFor="editImageUpload"
                // sx={{
                //   cursor: 'pointer',
                //   padding: '10px 20px',
                //   backgroundColor: '#007bff',
                //   color: 'white',
                //   borderRadius: '8px',
                //   display: 'inline-block',
                //   fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                //   textAlign: 'center',
                //   minWidth: '140px',
                //   transition: 'background-color 0.2s ease',
                //   '&:hover': {
                //     backgroundColor: '#0056b3',
                //   },
                //   '&:focus': {
                //     backgroundColor: '#0056b3',
                //     outline: '2px solid #ffffff',
                //     outlineOffset: '2px',
                //   },
                //   '&:active': {
                //     backgroundColor: '#004085',
                //   },
                // }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    document.getElementById('editImageUpload')?.click();
                  }
                }}
              >
                {/* Change Image */}
                <input
                  id="editImageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  //   onChange={(e) => {
                  //     if (e.target.files && e.target.files.length > 0) {
                  //       const file = e.target.files[0];
                  //       const reader = new FileReader();
                  //       reader.onloadend = () => {
                  //         const result = reader.result as string;
                  //         setFormData((prev) => ({ ...prev, image: result }));
                  //       };
                  //       reader.readAsDataURL(file);
                  //     }
                  //   }}
                  style={{ display: 'none' }}
                />
              </Box>
            </Box>

            {/* Form Fields */}
            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              size="small" // Smaller size for better mobile experience
              value={formData.title}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                  },
                },
              }}
            />

            <TextField
              label="Price"
              name="price"
              fullWidth
              margin="normal"
              size="small"
              value={formData.price.startsWith('$') ? formData.price : `$${formData.price}`}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/[^0-9.]/g, '');
                handleChangeWrapper({ name: 'price', value: rawValue });
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                  },
                },
              }}
            />

            <TextField
              label="CheckOut URL"
              name="checkouturl"
              fullWidth
              margin="normal"
              size="small"
              value={formData.checkouturl}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                  },
                },
              }}
            />

            <TextField
              label="Description"
              name="description"
              fullWidth
              margin="normal"
              multiline
              rows={3}
              size="small"
              value={formData.description}
              onChange={handleChange}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                  },
                },
              }}
            />

            {/* Button Container */}
            <Box
              display="flex"
              flexDirection={{
                xs: 'column', // Mobile: stack buttons vertically
                sm: 'row', // Small screens and up: horizontal
              }}
              justifyContent="space-between"
              gap={2}
              mt={3}
            >
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                fullWidth // Always full width for better mobile experience
                sx={{
                  order: {
                    xs: 2, // Mobile: Save button second
                    sm: 1, // Small screens and up: Save button first
                  },
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                  },
                  py: {
                    xs: 1.5, // More padding on mobile for easier touch
                    sm: 1,
                  },
                }}
              >
                Save Changes
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                fullWidth
                sx={{
                  order: {
                    xs: 1, // Mobile: Cancel button first
                    sm: 2, // Small screens and up: Cancel button second
                  },
                  fontSize: {
                    xs: '0.875rem',
                    sm: '1rem',
                  },
                  py: {
                    xs: 1.5,
                    sm: 1,
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        sx={{
          '& .MuiTableCell-root': {
            padding: {
              xs: '8px 4px', // Mobile: smaller padding
              sm: '16px 8px', // Small screens: medium padding
              md: '16px', // Desktop: default padding
            },
            fontSize: {
              xs: '0.75rem', // Mobile: smaller font
              sm: '0.875rem', // Small screens: medium font
              md: '1rem', // Desktop: default font
            },
          },
        }}
      >
        {/* Checkbox Column - Hidden on mobile */}
        <TableCell
          padding="checkbox"
          sx={{
            display: {
              xs: 'none', // Hidden on mobile
              sm: 'table-cell', // Visible on small screens and up
            },
          }}
        >
          {/* <Checkbox disableRipple checked={selected} onChange={onSelectRow} /> */}
        </TableCell>

        {/* Product Image and Title - Combined on mobile */}
        <TableCell
          component="th"
          scope="row"
          sx={{
            minWidth: {
              xs: 120,
              sm: 150,
              md: 200,
            },
          }}
        >
          <Box
            gap={2}
            display="flex"
            alignItems="center"
            sx={{
              flexDirection: {
                xs: 'column',
                sm: 'row',
              },
              textAlign: {
                xs: 'center',
                sm: 'left',
              },
            }}
          >
            {/* Zoom-on-hover wrapper */}
            <Box
              onClick={() => setOpenImageModal(true)}
              sx={{
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'scale(1.2)',
                  cursor: 'pointer',
                },
                borderRadius: '50%',
                overflow: 'hidden',
                display: 'inline-block',
              }}
            >
              <Avatar
                alt="Product Image"
                src={row.image && row.image.length > 0 ? `${API_BASE_URL}${row.image[0]}` : undefined}
                sx={{
                  width: {
                    xs: 40,
                    sm: 50,
                    md: 56,
                  },
                  height: {
                    xs: 40,
                    sm: 50,
                    md: 56,
                  },
                }}
              />
            </Box>

            {/* Show title on mobile within the image cell */}
            <Box
              sx={{
                display: {
                  xs: 'block',
                  sm: 'none',
                },
                fontSize: '0.75rem',
                fontWeight: 500,
                lineHeight: 1.2,
                maxWidth: 80,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {row.title}
            </Box>
          </Box>
        </TableCell>


        {/* Title Column - Hidden on mobile (shown in image cell) */}
        <TableCell
          sx={{
            display: {
              xs: 'none', // Hidden on mobile
              sm: 'table-cell', // Visible on small screens and up
            },
            maxWidth: {
              sm: 120, // Small screens: limited width
              md: 200, // Desktop: more width
            },
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {row.title}
        </TableCell>

        {/* Price Column */}
        <TableCell
          sx={{
            fontWeight: 600,
            color: 'primary.main',
            minWidth: {
              xs: 60, // Mobile: compact
              sm: 80, // Small screens: wider
            },
          }}
        >
          ${(() => {
            const price = row.price;
            if (typeof price === 'number') {
              return `${price}`;
            }
            if (typeof price === 'string') {
              return `${Number(price).toFixed(2)}`;
            }
            return price || 'N/A';
          })()}
        </TableCell>

        {/* Description Column - Responsive width and truncation */}
        <TableCell
          align="center"
          sx={{
            maxWidth: {
              xs: 100, // Mobile: very limited width
              sm: 150, // Small screens: medium width
              md: 300, // Desktop: full width
            },
            overflow: 'hidden',
          }}
        >
          <Tooltip title={row.description || 'No description'} arrow placement="top">
            <Box
              component="span"
              sx={{
                display: 'block',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                cursor: 'help',
              }}
            >
              {row.description?.length > 0 ? (
                <>
                  {/* Mobile: show less text */}
                  <Box
                    component="span"
                    sx={{
                      display: {
                        xs: 'inline',
                        sm: 'none',
                      },
                    }}
                  >
                    {row.description.length > 30
                      ? `${row.description.slice(0, 30)}...`
                      : row.description}
                  </Box>
                  {/* Small screens and up: show more text */}
                  <Box
                    component="span"
                    sx={{
                      display: {
                        xs: 'none',
                        sm: 'inline',
                      },
                    }}
                  >
                    {row.description.length > 100
                      ? `${row.description.slice(0, 100)}...`
                      : row.description}
                  </Box>
                </>
              ) : (
                <Box
                  component="span"
                  sx={{
                    fontStyle: 'italic',
                    color: 'text.secondary',
                  }}
                >
                  No description
                </Box>
              )}
            </Box>
          </Tooltip>
        </TableCell>

        {/* Actions Column */}
        <TableCell
          align="right"
          sx={{
            minWidth: 50,
            padding: {
              xs: '8px 4px', // Mobile: minimal padding
              sm: '16px 8px', // Small screens: normal padding
            },
          }}
        >
          <IconButton
            onClick={handleOpenPopover}
            size={window.innerWidth < 600 ? 'small' : 'medium'} // Responsive button size
            sx={{
              '&:hover': {
                backgroundColor: 'action.hover',
              },
            }}
          >
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Modal open={openImageModal} onClose={() => setOpenImageModal(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            outline: 'none',
            maxWidth: '90vw',
            maxHeight: '90vh',
          }}
        >
          <img
            src={
              row.image
                ? `${API_BASE_URL}${Array.isArray(row.image) ? row.image[0] : row.image}`
                : undefined
            }

            alt="Enlarged Product"
            style={{
              width: '100%',
              height: 'auto',
              maxHeight: '90vh',
              borderRadius: '8px',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
            }}
          />
        </Box>
      </Modal>

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
          <MenuItem onClick={handleOpenModal}>
            <Iconify icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={() => handleDelete(row?._id)}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
          {/* <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
          <Iconify icon="mdi:block" />
            Block 
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  );
}
function setImageUploadLoading(arg0: (prev: any) => any[]) {
  throw new Error('Function not implemented.');
}

