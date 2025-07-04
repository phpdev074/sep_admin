/* eslint-disable */
import { useState, useCallback, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { api, API_BASE_URL } from 'src/api/url';
import { _products, _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useQuery } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import { Card, CircularProgress, MenuItem, Table, TablePagination } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import TableContainer from '@mui/material/TableContainer';
import { UserTableHead } from 'src/sections/blockUser/user-table-head';
import TableBody from '@mui/material/TableBody';
import { UserTableRow } from 'src/sections/user/user-table-row';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { emptyRows } from 'src/sections/user/utils';
import { TableNoData } from 'src/sections/blockUser/table-no-data';
import { applyFilter, getComparator } from 'src/sections/blockUser/utils';
import { ProductTableRow } from '../product-table-row';
import { InputAdornment } from '@mui/material';
import { IconButton } from '@mui/material';
import { Iconify } from 'src/components/iconify';

export type ProductItemProps = {
  _id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};

type UserTableRowProps = {
  row: ProductItemProps;
  selected: boolean;
  onSelectRow: () => void;
  onModification: any;
};

export function ProductsView({ row, selected, onSelectRow, onModification }: UserTableRowProps) {
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    description: '',
    checkouturl: '',
    image: [] as string[],
    shippingType: '',
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userData, setUserData] = useState<ProductItemProps[]>([]);
  const [filterName, setFilterName] = useState('');
  const [errors, setErrors] = useState({
    image: '',
    title: '',
    price: '',
    description: '',
  });
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    limit: 10,
    page: 0,
  });


  const table = useTable();
  const fetchUsers = async (limit: number, page: number) => {
    try {
      const response = await api.get(`/api/product?limit=${limit}&page=${page + 1}`);
      setUserData(response?.data?.data?.data || []);

      setTotal(response?.data?.data?.totalCount || 0);
      return response.data?.data?.users || [];
    } catch (err: any) {
      if (err.response?.status === 404) {
        return [];
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchUsers(pagination.limit, pagination.page);
  }, [pagination.limit, pagination.page]);


  const handleChange = (e: any) => {
    const { name, value } = e.target;
    // console.log(name, value,'===>>name , value')
    setFormData({ ...formData, [name]: value });
  };

  if (isLoading) return <Typography>Loading...</Typography>;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      setIsUploading(true);
      const uploadedUrls: string[] = [];

      try {
        for (const file of Array.from(files)) {
          const formData = new FormData();
          formData.append('image', file);

          const response = await api.post(
            '/fileUpload',
            { files: file },
            {
              headers: { 'Content-Type': 'multipart/form-data' },
            }
          );

          if (response.status === 200) {
            const uploadedUrl = response?.data?.data?.urls?.[0];
            uploadedUrls.push(uploadedUrl);
          }
        }

        setImageUrls((prev) => [...prev, ...uploadedUrls]);
        setFormData((prev) => ({
          ...prev,
          image: [...prev.image, ...uploadedUrls],
        }));
      } catch (error) {
        console.error('Image upload failed:', error);
        alert('Failed to upload one or more images.');
      } finally {
        setIsUploading(false);
      }
    }
  };


  const notFound = !!filterName;

  const handleSubmit = async () => {

    const validationErrors: {
      image: string;
      title: string;
      price: string;
      description: string;
    } = {
      image: '',
      title: '',
      price: '',
      description: '',
    };


    if (!imageUrls) {
      validationErrors.image = 'Image is required';
    }

    if (!formData.title.trim()) {
      validationErrors.title = 'Title is required';
    }

    if (!formData.price.trim()) {
      validationErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price))) {
      validationErrors.price = 'Price must be a number';
    }


    if (!formData.description.trim()) {
      validationErrors.description = 'Description is required';
    }

    setErrors(validationErrors);

    // If any validation errors, stop here
    if (Object.values(validationErrors).some((msg) => msg !== '')) {
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(`/api/product`, formData);
      // console.log('response', response);
      if (response.status === 200) {
        handleCloseModal();
        fetchUsers(pagination.limit, pagination.page);
        setFormData({
          title: '',
          price: '',
          description: '',
          checkouturl: '',
          image: [],
          shippingType: '',
        });
        setImageUrls([])
      } else {
        // alert('Failed to update product. Please try again.');
      }
    } catch (error) {
      console.error('Creating product failed', error);
      alert('An error occurred while creating the product.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setErrors({
      image: '',
      title: '',
      price: '',
      description: '',
    });
    setFormData({
      title: '',
      price: '',
      description: '',
      checkouturl: '',
      image: [],
      shippingType: '',
    });
    setImageUrl(null);
    setImageUrls([]);
  };


  const handleRemoveImage = (indexToRemove: number) => {
    const updatedImages = imageUrls.filter((_, idx) => idx !== indexToRemove);
    setImageUrls(updatedImages);

    setFormData((prev) => ({
      ...prev,
      image: updatedImages,
    }));
  };


  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
        <Button
          variant="contained"
          size="medium"
          style={{ marginLeft: 900, backgroundColor: 'black' }}
          onClick={() => setOpenModal(true)}
        >
          Add Product
        </Button>
      </Typography>

      <Card>
        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_users.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _users.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'image', label: 'Image' },
                  { id: 'title', label: 'Title' },
                  { id: 'price', label: 'Price' },
                  { id: 'description', label: 'Description', align: 'center' },
                  // { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {userData
                  .map((row: any) => (
                    <ProductTableRow
                      key={row?._id}
                      row={row}
                      selected={table.selected.includes(row?._id)}
                      onSelectRow={() => table.onSelectRow(row?._id)}
                      onModification={fetchUsers}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _users.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={pagination.page}
          count={total}
          rowsPerPage={pagination.limit}
          onPageChange={(event, newPage) => {
            setPagination((prev) => ({ ...prev, page: newPage }));
            table.setPage(newPage);
          }}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={(event) => {
            const newLimit = parseInt(event.target.value, 10);
            setPagination({ page: 0, limit: newLimit });
            table.setRowsPerPage?.(newLimit);
          }}
        />
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
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
                fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)', // Responsive font size
              }}
            >
              Add Product
            </h2>

            <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
              {/* Multiple Image Previews */}
              <Box
                sx={{
                  display: 'flex',
                  gap: 2,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                {imageUrls.length > 0 ? (
                  imageUrls.map((url, idx) => (
                    <Box
                      key={idx}
                      sx={{
                        position: 'relative',
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '2px solid #ccc',
                        backgroundColor: '#f4f4f4',
                      }}
                    >
                      <img
                        src={`${API_BASE_URL}${url}`}
                        alt={`Uploaded ${idx}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <IconButton
                        size="small"
                        onClick={() => handleRemoveImage(idx)}
                        sx={{
                          position: 'absolute',
                          top: -1,
                          right: -1,
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          boxShadow: 1,
                          '&:hover': {
                            backgroundColor: '#f0f0f0',
                          },
                        }}
                      >
                        <Iconify icon="eva:close-fill" width={15} height={15} />
                      </IconButton>
                    </Box>
                  ))
                ) : (
                  <Typography variant="caption" color="textSecondary">
                    No images uploaded yet.
                  </Typography>
                )}
              </Box>

              {/* Styled Upload Button */}
              <label
                htmlFor="imageUpload"
                style={{
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  padding: '10px 20px',
                  backgroundColor: isUploading ? '#6c757d' : '#007bff',
                  color: 'white',
                  borderRadius: '8px',
                  display: 'inline-block',
                  fontSize: 'clamp(0.875rem, 2vw, 1rem)',
                  textAlign: 'center',
                  minWidth: '120px',
                  opacity: isUploading ? 0.7 : 1,
                  transition: 'all 0.3s ease',
                }}
              >
                {isUploading ? 'Uploading...' : 'Upload Images'}
                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  disabled={isUploading}
                  style={{ display: 'none' }}
                />
              </label>
              {errors.image && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {errors.image}
                </Typography>
              )}
            </Box>


            <TextField
              label="Title"
              name="title"
              fullWidth
              margin="normal"
              size="small" // Smaller size for better mobile experience
              value={formData.title}
              onChange={handleChange}
              error={!!errors.title}
              helperText={errors.title}
            />

            <TextField
              label="Price"
              name="price"
              fullWidth
              type='number'
              margin="normal"
              size="small"
              value={formData.price}
              onChange={handleChange}
              error={!!errors.price}
              helperText={errors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">$</InputAdornment>,
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
              error={!!errors.description}
              helperText={errors.description}
            />

            <TextField
              select
              label="Shipping Type"
              name="shippingType"
              fullWidth
              margin="normal"
              size="small"
              value={formData.shippingType}
              onChange={handleChange}
            >
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="shipping">Shipping</MenuItem>
            </TextField>

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
                fullWidth={true} // Always full width for better mobile experience
                sx={{
                  order: {
                    xs: 2, // Mobile: Add button second
                    sm: 1, // Small screens and up: Add button first
                  },
                }}
              >
                Add Product
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseModal}
                fullWidth={true}
                sx={{
                  order: {
                    xs: 1, // Mobile: Cancel button first
                    sm: 2, // Small screens and up: Cancel button second
                  },
                }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>

    </DashboardContent>
  );
}

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('title');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
    setRowsPerPage,
    setPage
  };
}
