import * as React from 'react';
import { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Button, Grid, TextField, IconButton, Card, Fade, InputAdornment, Box, Typography } from '@mui/material';
import { DataGrid, esES } from '@mui/x-data-grid';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircle';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';
import ViewComfyRoundedIcon from '@mui/icons-material/ViewComfyRounded';
import axios from 'axios';
import clsx from 'clsx';
import { useSnackbar } from 'notistack';
import { estilosdetabla, estilosdatagrid, styleActive, styleInactive } from '../../../../utils/csssistema/estilos';
import { CustomNoRowsOverlay } from '../../../../utils/csssistema/iconsdatagrid';

import CircularProgreso from '../../../../components/Cargando';
import HeaderBreadcrumbs from '../../../../components/cabecerainforme';

// import CircularProgreso from '../../../../sistema/componentes/circuloprogreso';


import { PATH_DASHBOARD, PATH_OPSISTEMA } from '../../../../routes/paths';
import { URLAPIGENERAL } from '../../../../config';
import Page from '../../../../components/Page';

export default function Homesegurosocual() {
    document.body.style.overflowX = 'hidden';
    const ocultaFooter = true;
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { enqueueSnackbar } = useSnackbar();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [mostrarprogreso, setMostrarProgreso] = useState(false);

    const messajeTool = (variant, msg) => {
        enqueueSnackbar(msg, { variant, anchorOrigin: { vertical: 'top', horizontal: 'center' } });
    };

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate();
    // ----------------------- bloque de asignacion de cabeceza/ Columns DataGrid  ------------------------->
    const columns = [
        {
            headerAlign: 'center',
            field: 'codigo',
            headerName: 'Código',
            width: 110,
            align: 'center',
        },
        {

            field: 'nombre',
            headerName: 'Nombre',
            width: 200,



            cellClassName: () => clsx('yellowCell')

        },
        {
            headerAlign: 'center',
            field: 'factor',
            headerName: 'Factor',
            width: 90,
            align: 'center',
        },
        {
            headerAlign: 'center',
            field: 'mesPago',
            headerName: 'Mes-Pago',
            width: 90,
            align: 'center',
        },
        {
            headerAlign: 'center',
            field: 'aplicaRol',
            headerName: 'Aplica Rol',
            width: 120,
            align: 'center',
            renderCell: (param) =>
                param.row.aplicaRol === true ? (

                    <Typography variant="overline" display="block" gutterBottom>
                        SI
                    </Typography>
                ) : (
                    <Typography variant="overline" display="block" gutterBottom>
                        NO
                    </Typography>
                ),
        },
        {
            headerAlign: 'center',
            field: 'seguroSocial',
            headerName: 'Seguro Social',
            width: 120,
            align: 'center',
            renderCell: (param) =>
                param.row.seguroSocial === true ? (
                    <Typography variant="overline" display="block" gutterBottom>
                        SI
                    </Typography>
                ) : (
                    <Typography variant="overline" display="block" gutterBottom>
                        NO
                    </Typography>
                ),
        },

        {
            headerAlign: 'center',
            field: 'estado',
            headerName: 'Estado',
            width: 100,
            align: 'center',
            renderCell: (param) =>
                param.row.estado === true ? (
                    <Button variant="containded" style={styleActive}>
                        Activo
                    </Button>
                ) : (
                    <Button variant="containded" style={styleInactive}>
                        Inactivo
                    </Button>
                ),
        },

        {
            headerAlign: 'center',
            field: 'sistema',
            headerName: 'Sistema',
            width: 90,
            align: 'center',
            renderCell: (param) =>
                param.row.sistema === true ? (
                    <Typography variant="overline" display="block" gutterBottom>
                        SI
                    </Typography>
                ) : (
                    <Typography variant="overline" display="block" gutterBottom>
                        NO
                    </Typography>
                )

        },
        {
            headerAlign: 'center',
            field: 'tipo',
            headerName: 'Tipo',
            width: 120,
            align: 'center',
            renderCell: (param) =>
                param.row.tipo === 'BEN' ? (
                    <Typography variant="overline" display="block" gutterBottom>
                        Beneficio
                    </Typography>
                ) : (
                    <Typography variant="overline" display="block" gutterBottom>
                        Aportación
                    </Typography>
                ),
        },
        {
            headerAlign: 'center',
            field: 'ingEgrEmp',
            headerName: 'Engr-Ingr',
            width: 120,
            align: 'center',
            renderCell: (param) =>
                param.row.ingEgrEmp === 'I' ? (
                    <Typography variant="overline" display="block" gutterBottom>
                        Ingreso
                    </Typography>
                ) : (
                    <Typography variant="overline" display="block" gutterBottom>
                        Egreso
                    </Typography>
                ),
        },
        {
            headerAlign: 'center',
            field: 'porcentaje',
            headerName: 'Porcentaje',
            width: 90,
            align: 'center',
        },
        {
            headerAlign: 'center',
            field: 'aplica',
            headerName: 'Aplica',
            width: 90,
            align: 'center',
            renderCell: (param) =>
                param.row.aplica === true ? (
                    <Typography variant="overline" display="block" gutterBottom>
                        SI
                    </Typography>
                ) : (
                    <Typography variant="overline" display="block" gutterBottom>
                        NO
                    </Typography>
                )
        },
    ];


    const Edit = (e) => {
        navigate(`/sistema/parametros/editarsegurosocial`, { state: { id: e.id } });
    };

    // // bloque de evento Edit()
    // const Edit = (e) => {
    //     navigate(`${PATH_DASHBOARD.editarnivel1}/${e.id}`);
    // };



    // eslint-disable-next-line camelcase
    const { token } = JSON.parse(window.localStorage.getItem('usuario'));

    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
        async function getDatos() {
            try {
                const { data } = await axios(`${URLAPIGENERAL}/segurosocial/listar`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                    , setMostrarProgreso(true));

                setDatosFilas(data);
                setResultadoBusqueda(data);
                setDatosFilas(data);
                // Funciones de busqueda
                setItems(data);
                setResultadoBusqueda(data);
            } catch (error) {
                setItems([]);
                messajeTool('error', 'Problemas, al traer los datos del servidor.');
            } finally {
                setMostrarProgreso(false);
            }
        }
        getDatos();
    }, []);

    // eslint-disable-next-line no-unused-vars
    const [datosfilas, setDatosFilas] =
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useState([]);
    // -----------------------Bloque de useState para Filtrar o Buscar id de la tabla------------------------->
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [rowss, setItems] = useState([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [buscar, setBuscar] = useState('');
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [resultadobusqueda, setResultadoBusqueda] = useState([]);

    const Buscar = (e) => {
        const texto1 = e.target.value.toLocaleUpperCase();
        setBuscar(texto1);
        const texto = String(e.target.value).toLocaleUpperCase();
        const resultado = resultadobusqueda.filter(
            (b) =>
                String(b.codigo).toLocaleUpperCase().includes(texto) || String(b.nombre).toLocaleUpperCase().includes(texto)
        );
        setItems(resultado);
    };




    const DIRECNUEVO = () => {
        navigate(`/sistema/parametros/nuevosegurosocial`);

        // const Volver = () => {
        //     navigate(`${PATH_OPSISTEMA.parametros.nuevosegurosocial}`);

        // }

        const Volver = () => {
            navigate(`${PATH_OPSISTEMA.parametros.nuevosegurosocial}`);

        }

        // ------------------------Mostrar a pantalla---------------------------->
        return (
            <>

                {/* <CircularProgreso */}

                <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                    <Page title="Seguro Social">
                        <Box sx={{ ml: 3, mr: 3, p: 1 }}>
                            <Box>
                                <HeaderBreadcrumbs
                                    heading="Seguro Social"
                                    links={[
                                        { name: 'Inicio' },
                                        { name: 'Seguro Social' },
                                        { name: 'Lista' },
                                    ]}
                                    action={
                                        <Button
                                            fullWidth

                                            variant="contained"
                                            // contained
                                            size='small'
                                            onClick={DIRECNUEVO}



                                            startIcon={<AddCircleRoundedIcon />}
                                        >
                                            Nuevo
                                        </Button>
                                    }
                                />
                            </Box>

                            <Card sx={{ height: 'auto', width: '100%' }}>
                                <Box sx={{ ml: 2, mr: 3, pt: 2 }}>

                                    <Grid container>
                                        <Grid item container>
                                            <Grid item xs={12} sm={4} md={4}>
                                                <Grid>
                                                    <TextField
                                                        fullWidth
                                                        label="Buscar"
                                                        value={buscar}
                                                        onChange={Buscar}
                                                        id="outlined-size-small"
                                                        size="small"
                                                        InputProps={{
                                                            endAdornment: (
                                                                <InputAdornment position="start">
                                                                    <IconButton aria-label="SearchIcon">
                                                                        <SearchIcon />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ),
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} sm={8} md={8}>
                                                <Grid container justifyContent="flex-end" direction="row">
                                                    <Grid item md={2} sm={2} xs={12}>
                                                        <Button
                                                            fullWidth
                                                            disabled={rowss.length === 0}
                                                            variant="text"
                                                            startIcon={<ViewComfyRoundedIcon />}
                                                            href={`${URLAPIGENERAL}/segurosocial/generarexcel`}

                                                        >
                                                            Excel
                                                        </Button>
                                                    </Grid>
                                                    <Grid item md={2} sm={2} xs={12}>
                                                        <Button
                                                            fullWidth
                                                            disabled={rowss.length === 0}
                                                            variant="text"
                                                            startIcon={<PictureAsPdfRoundedIcon />}
                                                            href={`${URLAPIGENERAL}/segurosocial/generarpdf`}


                                                            target="_blank"
                                                        >
                                                            PDF
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Box>
                                <Box
                                    sx={estilosdetabla}
                                >
                                    <div
                                        style={{
                                            padding: '1rem',
                                            height: '55vh',
                                            width: '100%',
                                        }}
                                    >
                                        <DataGrid
                                            sx={estilosdatagrid}
                                            density="compact"
                                            onRowDoubleClick={(e) => Edit(e)}
                                            columns={columns}
                                            rows={rowss}
                                            components={{
                                                NoRowsOverlay: CustomNoRowsOverlay,
                                            }}
                                            getRowId={(rows) => rows.codigo}
                                            rowHeight={28}
                                            disableSelectionOnClick
                                            localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                                            // hideFooter={rowss.length < 10}
                                            disableColumnMenu={ocultaFooter}
                                        />
                                    </div>
                                </Box>
                            </Card>
                        </Box>
                    </Page>
                </Fade>
            </>
        );
    }
}