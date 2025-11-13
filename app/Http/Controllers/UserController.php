<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Illuminate\Validation\Rule;

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
        // validasi
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nip' => 'nullable|string|max:255|unique:users',
            'ruangan' => 'required|string|max:255',
            'role' => 'required|string|in:admin,kabag,staff',
            'password' => ['required', 'confirmed', Rules\Password::min(8)],
        ]);

        // hash pw
        $validatedData['password'] = Hash::make($validatedData['password']);

        // create user baru
        User::create($validatedData);

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
        $users = User::findOrFail($id);

        return Inertia::render('Users/Edit', [
            'user' => $users
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = User::findOrFail($id);

        // validasi
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'nip' => [
                'nullable', 
                'string', 
                'max:255', 
                Rule::unique('users')->ignore($user->id)
            ],
            'ruangan' => 'required|string|max:255',
            'role' => 'required|string|in:admin,kabag,staff',
            // kalo pw kosong (pake yg lama)
            'password' => ['nullable', 'confirmed', Rules\Password::min(8)],
        ]);

        // validasi password
        if ($request->filled('password')) {
            $validatedData['password'] = Hash::make($validatedData['password']);
        } else {
            unset($validatedData['password']);
        }

        // update data user
        $user->update($validatedData);

        return redirect()->route('users.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $users = User::findOrFail($id);

        $users->delete();

        return redirect()->route('users.index');
    }
}
