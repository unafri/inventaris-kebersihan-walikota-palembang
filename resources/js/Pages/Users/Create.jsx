import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

// 'auth' dikirim otomatis
export default function Create({ auth }) {
    // Setup 'useForm' dengan field yang dibutuhkan
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        nip: "",
        ruangan: "",
        role: "staff", // Nilai default untuk role
        password: "",
        password_confirmation: "", // Wajib ada karena validasi 'confirmed'
    });

    // Fungsi untuk menangani submit form
    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke route 'users.store'
        post(route("users.store"), {
            onSuccess: () => reset("password", "password_confirmation"), // Kosongkan field password jika sukses
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Buat Akun Baru
                </h2>
            }
        >
            <Head title="Buat Akun Baru" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Informasi Akun
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Buat akun baru untuk staff, kabag, atau
                                    admin.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                {/* Nama */}
                                <div>
                                    <InputLabel htmlFor="name" value="Nama" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                        isFocused
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* NIP */}
                                <div>
                                    <InputLabel
                                        htmlFor="nip"
                                        value="NIP (Kosongkan jika tidak ada)"
                                    />
                                    <TextInput
                                        id="nip"
                                        className="mt-1 block w-full"
                                        value={data.nip}
                                        onChange={(e) =>
                                            setData("nip", e.target.value)
                                        }
                                    />
                                    {errors.nip && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.nip}
                                        </p>
                                    )}
                                </div>

                                {/* Ruangan */}
                                <div>
                                    <InputLabel
                                        htmlFor="ruangan"
                                        value="Ruangan"
                                    />
                                    <TextInput
                                        id="ruangan"
                                        className="mt-1 block w-full"
                                        value={data.ruangan}
                                        onChange={(e) =>
                                            setData("ruangan", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.ruangan && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.ruangan}
                                        </p>
                                    )}
                                </div>

                                {/* Role (Dropdown) */}
                                <div>
                                    <InputLabel htmlFor="role" value="Role" />
                                    <select
                                        id="role"
                                        name="role"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.role}
                                        onChange={(e) =>
                                            setData("role", e.target.value)
                                        }
                                    >
                                        <option value="staff">Staff</option>
                                        <option value="kabag">Kabag</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    {errors.role && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.role}
                                        </p>
                                    )}
                                </div>

                                {/* Password */}
                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.password && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.password}
                                        </p>
                                    )}
                                </div>

                                {/* Konfirmasi Password */}
                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Konfirmasi Password"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        required
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Simpan
                                    </PrimaryButton>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
