import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ item, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={`stat-card-premium card-glow-${item.color}`}
    >
      <div className="card-inner">
        <div className="card-top">
          <div className={`icon-box bg-${item.color}`}>{item.icon}</div>
          <span className="trend-indicator">{item.trend}</span>
        </div>
        <div className="card-content">
          <h3 className="stat-value">{item.val}</h3>
          <p className="stat-label">{item.label}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard;