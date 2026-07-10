import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid
} from "recharts";

function DomainChart({ data }) {
    // Map domain display names
    const chartData = data.map(item => ({
        ...item,
        domain: item.domain.replace("_documents", "").toUpperCase()
    }));

    return (
        <div className="glass-panel rounded-3xl p-6 shadow-xl border border-white/30">
            <h2 className="text-sm font-extrabold text-purple-900 tracking-tight mb-5 uppercase tracking-wider">
                Documents by Domain
            </h2>

            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.2)" />
                    <XAxis 
                        dataKey="domain" 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                    />
                    <YAxis 
                        stroke="#64748b" 
                        fontSize={10} 
                        tickLine={false} 
                    />
                    <Tooltip 
                        contentStyle={{ 
                            background: "rgba(255, 255, 255, 0.8)", 
                            backdropFilter: "blur(8px)",
                            border: "1px solid rgba(255, 255, 255, 0.4)",
                            borderRadius: "12px",
                            fontSize: "11px",
                            color: "#1e293b"
                        }} 
                    />
                    <Bar
                        dataKey="count"
                        fill="#9b51e0"
                        radius={[4, 4, 0, 0]}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default DomainChart;