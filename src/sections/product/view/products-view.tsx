/* eslint-disable */
import { useState, useCallback, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { api } from 'src/api/url';
import { _products, _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useQuery } from '@tanstack/react-query';
import Button from '@mui/material/Button';
import { Card, Table, TablePagination } from '@mui/material';
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





// import { TableBody } from '@mui/material';
// import { ProductItem } from '../product-item';
// import { ProductSort } from '../product-sort';
// import { CartIcon } from '../product-cart-widget';
// import { ProductFilters } from '../product-filters';
// import type { FiltersProps } from '../product-filters';
// ----------------------------------------------------------------------


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
    onModification:any;
};


export function ProductsView({ row, selected, onSelectRow,onModification }: UserTableRowProps) {
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [openModal, setOpenModal] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    image: "",
});

  const [userData, setUserData] = useState<ProductItemProps[]>([]);
  const [filterName, setFilterName] = useState('');

  // console.log("userData",userData)
  // const fetchUsers = async () => {
  //   try {
  //     const response = await api.get('/api/product'); // Adjust API endpoint as needed

  //     setUserData(response?.data?.data?.data)
  //     // return response.data;
  //     console.log("@@@@@",response?.data?.data?.data)
  //   } catch (error) {
  //    console.log(error) 
  //   }
  // }
const table = useTable();

  const fetchUsers = async () => {
    const response = await api.get('/api/product'); 
    setUserData(response?.data?.data?.data)
    console.log("@@@@@",response?.data?.data?.data)
  }

  // useEffect(()=>{
  //   fetchUsers()
  // },[])

    const { data: getAllPost, error, isLoading } = useQuery({
      queryKey: ['api/product'],
      queryFn: fetchUsers,  
      staleTime: 60000, 
    });




  if (isLoading) return <Typography>Loading...</Typography>;
  // if (error) return <Typography>Error loading products</Typography>;

  //  const dataFiltered: UserProps[] = applyFilter({
  //     inputData: userData,
  //     comparator: getComparator(table.order, table.orderBy),
  //     filterName,
  //   });

  
  const notFound =!!filterName;


  const handleSubmit = async () => {
    setLoading(true);
    try {
        const response = await api.post(`/api/product`, formData);
        console.log("response",response)
        if (response.status === 200) {
            // alert('Product updated successfully');
            // onModification();    
            handleCloseModal();
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
      };




  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
      <Button  variant="contained" size="medium" style={{marginLeft:920, backgroundColor: "black"}} onClick={() => setOpenModal(true)}  >
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
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row: any) => ( 
                    <ProductTableRow
                      key={row?._id}
                      row={row}
                      selected={table.selected.includes(row?._id)}
                      onSelectRow={() => table.onSelectRow(row?._id)}
                      onModification = {fetchUsers}
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
          page={table.page}
          count={_users.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <Modal open={openModal} onClose={() => setOpenModal(false)}>
      <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                }}
            >
                <h2>Add Product</h2>

                <Box display="flex" justifyContent="center" mb={2}>
                            <img 
                                src={ formData.image || 'https://via.placeholder.com/150'} 
                                alt="Product"
                                style={{ width: '70%', height: 'auto', borderRadius: 8 }}
                            />
                        </Box>

                        <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const result = reader.result as string; 
                setFormData((prev) => ({ ...prev, image: result }));
            };
            reader.readAsDataURL(file);
        }
    }}
/>

                <TextField
                            label="Title"
                            name="title"
                            fullWidth
                            margin="normal"
                            // value={formData.title}
                            // onChange={handleChange}
                        />


                        <TextField
                                    label="Price"
                                    name="price"
                                    fullWidth
                                    margin="normal"
                                    // value={formData.price}
                                    // onChange={handleChange}
                                />
                                <TextField
                                    label="CheckOut URL"
                                    name="checkout_URL"
                                    fullWidth
                                    margin="normal"
                                    // value={formData.price}
                                    // onChange={handleChange}
                                />
                                <TextField
                                            label="Description"
                                            name="description"
                                            fullWidth
                                            margin="normal"
                                            multiline
                                            rows={3}
                                            // value={formData.description}
                                            // onChange={handleChange}
                                        />
                
                <Box display="flex" justifyContent="space-between" mt={2}>
                     <Button variant="contained" color="primary" onClick={handleSubmit} >
                         Add Product
                     </Button>
                    <Button variant="outlined" onClick={handleCloseModal}>
                        Cancel
                    </Button> 
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
  };
}
