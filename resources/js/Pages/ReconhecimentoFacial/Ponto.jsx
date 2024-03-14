import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router, usePage } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { deDE } from '@mui/x-date-pickers/locales';
import dayjs from 'dayjs';
import ptBR from 'dayjs/locale/pt-br';

export default function Dashboard({ auth, funcionariosNaoEscaneados, funcionariosEscaneados }) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedOption, setSelectedOption] = useState("escaneados");

    const { url } = usePage();

    useEffect(() => {
        const regex = /\/pontos\/(\d{4}-\d{2}-\d{2})/;
        const match = url.match(regex);
        if (match) {
            const date = match[1];
            setSelectedDate(dayjs(date, 'YYYY-MM-DD'));
        }
    }, [url]);

   console.log(funcionariosEscaneados);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        date = dayjs(date).format('YYYY-MM-DD');

        router.get(`/pontos/${date}`, {
            option: selectedOption,
        });
    }

    const today = dayjs();
    const userCreatedAt = dayjs(auth.user.created_at);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pontos</h2>}
        >
            <Head title="Pontos" />
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                <DatePicker
                    value={selectedDate}
                    onChange={handleDateChange}
                    minDate={userCreatedAt}
                    maxDate={today}
                />
            </LocalizationProvider>

            <div>
                <input
                    type="radio"
                    id="escaneados"
                    value="escaneados"
                    checked={selectedOption === "escaneados"}
                    onChange={() => setSelectedOption("escaneados")}
                    style={{ marginRight: '5px' }}
                />
                <label htmlFor="escaneados" style={{ marginRight: '10px' }}>Funcionários Escaneados</label>

                <input
                    type="radio"
                    id="nao_escaneados"
                    value="nao_escaneados"
                    checked={selectedOption === "nao_escaneados"}
                    onChange={() => setSelectedOption("nao_escaneados")}
                    style={{ marginRight: '5px' }}
                />
                <label htmlFor="nao_escaneados">Funcionários Não Escaneados</label>
            </div>

            {selectedOption === "nao_escaneados" && funcionariosNaoEscaneados && (
                <div>
                    <h3 style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Funcionários que trabalham e não foram escaneados no dia:</h3>
                    <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Nome</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Cargo</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Horários de Trabalho</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Foto Registrada</th>
                            </tr>
                        </thead>
                        <tbody>
                            { funcionariosNaoEscaneados.map((funcionario, index) => (
                                       
                                          
                                       
                                <tr key={funcionario.id} style={{ border: '1px solid #ddd' }}>
                                    <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{funcionario.name}</td>
                                    <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{funcionario.cargo}</td>
                                    <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                                        <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                                       
                                            {Object.keys(funcionario.working_hours).map((day, intervaloIndex) => (
                                                
                                                <li key={intervaloIndex} style={{ padding: '4px 0', textAlign: 'left' }}>
                                                    {funcionario.specif_dates && (
                                                        <div>
                                                            <p>Dia de hora extra</p>
                                                        </div>
                                                    )}
                                                    <strong>{funcionario.working_hours[day].dia}</strong>
                                                    <strong>Início do expediente:</strong> {funcionario.working_hours[day].start_hour}<br />
                                                    {funcionario.working_hours[day].interval.map((intervalo, index) => (
                                                        <React.Fragment key={index}>
                                                            <strong>Início do intervalo:</strong> {intervalo.start}<br />
                                                            <strong>Fim do intervalo:</strong>{intervalo.end}<br />
                                                        </React.Fragment>
                                                    ))}<br />
                                                    <strong>Fim do expediente:</strong> {funcionario.working_hours[day].end_hour}
                                                    {funcionario.specif_dates && Object.keys(funcionario.specif_dates).map((specificDate, specificIndex) => (
                                                        <div key={specificIndex}>
                                                            <strong>Início da Hora Extra:</strong> {funcionario.specif_dates[specificDate].start_hour}<br />
                                                            <strong>Fim da Hora Extra:</strong> {funcionario.specif_dates[specificDate].end_hour}<br />
                                                        </div>
                                                    ))}
                                           
                                                </li>
                                            ))}
                                           { Object.keys(funcionario.specif_dates).map((day, intervaloIndex) => (
                                                
                                                <li key={intervaloIndex} style={{ padding: '4px 0', textAlign: 'left' }}>
                                                  
                                                    <strong>{funcionario.specif_dates[day].date}</strong>
                                                    <strong>Início do expediente:</strong> {funcionario.specif_dates[day].start_hour}<br />
                                                    {JSON.parse(funcionario.specif_dates[day].interval).map((intervalo, index) => (
                                                        <React.Fragment key={index}>
                                                            <strong>Início do intervalo:</strong> {intervalo.start}<br />
                                                            <strong>Fim do intervalo:</strong>{intervalo.end}<br />
                                                        </React.Fragment>
                                                    ))}<br />
                                                    <strong>Fim do expediente:</strong> {funcionario.specif_dates[day].end_hour}
                                                  
                                           
                                                </li>
                                            ))}
                                            
                                        </ul>
                                    </td>
                                    <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                                        <img src={`/imagens/${funcionario.imagem}`} alt="Foto Registrada" />
                                    </td>
                                </tr>
                            ))}

                       
                            
                        </tbody>
                    </table>
                </div>
            )}

            {/* Renderizar os funcionariosEscaneados se existirem */}
            {selectedOption === "escaneados" && funcionariosEscaneados && (
                <div>
                    <h3 style={{ marginTop: '20px', fontSize: '24px', fontWeight: 'bold', color: '#333' }}>Funcionários que foram escaneados:</h3>
                    <table style={{ borderCollapse: 'collapse', width: '100%', border: '1px solid #ddd' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Nome</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Cargo</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Horários de Trabalho</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Foto Registrada</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Foto do Ponto</th>
                                <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Data e horário do ponto</th>
                            </tr>
                        </thead>
                        <tbody>
                            { funcionariosEscaneados.map((funcionario, index) => (
                                <React.Fragment key={funcionario.id}>
                                    {funcionario.scans.map((scan, scanIndex) => (
                                        <tr key={scanIndex} style={{ border: '1px solid #ddd' }}>
                                            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{funcionario.name}</td>
                                            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{funcionario.cargo}</td>
                                            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                                                <ul style={{ listStyleType: 'none', margin: 0, padding: 0 }}>
                                                {Object.keys(funcionario.working_hours).map((day, intervaloIndex) => (
                                                
                                                <li key={intervaloIndex} style={{ padding: '4px 0', textAlign: 'left' }}>
                                                    {funcionario.specif_dates && (
                                                        <div>
                                                            <p>Dia de hora extra</p>
                                                        </div>
                                                    )}
                                                    <strong>{funcionario.working_hours[day].dia}</strong>
                                                    <strong>Início do expediente:</strong> {funcionario.working_hours[day].start_hour}<br />
                                                    {funcionario.working_hours[day].interval.map((intervalo, index) => (
                                                        <React.Fragment key={index}>
                                                            <strong>Início do intervalo:</strong> {intervalo.start}<br />
                                                            <strong>Fim do intervalo:</strong>{intervalo.end}<br />
                                                        </React.Fragment>
                                                    ))}<br />
                                                    <strong>Fim do expediente:</strong> {funcionario.working_hours[day].end_hour}
                                                    {funcionario.specif_dates && Object.keys(funcionario.specif_dates).map((specificDate, specificIndex) => (
                                                        <div key={specificIndex}>
                                                            <strong>Início da Hora Extra:</strong> {funcionario.specif_dates[specificDate].start_hour}<br />
                                                            <strong>Fim da Hora Extra:</strong> {funcionario.specif_dates[specificDate].end_hour}<br />
                                                        </div>
                                                    ))}
                                           
                                                </li>
                                            ))}
                                                              { Object.keys(funcionario.specif_dates).map((day, intervaloIndex) => (
                                                
                                                <li key={intervaloIndex} style={{ padding: '4px 0', textAlign: 'left' }}>
                                                  
                                                    <strong>{funcionario.specif_dates[day].date}</strong>
                                                    <strong>Início do expediente:</strong> {funcionario.specif_dates[day].start_hour}<br />
                                                    {JSON.parse(funcionario.specif_dates[day].interval).map((intervalo, index) => (
                                                        <React.Fragment key={index}>
                                                            <strong>Início do intervalo:</strong> {intervalo.start}<br />
                                                            <strong>Fim do intervalo:</strong>{intervalo.end}<br />
                                                        </React.Fragment>
                                                    ))}<br />
                                                    <strong>Fim do expediente:</strong> {funcionario.specif_dates[day].end_hour}
                                                  
                                           
                                                </li>
                                            ))}
                                                </ul>
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                                                <img src={`/imagens/${funcionario.imagem}`} alt="Foto Registrada" />
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                                                <img src={`/imagens/${scan.imagem}`} alt="Foto do Ponto" />
                                            </td>
                                            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>
                                                {dayjs(scan.created_at).format(' HH:mm')}
                                            </td>
                                        </tr>
                                    ))}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
