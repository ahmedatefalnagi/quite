<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CompanySetting extends Model
{
    protected $fillable = [
        'company_name',
        'vat_number',
        'commercial_registration',
        'iban',
        'email',
        'phone',
        'address',
        'city',
        'country',
    ];
}