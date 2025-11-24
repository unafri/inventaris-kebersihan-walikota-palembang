import InputError from "@/Components/InputError";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, useForm, Link } from "@inertiajs/react";

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: "",
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("password.email"));
    };

    return (
        <GuestLayout>
            <Head title="Lupa Password" />

            <div className="mb-4 ">
                <h1 className="block text-lg font-medium text-gray-700">
                    Lupa Password?
                </h1>
                <p className="text-sm text-gray-600">
                    Kami akan mengirimkan link verifikasi ke emailmu yang
                    terdaftar disini.
                </p>
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Masukkan Email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData("email", e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton
                        className="w-full flex justify-center"
                        disabled={processing}
                    >
                        Konfirmasi
                    </PrimaryButton>
                </div>

                <div>
                    <div className="mt-2">
                        <Link
                            href={route("login")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Kembali ke Halaman Login
                        </Link>
                    </div>
                </div>
            </form>
        </GuestLayout>
    );
}
