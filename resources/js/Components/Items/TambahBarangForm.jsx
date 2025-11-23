import { useForm } from "@inertiajs/react";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

export function TambahBarangForm() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_barang: "",
        harga: "",
    });

    const submit = (e) => {
        e.preventDefault();
        post(route("items.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="mt-6 space-y-6">
            <div>
                <InputLabel htmlFor="nama_barang" value="Nama Barang" />
                <TextInput
                    id="nama_barang"
                    className="mt-1 block w-full"
                    value={data.nama_barang}
                    onChange={(e) => setData("nama_barang", e.target.value)}
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
                <InputLabel htmlFor="harga" value="Harga Satuan" />
                <TextInput
                    id="harga"
                    type="number"
                    className="mt-1 block w-full"
                    value={data.harga}
                    onChange={(e) => setData("harga", e.target.value)}
                    required
                />
                {errors.harga && (
                    <p className="text-red-500 text-xs mt-1">{errors.harga}</p>
                )}
            </div>

            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
            </div>
        </form>
    );
}
