import { useContext } from "react";
import { Grid, Fade, Box, Card } from "@mui/material";
import CajaGenerica from '../../../../../components/admnomina/CajaGenerica';
import { MenuMantenimiento } from '../../../../../components/sistema/menumatenimiento';
import { JefeDepartamentoContext } from '../context/jefeDepartamentoContext'


function FormularioJefeDepartamento() {
    const { departamento, setDepartamento, listaDepartamentos, empleado, setEmpleado, listaEmpleados, modo } = useContext(JefeDepartamentoContext)

    return (
        <>
            <MenuMantenimiento
                modo
                nuevo={() => console.log('nuevo')}
                grabar={() => console.log('grabar')}
                volver={() => console.log('volver')}
            />
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Box sx={{ ml: 3, mr: 3, p: 1, width: '100%' }}>
                    <h1>{String(modo).toUpperCase().substring(0, 1) + String(modo).substring(1, modo.length)} Jefe Departamento</h1>
                </Box>
            </Fade>
            <Fade in style={{ transformOrigin: '0 0 0' }} timeout={1000}>
                <Card elevation={3} sx={{ ml: 3, mr: 3, mb: 2, p: 2 }}>
                    <Box sx={{ width: '100%' }}>
                        <Grid container spacing={1}>
                            <Grid item container xs={12}>
                                <Grid item md={6} sm={6} xs={12}>
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
                                                nombre: e.nombre
                                            })
                                        }}
                                        datos={listaEmpleados}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item container xs={12}>
                                <Grid item md={6} sm={6} xs={12}>
                                    <CajaGenerica
                                        estadoInicial={{
                                            codigoAlternativo: departamento.codigoalternativo,
                                            nombre: departamento.nombre
                                        }}
                                        tituloTexto={{ nombre: 'Código', descripcion: 'Departamento' }}
                                        tituloModal="Departamento"
                                        retornarDatos={(e) => {
                                            setDepartamento({
                                                codigo: e.codigo,
                                                codigoalternativo: e.codigoalternativo,
                                                nombre: e.nombre
                                            })
                                        }}
                                        datos={listaDepartamentos}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Box>
                </Card>
            </Fade>
        </>
    )
}

export default FormularioJefeDepartamento;