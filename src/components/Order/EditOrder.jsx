import React, { useState } from "react";
import {
  FiX,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiSave,
  FiLock,
  FiEdit3,
  FiHash,
} from "react-icons/fi";
import toast from "react-hot-toast";

const OrderEditModal = ({ order, onClose, onSave }) => {
  const [formData, setFormData] = useState({ ...order });

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;

    // Recalculate totals if quantity or price changes
    updatedItems[index].subtotal =
      updatedItems[index].quantity * (updatedItems[index].product_price || 0);
    const newSubtotal = updatedItems.reduce(
      (acc, item) => acc + item.subtotal,
      0,
    );
    const newTotal = newSubtotal + (Number(formData.shipping_cost) || 0);

    setFormData({ ...formData, items: updatedItems, total_amount: newTotal });
  };



  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-5xl h-full sm:h-auto max-h-screen sm:max-h-[90vh] rounded-none sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom sm:zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter truncate">
              Update{" "}
              <span className="text-indigo-600">#{formData.order_id}</span>
            </h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
              {formData.order_date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-600 hover:text-rose-500 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Scrollable Form */}
        <form className="flex-1 overflow-y-auto p-4 sm:px-8 space-y-8 custom-scrollbar pb-32 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* --- SHIPPING & LOGISTICS --- */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <FiTruck /> Logistics Handshake
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase ml-1 tracking-widest">
                    Recipient Name
                  </label>
                  <input
                    className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 outline-none"
                    value={formData.shipping_address.recipient_name}
                    onChange={(e) =>
                      handleNestedChange(
                        "shipping_address",
                        "recipient_name",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <input
                  placeholder="Phone"
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
                  value={formData.shipping_address.phone}
                  onChange={(e) =>
                    handleNestedChange(
                      "shipping_address",
                      "phone",
                      e.target.value,
                    )
                  }
                />
                <input
                  placeholder="Email"
                  className="w-full p-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-bold outline-none"
                  value={formData.shipping_address.email}
                  onChange={(e) =>
                    handleNestedChange(
                      "shipping_address",
                      "email",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>

            {/* --- STATUS & FINANCE --- */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <FiCreditCard /> Finance & Flow
              </h3>
              <div className="p-5 bg-slate-900 rounded-[28px] text-white space-y-4 shadow-xl">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Delivery Status
                  </span>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="bg-white/10 border-none text-[11px] font-black uppercase rounded-lg px-3 py-1.5 text-white"
                  >
                    <option className="bg-slate-900" value="Pending">
                      Pending
                    </option>
                    <option className="bg-slate-900" value="Completed">
                      Completed
                    </option>
                    <option className="bg-slate-900" value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                    Shipping Fee (৳)
                  </span>
                  <input
                    type="number"
                    className="w-20 text-right bg-transparent border-b border-white/20 outline-none font-bold text-sm"
                    value={formData.shipping_cost}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        shipping_cost: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          {/* --- ITEMS SECTION (SKU EDITABLE) --- */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiPackage /> Inventory Link
            </h3>
            <div className="overflow-x-auto rounded-[24px] border border-slate-100 bg-white">
              <table className="w-full text-left min-w-[850px]">
                <thead className="bg-slate-50">
                  <tr className="text-[11px] font-black text-slate-400 uppercase">
                    <th className="p-4">Item Name</th>
                    <th className="p-4">SKU / SN</th>
                    <th className="p-4">IMEI - Mobile</th>
                    <th className="p-4">Comment</th>
                    <th className="p-4 w-20">Qty</th>
                    <th className="p-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {formData.items.map((item, idx) => (
                    <tr key={idx} className="group">
                      {/* Product Name (Locked) */}
                      <td className="p-4 bg-slate-50/30">
                        <div className="flex items-center gap-2">
                          <FiLock className="text-slate-300" size={10} />
                          <p className="font-black text-slate-800 text-xs truncate max-w-[120px]">
                            {item.product_name}
                          </p>
                        </div>
                      </td>

                      {/* SKU ID (EDITABLE) */}
                      <td className="p-4">
                        <div className="relative group/input">
                          <FiHash
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300"
                            size={10}
                          />
                          <input
                            className="w-full pl-6 pr-2 py-2 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[12px] font-mono font-bold text-indigo-700 outline-none focus:ring-1 focus:ring-indigo-500"
                            value={item.skuID}
                            onChange={(e) =>
                              updateItem(idx, "skuID", e.target.value)
                            }
                          />
                        </div>
                      </td>

                      {/* IMEI Number */}
                      <td className="p-4">
                        <input
                          placeholder="IMEI Number"
                          className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-bold outline-none focus:border-orange-500"
                          value={item.imei}
                          onChange={(e) =>
                            updateItem(idx, "imei", e.target.value)
                          }
                        />
                      </td>

                      {/* Specs / Comments */}
                      <td className="p-4">
                        <input
                          placeholder="8/256GB"
                          className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-[12px] font-bold outline-none"
                          value={item.product_comments}
                          onChange={(e) =>
                            updateItem(idx, "product_comments", e.target.value)
                          }
                        />
                      </td>

                      {/* Quantity */}
                      <td className="p-4 text-center">
                        <input
                          type="number"
                          className="w-full p-2 bg-slate-50 rounded-lg text-center font-bold text-xs"
                          value={item.quantity}
                          onChange={(e) =>
                            updateItem(
                              idx,
                              "quantity",
                              parseInt(e.target.value) || 0,
                            )
                          }
                        />
                      </td>

                      {/* Total */}
                      <td className="p-4 text-right font-black text-slate-900 text-xs">
                        ৳{item.subtotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="p-4 sm:p-8 bg-white border-t border-slate-100 flex justify-between items-center sticky bottom-0">
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Final Amount
            </p>
            <p className="text-xl sm:text-2xl font-black text-slate-900 italic leading-none">
              ৳{formData.total_amount}
            </p>
          </div>
          <button
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            <FiSave size={16} /> Sync Command
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderEditModal;
