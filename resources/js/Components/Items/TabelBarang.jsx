import { Link } from "@inertiajs/react";

export function TabelBarang({ items }) {
    return (
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
                            {/* Edit */}
                            <Link
                                href={route("items.edit", item.id)}
                                className="text-indigo-600 hover:text-indigo-900 me-3"
                            >
                                Edit
                            </Link>

                            {/* Delete */}
                            <Link
                                href={route("items.destroy", item.id)}
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
    );
}
