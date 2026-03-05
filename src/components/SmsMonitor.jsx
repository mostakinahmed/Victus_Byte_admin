import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, AlertCircle, CheckCircle2, Zap } from "lucide-react";
import { toast } from "react-hot-toast";

const SmsMonitor = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    try {
      const res = await axios.get("https://api.victusbyte.com/api/sms-log");
      setLogs(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
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

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading)
    return (
      <div className="p-10 text-center text-slate-400 animate-pulse font-mono text-xs">
        INITIALIZING FEED...
      </div>
    );

  return (
    <div className="w-full max-w-2xl mt-4 bg-[#0f172a] rounded-lg border border-slate-800 shadow-xl overflow-hidden font-sans">
      {/* Header */}
      <div className="flex justify-between items-center px-4 py-2.5 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-yellow-400 fill-yellow-400" />
          <h3 className="text-[11px] font-black tracking-widest text-slate-200 uppercase">
            SMS Live Feed
          </h3>
          <span className="bg-slate-800 text-slate-400 text-[9px] px-1.5 py-0.5 rounded-md border border-slate-700">
            {logs.length}
          </span>
        </div>
        <button
          onClick={clearLogs}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-md transition-all"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* FIXED HEIGHT SCROLLABLE CONTAINER */}
      <div className="h-[300px] overflow-y-auto overflow-x-hidden custom-scrollbar bg-slate-950/20">
        {logs.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
            <Zap size={24} className="opacity-20" />
            <p className="text-[10px] uppercase tracking-widest">
              No active logs detected
            </p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse table-fixed">
            <thead className="sticky top-0 z-10 bg-slate-800 text-[10px] text-slate-500 uppercase font-black shadow-sm">
              <tr>
                <th className="p-3 pl-4 w-[40%]">Phone / ID</th>
                <th className="p-3 w-[40%]">Result</th>
                <th className="p-3 text-right pr-4 w-[20%]">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 overflow-x-auto whitespace-nowrap">
              {logs.map((log) => {
                const isSuccess = log.response_code === 202;
                return (
                  <tr
                    key={log._id}
                    className="group hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3 pl-4">
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-slate-200">
                          {log.phoneNumber}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 truncate uppercase">
                          {log.type} • {log.message_id || "ERR"}
                        </span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        {isSuccess ? (
                          <CheckCircle2
                            size={12}
                            className="text-green-500/80"
                          />
                        ) : (
                          <AlertCircle
                            size={12}
                            className="text-red-500 animate-pulse"
                          />
                        )}
                        <span
                          className={`text-[12px] font-mono font-bold ${isSuccess ? "text-green-500/80" : "text-red-400"}`}
                        >
                          {log.response_code}
                        </span>
                        {!isSuccess && log.error_message && (
                          <span
                            className="text-[12px] text-red-300 truncate -w-[250px]"
                            title={log.error_message}
                          >
                            {log.error_message}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3 text-right pr-4">
                      <span className="text-[12px] text-slate-300 font-mono">
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

      {/* Footer */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-900/50 flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
          <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">
            Stream Active
          </span>
        </div>
        <span className="text-[9px] text-slate-700 font-mono italic">
          v1.0.4-stable
        </span>
      </div>
    </div>
  );
};

export default SmsMonitor;
