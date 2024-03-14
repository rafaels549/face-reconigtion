<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Funcionarios extends Model
{

    protected $appends = ['formatted_created_at'];
   
    use HasFactory;
    public function workingHours(){
        return $this->hasMany(WorkingHours::class,"funcionario_id");
   }


   public function scans(){
      return $this->hasMany(Scan::class , "funcionario_id");
   }

   public function specifDates(){
       return $this->hasMany(SpecificDates::class,"funcionario_id");
   }

   public function getFormattedCreatedAtAttribute()
   {
       return Carbon::parse($this->created_at)->format('d/m/Y H:i:s');
   }
}
