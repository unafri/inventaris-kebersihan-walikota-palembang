import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

// 'auth' dan 'user' (data user yang mau diedit) dikirim dari controller
export default function Edit({ auth, user }) {
    // 'useForm' diisi dengan data user yang ada
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        nip: user.nip || "", // Tampilkan string kosong jika NIP null
        ruangan: user.ruangan,
        role: user.role,
        password: "", // Password selalu dikosongi
        password_confirmation: "",
    });

    // Fungsi untuk menangani submit form
    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke route 'users.update' dengan method PUT
        put(route("users.update", user.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Akun
                </h2>
            }
        >
            <Head title={`Edit Akun: ${user.name}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Informasi Akun
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Perbarui data akun. Kosongkan password jika
                                    tidak ingin mengubahnya.
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
                                        value="Password Baru (Kosongkan jika tidak berubah)"
                                    />
                                    <TextInput
                                        id="password"
                                        type="password"
                                        className="mt-1 block w-full"
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
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
                                        value="Konfirmasi Password Baru"
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
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Simpan Perubahan
                                    </PrimaryButton>
                                    <Link
                                        href={route("users.index")}
                                        className="inline-flex items-center px-4 py-2 bg-gray-200 border border-transparent rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest hover:bg-gray-300"
                                    >
                                        Batal
                                    </Link>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
