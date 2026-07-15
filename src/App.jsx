import React, { Suspense, useState, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";
import ProtectedRoute from "./components/ProtectedRoute";

// ── Lazy imports ──────────────────────────────────────────────────────────────
const MainLayout      = React.lazy(() => import("./layout/MainLayout"));
const AuthLayout      = React.lazy(() => import("./layout/AuthLayout"));
const MemberLayout    = React.lazy(() => import("./layout/MemberLayout"));

// Auth pages
const Login           = React.lazy(() => import("./pages/Auth/Login"));
const Register        = React.lazy(() => import("./pages/Auth/Register"));
const Forgot          = React.lazy(() => import("./pages/Auth/Forgot"));

// Landing / Guest
const LandingPage     = React.lazy(() => import("./pages/Landing/LandingPage"));
const GuestPage       = React.lazy(() => import("./pages/Guest/GuestPage"));

// Admin pages
const Dashboard       = React.lazy(() => import("./pages/Dashboard"));
const Orders          = React.lazy(() => import("./pages/Main/Orders"));
const Customers       = React.lazy(() => import("./pages/Main/Customers"));
const Products        = React.lazy(() => import("./pages/Main/Products"));
const ProductDetail   = React.lazy(() => import("./pages/Main/ProductDetail"));
const Promotions      = React.lazy(() => import("./pages/Main/Promotions"));
const PromotionDetail = React.lazy(() => import("./pages/Main/PromotionDetail"));
const Reports         = React.lazy(() => import("./pages/Main/Reports"));
const ReportDetail    = React.lazy(() => import("./pages/Main/ReportDetail"));
const UIComponents    = React.lazy(() => import("./pages/Main/Components"));
const AdminDebug      = React.lazy(() => import("./pages/Main/AdminDebug"));

// Member pages
const MemberHome      = React.lazy(() => import("./pages/Member/MemberHome"));
const MemberPesanan   = React.lazy(() => import("./pages/Member/MemberPesanan"));
const MemberPromo     = React.lazy(() => import("./pages/Member/MemberPromo"));
const MemberProfil    = React.lazy(() => import("./pages/Member/MemberProfil"));

// Shared
const NotFound        = React.lazy(() => import("./pages/Main/NotFound"));
const Loading         = React.lazy(() => import("./components/Loading"));

// ── Data awal ─────────────────────────────────────────────────────────────────
const initialMenuItems = [
    { id: "dashboard",  label: "Dasbor",       removable: false },
    { id: "orders",     label: "Pesanan",      removable: false },
    { id: "customers",  label: "Pelanggan",    removable: false },
    { id: "products",   label: "Produk",       removable: false },
    { id: "promotions", label: "Promosi",      removable: false },
    { id: "reports",    label: "Laporan",      removable: false },
    { id: "components", label: "Komponen UI",  removable: false },
];

const orderRows = [
    { id: "001", customer: "Wahyu", item: "Ayam",   total: "Rp.78.000",  status: "Preparing"   },
    { id: "002", customer: "Putra", item: "Kebab",  total: "Rp.92.000",  status: "On Delivery" },
    { id: "003", customer: "Dika",  item: "Burger", total: "Rp.105.000", status: "Delivered"   },
    { id: "004", customer: "Gama",  item: "Coffee", total: "Rp.64.000",  status: "Canceled"    },
    { id: "005", customer: "Arya",  item: "Pizza",  total: "Rp.88.000",  status: "Preparing"   },
];

const customerRows = [
    { id: "001", name: "Wahyu", email: "wahyu@email.com",   totalOrder: 14, city: "Bandung",  tier: "Gold"     },
    { id: "002", name: "Putra", email: "putra@email.com",   totalOrder: 9,  city: "Jakarta",  tier: "Silver"   },
    { id: "003", name: "Dika",  email: "dika@email.com",    totalOrder: 21, city: "Surabaya", tier: "Platinum" },
    { id: "004", name: "Gama",  email: "gama@email.com",    totalOrder: 5,  city: "Malang",   tier: "Bronze"   },
    { id: "005", name: "Arya",  email: "arya@email.com",    totalOrder: 12, city: "Semarang", tier: "Gold"     },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseRupiah(value) {
    return Number(String(value).replace(/[^0-9]/g, "") || 0);
}
function formatRupiah(value) {
    return `Rp.${new Intl.NumberFormat("id-ID").format(value)}`;
}
function getNextId(items) {
    const max = items.reduce((m, item) => Math.max(m, Number(String(item.id).replace(/[^0-9]/g, "")) || 0), 0);
    return String(max + 1).padStart(3, "0");
}

// ── sectionFromPath helper ─────────────────────────────────────────────────
function getSectionFromPath(pathname) {
    if (pathname === "/admin" || pathname === "/admin/") return "dashboard";
    if (pathname.startsWith("/admin/orders"))     return "orders";
    if (pathname.startsWith("/admin/customers"))  return "customers";
    if (pathname.startsWith("/admin/products"))   return "products";
    if (pathname.startsWith("/admin/promotions")) return "promotions";
    if (pathname.startsWith("/admin/reports"))    return "reports";
    if (pathname.startsWith("/admin/components")) return "components";
    return "dashboard";
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
    const location = useLocation();
    const { pathname } = location;

    const isAuthPage    = ["/login", "/register", "/forgot"].includes(pathname);
    const isGuestPage   = pathname === "/guest";
    const isLandingPage = pathname === "/" || pathname === "/landing";
    const isMemberArea  = pathname.startsWith("/member");
    const isAdminArea   = pathname.startsWith("/admin");

    // activeSection diambil langsung dari URL (reactive)
    const sectionFromPath = getSectionFromPath(pathname);
    const [activeSection, setActiveSection] = useState(sectionFromPath);

    const [searchQuery, setSearchQuery] = useState("");
    const [menuItems, setMenuItems]     = useState(initialMenuItems);
    const [ordersData, setOrdersData]   = useState(orderRows);
    const [customersData, setCustomersData] = useState(customerRows);

    // ── Derived data ─────────────────────────────────────────
    const dashboardCards = useMemo(() => {
        const total     = ordersData.length;
        const delivered = ordersData.filter(o => o.status === "Delivered").length;
        const canceled  = ordersData.filter(o => o.status === "Canceled").length;
        const revenue   = ordersData.reduce((s, o) => s + (o.status === "Canceled" ? 0 : parseRupiah(o.total)), 0);
        return [
            { id: "orders",    icon: "cart",  value: String(total),           label: "Total Pesanan"    },
            { id: "delivered", icon: "truck", value: String(delivered),        label: "Total Terkirim" },
            { id: "canceled",  icon: "ban",   value: String(canceled),         label: "Total Dibatalkan"  },
            { id: "revenue",   icon: "money", value: formatRupiah(revenue),    label: "Total Pendapatan"   },
        ];
    }, [ordersData]);

    const filteredMenuItems = useMemo(() => menuItems, [menuItems]);

    const filteredDashboardCards = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (sectionFromPath !== "dashboard" || !q) return dashboardCards;
        return dashboardCards.filter(c => c.label.toLowerCase().includes(q));
    }, [sectionFromPath, dashboardCards, searchQuery]);

    const filteredOrders = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (sectionFromPath !== "orders" || !q) return ordersData;
        return ordersData.filter(o => [o.id, o.customer, o.item, o.status].join(" ").toLowerCase().includes(q));
    }, [sectionFromPath, ordersData, searchQuery]);

    const filteredCustomers = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (sectionFromPath !== "customers" || !q) return customersData;
        return customersData.filter(c => [c.id, c.name, c.email, c.city, c.tier].join(" ").toLowerCase().includes(q));
    }, [sectionFromPath, customersData, searchQuery]);

    // ── Handlers ─────────────────────────────────────────────
    function handleSectionChange(id) { setActiveSection(id); }
    function handleSearchChange(e)   { setSearchQuery(e.target.value); }

    function handleAddMenu() {
        const n = menuItems.filter(m => m.id.startsWith("menu-")).length + 1;
        setMenuItems(prev => [...prev, { id: `menu-${n}`, label: `Menu ${n}`, removable: true }]);
    }

    function handleRemoveMenu(id) {
        setMenuItems(prev => {
            const item = prev.find(m => m.id === id);
            if (!item?.removable) return prev;
            const next = prev.filter(m => m.id !== id);
            if (activeSection === id) setActiveSection(next[0]?.id ?? null);
            return next;
        });
    }

    function handleAddOrder(payload) {
        const id    = getNextId(ordersData);
        const total = formatRupiah(parseRupiah(payload.total));
        setOrdersData(prev => [{ id, customer: payload.customer.trim(), item: payload.item.trim(), total, status: payload.status }, ...prev]);
        setCustomersData(prev => {
            const name = payload.customer.trim().toLowerCase();
            const exists = prev.find(c => c.name.toLowerCase() === name);
            if (exists) return prev.map(c => c.name.toLowerCase() === name ? { ...c, totalOrder: c.totalOrder + 1 } : c);
            return [{ id: getNextId(prev), name: payload.customer.trim(), email: `${payload.customer.trim().replace(/\s+/g,"").toLowerCase()}@email.com`, totalOrder: 1, city: "Unknown", tier: "Bronze" }, ...prev];
        });
    }

    function handleEditOrder(payload) {
        setOrdersData(prev => prev.map(o => o.id === payload.id ? { ...o, customer: payload.customer.trim(), item: payload.item.trim(), total: formatRupiah(parseRupiah(payload.total)), status: payload.status } : o));
    }

    function handleDeleteOrder(id) { setOrdersData(prev => prev.filter(o => o.id !== id)); }

    function handleAddCustomer(payload) {
        setCustomersData(prev => [{ id: getNextId(prev), name: payload.name.trim(), email: payload.email.trim(), totalOrder: Number(payload.totalOrder || 0), city: payload.city.trim(), tier: payload.tier }, ...prev]);
    }

    function handleEditCustomer(payload) {
        setCustomersData(prev => prev.map(c => c.id === payload.id ? { ...c, name: payload.name.trim(), email: payload.email.trim(), city: payload.city.trim(), totalOrder: Number(payload.totalOrder || 0), tier: payload.tier } : c));
    }

    function handleDeleteCustomer(id) { setCustomersData(prev => prev.filter(c => c.id !== id)); }

    // ── Page meta ─────────────────────────────────────────────
    const PAGE_TITLES = { orders: "Pesanan", customers: "Pelanggan", products: "Produk", promotions: "Promosi", reports: "Laporan", components: "Komponen UI", dashboard: "Dasbor" };
    const PAGE_BREADCRUMBS = { orders: "Admin / Pesanan", customers: "Admin / Pelanggan", products: "Admin / Produk", promotions: "Admin / Promosi", reports: "Admin / Laporan", components: "Admin / Komponen UI", dashboard: "Admin / Dasbor" };

    const pageTitle      = PAGE_TITLES[sectionFromPath]      ?? "Dasbor";
    const pageBreadcrumb = PAGE_BREADCRUMBS[sectionFromPath] ?? "Admin / Dasbor";

    const isDashboardEmpty  = filteredDashboardCards.length === 0;
    const isOrdersEmpty     = filteredOrders.length === 0;
    const isCustomersEmpty  = filteredCustomers.length === 0;

    // ── Route rendering ───────────────────────────────────────

    // 1. Auth pages (login / register / forgot)
    if (isAuthPage) {
        return (
            <Suspense fallback={<div style={{ padding: "20px", color: "#888" }}>Loading...</div>}>
                <Routes>
                    <Route element={<AuthLayout />}>
                        <Route path="/login"    element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot"   element={<Forgot />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        );
    }

    // 2. Guest preview page
    if (isGuestPage) {
        return (
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/guest" element={<GuestPage />} />
                </Routes>
            </Suspense>
        );
    }

    // 3. Landing page (halaman utama publik, /, /landing)
    if (isLandingPage) {
        return (
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/"        element={<LandingPage />} />
                    <Route path="/landing" element={<LandingPage />} />
                </Routes>
            </Suspense>
        );
    }

    // 4. Member area (/member/*)
    if (isMemberArea) {
        return (
            <Suspense fallback={<Loading />}>
                <ProtectedRoute role="member">
                    <MemberLayout>
                        <Routes>
                            <Route path="/member"          element={<MemberHome />} />
                            <Route path="/member/pesanan"  element={<MemberPesanan />} />
                            <Route path="/member/promo"    element={<MemberPromo />} />
                            <Route path="/member/profil"   element={<MemberProfil />} />
                            <Route path="*"                element={<NotFound />} />
                        </Routes>
                    </MemberLayout>
                </ProtectedRoute>
            </Suspense>
        );
    }

    // 5. Admin area (/admin/*)
    if (isAdminArea) {
        return (
            <Suspense fallback={<Loading />}>
                <ProtectedRoute role="admin">
                    <MainLayout
                        activeSection={sectionFromPath}
                        menuItems={filteredMenuItems}
                        onMenuClick={handleSectionChange}
                        onAddMenu={handleAddMenu}
                        onRemoveMenu={handleRemoveMenu}
                        searchValue={searchQuery}
                        onSearchChange={handleSearchChange}
                        pageTitle={pageTitle}
                        pageBreadcrumb={pageBreadcrumb}
                    >
                        <Routes>
                            {/* Dashboard */}
                            <Route path="/admin" element={
                                <Dashboard
                                    activeSection={sectionFromPath}
                                    cards={filteredDashboardCards}
                                    orders={filteredOrders}
                                    customers={filteredCustomers}
                                    onAddOrder={handleAddOrder}
                                    onAddCustomer={handleAddCustomer}
                                    searchQuery={searchQuery}
                                    isEmpty={isDashboardEmpty}
                                    isOrdersEmpty={isOrdersEmpty}
                                    isCustomersEmpty={isCustomersEmpty}
                                />
                            } />

                            {/* Orders */}
                            <Route path="/admin/orders" element={
                                <Orders
                                    orders={filteredOrders}
                                    onAddOrder={handleAddOrder}
                                    onEditOrder={handleEditOrder}
                                    onDeleteOrder={handleDeleteOrder}
                                    isEmpty={isOrdersEmpty}
                                />
                            } />

                            {/* Customers */}
                            <Route path="/admin/customers" element={
                                <Customers
                                    customers={filteredCustomers}
                                    onAddCustomer={handleAddCustomer}
                                    onEditCustomer={handleEditCustomer}
                                    onDeleteCustomer={handleDeleteCustomer}
                                    isEmpty={isCustomersEmpty}
                                />
                            } />

                            {/* Products */}
                            <Route path="/admin/products/:id" element={<ProductDetail />} />
                            <Route path="/admin/products"     element={<Products />} />

                            {/* Promotions */}
                            <Route path="/admin/promotions/:id" element={<PromotionDetail />} />
                            <Route path="/admin/promotions"     element={<Promotions />} />

                            {/* Reports */}
                            <Route path="/admin/reports/:id" element={<ReportDetail />} />
                            <Route path="/admin/reports"     element={<Reports />} />

                            {/* Misc */}
                            <Route path="/admin/components" element={<UIComponents />} />
                            <Route path="/admin/debug"      element={<AdminDebug />} />
                            <Route path="*"                 element={<NotFound />} />
                        </Routes>
                    </MainLayout>
                </ProtectedRoute>
            </Suspense>
        );
    }

    // 6. Fallback 404
    return (
        <Suspense fallback={<Loading />}>
            <Routes>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
}
