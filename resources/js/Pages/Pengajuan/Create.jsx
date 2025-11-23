import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

// 'auth' dan 'items' (daftar barang) dikirim dari controller
export default function Create({ auth, items }) {
    const { data, setData, post, processing, errors } = useForm({
        item_id: "",
        jumlah: "",
        berkas: null,
        ruangan: auth.user.ruangan,
    });

    // Fungsi untuk menangani submit form
    const submit = (e) => {
        e.preventDefault();
        // Kirim data ke route 'pengajuan.store'
        // Inertia otomatis tahu cara handle file upload (multipart/form-data)
        post(route("pengajuan.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Buat Pengajuan Baru
                </h2>
            }
        >
            <Head title="Buat Pengajuan Baru" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Formulir Pengajuan
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Isi data barang yang ingin Anda ajukan.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                {/* Dropdown Nama Barang */}
                                <div>
                                    <InputLabel
                                        htmlFor="item_id"
                                        value="Nama Barang"
                                    />
                                    <select
                                        id="item_id"
                                        name="item_id"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.item_id}
                                        onChange={(e) =>
                                            setData("item_id", e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">Pilih Barang</option>
                                        {items.map((item) => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                            >
                                                {item.nama_barang}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError
                                        message={errors.item_id}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Jumlah Barang */}
                                <div>
                                    <InputLabel
                                        htmlFor="jumlah"
                                        value="Jumlah Barang"
                                    />
                                    <TextInput
                                        id="jumlah"
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={data.jumlah}
                                        onChange={(e) =>
                                            setData("jumlah", e.target.value)
                                        }
                                        required
                                    />
                                    <InputError
                                        message={errors.jumlah}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Ruangan (Read Only) */}
                                <div>
                                    <InputLabel
                                        htmlFor="ruangan"
                                        value="Ruangan (Otomatis)"
                                    />
                                    <TextInput
                                        id="ruangan"
                                        className="mt-1 block w-full bg-gray-100"
                                        value={data.ruangan}
                                        disabled // Tidak bisa diubah
                                    />
                                </div>

                                {/* Berkas Pengajuan (File Upload) */}
                                <div>
                                    <InputLabel
                                        htmlFor="berkas"
                                        value="Berkas Pendukung (Nota Dinas)"
                                    />
                                    <TextInput
                                        id="berkas"
                                        type="file"
                                        className="mt-1 block w-full"
                                        onChange={(e) =>
                                            setData("berkas", e.target.files[0])
                                        } // Ambil file pertama
                                        required
                                    />
                                    <InputError
                                        message={errors.berkas}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Ajukan
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
