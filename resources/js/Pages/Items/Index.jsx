import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

// 'auth' dan 'items' dikirim otomatis dari controller
export default function Index({ auth, items }) {
    // 1. Setup 'useForm' hook dari Inertia
    // Ini adalah cara React-Inertia mengelola data form
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_barang: "",
        stok: "",
        harga: "",
    });

    // 2. Fungsi untuk menangani submit form
    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke route 'items.store'
        post(route("items.store"), {
            onSuccess: () => reset(), // Reset form jika sukses
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Daftar Barang
                </h2>
            }
        >
            <Head title="Barang" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    {/* BAGIAN FORMULIR TAMBAH BARANG */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Tambah Barang Baru
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Masukkan nama barang dan stok awal.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel
                                        htmlFor="nama_barang"
                                        value="Nama Barang"
                                    />
                                    <TextInput
                                        id="nama_barang"
                                        className="mt-1 block w-full"
                                        value={data.nama_barang}
                                        onChange={(e) =>
                                            setData(
                                                "nama_barang",
                                                e.target.value
                                            )
                                        }
                                        required
                                        isFocused
                                    />
                                    {/* Menampilkan error validasi jika ada */}
                                    {errors.nama_barang && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.nama_barang}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel htmlFor="stok" value="Stok" />
                                    <TextInput
                                        id="stok"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.stok}
                                        onChange={(e) =>
                                            setData("stok", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.stok && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.stok}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="harga"
                                        value="Harga Satuan"
                                    />
                                    <TextInput
                                        id="harga"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.harga}
                                        onChange={(e) =>
                                            setData("harga", e.target.value)
                                        }
                                        required
                                    />
                                    {errors.harga && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {errors.harga}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Simpan
                                    </PrimaryButton>
                                </div>
                            </form>
                        </section>
                    </div>

                    {/* BAGIAN TABEL DAFTAR BARANG */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        ID
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Nama Barang
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Stok
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Harga
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.id}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.nama_barang}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {item.stok}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            Rp{item.harga}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {/* Tombol Edit */}
                                            <Link
                                                href={route(
                                                    "items.edit",
                                                    item.id
                                                )} // Kirim ke route 'items.edit'
                                                className="text-indigo-600 hover:text-indigo-900 me-3" // me-3 = margin-right
                                            >
                                                Edit
                                            </Link>

                                            {/* Tombol Delete */}
                                            <Link
                                                href={route(
                                                    "items.destroy",
                                                    item.id
                                                )}
                                                method="delete"
                                                as="button"
                                                className="text-red-600 hover:text-red-900"
                                                onBefore={() =>
                                                    confirm(
                                                        "Apakah Anda yakin ingin menghapus item ini?"
                                                    )
                                                }
                                            >
                                                Delete
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                                {items.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="px-6 py-4 text-center text-gray-500"
                                        >
                                            Belum ada data barang.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
