import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export type PrizeItemProps = {
  id: string;
  Name: string;
  Description: string;
  Price: number;
  Category: string;
  ImageUrl: string;
};

export function ProductItem({ prize }: { prize: PrizeItemProps }) {
  const renderStatus = (
    <Label
      variant="inverted"
      color={(prize.Category === 'sale' && 'error') || 'info'}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: 'absolute',
        textTransform: 'uppercase',
      }}
    >
      {prize.Category}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={prize.Name}
      src={prize.ImageUrl}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      {fCurrency(prize.Price)}
    </Typography>
  );

  return (
    <Card>
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {renderStatus}
        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {prize.Name}
        </Link>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <ColorPreview colors={[]} />
          {renderPrice}
        </Box>
      </Stack>
    </Card>
  );
}
