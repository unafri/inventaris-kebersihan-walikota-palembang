import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

export function TambahStokForm({ items }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        item_id: "",
        jumlah: "",
        keterangan: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("stok.masuk.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <section>
            <header>
                <h2 className="text-lg font-medium text-gray-900">
                    Catat Stok Masuk
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                    Gunakan form ini untuk mencatat pembelian atau penambahan
                    stok baru.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                {/* Dropdown Nama Barang */}
                <div>
                    <InputLabel htmlFor="item_id" value="Nama Barang" />
                    <select
                        id="item_id"
                        name="item_id"
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
                        value={data.item_id}
                        onChange={(e) => setData("item_id", e.target.value)}
                        required
                    >
                        <option value="">Pilih Barang</option>
                        {items.map((item) => (
                            <option key={item.id} value={item.id}>
                                {item.nama_barang} (Stok Saat Ini: {item.stok})
                            </option>
                        ))}
                    </select>
                    <InputError message={errors.item_id} className="mt-2" />
                </div>

                {/* Jumlah Masuk */}
                <div>
                    <InputLabel htmlFor="jumlah" value="Jumlah Masuk" />
                    <TextInput
                        id="jumlah"
                        type="number"
                        className="mt-1 block w-full"
                        value={data.jumlah}
                        onChange={(e) => setData("jumlah", e.target.value)}
                        required
                    />
                    <InputError message={errors.jumlah} className="mt-2" />
                </div>

                {/* Keterangan */}
                <div>
                    <InputLabel
                        htmlFor="keterangan"
                        value="Keterangan (Misal: Pembelian Supplier X)"
                    />
                    <TextInput
                        id="keterangan"
                        className="mt-1 block w-full"
                        value={data.keterangan}
                        onChange={(e) => setData("keterangan", e.target.value)}
                        required
                    />
                    <InputError message={errors.keterangan} className="mt-2" />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>
                        Simpan Stok Masuk
                    </PrimaryButton>
                </div>
            </form>
        </section>
    );
}
