import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">

            {/* sidebar */}
            <aside className="w-64 bg-gray-100 border-r shadow-sm shadow-blue-500 border-gray-200 fixed h-full flex flex-col">

                <div className="p-4 flex items-center gap-3 border-b border-gray-400"> 
                    <Link href="/" className="flex-shrink-0">
                        <ApplicationLogo className="h-14 w-auto fill-current text-gray-800" />
                    </Link>

                    <span className="text-sm text-blue-500 font-bold leading-tight">
                        Sistem Pengadaan<br />Distribusi Alat Kebersihan
                    </span>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto">

                    <div>
                        <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                            Main
                        </p>

                        <NavLink href={route("dashboard")} active={route().current("dashboard")} icon="dashboard">
                            Dashboard
                        </NavLink>
                    </div>

                    {/* ADMIN MENU */}
                    {user.role === "admin" && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Administrator
                            </p>

                            <div className="space-y-1">
                                <NavLink href={route("items.index")} active={route().current("items.index")}>
                                    Manajemen Barang
                                </NavLink>

                                <NavLink href={route("users.index")} active={route().current("users.index")}>
                                    Manajemen Akun
                                </NavLink>

                                <NavLink href={route("admin.index")} active={route().current("admin.index")}>
                                    Proses Pengajuan
                                </NavLink>
                            </div>
                        </div>
                    )}

                    {/* ADMIN + KABAG */}
                    {(user.role === "admin" || user.role === "kabag") && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Laporan
                            </p>

                            <NavLink
                                href={route("laporan.stok.page")}
                                active={route().current("laporan.stok.page")}
                            >
                                Laporan Stok
                            </NavLink>
                        </div>
                    )}

                    {/* STAFF ONLY */}
                    {user.role === "staff" && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Staff
                            </p>

                            <div className="space-y-1">
                                <NavLink
                                    href={route("pengajuan.create")}
                                    active={route().current("pengajuan.create")}
                                    icon="add_shopping_cart"
                                >
                                    Permintaan Barang
                                </NavLink>

                                <NavLink
                                    href={route("pengajuan.index")}
                                    active={route().current("pengajuan.index")}
                                    icon="pending_actions"
                                >
                                    Status Pengajuan
                                </NavLink>
                            </div>
                        </div>
                    )}

                    {/* KABAG */}
                    {user.role === "kabag" && (
                        <div>
                            <p className="text-xs font-semibold text-gray-400 uppercase mb-2">
                                Kepala Bagian
                            </p>

                            <NavLink href={route("kabag.index")} active={route().current("kabag.index")}>
                                Persetujuan Pengajuan
                            </NavLink>
                        </div>
                    )}
                </nav>

                {/* USER DROPDOWN FOOTER */}
                <div className="absolute bottom-0 w-full border-t p-4 bg-gray-100">
                    <div className="text-gray-700 font-semibold mb-2">{user.name}</div>

                    <Link
                        href={route("profile.edit")}
                        className="block px-3 py-2 rounded-md text-gray-600 hover:bg-gray-200"
                    >
                        Profile
                    </Link>

                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="block w-full text-left px-3 py-2 rounded-md text-gray-600 hover:bg-gray-100"
                    >
                        Log Out
                    </Link>
                </div>
            </aside>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 ml-64">
                {header && (
                    <header className="bg-white shadow p-6">
                        <div className="max-w-7xl">{header}</div>
                    </header>
                )}

                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
