<?php

namespace App\Http\Controllers;

use App\Models\Funcionarios;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Aws\Rekognition\RekognitionClient;

use App\Models\Scan;
use Carbon\Carbon;

class ReconhecimentoController extends Controller
{
    public function index()
    {
        return Inertia::render('ReconhecimentoFacial/Reconhecer', [
            'successMessage' => session('success'),
            'errorMessage' => session('error')
        ]);
    }

    public function reconhecer(Request $request)
    {
        date_default_timezone_set('America/Sao_Paulo');
        $client = new RekognitionClient([
            'version' => 'latest',
            'region'  => 'us-east-1',
            'credentials' => [
                'key'    => env('AWS_ACCESS_KEY_ID'),
                'secret' => env('AWS_SECRET_ACCESS_KEY'),
            ],
        ]);

        $funcionarios = Funcionarios::where("user_id",auth()->user()->id)->get();

        foreach ($funcionarios as $funcionario) {
            $now = Carbon::now()->locale('pt-BR');
          
         
          
           
               
                $result = $client->compareFaces([
                    'SimilarityThreshold' => 90, // Limite de similaridade (valor entre 0 e 100)
                    'SourceImage' => [
                        'Bytes' => file_get_contents($request->input('imagem')) // Imagem de origem (arquivo bytes)
                    ],
                    'TargetImage' => [
                        'Bytes' => file_get_contents(public_path('/imagens/'.$funcionario->imagem)) // Imagem de destino (arquivo bytes)
                    ]
                ]);
          
                $base64Image = $request->imagem;
            
        
                $data = substr($base64Image, strpos($base64Image, ',') + 1);
                
                $imageName = time() . '_' . Str::random(10) . '.jpg'; 
                $imagePath = public_path('imagens/' . $imageName);
                
                file_put_contents($imagePath, base64_decode($data));

             
                if (!empty($result['FaceMatches'])) {
                  
                    $ultimoScan = Scan::where('funcionario_id', $funcionario->id)->latest()->first();
              
                    
                    if ($ultimoScan && $now->diffInMinutes($ultimoScan->created_at) <= 20) {
                               
                        break; 
                    }
                    $scan = new Scan();
                    $scan->name = $funcionario->name;
                    $scan->cargo = $funcionario->cargo;
                    $scan->imagem =  $imageName;
                    $scan->funcionario_id = $funcionario->id;
                  
                    $scan->save();

                    // Redirecionar com uma mensagem de sucesso
                    return redirect("/reconhecer")->with('success', 'Ponto Concedido - Similaridade: ' . $result['FaceMatches'][0]['Similarity']);
                }
            }
                    // Se não houver correspondência, redirecionar com uma mensagem de erro
                    return redirect("/reconhecer")->with('error', 'Ponto Não Concedido! ');
                
            
        

        // Redirecionar em caso de erro
       
    
}
}
