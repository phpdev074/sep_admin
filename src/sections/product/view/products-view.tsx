import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';
import { api } from 'src/api/url';
import { _products, _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import { useQuery } from '@tanstack/react-query';
// import { ProductItem } from '../product-item';
// import { ProductSort } from '../product-sort';
// import { CartIcon } from '../product-cart-widget';
// import { ProductFilters } from '../product-filters';

// import type { FiltersProps } from '../product-filters';
import { Card, Table, TablePagination } from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import TableContainer from '@mui/material/TableContainer';
import { UserTableHead } from 'src/sections/blockUser/user-table-head';
import TableBody from '@mui/material/TableBody';
// import { TableBody } from '@mui/material';
import { UserTableRow } from 'src/sections/user/user-table-row';
import { TableEmptyRows } from 'src/sections/user/table-empty-rows';
import { emptyRows } from 'src/sections/user/utils';
import { TableNoData } from 'src/sections/blockUser/table-no-data';
import { applyFilter, getComparator } from 'src/sections/blockUser/utils';
import { ProductTableRow } from '../product-table-row';

// ----------------------------------------------------------------------


export type ProductItemProps = {
  id: string;
  title: string;
  price: string;
  description: string;
  image: string;
  createdAt: string;
  updatedAt: string;
};


const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

const COLOR_OPTIONS = [
  '#00AB55',
  '#000000',
  '#FFFFFF',
  '#FFC0CB',
  '#FF4842',
  '#1890FF',
  '#94D82D',
  '#FFC107',
];

const defaultFilters = {
  price: '',
  gender: [GENDER_OPTIONS[0].value],
  colors: [COLOR_OPTIONS[4]],
  rating: RATING_OPTIONS[0],
  category: CATEGORY_OPTIONS[0].value,
};

export function ProductsView() {
  const [sortBy, setSortBy] = useState('featured');

  const [openFilter, setOpenFilter] = useState(false);


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


  // const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  // const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
  //   setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  // }, []);

  // const canReset = Object.keys(filters).some(
  //   (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  // );

  if (isLoading) return <Typography>Loading...</Typography>;
  // if (error) return <Typography>Error loading products</Typography>;

  //  const dataFiltered: UserProps[] = applyFilter({
  //     inputData: userData,
  //     comparator: getComparator(table.order, table.orderBy),
  //     filterName,
  //   });

  
  const notFound =!!filterName;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Products
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