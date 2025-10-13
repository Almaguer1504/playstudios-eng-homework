import type { SelectChangeEvent} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import { Modal, Select, MenuItem, Checkbox, TextField, IconButton, InputLabel, FormControl, InputAdornment, FormControlLabel } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/hooks';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import ErrorMessage from 'src/sections/error/error-message';

import ImagePicker from './image-uploader';
import { TableNoData } from '../table-no-data';
import { UserTableRow } from '../user-table-row';
import { UserTableHead } from '../user-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { UserTableToolbar } from '../user-table-toolbar';
import { register, listUsers } from '../actions/userActions';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { UserProps } from '../user-table-row';

// ----------------------------------------------------------------------

export function UserView() {
  const table = useTable();

  const navigate = useNavigate();

  const userList = useAppSelector((state: any) => state.userList);
  const { loading, error, users } = userList;

  const userDelete = useAppSelector((state: any) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;


  const userRegister = useAppSelector((state: any) => state.userRegister);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = userRegister;

  const userLogin = useAppSelector((state: any) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useAppDispatch();


  useEffect(() => {
    if (!userInfo || !userInfo?.IsAdmin) {
      navigate("/sign-in");
    }
    dispatch(listUsers());
  }, [userInfo, navigate, dispatch, successDelete, successCreate]);

  const [filterName, setFilterName] = useState('');
  const [alll_users, setAllUsers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [pic, setPic] = useState("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");


  useEffect(() => {
    if (!users) return;
    setAllUsers(users);
  }, [users]);

  const handleAdd = useCallback(() => {
    dispatch(register(name, role, email, password, isAdmin, pic));
    setName("");
    setEmail("");
    setPassword("");
    setRole("");
    setIsAdmin(false);
    setPic("https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg");
    setShowModal(false);
  }, [dispatch, email, isAdmin, name, password, pic, role]);


  if (loadingDelete) return null;
  if (loadingCreate) return null;
  if (loading) return null;


  const dataFiltered: UserProps[] = applyFilter({
    inputData: alll_users,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const style = {
    position: "absolute" as const,
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
  };


  const handleChangeRole = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };

  console.log(pic);

  return (
    <>

      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={style}
        >

          <FormControl fullWidth style={{alignItems: 'center', marginBottom: "1rem"}}>
            <ImagePicker setPic={setPic}/>
          </FormControl>

          <TextField
            fullWidth
            name="name"
            label="Name"
            sx={{ mb: 3 }}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <TextField
            fullWidth
            name="email"
            label="Email address"
            sx={{ mb: 3 }}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            onChange={(e) => setEmail(e.target.value)}
            required
          />


          <FormControl fullWidth style={{marginBottom: "2rem"}}>
            <InputLabel id="demo-simple-select-label">Role</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              label="Age"
              onChange={handleChangeRole}
              required
            >
              <MenuItem value='Programmer'>Programmer</MenuItem>
              <MenuItem value='Designer'>Designer</MenuItem>
              <MenuItem value='Artist'>Artist</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth style={{alignItems: 'center', marginBottom: "1rem"}}>
            <FormControlLabel control={<Checkbox defaultChecked={false} onChange={(e) => setIsAdmin(e.target.checked)}/>} label="Is Admin" />
          </FormControl>

          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mb: 3 }}
            required
          />

          <Button
            fullWidth
            size="large"
            type="submit"
            color="inherit"
            variant="contained"
            onClick={handleAdd}
          >
            Add
          </Button>
        </Box>
      </Modal>

      <DashboardContent>
        <Box
          sx={{
            mb: 5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography variant="h4" sx={{ flexGrow: 1 }}>
            Users
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />
            }
            onClick={() => setShowModal(true)}
          >
            New user
          </Button>
        </Box>

        <Card>
          
          <UserTableToolbar
            numSelected={table.selected.length}
            filterName={filterName}
            onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
              setFilterName(event.target.value);
              table.onResetPage();
            }}
          />

          {error && <ErrorMessage variant="filled">{error}</ErrorMessage>}
          {errorDelete && <ErrorMessage variant="filled">{errorDelete}</ErrorMessage>}
          {errorCreate && <ErrorMessage variant="filled">{errorCreate}</ErrorMessage>}

          <Scrollbar>
            <TableContainer sx={{ overflow: 'unset' }}>
              <Table sx={{ minWidth: 800 }}>
                <UserTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  onSort={table.onSort}
                  headLabel={[
                    { id: 'Name', label: 'Name' },
                    { id: 'Email', label: 'Email' },
                    { id: 'Role', label: 'Role' },
                    { id: 'IsAdmin', label: 'Is Admin', align: 'center' },
                    { id: '' },
                  ]}
                />
                <TableBody>
                  {dataFiltered
                    .slice(
                      table.page * table.rowsPerPage,
                      table.page * table.rowsPerPage + table.rowsPerPage
                    )
                    .map((row) => (
                      <UserTableRow
                        key={row.id}
                        row={row}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, alll_users.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={alll_users.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </Card>
      </DashboardContent>
    </>
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
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
