<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_id',
        'category',
        'description',
        'severity',
        'resolution_notes',
        'resolution_time_minutes',
        'customer_feedback',
    ];

    public function lead()
    {
        return $this->belongsTo(Lead::class);
    }
}
