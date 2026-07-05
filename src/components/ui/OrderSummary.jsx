/**
 * OrderSummary Component - Ringkasan pesanan / cart summary
 *
 * Props:
 * @param {Array} items - Array of { name, qty, price, image }
 * @param {number} deliveryFee - Biaya pengiriman
 * @param {string} promoCode - Kode promo yang dipakai
 * @param {number} discount - Nilai diskon
 * @param {function} onCheckout - Callback tombol checkout
 * @param {function} onRemoveItem - Callback hapus item
 * @param {function} onQtyChange - Callback ubah qty (id, newQty)
 */
export default function OrderSummary({
    items = [
        { id: "1", name: "Ayam Bakar Spesial", qty: 2, price: 45000 },
        { id: "2", name: "Es Teh Manis", qty: 3, price: 8000 },
    ],
    deliveryFee = 15000,
    promoCode = "",
    discount = 0,
    onCheckout,
    onRemoveItem,
    onQtyChange,
}) {
    const formatRupiah = (val) =>
        new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(val);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const total = subtotal + deliveryFee - discount;

    return (
        <div style={{
            backgroundColor: "#1e1e2e",
            borderRadius: "16px",
            padding: "24px",
            border: "1px solid rgba(255,255,255,0.06)",
            minWidth: "300px",
        }}>
            <h3 style={{ margin: "0 0 20px", fontSize: "17px", fontWeight: 700, color: "#fff" }}>
                🛒 Order Summary
            </h3>

            {/* Items */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                {items.length === 0 ? (
                    <p style={{ color: "#666", fontSize: "14px", textAlign: "center", padding: "20px 0" }}>
                        Keranjang kosong
                    </p>
                ) : items.map((item) => (
                    <div key={item.id} style={{
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "10px", backgroundColor: "#2d2d3d", borderRadius: "10px",
                    }}>
                        {/* Image placeholder */}
                        <div style={{
                            width: "44px", height: "44px", borderRadius: "8px",
                            backgroundColor: "#374151", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "20px",
                        }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px" }} /> : "🍽️"}
                        </div>

                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {item.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#ff6b35", fontWeight: 700, marginTop: "2px" }}>
                                {formatRupiah(item.price)}
                            </div>
                        </div>

                        {/* Qty controls */}
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <button type="button" onClick={() => onQtyChange?.(item.id, Math.max(1, item.qty - 1))}
                                style={{ width: "24px", height: "24px", borderRadius: "50%", border: "none", backgroundColor: "#374151", color: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                −
                            </button>
                            <span style={{ fontSize: "13px", fontWeight: 700, color: "#fff", minWidth: "16px", textAlign: "center" }}>{item.qty}</span>
                            <button type="button" onClick={() => onQtyChange?.(item.id, item.qty + 1)}
                                style={{ width: "24px", height: "24px", borderRadius: "50%", border: "none", backgroundColor: "#ff6b35", color: "#fff", cursor: "pointer", fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                +
                            </button>
                        </div>

                        {/* Remove */}
                        {onRemoveItem && (
                            <button type="button" onClick={() => onRemoveItem(item.id)}
                                style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "16px", padding: "0 4px" }}
                                aria-label="Remove item">
                                ✕
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* Price breakdown */}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <PriceLine label="Subtotal" value={formatRupiah(subtotal)} />
                <PriceLine label="Ongkir" value={formatRupiah(deliveryFee)} />
                {discount > 0 && <PriceLine label={`Diskon ${promoCode}`} value={`-${formatRupiah(discount)}`} valueColor="#10b981" />}
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "12px", marginTop: "4px" }}>
                    <PriceLine label="Total" value={formatRupiah(total)} bold />
                </div>
            </div>

            {/* Checkout button */}
            <button
                type="button"
                onClick={onCheckout}
                disabled={items.length === 0}
                style={{
                    width: "100%", marginTop: "20px",
                    backgroundColor: items.length === 0 ? "#374151" : "#ff6b35",
                    color: "white", border: "none",
                    padding: "14px", borderRadius: "10px",
                    fontWeight: 700, fontSize: "15px",
                    cursor: items.length === 0 ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                }}
                onMouseEnter={(e) => { if (items.length > 0) e.target.style.backgroundColor = "#e55a25"; }}
                onMouseLeave={(e) => { if (items.length > 0) e.target.style.backgroundColor = "#ff6b35"; }}
            >
                Checkout → {formatRupiah(total)}
            </button>
        </div>
    );
}

function PriceLine({ label, value, valueColor, bold }) {
    return (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: bold ? "15px" : "13px" }}>
            <span style={{ color: bold ? "#fff" : "#888", fontWeight: bold ? 700 : 400 }}>{label}</span>
            <span style={{ color: valueColor || (bold ? "#ff6b35" : "#fff"), fontWeight: bold ? 800 : 500 }}>{value}</span>
        </div>
    );
}
