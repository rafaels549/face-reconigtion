<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Models\Funcionarios;
use App\Models\WorkingHours;
use App\Enums\DaysOfWeek;
use Carbon\Carbon;
use Illuminate\Support\Str;

class CadastroController extends Controller
{
    public function index()
    {
        return Inertia::render('ReconhecimentoFacial/Cadastro', [
            'successMessage' => session('sucess'),
            'errors' => session('errors')
        ]);
    }

    public function cadastrar(Request $request)
    {
        // Regras de validação
        $rules = [
            'nome' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'imagem' => 'required|string',
            'dados' => 'required|array',
            'dados.*.isChecked' => 'required|boolean',
            'dados.*.horarioInicial' => 'required_if:dados.*.isChecked,true',
            'dados.*.horarioFinal' => 'required_if:dados.*.isChecked,true',
            'dados.*.intervaloInicial' => 'nullable',
            'dados.*.intervaloFinal' => 'nullable',
        ];
        
        // Mensagens de erro personalizadas
        $messages = [
            'nome.required' => 'O campo nome é obrigatório.',
            'cargo.required' => 'O campo cargo é obrigatório.',
            'imagem.required' => 'O campo imagem é obrigatório.',
            'dados.*.isChecked.required' => 'O campo isChecked é obrigatório.',
            'dados.*.horarioInicial.required_if' => 'O horário inicial é obrigatório quando o dia está marcado.',
            'dados.*.horarioFinal.required_if' => 'O horário final é obrigatório quando o dia está marcado.',
        ];
    
        $validator = Validator::make($request->all(), $rules, $messages);
    
        if ($validator->fails()) {
            // Se houver erros de validação, redirecione de volta com os erros
            return redirect("/cadastro")->with("errors", $validator->errors()->all());
        } else {
            // Se não houver erros de validação, prosseguir com o cadastro
            $base64Image = $request->imagem;
            $data = substr($base64Image, strpos($base64Image, ',') + 1);
            $imageName = time() . '_' . Str::random(10) . '.jpg';
            $imagePath = public_path('imagens/' . $imageName);
            file_put_contents($imagePath, base64_decode($data));

            $funcionario = new Funcionarios();
            $funcionario->user_id = auth()->user()->id;
            $funcionario->name = $request->nome;
            $funcionario->cargo = $request->cargo;
            $funcionario->imagem = $imageName;
            $funcionario->save();

            foreach ($request->dados as $dia) {
                if ($dia['isChecked']) {
                    $workingHours = new WorkingHours();
                    if (defined(DaysOfWeek::class . '::' . $dia["dia"])) {
                        $workingHours->dia = constant(DaysOfWeek::class . '::' . $dia["dia"])->value;
                    }

                    $workingHours->start_hour = Carbon::parse($dia["horarioInicial"])->subHours(3)->format("H:i:s");
                    $workingHours->end_hour = Carbon::parse($dia["horarioFinal"])->subHours(3)->format("H:i:s");

                    // Verificar se há intervalo inicial e final antes de salvar
                    if (!empty($dia["intervaloInicial"]) && !empty($dia["intervaloFinal"])) {
                        $workingHours->interval = [
                            [
                                "start" => Carbon::parse($dia["intervaloInicial"])->subHours(3)->format("H:i:s"),
                                "end" => Carbon::parse($dia["intervaloFinal"])->subHours(3)->format("H:i:s")
                            ]
                        ];
                    }

                    $workingHours->funcionario_id = $funcionario->id;
                    $workingHours->save();
                }
            }

            // Após o cadastro bem-sucedido, redirecione de volta com a mensagem de sucesso
            return redirect("/cadastro")->with("success", "Cadastro realizado com sucesso");
        }
    }

}
