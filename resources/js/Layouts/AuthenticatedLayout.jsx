import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import { Link, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">

            {/* sidebar */}
            <aside className="w-64 bg-gray-00 border-r shadow-sm shadow-blue-500 border-gray-200 fixed h-full flex flex-col">

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
               <div className="absolute bottom-0 w-full p-4 border-t bg-gray-50">
                    {/* Profile Name */}
                    <div className="flex items-center gap-3 mb-4">
                        <span className="material-symbols-outlined text-gray-600 text-3xl">
                            account_circle
                        </span>
                        <div>
                            <div className="text-gray-800 font-semibold leading-tight">
                                {user.name}
                            </div>
                            <div className="text-gray-500 text-sm">
                                {user.email}
                            </div>
                        </div>
                    </div>

                    {/* Profile Button */}
                    <Link
                        href={route("profile.edit")}
                        className="flex items-center gap-3 px-3 py-2 rounded-lg
                                text-gray-700 hover:bg-indigo-100 hover:text-indigo-700
                                transition-all duration-150"
                    >
                        <span className="material-symbols-outlined text-lg">person</span>
                        <span>Profile</span>
                    </Link>

                    {/* Logout Button */}
                    <Link
                        href={route("logout")}
                        method="post"
                        as="button"
                        className="flex items-center gap-3 px-3 py-2 w-full rounded-lg
                                text-red-600 hover:bg-red-100 hover:text-red-700
                                transition-all duration-150 mt-1"
                    >
                        <span className="material-symbols-outlined text-lg">logout</span>
                        <span>Log Out</span>
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
