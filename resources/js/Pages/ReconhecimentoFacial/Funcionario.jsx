import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router,usePage } from '@inertiajs/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useEffect } from 'react';





dayjs.extend(utc);
dayjs.extend(advancedFormat);

dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');



export default function Dashboard({ auth  }) {
  
    const [selectedOption, setSelectedOption] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedStartTime, setSelectedStartTime] = useState(null);
    const [selectedEndTime, setSelectedEndTime] = useState(null);
    const [intervalStartTime, setIntervalStartTime] = useState(null);
    const [intervalEndTime, setIntervalEndTime] = useState(null);
    const [id, setId] = useState(null);

   
    const { url } = usePage();
    
    useEffect(() => {
        const regex = /\/funcionario\/(\d+)/; 
        const match = url.match(regex);
        if (match) {
            const idFromUrl = match[1];
            setId(idFromUrl); 
        }
    }, [url]);
       

    const handleSubmit = (event) => {
        event.preventDefault();

        
  
      
        router.post(`/funcionario/${id}` ,{
                option: selectedOption,
                data:selectedDate,
                start_hour:selectedStartTime,
                end_hour: selectedEndTime,
                interval_start:intervalStartTime,
                interval_end:intervalEndTime
             

        })

                
             
        
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Editar Funcionário</h2>}
        >
            <Head title="Dashboard" />

            <div>
                <h3>Opções:</h3>
                <form onSubmit={handleSubmit}>
                    {/* Opção de escolha */}
                    <div>
                        <label htmlFor="opcoes">Escolha uma opção:</label>
                        <select id="opcoes" onChange={(e) => setSelectedOption(e.target.value)}>
                            <option value="">Selecione...</option>
                            <option value="removerDia">Remover Dia</option>
                            <option value="adicionarHoraExtra">Adicionar Hora Extra</option>
                            <option value="adicionarDia">Adicionar Dia</option>
                        </select>
                    </div>

                    {/* Exibição do campo relevante baseado na opção selecionada */}
                    {selectedOption === "removerDia" && (
                        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DatePicker
                                label="Remover Dia"
                                value={selectedEndTime}
                                onChange={(date) => setSelectedDate(date)}
                                renderInput={(params) => <TextField {...params} />}
                                 timezone = 'America/Sao_Paulo'
                               
                            />
                        </LocalizationProvider>
                    )}

                    {selectedOption === "adicionarHoraExtra" && (
                        <div>
                             <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DatePicker
                                label="Adicionar Hora Extra"
                                value={dayjs.utc(selectedEndTime)}
                                onChange={(date) => setSelectedDate(date)}
                                inputFormat="DD-MM-YYYY"
                                renderInput={(params) => <TextField {...params} />}
                            />
                             <TimePicker
                                label="Início da Hora Extra"
                                value={dayjs.utc(selectedStartTime)}
                                onChange={(time) => setSelectedStartTime(time)}
                                renderInput={(params) => <TextField {...params} />}
                                timezone="America/Sao_Paulo"
                                inputFormat="DD-MM-YYYY"
                                format="HH:mm"
                                ampm={false}
                               
                            />
                            <TimePicker
                                label="Fim da Hora Extra"
                                value={dayjs.utc(selectedEndTime)}
                                onChange={(time) => setSelectedEndTime(time)}
                                renderInput={(params) => <TextField {...params} />}
                                timezone="America/Sao_Paulo"
                                format="HH:mm"
                                inputFormat="DD-MM-YYYY"
                                ampm={false}
                            />
                        </LocalizationProvider>
                           
                        </div>
                    )}

                    {selectedOption === "adicionarDia" && (
                        <div>
                           <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                            <DatePicker
                                label="Adicionar Dia"
                                value={selectedDate}
                                onChange={(date) => setSelectedDate(date)}
                                renderInput={(params) => <TextField {...params} />}
                                inputFormat="DD-MM-YYYY"
                            />
                             <TimePicker
                                label="Início do expendiente"
                                value={dayjs.utc(selectedStartTime)}
                                onChange={(time) => setSelectedStartTime(time)}
                                renderInput={(params) => <TextField {...params} />}
                                timezone="America/Sao_Paulo"
                                format="HH:mm"
                                ampm={false}
                               
                               
                            />
                            <TimePicker
                                label="Fim do expediente"
                                value={dayjs.utc(selectedEndTime)}
                                onChange={(time) => setSelectedEndTime(time)}
                                renderInput={(params) => <TextField {...params} />}
                                timezone="America/Sao_Paulo"
                                format="HH:mm"
                                ampm={false}
                            />

                           <TimePicker
                                label="Inicio do intervalo"
                                value={dayjs.utc(intervalStartTime)}
                                onChange={(time) => setIntervalStartTime(time)}
                                renderInput={(params) => <TextField {...params} />}
                                timezone="America/Sao_Paulo"
                                format="HH:mm"
                                ampm={false}
                            />
                              <TimePicker
                                label="Fim do intervalo"
                                value={dayjs.utc(intervalEndTime)}
                                onChange={(time) => setIntervalEndTime(time)}
                                renderInput={(params) => <TextField {...params} />}
                                timezone="America/Sao_Paulo"
                                format="HH:mm"
                                ampm={false}
                            />
                        </LocalizationProvider>
                        </div>
                    )}

                   
                    <button type="submit">Enviar</button>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
