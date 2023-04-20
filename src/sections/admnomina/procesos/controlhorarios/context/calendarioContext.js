import { createContext, useEffect, useState, useRef, useContext } from "react";
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from '../../../../../redux/store';
import { getEvents, openModal, closeModal, updateEvent, selectEvent, selectRange } from '../../../../../redux/slices/calendar';
import useSettings from '../../../../../hooks/useSettings';
import useResponsive from '../../../../../hooks/useResponsive';
import useCargando from "../../../../../hooks/admnomina/useCargando";
import { formatearFecha } from "../../../../../utils/admnomina/funciones/funciones"
import useMensajeGeneral from '../../../../../hooks/admnomina/useMensajeGeneral';
import serviciosControlHorario from "../services/servicesControlHorarios";
import { FormularioContext } from "./formularioContext"

export const CalendarioContext = createContext();

// ----------------------------------------------------------------------

// eslint-disable-next-line react/prop-types
export const CalendarioContextProvider = ({ children }) => {
    const { empleado } = useContext(FormularioContext);
    const { empezarCarga, terminarCarga } = useCargando()
    const { mensajeSistemaGenerico, mensajeSistemaPregunta } = useMensajeGeneral()
    const { enqueueSnackbar } = useSnackbar();

    // función para la selección de eventos (horario del dia)
    const selectedEventSelector = (state) => {
        const { events, selectedEventId } = state.calendar;
        if (selectedEventId) {
            return events.find((_event) => _event.id === selectedEventId);
        }
        return null;
    };

    // disenio del calendario
    const { themeStretch } = useSettings();
    const isDesktop = useResponsive('up', 'sm');
    const [view, setView] = useState(isDesktop ? 'dayGridMonth' : 'listWeek');

    // variables(estados) y funciones del redux para el funcionamiento del calendario
    const dispatch = useDispatch();
    const calendarRef = useRef(null);
    const [fecha, setFecha] = useState(new Date());
    const [fechaSeleccionada, setFechaSeleccionada] = useState(new Date())
    const selectedEvent = useSelector(selectedEventSelector);
    const { events, isOpenModal, selectedRange } = useSelector((state) => state.calendar);

    const [formulario, setFormulario] = useState({
        fechaHoraEntrada: new Date(), 
        fechaHoraSalida: new Date(),
        totalHoras: 0
    })

    const cambiarFechaHoraEntrada = (e) => {
        setFormulario({
            ...formulario,
            fechaHoraEntrada: e
        })
    }

    const cambiarFechaHoraSalida = (e) => {
        setFormulario({
            ...formulario,
            fechaHoraSalida: e
        })
    }

    const [abrirModal, setAbrirModal] = useState(false)
    const [tipoModal, setTipoModal] = useState('Agregar Horario')
    const abrirTipoModal = (tipo) => {
        setAbrirModal(true)
        setTipoModal(tipo)
    }
    const cerrarModal = () => setAbrirModal((p) => !p)

    // funciones del calendario ------------------------------------------------------------------------------
    // regresa el calendario al día actual
    const handleClickToday = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.today();
            setFecha(calendarApi.getDate());
        }
    };
    // cambia la relación de aspecto del toolbar del calendario
    const handleChangeView = (newView) => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.changeView(newView);
            setView(newView);
        }
    };
    // retrocede al mes anterior
    const handleClickDatePrev = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.prev();
            setFecha(calendarApi.getDate());
        }
    };
    // avanza al mes siguiente
    const handleClickDateNext = () => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.next();
            setFecha(calendarApi.getDate());
        }
    };
    // selecciona un rango de fechas en el calendario
    const handleSelectRange = (arg) => {
        if (empleado.nombre === '') {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Para agregar un horario debe seleccionar el empleado al que se va a asignar el horario primero' });
            return
        }
        const fechaSeleccionada = arg.startStr
        const existeYahorario = events.filter(f => f.start.substring(0, 10) === fechaSeleccionada)
        if (existeYahorario.length !== 0) {
            mensajeSistemaGenerico({ tipo: 'warning', mensaje: 'Ya existe un horario en la fecha seleccionada' });
            return
        }
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            calendarApi.unselect();
        }
        dispatch(selectRange(arg.start, arg.end));
        setFechaSeleccionada(fechaSeleccionada)
        setFormulario({
            fechaHoraEntrada: arg.start, 
            fechaHoraSalida: arg.start,
            totalHoras: 0
        })
        abrirTipoModal('Agregar Horario')
    };
    // selecciona un evento (horario) en el calendario
    const handleSelectEvent = (arg) => {
        const evento = events.filter(f => f.id === arg.event.id)
        const { horaEntrada } = evento[0]
        const { horaSalida } = evento[0]
        const { fechaEntrada } = evento[0]
        const { fechaSalida } = evento[0]
        const [anioE, mesE, diaE] = fechaEntrada.substring(0,10).split('-');
        const [anioS, mesS, diaS] = fechaSalida.substring(0,10).split('-');
        const [hourE, minuteE, secondE] = horaEntrada.split(':');
        const [hourS, minuteS, secondS] = horaSalida.split(':');
        const fechaHoraEntrada = new Date(parseFloat(anioE), parseFloat(mesE), parseFloat(diaE), parseFloat(hourE), parseFloat(minuteE), parseFloat(secondE), 0)
        const fechaHoraSalida = new Date(parseFloat(anioS), parseFloat(mesS), parseFloat(diaS), parseFloat(hourS), parseFloat(minuteS), parseFloat(secondS), 0)
        setFormulario({
            fechaHoraEntrada,
            fechaHoraSalida,
            totalHoras: parseFloat(((formulario.fechaHoraSalida - formulario.fechaHoraEntrada) / 3600000).toFixed(2))
        })
        dispatch(selectEvent(arg.event.id));
        abrirTipoModal('Editar Horario')
    };
    // ?
    const handleResizeEvent = async ({ event }) => {
        try {
            dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    // crea un nuevo horario en la base de datos y consulta los datos nuevamente para reflejarlos en el calendario
    const agregarHorario = async (horario) => {
        empezarCarga();
        serviciosControlHorario.GrabarHorario({ horario })
            .then(res => {
                const { data } = res
                const datosRespuesta = { codigoEmpleado: data[0].empleado  }
                dispatch(getEvents('horarios', datosRespuesta))
                enqueueSnackbar('Horario Actualizado!');
                cerrarModal();
            })
            .catch(error => {
                console.log(error)
                mensajeSistemaGenerico({ tipo: 'error', mensaje: 'Problemas al grabar el horario, intente nuevamente si el problema persiste contácte con soporte' });
            })
            .finally(
                terminarCarga()
            )
    }

    // ?
    const handleDropEvent = async ({ event }) => {
        try {
            dispatch(
                updateEvent(event.id, {
                    allDay: event.allDay,
                    start: event.start,
                    end: event.end,
                })
            );
        } catch (error) {
            console.error(error);
        }
    };
    // abre un modal para agg un nuevo evento (horario)
    const handleAddEvent = () => {
        dispatch(openModal());
    };
    // cierra el modal
    const handleCloseModal = () => {
        dispatch(closeModal());
    };

    // obtiene el horario cada vez que se cambia de empleado
    useEffect(() => {
        if (empleado.nombre !== '') {
            const calendario = 'horarios';
            const datos = {
                codigoEmpleado: empleado.codigo
            }
            dispatch(getEvents(calendario, datos));
        }
    }, [dispatch, empleado]);

    // calcula el total de horas entre hora Ingreso y hora Salida
    function CalcularHoras() {
        const horas = parseFloat(((formulario.fechaHoraSalida - formulario.fechaHoraEntrada) / 3600000).toFixed(2))
        setFormulario({
            ...formulario,
            // eslint-disable-next-line no-restricted-globals
            totalHoras: isNaN(horas) ? 0 : horas 
        })
    }
    useEffect(() => {
        CalcularHoras()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [formulario.fechaHoraEntrada, formulario.fechaHoraSalida])
    
    // cambia el formato de vista de acuerdo a la relación de la pantalla
    useEffect(() => {
        const calendarEl = calendarRef.current;
        if (calendarEl) {
            const calendarApi = calendarEl.getApi();
            const newView = isDesktop ? 'dayGridMonth' : 'listWeek';
            calendarApi.changeView(newView);
            setView(newView);
        }
    }, [isDesktop]);

    return (
        <CalendarioContext.Provider
            value={{ 
                themeStretch, view, isDesktop, mensajeSistemaPregunta,
                fecha, fechaSeleccionada, selectedEvent, events, isOpenModal, selectedRange, calendarRef,
                formulario, setFormulario, cambiarFechaHoraEntrada, cambiarFechaHoraSalida, abrirModal, cerrarModal, tipoModal,
                handleClickToday, handleChangeView, handleClickDatePrev, handleClickDateNext, handleSelectRange,
                handleSelectEvent, handleResizeEvent, handleDropEvent, handleAddEvent, handleCloseModal,
                agregarHorario
            }}
        >
            { children }
        </CalendarioContext.Provider>
    )
}