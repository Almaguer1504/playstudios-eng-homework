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
import { Modal, Select, MenuItem, TextField, InputLabel, FormControl } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/hooks';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import ErrorMessage from 'src/sections/error/error-message';
import { listPrizes, createPrizeAction } from 'src/sections/product/actions/productsActions';

import ImagePicker from './image-uploader';
import { TableNoData } from '../table-no-data';
import { PrizeTableRow } from '../prize-table-row';
import { PrizeTableHead } from '../prize-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { PrizeTableToolbar } from '../prize-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { PrizeProps } from '../prize-table-row';

// ----------------------------------------------------------------------

export function ManagePrizesView() {
  const table = useTable();

  const navigate = useNavigate();

  const prizeList = useAppSelector((state: any) => state.prizeList);
  const { loading, error, prizes } = prizeList;

  const prizeDelete = useAppSelector((state: any) => state.prizeDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = prizeDelete;


  const prizeCreate = useAppSelector((state: any) => state.prizeCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
  } = prizeCreate;

  const userLogin = useAppSelector((state: any) => state.userLogin);
  const { userInfo } = userLogin;

  const dispatch = useAppDispatch();


  useEffect(() => {
    if (!userInfo || !userInfo?.IsAdmin) {
      navigate("/sign-in");
    }
    dispatch(listPrizes());
  }, [userInfo, navigate, dispatch, successDelete, successCreate]);

  const [filterName, setFilterName] = useState('');
  const [alll_prizes, setAllPrizes] = useState([]);

  const [showModal, setShowModal] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!prizes) return;
    setAllPrizes(prizes);
  }, [prizes]);

  const handleAdd = useCallback(() => {
    dispatch(createPrizeAction(name, description, price, category, imageUrl));
    setName("");
    setDescription("");
    setPrice(0);
    setCategory("");
    setImageUrl("");
    setShowModal(false);
  }, [dispatch, name, description, price, category, imageUrl]);


  if (loadingDelete) return null;
  if (loadingCreate) return null;
  if (loading) return null;


  const dataFiltered: PrizeProps[] = applyFilter({
    inputData: alll_prizes,
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


  const handleChangeCategory = (event: SelectChangeEvent) => {
    setCategory(event.target.value as string);
  };

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
            <ImagePicker setPic={setImageUrl}/>
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
          />

          <TextField
            fullWidth
            name="description"
            label="Description"
            sx={{ mb: 3 }}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            onChange={(e) => setDescription(e.target.value)}
          />

          <TextField
            fullWidth
            name="price"
            label="Price"
            sx={{ mb: 3 }}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            type='number'
            onChange={(e) => setPrice(parseInt(e.target.value))}
          />

          <FormControl fullWidth style={{marginBottom: "2rem"}}>
            <InputLabel id="demo-simple-select-label">Category</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={category}
              label="Age"
              onChange={handleChangeCategory}
            >
              <MenuItem value='Categ 1'>Categ 1</MenuItem>
              <MenuItem value='Categ 2'>Categ 2</MenuItem>
              <MenuItem value='Categ 3'>Categ 3</MenuItem>
            </Select>
          </FormControl>

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
            Prizes
          </Typography>
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="mingcute:add-line" />
            }
            onClick={() => setShowModal(true)}
          >
            New prize
          </Button>
        </Box>

        <Card>
          <PrizeTableToolbar
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
                <PrizeTableHead
                  order={table.order}
                  orderBy={table.orderBy}
                  onSort={table.onSort}
                  headLabel={[
                    { id: 'Name', label: 'Name' },
                    { id: 'Description', label: 'Description' },
                    { id: 'Price', label: 'Price' },
                    { id: 'Category', label: 'Category' },
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
                      <PrizeTableRow
                        key={row.id}
                        row={row}
                      />
                    ))}

                  <TableEmptyRows
                    height={68}
                    emptyRows={emptyRows(table.page, table.rowsPerPage, alll_prizes.length)}
                  />

                  {notFound && <TableNoData searchQuery={filterName} />}
                </TableBody>
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            component="div"
            page={table.page}
            count={alll_prizes.length}
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
