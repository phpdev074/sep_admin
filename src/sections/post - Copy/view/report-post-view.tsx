import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { api } from 'src/api/url';
import { useQuery } from '@tanstack/react-query';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';
import CircularProgress from '@mui/material/CircularProgress';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';



interface File {
  file: string;
  type: string;
  _id: string;
}

// interface Post {
//   _id: string;
//   userId: string;
//   name: string;
//   categoryId: string;
//   content: string;
//   files: File[];
//   fileType: string;
//   createdAt: string;
//   updatedAt: string;
//   __v: number;
//   options: any[];
//   votes: any[];
//   location: {
//     type: string;
//     coordinates: [number, number];
//   };
// }

// type Table = {
//   selected: string[];
//   onSelectRow: (id: string) => void;
// };
// ----------------------------------------------------------------------

export function ReportPostViews() {
  const [userData, setUserData] = useState([]);
 
  const fetchUsers = async () => {
    const response = await api.get('/api/post/getReportedPosts'); 
    setUserData(response?.data?.data)
    // return response.data;
    // console.log("123654798",response?.data?.data);
  }
    const { data: getReportedPosts, error, isLoading } = useQuery({
      queryKey: ['/api/post/getReportedPosts'],
      queryFn: fetchUsers,  
      staleTime: 60000, // Cache for 60 seconds
    });
  const table = useTable();
    
  const [filterName, setFilterName] = useState('');
  if (isLoading) return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
    >
      <CircularProgress /> {/* This is the loader */}
    </Box>
  );
  const dataFiltered: UserProps[] = applyFilter({
// <<<<<<< Tabnine <<<<<<<
    // inputData: _users,//-
    inputData: userData,//+
// >>>>>>> Tabnine >>>>>>>// {"conversationId":"d93ec7bf-3bb2-4650-9d97-bbb060635f5d","source":"instruct"}
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      {/* <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Users
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button>
      </Box> */}

      <Card>
        {/* <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        /> */}

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
                  { id: 'files', label: 'Image' },
                  { id: 'content', label: 'Content' },
                  { id: 'createdAt', label: 'Create Time' },
                  { id: 'count', label: 'Total Number of Reports' },
                  { id: 'userReport', label: 'Reported By' },
                  { id: '' },
                ]}
              />
              <TableBody>
                {userData
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row:any) => (
                    <UserTableRow
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

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
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