import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { useAppDispatch, useAppSelector } from 'src/hooks';

import ErrorMessage from 'src/sections/error/error-message';

import { ProductItem } from '../product-item';
import { ProductSort } from '../product-sort';
import { ProductFilters } from '../product-filters';
import { listPrizes } from '../actions/productsActions';

import type { FiltersProps } from '../product-filters';

// ----------------------------------------------------------------------


const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

const defaultFilters = {
  price: '',
  category: 'all',
};

export function ProductsView() {

  const [sortBy, setSortBy] = useState('newest');

  const [category_options, setCategoryOptions] = useState([{ value: 'all', label: 'ALL' }]);

  const [openFilter, setOpenFilter] = useState(false);

  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const dispatch = useAppDispatch();

  const prizeList = useAppSelector((state: any) => state.prizeList);
  const { loading, error, prizes } = prizeList;

  const [processed_prizes, setProcessedPrizes] = useState([]);


  useEffect(() => {
    dispatch(listPrizes());
  }, [dispatch]);

  useEffect(() => {
    if (!prizes) return;
    const prizes_categories = new Map<string, string>();
    const CATEGORY_OPTIONS = [
      { value: 'all', label: 'ALL' }
    ];
    for (const prize of prizes) {
      if (!prize.Category) continue;
      prizes_categories.set(prize.Category, prize.Category);
    }
    for (const category of prizes_categories.values()) {
      CATEGORY_OPTIONS.push({ value: category, label: category.toUpperCase() });
    }

    setCategoryOptions(CATEGORY_OPTIONS);
  }, [prizes]);


  useEffect(() => {
    if (!prizes) return;
    const category_filtered_prizes = prizes.filter((prize: any) => filters.category === "all" ? true : prize.Category === filters.category);
    const price_filtered_prizes = category_filtered_prizes.filter((prize: any) =>
      filters.price === "below" ? prize.Price < 25 :
        (filters.price === "between" ? (prize.Price >= 25 && prize.Price <= 75) :
          filters.price === "above" ? prize.Price > 75 : true));

    const sorted_prizes = sortBy === "priceDesc" ? price_filtered_prizes.slice().sort((prize1: any, prize2: any) => prize2.Price - prize1.Price) :
      (sortBy === "priceAsc" ? price_filtered_prizes.slice().sort((prize1: any, prize2: any) => prize1.Price - prize2.Price) : price_filtered_prizes.slice().reverse())

    setProcessedPrizes(sorted_prizes);
  }, [prizes, filters, sortBy]);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  if (loading) return null;

  return (
    <DashboardContent>
      <Typography variant="h4" sx={{ mb: 5 }}>
        Prizes
      </Typography>
      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap-reverse',
          justifyContent: 'flex-end',
        }}
      >
        <Box
          sx={{
            my: 1,
            gap: 1,
            flexShrink: 0,
            display: 'flex',
          }}
        >
          <ProductFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              categories: category_options,
              price: PRICE_OPTIONS,
            }}
          />

          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      {error && <ErrorMessage variant="filled">{error}</ErrorMessage>}

      <Grid container spacing={3}>
        {processed_prizes.length <= 0 && "No Prizes To Display"}
        {processed_prizes.map((prize: any) => (
          <Grid key={prize.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <ProductItem prize={prize} />
          </Grid>
        ))}
      </Grid>
    </DashboardContent>
  );
}
