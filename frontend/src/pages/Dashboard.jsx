import { useEffect, useState } from "react";

import { getDashboardStats } from "../services/analytics";

import GreetingCard from "../components/dashboard/GreetingCard";
import StatsCard from "../components/dashboard/StatsCard";
import InsightCard from "../components/dashboard/InsightCard";

import "../styles/dashboard.css";

export default function Dashboard() {

    const [stats, setStats] = useState(null);

    useEffect(() => {

        async function load(){

            try{

                const data = await getDashboardStats();

                setStats(data);

            }

            catch(error){

                console.error(error);

            }

        }

        load();

    }, []);

    if(!stats){

        return <h2>Loading Dashboard...</h2>;

    }

    return(

        <div className="dashboard">

            <GreetingCard/>

            <div className="stats-grid">

                <StatsCard

                    title="Productivity"

                    value={`${stats.productivity_score}%`}

                    icon="📈"

                />

                <StatsCard

                    title="Total Tasks"

                    value={stats.total_tasks}

                    icon="📋"

                />

                <StatsCard

                    title="Completed"

                    value={stats.completed_tasks}

                    icon="✅"

                />

                <StatsCard

                    title="Pending"

                    value={stats.pending_tasks}

                    icon="⏳"

                />

                <StatsCard

                    title="High Priority"

                    value={stats.high_priority_tasks}

                    icon="🔥"

                />

            </div>

            <InsightCard/>

        </div>

    );

}