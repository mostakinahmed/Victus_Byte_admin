import React, { useState } from "react";
import {
  FiX,
  FiPackage,
  FiTruck,
  FiCreditCard,
  FiSave,
  FiLock,
  FiHash,
} from "react-icons/fi";

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
    setFormData({ ...formData, items: updatedItems });
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-0 sm:p-4">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-5xl h-full sm:h-auto max-h-screen sm:max-h-[90vh]  rounded shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 sticky top-0 z-10">
          <div className="min-w-0">
            <h2 className="text-lg sm:text-xl font-black text-slate-800 uppercase tracking-tighter truncate">
              Update{" "}
              <span className="text-indigo-600">#{formData.order_id}</span>
            </h2>
            <p className="text-[12px] font-bold text-slate-400 uppercase tracking-widest">
              Victus Byte Command Center
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2.5 bg-white border border-slate-300 rounded-xl text-slate-600 hover:text-rose-500 transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:px-8 space-y-8 custom-scrollbar pb-32 sm:pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {/* 1. SHIPPING & RECIPIENT */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <FiTruck /> Shipping & Recipient
              </h3>
              <div className="grid grid-cols-1 gap-3 bg-slate-200 md:p-5 p-2 rounded border border-slate-100">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase ml-1">
                    Recipient Name
                  </label>
                  <input
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none"
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
                <div className="grid grid-cols-2 gap-3">
                  <input
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none"
                    placeholder="Phone"
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
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none"
                    placeholder="Email"
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
                <textarea
                  rows="2"
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm font-bold outline-none resize-none"
                  value={formData.shipping_address.address_line1}
                  onChange={(e) =>
                    handleNestedChange(
                      "shipping_address",
                      "address_line1",
                      e.target.value,
                    )
                  }
                />
              </div>
            </div>

            {/* 2. COURIER & FINANCE */}
            <div className="space-y-4">
              <h3 className="text-[11px] font-black text-emerald-600 uppercase tracking-[0.2em] flex items-center gap-2">
                <FiCreditCard /> Logistics & Finance
              </h3>
              <div className="md:p-6 p-3 bg-slate-900 rounded text-white space-y-4 shadow-xl">
                {/* Editable Delivery Charge */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Delivery Charge
                  </span>
                  <div className="flex items-center gap-1 w-[130px] justify-end">
                    <span className="text-[15px] font-bold text-slate-500">
                      ৳
                    </span>
                    <input
                      type="number"
                      className="bg-transparent border-b border-indigo-500/50 w-16 text-center text-indigo-400 font-black outline-none focus:border-indigo-400 transition-colors"
                      value={formData.courier.delivery_charge}
                      onChange={(e) =>
                        handleNestedChange(
                          "courier",
                          "delivery_charge",
                          Number(e.target.value),
                        )
                      }
                    />
                  </div>
                </div>

                {/* Delivery Status Dropdown */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Delivery Status
                  </span>
                  <select
                    value={formData.courier.delivery_status}
                    onChange={(e) =>
                      handleNestedChange(
                        "courier",
                        "delivery_status",
                        e.target.value,
                      )
                    }
                    className="bg-transparent border-none text-[12px] font-black uppercase text-indigo-400 outline-none w-[130px] text-right cursor-pointer"
                  >
                    <option className="bg-slate-900" value="Pending">
                      Pending
                    </option>
                    <option className="bg-slate-900" value="Confirmed">
                      Confirmed
                    </option>
                    <option className="bg-slate-900" value="Delivered">
                      Delivered
                    </option>
                    <option className="bg-slate-900" value="Returned">
                      Returned
                    </option>
                    <option className="bg-slate-900" value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </div>

                {/* Cash Status Dropdown */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Payment Status
                  </span>
                  <select
                    value={formData.courier.cash_status}
                    onChange={(e) =>
                      handleNestedChange(
                        "courier",
                        "cash_status",
                        e.target.value,
                      )
                    }
                    className="bg-transparent border-none text-[12px] font-black uppercase text-emerald-400 outline-none w-[130px] text-right cursor-pointer"
                  >
                    <option className="bg-slate-900" value="Pending">
                      Pending
                    </option>
                    <option className="bg-slate-900" value="Paid">
                      Paid
                    </option>
                    <option className="bg-slate-900" value="Processing">
                      Processing
                    </option>
                  </select>
                </div>

                {/* Payout Method Dropdown */}
                <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Payment Method
                  </span>
                  <select
                    value={formData.courier.payment_method}
                    onChange={(e) =>
                      handleNestedChange(
                        "courier",
                        "payment_method",
                        e.target.value,
                      )
                    }
                    className="bg-transparent border-none text-[12px] font-black uppercase text-amber-400 outline-none w-[130px] text-right cursor-pointer"
                  >
                    <option className="bg-slate-900" value="N/A">
                      N/A
                    </option>
                    <option className="bg-slate-900" value="bKash">
                      bKash
                    </option>
                    <option className="bg-slate-900" value="Nagad">
                      Nagad
                    </option>
                    <option className="bg-slate-900" value="Rocket">
                      Rocket
                    </option>
                    <option className="bg-slate-900" value="Bank">
                      Bank Transfer
                    </option>
                    <option className="bg-slate-900" value="Cash">
                       Cash
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ITEMS */}
          <div className="space-y-4">
            <h3 className="text-[11px] font-black text-orange-500 uppercase tracking-[0.2em] flex items-center gap-2">
              <FiPackage /> Product Specification
            </h3>
            <div className="overflow-x-auto rounded-[24px] border border-slate-100 bg-white shadow-sm">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-slate-50">
                  <tr className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <th className="p-4">Product</th>
                    <th className="p-4">SKU / Serial</th>
                    <th className="p-4">IMEI Hub</th>
                    <th className="p-4">Variation</th>
                    <th className="p-4 text-right">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {formData.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <FiLock className="text-slate-300" size={10} />
                          <p className="font-bold text-slate-800 text-xs truncate max-w-[150px]">
                            {item.product_name}
                          </p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="relative">
                          <FiHash
                            className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-300"
                            size={10}
                          />
                          <input
                            className="w-full pl-6 pr-2 py-2 bg-indigo-50/50 border border-indigo-100 rounded-lg text-[12px]  font-bold text-indigo-700 outline-none"
                            value={item.skuID}
                            onChange={(e) =>
                              updateItem(idx, "skuID", e.target.value)
                            }
                          />
                        </div>
                      </td>
                      <td className="p-4">
                        <input
                          className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold outline-none"
                          value={item.imei}
                          placeholder="IMEI"
                          onChange={(e) =>
                            updateItem(idx, "imei", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4">
                        <input
                          className="w-full p-2 bg-slate-50 border border-slate-100 rounded-lg text-[11px] font-bold outline-none"
                          value={item.product_comments}
                          placeholder="Variation"
                          onChange={(e) =>
                            updateItem(idx, "product_comments", e.target.value)
                          }
                        />
                      </td>
                      <td className="p-4 text-right font-black text-slate-900 text-xs">
                        ৳{item.product_price}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-6 bg-white border-t border-slate-100 flex justify-between items-center sticky bottom-0">
          <div className="text-left">
            <p className="text-[10px] font-black text-slate-400 uppercase">
              Final Total
            </p>
            <p className="text-xl font-black text-slate-900 italic">
              ৳{formData.total_amount}
            </p>
          </div>
          <button
            onClick={() => onSave(formData)}
            className="flex items-center gap-2 bg-slate-900 text-white px-10 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
          >
            <FiSave size={16} /> Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderEditModal;
