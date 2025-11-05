<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Pengajuan extends Model
{
    protected $fillable = [
        'user_id',
        'item_id',
        'jumlah',
        'berkas_path',
        'status',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }    

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
