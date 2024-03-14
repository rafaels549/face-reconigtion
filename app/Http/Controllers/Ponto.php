<?php

namespace App\Http\Controllers;

use App\Models\Funcionarios;
use App\Models\Scan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Carbon\Carbon;
class Ponto extends Controller
{    public $funcionariosNaoEscaneados = [];
    public $funcionariosEscaneados = [];
    public $workingHoursNao = [];
    public $workingHours = [];
     public $fotoPontoDoDia = [];

     public function index(){
        return Inertia::render('ReconhecimentoFacial/Ponto', [
           
        ]);
     }

     public function scans($date){

       
          $data = $date;

          

           $funcionarios  = Funcionarios::where("user_id", auth()->user()->id)->get();
           

          foreach($funcionarios as $funcionario){
                   $diaRemovido= $funcionario->specifDates->where("option", "removerDia")->first(function ($specificDate) use ($data){
                              return $specificDate->start_date === $data;
                   });
                  $diaHoraExtra =  $funcionario->specifDates->where("option", "adicionarHoraExtra")->first(function ($specificDate) use ($data){
                    return $specificDate->start_date === $data;
         });
                   $diaAdicionado = $funcionario->specifDates->where("option", "adicionarDia")->first(function ($specificDate) use ($data){
                    return $specificDate->start_date === $data;
         });
                  $horaTrabalhada = $funcionario->workingHours->first(function ($dia) use ($data){
                    return $dia->dia->value === Carbon::parse($data)->dayOfWeek;
         });

                  
                 
            if ($funcionario->scans === null) {
                
                
              if($horaTrabalhada && !$diaRemovido){
                foreach ($funcionario->workingHours as $dia) {
                    
                        
                        
                                          
                        if($dia->dia->value === Carbon::parse($data)->dayOfWeek){
                         $this->funcionariosNaoEscaneados[] = $funcionario;
                         
                        
                         
                         
                            }
                  
  
                    }
                }
                if($diaAdicionado){
                    $this->funcionariosNaoEscaneados[] = $funcionario;
                }
            }else{
                
            
              
                $scanDoFuncionario =  $funcionario->scans->first(function ($scan) use ($data){
                              return Carbon::parse($scan->created_at)->format('Y-m-d') === $data;

                }); 
                  

                            if($scanDoFuncionario !== null){

                                if($horaTrabalhada && !$diaRemovido){
                                   $this->funcionariosEscaneados[] = $funcionario;
                                }
                                if($diaAdicionado){
                                    $this->funcionariosEscaneados[] = $funcionario;
                                }
                                  
                                  
                            }else{
            

                                if($horaTrabalhada && !$diaRemovido){
                                foreach ($funcionario->workingHours as $dia) {
                                    
                                        
                                        
                                                          
                                        if($dia->dia->value === Carbon::parse($data)->dayOfWeek){
                                         $this->funcionariosNaoEscaneados[] = $funcionario;
                                         
                                            }
                                  
                  
                                    }
                                }
                                if($diaAdicionado){
                                    $this->funcionariosNaoEscaneados[] = $funcionario;
                                }
                            }
                                
                            
                
          }
           
        } 
                
        foreach ($this->funcionariosNaoEscaneados as $index => $funcionario) {
           
                foreach ($funcionario->workingHours as $workIndex=> $work){
                if ($work->dia->value!== Carbon::parse($data)->dayOfWeek) {
                       
                    unset($this->funcionariosNaoEscaneados[$index]->workingHours[$workIndex]);
                }
            }
            foreach ($funcionario->scans as $scanIndex => $scan) {
                $scanCreatedAt = Carbon::parse($scan->created_at)->format('Y-m-d');
                if ($scanCreatedAt !== $data) {
                    unset($this->funcionariosNaoEscaneados[$index]->scans[$scanIndex]);
                }
            } 
                   
            foreach($funcionario->specifDates as $specificIndex => $specificDate ){
                     
                       
                if($specificDate->start_date !== $data){
                  
                    unset($this->funcionariosNaoEscaneados[$index]->specifDates[$specificIndex]);
                }
        }
        }
        
        // Reindexa o array após a remoção dos elementos
        $this->funcionariosNaoEscaneados = array_values($this->funcionariosNaoEscaneados);

                
        foreach ($this->funcionariosEscaneados as $index => $funcionario) {
                       
                      
            foreach ($funcionario->workingHours as $workIndex=> $work){
                if ($work->dia->value!== Carbon::parse($data)->dayOfWeek) {
                        
                    unset($this->funcionariosEscaneados[$index]->workingHours[$workIndex]);
                }
            }
                foreach ($funcionario->scans as $scanIndex => $scan) {
                    $scanCreatedAt = Carbon::parse($scan->created_at)->format('Y-m-d');
                    if ($scanCreatedAt !== $data) {
                        unset($this->funcionariosEscaneados[$index]->scans[$scanIndex]);
                    }
            } 


            foreach($funcionario->specifDates as $specificIndex => $specificDate ){
                    if($specificDate->start_date !== $data){
                        unset($this->funcionariosEscaneados[$index]->specifDates[$specificIndex]);
                    }
            }

                
            
        }
        
       
        $this->funcionariosEscaneados = array_values($this->funcionariosEscaneados);
      
        return Inertia::render('ReconhecimentoFacial/Ponto', [
            'funcionariosNaoEscaneados' => $this->funcionariosNaoEscaneados,
            'funcionariosEscaneados' => $this->funcionariosEscaneados,
            
              'data' =>$data,
              'pontoDoDia'=>$this->fotoPontoDoDia,
        ]);
     }
}
