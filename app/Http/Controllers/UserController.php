<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $users = User::all();

        return Inertia::render('Users/Index', ['users' => $users]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Langkah 1: Validasi data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255|unique:users', // boleh kosong, tapi jika diisi harus unik
            'ruangan' => 'required|string|max:255',
            'role' => 'required|string|in:admin,kabag,staff', // harus salah satu dari 3 ini
            'password' => ['required', 'confirmed', Rules\Password::min(8)], // 'confirmed' = harus cocok dengan 'password_confirmation'
        ]);

        // Langkah 2: Enkripsi (Hash) Password
        // INI SANGAT PENTING! Jangan pernah simpan password sebagai teks biasa.
        $validatedData['password'] = Hash::make($validatedData['password']);

        // Langkah 3: Buat user baru di database
        User::create($validatedData);

        // Langkah 4: Redirect kembali ke halaman index
        return redirect()->route('users.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
