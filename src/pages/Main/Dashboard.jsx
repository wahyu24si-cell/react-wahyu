import { createElement, useState } from "react";
import { FaShoppingCart, FaTruck, FaBan, FaDollarSign } from "react-icons/fa";

// Kartu ringkasan dashboard untuk menampilkan statistik utama.
function StatCard({ id, icon: Icon, value, label }) {
    return (
        <div
            id={
                id === "orders"
                    ? "dashboard-orders"
                    : id === "delivered"
                      ? "dashboard-delivered"
                      : id === "canceled"
                        ? "dashboard-canceled"
                        : "dashboard-revenue"
            }
        >
            <div className="stat-icon">{createElement(Icon)}</div>
            <div className="stat-info"> 
                <span className="stat-count">{value}</span>
                <span className="stat-label">{label}</span>
            </div>
        </div>
    );
}

// Dashboard menampilkan kartu statistik yang bisa difilter dari search.
export default function Dashboard({
    activeSection,
    cards,
    orders,
    customers,
    onAddOrder,
    onAddCustomer,
    searchQuery,
    isEmpty,
    isOrdersEmpty,
    isCustomersEmpty,
}) {
    // State form untuk menambah order dari halaman Orders.
    const [orderForm, setOrderForm] = useState({
        customer: "",
        item: "",
        total: "",
        status: "Preparing",
    });

    // State form untuk menambah customer dari halaman Customers.
    const [customerForm, setCustomerForm] = useState({
        name: "",
        email: "",
        city: "",
        totalOrder: "",
        tier: "Bronze",
    });

    // Mapping icon untuk kartu ringkasan pada halaman Dashboard.
    const iconMap = {
        cart: FaShoppingCart,
        truck: FaTruck,
        ban: FaBan,
        money: FaDollarSign,
    };

    // Menentukan class status agar badge order punya warna yang berbeda.
    function getOrderStatusClass(status) {
        if (status === "Delivered") return "order-status delivered";
        if (status === "On Delivery") return "order-status on-delivery";
        if (status === "Preparing") return "order-status preparing";
        return "order-status canceled";
    }

    // Menentukan class tier agar badge customer lebih informatif.
    function getTierClass(tier) {
        if (tier === "Platinum") return "customer-tier platinum";
        if (tier === "Gold") return "customer-tier gold";
        if (tier === "Silver") return "customer-tier silver";
        return "customer-tier bronze";
    }

    // Menangani submit form order baru.
    function handleSubmitOrder(event) {
        event.preventDefault();

        if (!orderForm.customer.trim() || !orderForm.item.trim() || !orderForm.total.trim()) {
            return;
        }

        onAddOrder(orderForm);
        setOrderForm({
            customer: "",
            item: "",
            total: "",
            status: "Preparing",
        });
    }

    // Menangani submit form customer baru.
    function handleSubmitCustomer(event) {
        event.preventDefault();

        if (!customerForm.name.trim() || !customerForm.email.trim() || !customerForm.city.trim()) {
            return;
        }

        onAddCustomer(customerForm);
        setCustomerForm({
            name: "",
            email: "",
            city: "",
            totalOrder: "",
            tier: "Bronze",
        });
    }

    if (activeSection === "orders") {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div className="panel-title">Pesanan Terbaru</div>
                    <form className="quick-add-form" onSubmit={handleSubmitOrder} noValidate>
                        <input
                            type="text"
                            placeholder="Nama pelanggan"
                            aria-label="Nama pelanggan"
                            value={orderForm.customer}
                            onChange={(event) =>
                                setOrderForm((current) => ({ ...current, customer: event.target.value }))
                            }
                            required
                        />
                        <input
                            type="text"
                            placeholder="Nama menu"
                            aria-label="Nama menu"
                            value={orderForm.item}
                            onChange={(event) =>
                                setOrderForm((current) => ({ ...current, item: event.target.value }))
                            }
                            required
                        />
                        <input
                            type="text"
                            placeholder="Total (contoh: 78000)"
                            aria-label="Total"
                            value={orderForm.total}
                            onChange={(event) =>
                                setOrderForm((current) => ({ ...current, total: event.target.value }))
                            }
                            required
                        />
                        <select
                            aria-label="Status pesanan"
                            value={orderForm.status}
                            onChange={(event) =>
                                setOrderForm((current) => ({ ...current, status: event.target.value }))
                            }
                        >
                            <option value="Preparing">Diproses</option>
                            <option value="On Delivery">Dalam Pengiriman</option>
                            <option value="Delivered">Terkirim</option>
                            <option value="Canceled">Dibatalkan</option>
                        </select>
                        <button type="submit">Tambah Pesanan</button>
                    </form>
                    {isOrdersEmpty ? (
                        <div id="dashboard-empty-state">
                            Tidak ada pesanan untuk <b>{searchQuery}</b>
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="panel-table">
                                <thead>
                                    <tr>
                                        <th>ID Pesanan</th>
                                        <th>Pelanggan</th>
                                        <th>Menu</th>
                                        <th>Total</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td>{order.id}</td>
                                            <td>{order.customer}</td>
                                            <td>{order.item}</td>
                                            <td>{order.total}</td>
                                            <td>
                                                <span className={getOrderStatusClass(order.status)}>{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    if (activeSection === "customers") {
        return (
            <div id="dashboard-container">
                <div className="panel-card">
                    <div className="panel-title">Pelanggan</div>
                    <form className="quick-add-form" onSubmit={handleSubmitCustomer} noValidate>
                        <input
                            type="text"
                            placeholder="Nama pelanggan"
                            aria-label="Nama pelanggan"
                            value={customerForm.name}
                            onChange={(event) =>
                                setCustomerForm((current) => ({ ...current, name: event.target.value }))
                            }
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            aria-label="Email"
                            value={customerForm.email}
                            onChange={(event) =>
                                setCustomerForm((current) => ({ ...current, email: event.target.value }))
                            }
                            required
                        />
                        <input
                            type="text"
                            placeholder="Kota"
                            aria-label="Kota"
                            value={customerForm.city}
                            onChange={(event) =>
                                setCustomerForm((current) => ({ ...current, city: event.target.value }))
                            }
                            required
                        />
                        <input
                            type="number"
                            min="0"
                            placeholder="Total pesanan"
                            aria-label="Total pesanan"
                            value={customerForm.totalOrder}
                            onChange={(event) =>
                                setCustomerForm((current) => ({ ...current, totalOrder: event.target.value }))
                            }
                        />
                        <select
                            aria-label="Tingkat pelanggan"
                            value={customerForm.tier}
                            onChange={(event) =>
                                setCustomerForm((current) => ({ ...current, tier: event.target.value }))
                            }
                        >
                            <option value="Bronze">Perunggu</option>
                            <option value="Silver">Perak</option>
                            <option value="Gold">Emas</option>
                            <option value="Platinum">Platinum</option>
                        </select>
                        <button type="submit">Tambah Pelanggan</button>
                    </form>
                    {isCustomersEmpty ? (
                        <div id="dashboard-empty-state">
                            Tidak ada pelanggan untuk <b>{searchQuery}</b>
                        </div>
                    ) : (
                        <div className="customers-grid">
                            {customers.map((customer) => (
                                <article key={customer.id} className="customer-card">
                                    <div className="customer-head">
                                        <div>
                                            <p className="customer-name">{customer.name}</p>
                                            <p className="customer-email">{customer.email}</p>
                                        </div>
                                        <span className={getTierClass(customer.tier)}>{customer.tier}</span>
                                    </div>
                                    <div className="customer-meta">
                                        <span>{customer.id}</span>
                                        <span>{customer.city}</span>
                                        <span>{customer.totalOrder} Pesanan</span>
                                    </div>
                                </article>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div id="dashboard-container">
            <div id="dashboard-grid">
                {isEmpty ? (
                    <div id="dashboard-empty-state">
                        Tidak ada hasil untuk <b>{searchQuery}</b>
                    </div>
                ) : (
                    cards.map((card) => (
                        <StatCard
                            key={card.id}
                            id={card.id}
                            icon={iconMap[card.icon]}
                            value={card.value}
                            label={card.label}
                        />
                    ))
                )}
            </div>

            <div id="dashboard-secondary-grid">
                <div className="panel-card">
                    <div className="panel-title">Pesanan Terbaru</div>
                    <div className="table-wrapper">
                        <table className="panel-table">
                            <thead>
                                <tr>
                                    <th>ID Pesanan</th>
                                    <th>Pelanggan</th>
                                    <th>Menu</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((order) => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.customer}</td>
                                        <td>{order.item}</td>
                                        <td>
                                            <span className={getOrderStatusClass(order.status)}>{order.status}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="panel-card">
                    <div className="panel-title">Aktivitas Pelanggan</div>
                    <div id="dashboard-activity-list">
                        {customers.slice(0, 4).map((customer) => (
                            <div key={customer.id} className="dashboard-activity-item">
                                <div>
                                    <div className="dashboard-activity-title">{customer.name}</div>
                                    <div className="dashboard-activity-meta">
                                        {customer.city} · {customer.tier}
                                    </div>
                                </div>
                                <div className="dashboard-activity-value">{customer.totalOrder} pesanan</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}