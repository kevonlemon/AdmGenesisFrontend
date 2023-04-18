import { useContext } from 'react'
import { Box, Fade, Card, Grid, Button, Typography } from '@mui/material';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import HeaderBreadcrumbs from '../../../../../components/HeaderBreadcrumbs';
import CajaGenerica from '../../../../../components/admnomina/CajaGenerica'
import { FormularioContext } from '../context/formularioContext'

export default function Formulario() {

    const { empleado, setEmpleado, listaEmpleados } = useContext(FormularioContext)

    return (
        <>
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Box sx={{ ml: 2, mr: 2, p: 1 }}>
                    <HeaderBreadcrumbs
                        heading="Control de Horarios"
                        links={[{ name: 'Inicio' }, { name: 'Procesos' }, { name: 'Control de Horarios' }]}
                        action={
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => {
                                    // Nuevo();
                                }}
                                startIcon={<SaveRoundedIcon />}
                            >
                                Guardar
                            </Button>
                        }
                    />
                    <Card sx={{ p: 2 }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant='h6'> Selección de Empleado </Typography>
                            </Grid>
                            <Grid item md={7}>
                                <CajaGenerica
                                    estadoInicial={{
                                        codigoAlternativo: empleado.codigoalternativo,
                                        nombre: empleado.nombre
                                    }}
                                    tituloTexto={{ nombre: 'Código', descripcion: 'Empleado' }}
                                    tituloModal="Empleado"
                                    retornarDatos={(e) => {
                                        setEmpleado({
                                            codigo: e.codigo,
                                            codigoalternativo: e.codigoalternativo,
                                            nombre: e.nombre,
                                            jornada: e.jornada
                                        })
                                    }}
                                    datos={listaEmpleados}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Box>
            </Fade>
        </>
    )
}
                                    
