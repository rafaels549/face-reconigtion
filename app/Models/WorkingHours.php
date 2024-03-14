<?php

namespace App\Models;

use App\Enums\DaysOfWeek;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkingHours extends Model
{

     
    use HasFactory;
    protected $casts = ["dia" => DaysOfWeek::class,"interval"=>"array"];
    public function funcionario(){
        return $this->belongsTo(Funcionarios::class,"funcionario_id");
   }
}
