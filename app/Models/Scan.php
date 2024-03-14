<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Scan extends Model
{
    use HasFactory;
    public function funcionario(){
        return $this->belongsTo(Funcionarios::class , "funcionario_id");
     }
}
