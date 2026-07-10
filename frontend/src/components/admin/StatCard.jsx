function StatCard({
    title,
    value
}) {
    return (
        <div className="glass-panel rounded-2xl p-6 shadow-md border border-white/30 flex flex-col justify-between">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                {title}
            </h3>
            <p className="text-3.5xl font-extrabold mt-4 bg-gradient-to-r from-purple-700 to-indigo-600 bg-clip-text text-transparent">
                {value}
            </p>
        </div>
    );
}

export default StatCard;