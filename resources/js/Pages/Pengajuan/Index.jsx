import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ auth, pengajuans }) {
    // Fungsi untuk menghitung lama ajuan (misal: "2 hari lalu")
    const hitungLamaAjuan = (tanggal) => {
        const now = new Date();
        const then = new Date(tanggal);
        const diffMs = now.getTime() - then.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "Hari ini";
        return `${diffDays} hari lalu`;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Riwayat Pengajuan Barang
                </h2>
            }
        >
            <Head title="Riwayat Pengajuan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">
                                Daftar Pengajuan Saya
                            </h3>

                            <Link
                                href={route("pengajuan.create")}
                                className="inline-flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-indigo-500 active:bg-indigo-700"
                            >
                                Buat Pengajuan Baru
                            </Link>

                            {/* TABEL RIWAYAT */}
                            <table className="min-w-full divide-y divide-gray-200 mt-4">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Tgl. Ajuan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Lama Ajuan
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Barang
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Jumlah
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                            Status
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {pengajuans.map((p) => (
                                        <tr key={p.id}>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {new Date(
                                                    p.created_at
                                                ).toLocaleDateString("id-ID")}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {hitungLamaAjuan(p.created_at)}
                                            </td>
                                            {/* Kita bisa ambil 'nama_barang' karena kita pakai 'with('item')' */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {p.item.nama_barang}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {p.jumlah}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {p.status}
                                            </td>
                                        </tr>
                                    ))}
                                    {pengajuans.length === 0 && (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-4 text-center text-gray-500"
                                            >
                                                Belum ada riwayat pengajuan.
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
