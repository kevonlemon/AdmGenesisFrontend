import { useContext } from 'react';
import { useNavigate } from "react-router";
import { TextField, Button, Card, Grid, InputAdornment, Fade, Box } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import { URLAPIGENERAL } from '../../../../../config';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import { estilosdatagrid, estilosdetabla } from '../../../../../utils/admnomina/estilos/estilos';
import { CustomNoRowsOverlay } from '../../../../../utils/csssistema/iconsdatagrid';
import { JefeDepartamentoContext } from '../context/jefeDepartamentoContext'


function TablaJefeDepartamento() {
    const { columns, rows, buscar, Buscar } = useContext(JefeDepartamentoContext)
    const navegacion = useNavigate()

    return (
        <>
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                    <HeaderBreadcrumbs
                        heading="Jefes de Departamentos"
                        links={[{ name: 'Parametros' }, { name: 'Jefe Departamento' }, { name: 'Lista' }]}
                        action={
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => {
                                    // Nuevo();
                                }}
                                startIcon={<AddCircleRoundedIcon />}
                            >
                                Nuevo
                            </Button>
                        }
                    />
                </Box>
            </Fade>
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Card sx={{ ml: 3, mr: 3, p: 1 }}>
                    <Box sx={{ ml: 2, mt: 2 }}>
                        <Grid container spacing={1} direction="row" justifyContent="space-between">
                            <Grid item md={4} sm={6} xs={12}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    type="text"
                                    label="Buscar"
                                    value={buscar}
                                    onChange={Buscar}
                                    variant="outlined"
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="start">
                                                <SearchRoundedIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid item container spacing={1} md={8} sm={6} xs={12} justifyContent="flex-end">
                                <Grid item md={1.5} sm={3} xs={6}>
                                    <Button
                                        // disabled
                                        fullWidth
                                        variant="text"
                                        // href={`${URLAPILOCAL}/empleados/generarexcel`}
                                        target="_blank"
                                        startIcon={<ViewComfyRoundedIcon />}
                                    >
                                        Excel
                                    </Button>
                                </Grid>
                                <Grid item md={1.5} sm={3} xs={6}>
                                    <Button
                                        // disabled
                                        fullWidth
                                        variant="text"
                                        // href={`${URLAPIGENERAL}/empleados/generarpdf?operador=${usuario.tipo_Persona}`}
                                        target="_blank"
                                        startIcon={<PictureAsPdfRoundedIcon />}
                                    >
                                        Pdf
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                    <Box sx={estilosdetabla}>
                        <div
                            style={{
                                padding: '0.5rem',
                                height: '55vh',
                                width: '100%',
                            }}
                        >
                            <DataGrid
                                density="compact"
                                rowHeight={28}
                                localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                onRowDoubleClick={(e) => navegacion(`/sistema/parametros/formulariojefedepartamento`)}
                                sx={estilosdatagrid}
                                rows={rows}
                                columns={columns}
                                getRowId={(rows) => rows.id}
                                components={{
                                    NoRowsOverlay: CustomNoRowsOverlay,
                                }}
                            />
                        </div>
                    </Box>
                </Card>
            </Fade>
        </>
    )
}

export default TablaJefeDepartamento;