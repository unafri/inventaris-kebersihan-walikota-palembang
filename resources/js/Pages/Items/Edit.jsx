import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";

// 'auth' dan 'item' (data 1 barang) dikirim dari controller
export default function Edit({ auth, item }) {
    // Setup 'useForm' dengan data awal dari 'item'
    const { data, setData, put, processing, errors } = useForm({
        nama_barang: item.nama_barang,
        stok: item.stok,
    });

    // Fungsi untuk menangani submit form
    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke route 'items.update' dengan method PUT
        put(route("items.update", item.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Edit Barang
                </h2>
            }
        >
            <Head title={`Edit Barang: ${item.nama_barang}`} />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Edit Data Barang
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Perbarui nama barang dan stok.
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
                                        value={data.nama_barang} // <-- Nilai dari useForm
                                        onChange={(e) =>
                                            setData(
                                                "nama_barang",
                                                e.target.value
                                            )
                                        }
                                        required
                                        isFocused
                                    />
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
                                        value={data.stok} // <-- Nilai dari useForm
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

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Simpan Perubahan
                                    </PrimaryButton>

                                    <Link
                                        href={route("items.index")}
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
