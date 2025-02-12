import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Star, Clock, ChefHat } from 'lucide-react';

const Profile = () => {
  const [stats] = useState({
    level: 5,
    xp: 2340,
    nextLevel: 3000,
    recipesCreated: 23,
    questsCompleted: 15,
    achievements: [
      { id: 1, title: 'First Recipe', description: 'Created your first recipe', icon: ChefHat },
      { id: 2, title: 'Quest Master', description: 'Completed 10 quests', icon: Star },
      { id: 3, title: 'Early Bird', description: 'Joined the platform early', icon: Clock }
    ]
  });

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
            <ChefHat className="w-10 h-10 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Chef Level {stats.level}</h2>
            <p className="text-gray-600">
              {stats.xp} / {stats.nextLevel} XP to next level
            </p>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div 
            className="bg-blue-600 rounded-full h-2"
            style={{ width: `${(stats.xp / stats.nextLevel) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <ChefHat className="w-5 h-5" />
              <span>Recipes Created</span>
            </div>
            <p className="text-2xl font-bold">{stats.recipesCreated}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-gray-600 mb-1">
              <Award className="w-5 h-5" />
              <span>Quests Completed</span>
            </div>
            <p className="text-2xl font-bold">{stats.questsCompleted}</p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Achievements</h3>
        <div className="grid gap-4">
          {stats.achievements.map(({ id, title, description, icon: Icon }) => (
            <div key={id} className="flex items-center gap-4 bg-gray-50 rounded-lg p-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h4 className="font-semibold">{title}</h4>
                <p className="text-sm text-gray-600">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;