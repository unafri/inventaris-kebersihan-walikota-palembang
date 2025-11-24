import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { TambahBarangForm } from "@/Components/Items/TambahBarangForm";
import { TambahStokForm } from "@/Components/Items/TambahStokForm";
import { TabelBarang } from "@/Components/Items/TabelBarang";

export default function Index({ auth, items, riwayat }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Manajemen Barang
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
                                    Masukkan nama barang dan Harga Satuan
                                </p>
                            </header>

                            <TambahBarangForm />
                        </section>
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <TambahStokForm items={items} />
                    </div>

                    {/* BAGIAN TABEL DAFTAR BARANG */}
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <TabelBarang items={items} />
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
