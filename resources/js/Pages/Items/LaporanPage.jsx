import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";

export default function LaporanPage({ auth }) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    const { data, setData, post, processing } = useForm({
        bulan: currentMonth,
        tahun: currentYear,
    });

    const months = [
        { value: 1, label: "Januari" },
        { value: 2, label: "Februari" },
        { value: 3, label: "Maret" },
        { value: 4, label: "April" },
        { value: 5, label: "Mei" },
        { value: 6, label: "Juni" },
        { value: 7, label: "Juli" },
        { value: 8, label: "Agustus" },
        { value: 9, label: "September" },
        { value: 10, label: "Oktober" },
        { value: 11, label: "November" },
        { value: 12, label: "Desember" },
    ];
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

    const submit = (e) => {
        e.preventDefault();

        const url =
            route("laporan.stok.download") +
            `?bulan=${data.bulan}&tahun=${data.tahun}`;

        window.location.href = url;
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Laporan Stok Bulanan
                </h2>
            }
        >
            <Head title="Laporan Stok Bulanan" />

            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Filter Laporan
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Pilih periode bulan dan tahun untuk
                                    men-download laporan stok.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                {/* Dropdown Bulan */}
                                <div>
                                    <InputLabel htmlFor="bulan" value="Bulan" />
                                    <select
                                        id="bulan"
                                        name="bulan"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.bulan}
                                        onChange={(e) =>
                                            setData("bulan", e.target.value)
                                        }
                                    >
                                        {months.map((m) => (
                                            <option
                                                key={m.value}
                                                value={m.value}
                                            >
                                                {m.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Dropdown Tahun */}
                                <div>
                                    <InputLabel htmlFor="tahun" value="Tahun" />
                                    <select
                                        id="tahun"
                                        name="tahun"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.tahun}
                                        onChange={(e) =>
                                            setData("tahun", e.target.value)
                                        }
                                    >
                                        {years.map((y) => (
                                            <option key={y} value={y}>
                                                {y}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Download Laporan
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
