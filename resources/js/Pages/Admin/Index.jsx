import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";

// 'pengajuans' dikirim dari controller
export default function Index({ auth, pengajuans }) {
    // Ambil 'flash message' (error) dari Inertia
    const { flash } = usePage().props;

    const lihatBerkas = (berkasPath) => {
        window.open(`/storage/${berkasPath}`, "_blank");
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Proses Pengajuan Admin
                </h2>
            }
        >
            <Head title="Proses Pengajuan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Tampilkan pesan error jika ada */}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">
                                Daftar Pengajuan Siap Proses
                            </h3>

                            {/* TABEL PROSES */}
                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Pengaju
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Ruangan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Barang (Stok Saat Ini)
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Jumlah Diminta
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Berkas
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Aksi
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pengajuans.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {p.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {p.user.ruangan}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {p.item.nama_barang} (
                                                {p.item.stok})
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap font-bold text-red-600">
                                                {p.jumlah}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() =>
                                                        lihatBerkas(
                                                            p.berkas_path
                                                        )
                                                    }
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    Lihat
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {/* Tombol Proses */}
                                                <Link
                                                    href={route(
                                                        "admin.proses",
                                                        p.id
                                                    )}
                                                    method="patch"
                                                    as="button"
                                                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                                                    onBefore={() =>
                                                        confirm(
                                                            "Proses dan kurangi stok untuk pengajuan ini?"
                                                        )
                                                    }
                                                >
                                                    Proses
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                    {pengajuans.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="6"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                Tidak ada pengajuan yang siap
                                                diproses.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
