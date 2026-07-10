import { useEffect, useState } from "react";

import Header from "../components/Header";
import DashboardHeader from "../components/admin/DashboardHeader";
import StatCard from "../components/admin/StatCard";
import DomainChart from "../components/admin/DomainChart";
import RecentConversationTable from "../components/admin/RecentConversationTable";

import { getDashboard }
from "../services/adminService";

import {
    getAnalyticsDashboard,
    getDomainUsage
}
from "../services/analyticsService";

import { useAuth }
from "../contexts/AuthContext";


function Dashboard() {

    const { currentUser } =
        useAuth();

    const [dashboard,
        setDashboard] =
        useState(null);

    const [analytics,
        setAnalytics] =
        useState(null);

    const [domainUsage,
        setDomainUsage] =
        useState([]);

    const [loading,
        setLoading] =
        useState(true);

    const loadData = async () => {
        try {
            const userIdentifier = currentUser.uid;

            const [
                dashboardData,
                analyticsData,
                domainData
            ] = await Promise.all([
                getDashboard(userIdentifier),
                getAnalyticsDashboard(userIdentifier),
                getDomainUsage(userIdentifier)
            ]);

            setDashboard(dashboardData);
            setAnalytics(analyticsData);
            setDomainUsage(domainData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (currentUser) {
            loadData();
        }
    }, [currentUser]);



    if (
        loading ||
        !analytics ||
        !dashboard
    ) {

        return (
            <div className="min-h-screen flex flex-col bg-transparent">
                <Header />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex items-center gap-3">
                        <svg className="animate-spin h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-600">Loading metrics...</span>
                    </div>
                </div>
            </div>
        );

    }


    return (
        <div className="min-h-screen flex flex-col bg-transparent pb-10">
            <Header />

            <main className="max-w-7xl w-full mx-auto px-6 py-8 flex-1">
                <DashboardHeader />

                {/* Stat Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        title="Total Conversations"
                        value={analytics.total_conversations}
                    />
                    <StatCard
                        title="Messages Processed"
                        value={analytics.total_messages}
                    />
                    <StatCard
                        title="Analytics Queries"
                        value={analytics.total_queries}
                    />
                    <StatCard
                        title="Trained Documents"
                        value={analytics.total_documents}
                    />
                </div>

                {/* Analytical Charts and Table */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    <div className="lg:col-span-6">
                        <DomainChart data={domainUsage} />
                    </div>
                    <div className="lg:col-span-6">
                        <RecentConversationTable conversations={dashboard.recent_conversations} />
                    </div>
                </div>
            </main>
        </div>
    );

}

export default Dashboard;