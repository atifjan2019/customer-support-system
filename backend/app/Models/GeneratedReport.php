<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GeneratedReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'report_type',
        'generated_by',
        'date_from',
        'date_to',
        'data_snapshot',
        'file_path',
    ];

    protected $casts = [
        'date_from' => 'date',
        'date_to' => 'date',
        'data_snapshot' => 'array',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
