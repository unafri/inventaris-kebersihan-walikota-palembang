import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import React, { useState } from 'react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const [showPassword, setShowPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-semibold mb-1">
                        Selamat Datang
                    </h1>
                    <p>Silahkan Log in untuk masuk ke sistem!</p>
                </div>

                <div>
                    <InputLabel htmlFor="email" value="NIP / Email" />

                    <TextInput
                        id="email"
                        type="text"
                        name="email"
                        placeholder="Masukkan NIP atau Email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <div className="relative mt-1">
                        <TextInput
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Masukkan Password"
                            value={data.password}
                            className="mt-1 block w-full pe-10"
                            autoComplete="current-password"
                            onChange={(e) => setData("password", e.target.value)}
                        />

                        <button
                            type="button"
                            className="absolute right-0 inset-y-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                        {showPassword ? 
                        <span className="material-symbols-outlined text-xl">
                            visibility_off
                        </span> : 
                        <span className="material-symbols-outlined text-xl">
                            visibility
                        </span>}
                        </button>
                    </div>

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData("remember", e.target.checked)
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Ingat saya
                        </span>
                    </label>
                </div>

                <div className="mt-5 flex items-center justify-center">
                    <PrimaryButton
                        className="w-full flex justify-center"
                        disabled={processing}
                    >
                        Login
                    </PrimaryButton>
                </div>

                <div className="flex justify-between mt-2">
                    <div className="">
                        {canResetPassword && (
                            <Link
                                href={route("password.request")}
                                className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Forgot your password?
                            </Link>
                        )}
                    </div>
                        
                    <div>
                        <Link
                            href={route("register")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Buat akun?
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
