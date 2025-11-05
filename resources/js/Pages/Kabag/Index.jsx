import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, pengajuans }) {
    // Fungsi untuk melihat berkas (membuka di tab baru)
    const lihatBerkas = (berkasPath) => {
        // URL berkas ada di /storage/nama_file
        window.open(`/storage/${berkasPath}`, "_blank");
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Persetujuan Kabag
                </h2>
            }
        >
            <Head title="Persetujuan Kabag" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">
                                Daftar Pengajuan Menunggu Persetujuan
                            </h3>

                            {/* TABEL PERSETUJUAN */}
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
                                            Barang
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Jumlah
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
                                                {p.item.nama_barang} (Stok:{" "}
                                                {p.item.stok})
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
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
                                                    Lihat Berkas
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                {/* Tombol Setuju */}
                                                <Link
                                                    href={route(
                                                        "kabag.setuju",
                                                        p.id
                                                    )}
                                                    method="patch" // Kirim sebagai PATCH
                                                    as="button"
                                                    className="inline-flex items-center px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                                                    onBefore={() =>
                                                        confirm(
                                                            "Setujui pengajuan ini?"
                                                        )
                                                    }
                                                >
                                                    Setuju
                                                </Link>
                                                {/* Tombol Tolak */}
                                                <Link
                                                    href={route(
                                                        "kabag.tolak",
                                                        p.id
                                                    )}
                                                    method="patch"
                                                    as="button"
                                                    className="inline-flex items-center px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                                                    onBefore={() =>
                                                        confirm(
                                                            "Tolak pengajuan ini?"
                                                        )
                                                    }
                                                >
                                                    Tolak
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
                                                Tidak ada pengajuan yang
                                                menunggu persetujuan.
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
