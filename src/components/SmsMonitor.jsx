import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Trash2,
  AlertCircle,
  CheckCircle2,
  Zap,
  RefreshCw,
} from "lucide-react";
import { toast } from "react-hot-toast";

const SmsMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isLoading, setIsLoading] = useState(false);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      // Your API call logic here
      fetchLogs();
    } finally {
      // Slight delay so the user sees the spin
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  const clearLogs = async () => {
    if (!window.confirm("Clear all logs?")) return;
    try {
      await axios.delete("https://api.victusbyte.com/api/sms-log/clear");
      setLogs([]);
      toast.success("Logs cleared");
    } catch (err) {
      toast.error("Failed to clear");
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await axios.get("https://api.victusbyte.com/api/sms-log");
      setLogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-slate-400 animate-pulse">
        Syncing...
      </div>
    );

  return (
    <div className="w-full max-w-2xl mt-4 h-[375px] bg-[#0f172a] rounded border border-slate-800 shadow-xl overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-3 border-b border-slate-800 bg-slate-900/50">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-400 fill-yellow-400" />
          <h3 className="text-sm font-bold tracking-wider text-slate-200 uppercase">
            SMS Feed
          </h3>
          <span className="bg-slate-800 text-slate-400 text-[10px] px-2 py-0.5 rounded-full">
            {logs.length}
          </span>
        </div>

        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 rounded-full hover:bg-gray-100 cursor-pointer transition-colors disabled:opacity-50"
          aria-label="Refresh data"
        >
          <RefreshCw
            size={22}
            className={`text-blue-600 ${isLoading ? "animate-spin" : ""}`}
          />
        </button>

        <button
          onClick={clearLogs}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded transition-all"
          title="Clear Monitor"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Table Body */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
        {logs.length === 0 ? (
          <div className="p-10 text-center text-slate-600 text-xs">
            No active logs
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead className="sticky top-0 bg-slate-800 text-[10px] text-slate-500 uppercase font-black">
              <tr>
                <th className="p-3 pl-4">Phone / ID</th>
                <th className="p-3">Result</th>
                <th className="p-3 text-right pr-4">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {logs.map((log) => {
                const isSuccess = log.response_code === 202;
                return (
                  <tr
                    key={log._id}
                    className="group hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="p-3 pl-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-200">
                          {log.phoneNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-tighter">
                          {log.type} • ID:{log.message_id || "ERR"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isSuccess ? (
                          <CheckCircle2 size={14} className="text-green-500" />
                        ) : (
                          <AlertCircle
                            size={14}
                            className="text-red-500 animate-pulse"
                          />
                        )}
                        <span
                          className={`text-[12px] font-bold ${isSuccess ? "text-green-500/80" : "text-red-400"}`}
                        >
                          {log.response_code}
                        </span>
                        {!isSuccess && (
                          <span
                            className="text-[11px] text-red-300/60 max-w-[210px] truncate"
                            title={log.error_message}
                          >
                            {log.error_message}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right pr-4">
                      <span className="text-[12px] text-slate-500 font-mono">
                        {new Date(log.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer Info */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            Live Syncing
          </span>
        </div>
        <span className="text-[9px] text-slate-600 font-mono">
          Victus Byte v1.0
        </span>
      </div>
    </div>
  );
};

export default SmsMonitor;
