<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    // List all users
    public function index(Request $request)
    {
        $user = auth()->user();
        $query = User::with('company');

        // Multi-tenancy: filter by company unless super_admin
        if ($user->role !== 'super_admin') {
            $query->where('company_id', $user->company_id);
        }

        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        return response()->json($query->latest()->paginate(20));
    }

    // Create a new user
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'role' => 'required|in:super_admin,employee,company_owner,tech_team',
            'phone' => 'nullable|string',
            'company_id' => 'nullable|exists:companies,id',
            'permissions' => 'nullable|array',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'phone' => $validated['phone'] ?? null,
            'company_id' => $validated['company_id'] ?? null,
            'permissions' => $validated['permissions'] ?? null,
            'is_active' => true,
        ]);

        return response()->json($user, 201);
    }

    // Show a single user
    public function show($id)
    {
        return User::with('company')->findOrFail($id);
    }

    // Update user details
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('users')->ignore($user->id)],
            'role' => 'sometimes|in:super_admin,employee,company_owner,tech_team',
            'phone' => 'nullable|string',
            'password' => 'nullable|string|min:8',
            'company_id' => 'nullable|exists:companies,id',
            'is_active' => 'boolean',
            'permissions' => 'nullable|array'
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = Hash::make($validated['password']);
        }

        $user->update($validated);

        return response()->json($user);
    }

    // Delete (Soft Delete)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        
        // Prevent deleting self
        if (auth()->id() == $user->id) {
            return response()->json(['message' => 'Cannot delete your own account'], 403);
        }

        // Prevent deleting Main Super Admin
        if ($user->id == 1) {
            return response()->json(['message' => 'Cannot delete the main Super Admin'], 403);
        }

        $user->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }
}
