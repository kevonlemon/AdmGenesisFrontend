// @mui
import { Box, Typography, Stack } from '@mui/material';
// assets
import { UploadIllustration } from '../../assets';

// ----------------------------------------------------------------------

export default function BlockContent() {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{ xs: 'column', md: 'row' }}
      sx={{ width: 1, textAlign: { xs: 'center', md: 'left' } }}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Soltar o Seleccionar archivo
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Coloque los archivos aquí o haga clic para poder&nbsp;
          <Typography variant="body2" component="span" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
            navegar
          </Typography>
          &nbsp; en su dispositivo
        </Typography>
      </Box>
    </Stack>
  );
}
