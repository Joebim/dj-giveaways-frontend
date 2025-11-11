import React from "react";
import { Link } from "react-router-dom";
import { FaGift, FaClipboardList, FaTrophy, FaUsers } from "react-icons/fa";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { competitionService, adminService } from "../../../services";

const Dashboard: React.FC = () => {
  const {
    data: competitionsData,
    isLoading: isLoadingCompetitions,
    isError: isCompetitionsError,
  } = useQuery({
    queryKey: ["admin", "competitions", "summary"],
    queryFn: () => competitionService.getAdminCompetitions({ page: 1, limit: 50 }),
    staleTime: 60_000,
  });

  const {
    data: drawsData,
    isLoading: isLoadingDraws,
    isError: isDrawsError,
  } = useQuery({
    queryKey: ["admin", "draws", "recent"],
    queryFn: () => adminService.getDraws({ page: 1, limit: 10 }),
    staleTime: 60_000,
  });

  const {
    data: championsData,
    isLoading: isLoadingChampions,
    isError: isChampionsError,
  } = useQuery({
    queryKey: ["admin", "champions", "summary"],
    queryFn: () => adminService.getChampions({ page: 1, limit: 50 }),
    staleTime: 60_000,
  });

  const {
    data: usersData,
    isLoading: isLoadingUsers,
    isError: isUsersError,
  } = useQuery({
    queryKey: ["admin", "users", "summary"],
    queryFn: () => adminService.getUsersSummary({ limit: 200 }),
    staleTime: 60_000,
  });

  if (isCompetitionsError) {
    console.error("Failed to load competitions summary");
  }
  if (isDrawsError) {
    console.error("Failed to load draws summary");
  }
  if (isChampionsError) {
    console.error("Failed to load champions summary");
  }
  if (isUsersError) {
    console.error("Failed to load users summary");
  }

  const competitions = competitionsData?.competitions ?? [];
  const draws = drawsData?.draws ?? [];
  const champions = championsData?.champions ?? [];
  const usersCount = usersData?.total ?? usersData?.users?.length ?? 0;

  const activeCompetitions = competitions.filter((c) => c.status === "active").length;
  const totalRevenue = competitions.reduce((sum, competition) => {
    return sum + competition.soldTickets * competition.ticketPrice;
  }, 0);

  const stats = [
    {
      title: "Total Competitions",
      value: isLoadingCompetitions ? "—" : competitions.length.toString(),
      icon: FaGift,
      link: "/admin/competitions",
    },
    {
      title: "Total Draws",
      value: isLoadingDraws ? "—" : draws.length.toString(),
      icon: FaClipboardList,
      link: "/admin/draws",
    },
    {
      title: "Champions",
      value: isLoadingChampions ? "—" : champions.length.toString(),
      icon: FaTrophy,
      link: "/admin/champions",
    },
    {
      title: "Total Users",
      value: isLoadingUsers ? "—" : usersCount.toString(),
      icon: FaUsers,
      link: "/admin/users",
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl font-light text-white mb-2 gold-text-glow">
          Admin Dashboard
        </h1>
        <p className="text-white/60 text-sm font-light uppercase tracking-wider">
          Welcome to the DJ Giveaways admin panel
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <Link
              to={stat.link}
              className="block bg-black border border-gold-primary/20 rounded-lg p-3 hover:border-gold-primary/50 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-lg bg-gold-primary/10 border border-gold-primary/30 flex items-center justify-center group-hover:bg-gold-primary/20 transition-all duration-300">
                  <stat.icon className="w-4 h-4 text-gold-primary" />
                </div>
              </div>
              <h3 className="text-white/60 text-xs font-light uppercase tracking-wider">
                {stat.title}
              </h3>
              <p className="text-2xl md:text-3xl font-light text-gold-primary group-hover:scale-105 transition-transform duration-300">
                {stat.value}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-black border border-gold-primary/20 rounded-lg p-6"
        >
          <h3 className="text-white/60 text-xs font-light uppercase tracking-wider mb-2">
            Active Competitions
          </h3>
          <p className="text-3xl font-light text-gold-primary">
            {isLoadingCompetitions ? "—" : activeCompetitions}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="bg-black border border-gold-primary/20 rounded-lg p-6"
        >
          <h3 className="text-white/60 text-xs font-light uppercase tracking-wider mb-2">
            Total Revenue (approx)
          </h3>
          <p className="text-3xl font-light text-gold-primary">
            {isLoadingCompetitions ? "—" : `£${totalRevenue.toLocaleString()}`}
          </p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-black border border-gold-primary/20 rounded-lg p-6"
      >
        <h2 className="text-2xl font-light text-white mb-6 gold-text-glow">
          Recent Activity
        </h2>
        <div className="space-y-4">
          {isLoadingDraws ? (
            <div className="h-12 w-full animate-pulse rounded bg-gold-primary/10" />
          ) : draws.length === 0 ? (
            <p className="text-white/60 text-sm font-light">No recent activity</p>
          ) : (
            draws.slice(0, 5).map((draw) => (
              <div
                key={draw.id}
                className="flex items-center justify-between py-3 border-b border-gold-primary/10 last:border-0"
              >
                <div>
                  <p className="font-light text-white">Draw completed</p>
                  <p className="text-sm text-white/60">
                    {draw.prizeName || draw.competitionTitle || "Competition"} – {" "}
                    {draw.winnerName}
                  </p>
                </div>
                <span className="text-xs text-white/40">
                  {draw.drawDate ? new Date(draw.drawDate).toLocaleString() : "—"}
                </span>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;

