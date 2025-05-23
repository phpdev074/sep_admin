import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { api } from 'src/api/url';
import { useQuery } from '@tanstack/react-query';

import { _users } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';
import CircularProgress from '@mui/material/CircularProgress';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';


export function BlockView() {
  const [userData, setUserData] = useState([]);
  const fetchUsers = async () => {
    const response = await api.get('/admin/getAllBlockedUsersAdmin'); 
    setUserData(response?.data?.data)
    // console.log(response?.data?.data,"===>>>")
  }
  const { data: getAllBlockedUsersAdmin, error, isLoading } = useQuery({
    queryKey: ['admin/getAllBlockedUsersAdmin'],
    queryFn: fetchUsers,
    // staleTime: 60000,
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
      <CircularProgress /> 
    </Box>
  );
  const dataFiltered: UserProps[] = applyFilter({
    inputData: userData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  return (
    <DashboardContent>
      <Typography variant="h4" flexGrow={0.2}>
                Blocked Users
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
                  { id: 'name', label: 'Name' },
                  { id: 'gender', label: 'Gender' },
                  { id: 'role', label: 'Role' },
                  { id: 'email', label: 'Email', align: 'center' },
                  // { id: 'status', label: 'Status' },
                  { id: '' },
                ]}
              />
              <TableBody>
  {userData.length > 0 ? (
    userData
      .slice(
        table.page * table.rowsPerPage,
        table.page * table.rowsPerPage + table.rowsPerPage
      )
      .map((row: any) => (
        <UserTableRow
          key={row?._id}
          row={row}
          selected={table.selected.includes(row?._id)}
          onSelectRow={() => table.onSelectRow(row?._id)}
        />
      ))
  ) : (
    <TableRow>
      <TableCell colSpan={12} align="center" sx={{ py: 6 }}>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        color: 'text.secondary',
      }}
    >
      <Typography variant="h6" gutterBottom>
        No users found
      </Typography>
    </Box>
  </TableCell>
    </TableRow>
  )}

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
          count={userData.length}
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
};