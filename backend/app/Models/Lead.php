<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lead extends Model
{
    use HasFactory;

    protected $fillable = [
        'lead_type',
        'location',
        'company',
        'customer_name',
        'phone',
        'address',
        'status',
        'priority',
        'assigned_to',
        'created_by',
        'company_id',
        'company', // Legacy string
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'resolved_at' => 'datetime',
    ];

    public function assignedAgent()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function companyRel()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function complaint()
    {
        return $this->hasOne(Complaint::class);
    }
}
