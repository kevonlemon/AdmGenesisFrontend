import { useContext } from 'react'
import { Box, Fade, Card, Grid, Button, Typography } from '@mui/material';
import CalendarGenesis from './calendarGenesis/CalendarGenesis'
import { FormularioContext } from '../context/formularioContext'


export default function Calendario() {



    return (
        <>
            <CalendarGenesis />
        </>
    )
}