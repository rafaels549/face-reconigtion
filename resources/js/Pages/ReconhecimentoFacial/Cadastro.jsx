
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import FaceRecognition from '@/Components/FaceReconigtion';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import React, { useState, useEffect  } from 'react';
/* import Checkbox from '@/Components/Checkbox'; */
/* import TimePicker from 'react-time-picker'; */
import 'react-time-picker/dist/TimePicker.css';
import 'react-clock/dist/Clock.css';


import { Dayjs } from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import TextField from '@mui/material/TextField';
import advancedFormat from 'dayjs/plugin/advancedFormat';

dayjs.extend(utc);
dayjs.extend(advancedFormat);

dayjs.extend(timezone);
dayjs.tz.setDefault('America/Sao_Paulo');



export default function Reconhecer({ auth,successMessage, errors }) {




   
    const [userName, setUserName] = useState('');
    const [userRole, setUserRole] = useState('');
    const [isFaceRecognitionEnabled, setIsFaceRecognitionEnabled] = useState(false);
    const [dias, setDias] = useState(Array(7).fill(false));
    const [horariosIniciais, setHorariosIniciais] = useState(Array(7).fill(''));
    const [horariosFinais, setHorariosFinais] = useState(Array(7).fill(''));
    const [intervaloInicial, setIntervaloInicial] = useState(Array(7).fill('')); 
    const [intervaloFinal, setIntervaloFinal] = useState(Array(7).fill('')); 
   

    const diasDaSemana = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
  
    const handleSubmit = (faceImageDataURL) => {
      
       
        const dados = diasDaSemana.map((dia, index) => {
            return {
                dia: dia,
                isChecked: dias[index],
                horarioInicial: horariosIniciais[index],
                horarioFinal: horariosFinais[index],
                intervaloInicial: intervaloInicial[index],
                intervaloFinal: intervaloFinal[index]
            };
        });
        
       
      
       
      
        router.post('/cadastrar', {
            imagem: faceImageDataURL,
            nome: userName,
            cargo: userRole,
            dados: dados,
        })
      if(!errors) {
        setUserName('');
        setUserRole('');
        setIsFaceRecognitionEnabled(false);
        setDias((Array(7).fill(false)))
        
        setHorariosIniciais(Array(7).fill(" "));
        setHorariosFinais(Array(7).fill(" "));
        setIntervaloInicial(Array(7).fill(" "));
        setIntervaloFinal(Array(7).fill(" "));
      }
           
     
      
       
        
     
    };
    const onRecognitionSuccess = (faceImageDataURL) => {
       
      
        handleSubmit(faceImageDataURL);
    };
 
    const handleStartRecognition = () => {
        setIsFaceRecognitionEnabled(true);
    };



    return (
   
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Cadastro</h2>}
        >
            <Head title="Cadastro" />

            <div className="py-12">
            <form >

            {errors && (
                        <div className="bg-red-600 text-white py-2 px-4 rounded">
                            {errors}
                        </div>
                    )}
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
               
                    <div>
                   
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        /> 

                    </div>
                    <div className="mt-4">
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo:</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={userRole}
                            onChange={(e) => setUserRole(e.target.value)}
                            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                        />
                    </div>
                    <div>
                    <LocalizationProvider  dateAdapter={AdapterDayjs} >
                                                <div>
                            {diasDaSemana.map((dia, index) => (
                                <div key={index} className="flex flex-wrap items-center gap-4">
                                  
                                  {/*   <Checkbox
                                        id={dia.toLowerCase()}
                                        md
                                        value={index}
                                        label={dia}
                                        onChange={(e) => setDias(prevDias => {
                                            const novosDias = [...prevDias];
                                            novosDias[index] = e.target.checked;
                                            return novosDias;
                                        })}
                                    /> */}
                                      <FormControlLabel control={<Checkbox  value={index} checked={dias[index]} onChange={(e) => setDias(prevDias => {
                                            const novosDias = [...prevDias];
                                            novosDias[index] = e.target.checked;
                                            return novosDias;
                                        })}  />} label={dia} />
                                  
    <div className="flex  flex-wrap justify-center gap-x-3 gap-y-4 py-2">     

    
<TimePicker
           
          label="Horário Inicial"
          value = {dayjs.utc(horariosIniciais[index])}
          onChange={(value) => setHorariosIniciais(prevHorariosIniciais => {
              const novosHorariosIniciais = [...prevHorariosIniciais];
        
              novosHorariosIniciais[index] = value;
              return novosHorariosIniciais;
          })}
         
          timezone="America/Sao_Paulo"
          format="HH:mm"
          ampm={false}
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          
          }}
        />

<TimePicker
          label="Horário FInal"
          value = {dayjs.utc(horariosFinais[index])}
          onChange={(value) => setHorariosFinais(prevHorariosFinais => {
              const novosHorariosFinais = [...prevHorariosFinais];
              novosHorariosFinais[index] = value;
              return novosHorariosFinais;
          })}
         
          ampm={false}
          timezone="America/Sao_Paulo"
          format="HH:mm"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          
          }}
        />
      
                                 {/*    <h2 className="font-bold">Intervalo:</h2> */}
                                
                            
<TimePicker
          label="Intervalo Inicial"
          value = {dayjs.utc(intervaloInicial[index])}
          onChange={(value) => setIntervaloInicial(prevIntervaloInicial => {
            const novoIntervaloInicial = [...prevIntervaloInicial];
            novoIntervaloInicial[index] = value;
            return novoIntervaloInicial;
        })}
        
          ampm={false}
          timezone="America/Sao_Paulo"
          format="HH:mm"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
            seconds: renderTimeViewClock,
          }}
        />

<TimePicker
          label="Intervalo Final"
          value = {dayjs.utc(intervaloFinal[index])}
          onChange={(value) => setIntervaloFinal(prevIntervaloFinal => {
              const novoIntervaloFinal = [...prevIntervaloFinal];
              novoIntervaloFinal[index] = value;
              return novoIntervaloFinal;
          })}
         
          ampm={false}
          
          timezone="America/Sao_Paulo"
          format="HH:mm"
          viewRenderers={{
            hours: renderTimeViewClock,
            minutes: renderTimeViewClock,
          
          }}
        />
        </div>  
        
               
                                </div>
                            ))}
                        </div>
                        </LocalizationProvider>
                        {successMessage && (
                        <div className="bg-green-200 text-green-800 py-2 px-4 rounded">
                            {successMessage}
                        </div>
                    )}
                        {!isFaceRecognitionEnabled && (
                            <button
                                onClick={handleStartRecognition}
                                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Iniciar Reconhecimento Facial
                            </button>
                        )}
                 
                        {isFaceRecognitionEnabled && (
                            <FaceRecognition
                                width={640}
                                height={480}
                                onRecognitionSuccess={onRecognitionSuccess}
                                
                            />
                        )}
                   
                    </div>
                </div>
            </form>
              
            </div>
        </AuthenticatedLayout>
      
    );
}
