<?php

namespace App\Http\Controllers;

use App\Models\Funcionarios;
use App\Models\SpecificDates;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FuncionarioController extends Controller
{

    public $funcionario;
public function index() {
    $funcionarios = Funcionarios::where("user_id",auth()->user()->id)->get();
    return Inertia::render('ReconhecimentoFacial/Funcionarios', [
        'funcionarios' => $funcionarios,
        'successMessage' => session('sucess'),
    ]);
}


public function editar($id){
    $id = intval($id);  
    $this->funcionario = Funcionarios::where("id" , $id)->first();

    return Inertia::render('ReconhecimentoFacial/Funcionario', [
        'funcionario' => $this->funcionario,
     
    ]);

}


public function salvar($id,Request $request){
                
    $id = intval($id);    
           $funcionario = Funcionarios::where("id" , $id)->first();
           $specificDates = new SpecificDates();
        if($request->option === "adicionarHoraExtra"){
            $specificDates->start_date= Carbon::parse($request->data)->format('Y-m-d');
            $specificDates->start_hour = Carbon::parse($request->start_hour)->timezone('America/Sao_Paulo')->toTimeString();
            $specificDates->end_hour = Carbon::parse($request->end_hour)->timezone('America/Sao_Paulo')->toTimeString();
            $specificDates->funcionario_id = $funcionario->id;
            $specificDates->option = $request->option;
            $specificDates->save();
        }else if($request->option === "removerDia"){
            $specificDates->start_date= Carbon::parse($request->data)->format('Y-m-d');
            $specificDates->funcionario_id = $funcionario->id;
            $specificDates->option = $request->option;
            $specificDates->save();
        }else if($request->option === "adicionarDia"){

            $specificDates->start_date= Carbon::parse($request->data)->format('Y-m-d');
            $specificDates->start_hour = Carbon::parse($request->start_hour)->timezone('America/Sao_Paulo')->toTimeString();
            $specificDates->end_hour = Carbon::parse($request->end_hour)->timezone('America/Sao_Paulo')->toTimeString();
             $specificDates->interval = [
                
                    "start" => Carbon::parse($request->interval_start)->timezone('America/Sao_Paulo')->format("H:i:s"),
                    "end" => Carbon::parse($request->interval_end )->timezone('America/Sao_Paulo')->format("H:i:s")
                
            ];
            $interval = [
                "start" => Carbon::parse($request->interval_start)->timezone('America/Sao_Paulo')->toTimeString(),
                "end" => Carbon::parse($request->interval_end)->timezone('America/Sao_Paulo')->toTimeString()
            ];
            
            // Converter o array em uma string JSON antes de atribuí-lo ao campo do modelo
            $specificDates->interval = json_encode([$interval]);
          
            $specificDates->funcionario_id = $funcionario->id;
            $specificDates->option = $request->option;
            $specificDates->save(); 
        }else{
                  return redirect("/funcionario/{$id}")->with("error", " Erro ");
        }
                       
        return redirect("/funcionario/{$id}")->with("sucess", " Cadastro feito ");
              
}
}
