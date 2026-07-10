function RecentConversationTable({
    conversations
}) {
    return (
        <div className="glass-panel rounded-3xl p-6 shadow-xl border border-white/30 overflow-hidden">
            <h2 className="text-sm font-extrabold text-purple-900 tracking-tight mb-5 uppercase tracking-wider">
                Recent Activity
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-b border-purple-200/20 text-slate-400 font-bold">
                            <th className="text-left pb-3 font-semibold">
                                Topic / Title
                            </th>
                            <th className="text-right pb-3 font-semibold">
                                Timestamp
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-purple-200/10">
                        {conversations.map((conversation) => (
                            <tr
                                key={conversation.id}
                                className="hover:bg-white/20 transition duration-150 text-slate-700"
                            >
                                <td className="py-3 font-semibold max-w-[200px] truncate pr-4">
                                    {conversation.title}
                                </td>
                                <td className="py-3 text-right text-slate-500 font-medium">
                                    {new Date(
                                        conversation.created_at
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentConversationTable;