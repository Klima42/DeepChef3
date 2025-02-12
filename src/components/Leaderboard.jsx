import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Medal, Star, ChefHat } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard] = useState({
    topChefs: [
      { id: 1, name: "Gordon R.", level: 42, xp: 84200, recipes: 156, rank: 1 },
      { id: 2, name: "Julia C.", level: 38, xp: 76400, recipes: 142, rank: 2 },
      { id: 3, name: "Jamie O.", level: 35, xp: 70000, recipes: 128, rank: 3 },
      { id: 4, name: "Emeril L.", level: 33, xp: 66000, recipes: 115, rank: 4 },
      { id: 5, name: "Ina G.", level: 31, xp: 62000, recipes: 108, rank: 5 }
    ]
  });

  const getRankStyle = (rank) => {
    switch(rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800";
      case 2:
        return "bg-gray-100 text-gray-800";
      case 3:
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-blue-50 text-blue-800";
    }
  };

  const getRankIcon = (rank) => {
    switch(rank) {
      case 1:
        return <Trophy className="w-6 h-6 text-yellow-600" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-600" />;
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />;
      default:
        return <Star className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <Trophy className="w-7 h-7 text-yellow-600" />
          Top Chefs
        </h2>

        <div className="space-y-4">
          {leaderboard.topChefs.map((chef) => (
            <motion.div
              key={chef.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-4 p-4 rounded-lg ${getRankStyle(chef.rank)}`}
            >
              <div className="flex items-center gap-4 flex-1">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                  {getRankIcon(chef.rank)}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold">{chef.name}</span>
                    <span className="text-sm bg-white px-2 py-1 rounded">
                      Level {chef.level}
                    </span>
                  </div>
                  <div className="text-sm opacity-75">
                    {chef.recipes} recipes created
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-semibold">{chef.xp.toLocaleString()} XP</div>
                  <div className="text-sm opacity-75">Rank #{chef.rank}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Leaderboard;