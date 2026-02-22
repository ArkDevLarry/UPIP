<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => [
                'required',
                'string',
                'max:255'
            ],

            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                'unique:users,email'
            ],

            'password' => [
                'required',
                'string',
                'min:10',
                'confirmed'
            ],

            'password_confirmation' => [
                'required',
                'string'
            ],

            'dob' => [
                'nullable',
                'date',
                'before:today'
            ],

            'gender' => [
                'nullable',
                'in:male,female,other,prefer_not_to_say'
            ],

            'region' => [
                'nullable',
                'string',
                'size:2'
            ],
        ];
    }
}