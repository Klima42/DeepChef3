import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Clock, Star, ChefHat } from 'lucide-react';

const Quests = () => {
  const [quests] = useState({
    daily: [
      {
        id: 1,
        title: "Breakfast Champion",
        description: "Create a healthy breakfast recipe using eggs and vegetables",
        reward: 100,
        timeLeft: "23:45:12",
        difficulty: "Easy"
      },
      {
        id: 2,
        title: "Veggie Master",
        description: "Make a vegetarian main course",
        reward: 150,
        timeLeft: "23:45:12",
        difficulty: "Medium"
      }
    ],
    weekly: [
      {
        id: 3,
        title: "International Cuisine",
        description: "Create recipes from three different cuisines",
        reward: 500,
        timeLeft: "6d 23h",
        difficulty: "Hard"
      }
    ],
    special: [
      {
        id: 4,
        title: "Holiday Special",
        description: "Create a festive recipe using seasonal ingredients",
        reward: 1000,
        timeLeft: "13d 23h",
        difficulty: "Expert"
      }
    ]
  });

  const QuestCard = ({ quest }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{quest.title}</h3>
        <span className={`px-2 py-1 rounded text-sm ${
          quest.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
          quest.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
          quest.difficulty === 'Hard' ? 'bg-orange-100 text-orange-700' :
          'bg-red-100 text-red-700'
        }`}>
          {quest.difficulty}
        </span>
      </div>
      
      <p className="text-gray-600 mb-4">{quest.description}</p>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-blue-600">
          <Star className="w-4 h-4" />
          <span>{quest.reward} XP</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4" />
          <span>{quest.timeLeft}</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-600" />
          Daily Quests
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quests.daily.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-blue-600" />
          Weekly Challenges
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quests.weekly.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Star className="w-6 h-6 text-blue-600" />
          Special Events
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quests.special.map(quest => (
            <QuestCard key={quest.id} quest={quest} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quests;