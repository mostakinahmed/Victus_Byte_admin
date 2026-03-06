import React, { useState } from "react";
import { RotateCcw, Hash, Copy, CheckCircle, Printer } from "lucide-react";

const SerialGenerator = () => {
  const [serialNumbers, setSerialNumbers] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);

  const generateYearDaySafeSN = () => {
    const now = new Date();

    // 1. Year Part (e.g., "26")
    const year = now.getFullYear().toString().slice(-2);

    // 2. Day of Year Part (001 - 366)
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now - start;
    const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24))
      .toString()
      .padStart(3, "0");

    const newBatch = [];

    for (let i = 0; i < 15; i++) {
      // 3. Millisecond Part (Last 4 digits of current time)
      const msPart = (Date.now() % 10000).toString().padStart(4, "0");

      // 4. Random Part (6 digits)
      const randomPart = Math.floor(100000 + Math.random() * 900000);

      // Final Structure: SN + YY + DDD + MS + RANDOM
      // Example: SN26065401284565
      const fullSN = `SN${year}${dayOfYear}${msPart}${randomPart}`;
      newBatch.push(fullSN);
    }

    setSerialNumbers(newBatch);
  };

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const resetTable = () => {
    setSerialNumbers([]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-indigo-600 p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Hash size={24} /> Victus Byte Pro
              </h1>
              <p className="text-indigo-100 text-sm mt-1">
                Industrial Grade Serial Generator
              </p>
            </div>
            <button
              onClick={() => window.print()}
              className="p-2 bg-indigo-500 hover:bg-indigo-400 rounded-lg transition-colors"
              title="Print Table"
            >
              <Printer size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={generateYearDaySafeSN}
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg shadow-indigo-200 active:scale-[0.98]"
            >
              Generate 15 Unique SNs
            </button>

            <button
              onClick={resetTable}
              className="flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-600 font-semibold py-4 px-8 rounded-xl transition-all border border-slate-300"
            >
              <RotateCcw size={18} /> Reset
            </button>
          </div>

          {/* Result Table */}
          {serialNumbers.length > 0 ? (
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Index
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">
                      Serial Number
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {serialNumbers.map((sn, index) => (
                    <tr
                      key={index}
                      className="group hover:bg-indigo-50/50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-slate-400">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-mono text-lg font-semibold text-slate-700 tracking-wider">
                          {sn}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleCopy(sn, index)}
                          className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                            copiedIndex === index
                              ? "bg-green-100 text-green-700"
                              : "bg-slate-100 text-slate-600 hover:bg-indigo-100 hover:text-indigo-600"
                          }`}
                        >
                          {copiedIndex === index ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Copy size={14} />
                          )}
                          {copiedIndex === index ? "Copied" : "Copy"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-slate-200 rounded-2xl">
              <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="text-slate-300" size={32} />
              </div>
              <p className="text-slate-400 font-medium">
                Ready to produce stock? Click generate.
              </p>
            </div>
          )}
        </div>

        {/* Footer info for manual tracking */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 text-[10px] text-slate-400 text-center uppercase tracking-widest">
          Format: PREFIX + YEAR + DAY_OF_YEAR + MS_STAMP + RANDOM_UNIQ
        </div>
      </div>
    </div>
  );
};

export default SerialGenerator;
