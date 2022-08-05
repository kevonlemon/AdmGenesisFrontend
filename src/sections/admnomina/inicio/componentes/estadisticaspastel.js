import * as React from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { Card, CardHeader } from "@mui/material";
import merge from 'lodash/merge';
import numeral from 'numeral';
import { useSnackbar } from 'notistack';
import { useTheme, styled } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import BaseOptionChart from '../../../../components/chart/BaseOptionChart'
import { URLAPIGENERAL, URLAPILOCAL } from '../../../../config';
import CircularProgreso from '../../../../components/Cargando';

GraficarPastel.propTypes = {
    titulo: PropTypes.string.isRequired,
    tipoinformacion: PropTypes.string.isRequired,
    sucursal: PropTypes.number.isRequired,
}

export function fNumber(number) {
    return numeral(number).format();
}

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    '& .apexcharts-canvas svg': { height: CHART_HEIGHT },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
        overflow: 'visible',
    },
    '& .apexcharts-legend': {
        height: LEGEND_HEIGHT,
        alignContent: 'center',
        position: 'relative !important',
        borderTop: `solid 1px ${theme.palette.divider}`,
        top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
    },
}));

function GraficarPastel(props) {
    const { titulo, tipoinformacion, sucursal } = props;
    const [valor, setValor] = React.useState([0,10,5,2,3]);
    const [topvalor, setTopvalor] = React.useState([1,2,15,48,2]);
    const [mostrarprogreso, setMostrarProgreso] = React.useState(false);
    const theme = useTheme();
    const { enqueueSnackbar } = useSnackbar();
    const CHART_DATA = topvalor;
    const chartOptions = merge(BaseOptionChart(), {
        colors: [
            theme.palette.primary.lighter,
            theme.palette.primary.light,
            theme.palette.primary.main,
            theme.palette.primary.dark,
        ],
        labels: topvalor.length > 0 ? valor : ['---'],
        stroke: { colors: [theme.palette.background.paper] },
        legend: { floating: true, horizontalAlign: 'center' },
        tooltip: {
            fillSeriesColor: false,
            y: {
                formatter: (seriesName) => fNumber(seriesName),
                title: {
                    formatter: (seriesName) => `${seriesName}`,
                },
            },
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '90%',
                    labels: {
                        value: {
                            formatter: (val) => fNumber(val),
                        },
                        total: {
                            formatter: (w) => {
                                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                                return fNumber(sum);
                            },
                        },
                    },
                },
            },
        },
    });
    const mensajeSistema = (mensaje, variante) => {
        enqueueSnackbar(mensaje,
            {
                variant: variante,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                },
            }
        )
    }
    // PETECIONES 
    React.useEffect(() => {
        async function obtenerTop() {
            try {
                const { data } = await axios(`${URLAPILOCAL}/dashboard/topproductos?sucursal=${sucursal}`, setMostrarProgreso(false));
                if (tipoinformacion === 'producto') {
                    const topproductos = data.map(t => t.totalproducto);
                    const nombreproducto = data.map(t => t.nombreproducto);
                    setTopvalor(topproductos);
                    setValor(nombreproducto);
                }
            } catch (error) {
                mensajeSistema("Problemas de Conexion con el servidor", "error");
            } finally {
                setMostrarProgreso(false);
            }
        }
       // obtenerTop();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sucursal])
    return (
        <>
            <CircularProgreso open={mostrarprogreso} handleClose1={() => { setMostrarProgreso(false) }} />
            <Card>
                <CardHeader title={titulo} />
                <ChartWrapperStyle dir="ltr">
                    <ReactApexChart type="donut"
                        // series={topvalor.length > 0 ? CHART_DATA : [0,10]} 
                        series={[0,10,5,2,3]} 
                        
                        options={chartOptions} height={280} />
                </ChartWrapperStyle>
            </Card>
        </>
    )
}

export default React.memo(GraficarPastel);
