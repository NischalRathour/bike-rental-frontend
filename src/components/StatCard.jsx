import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ item, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`stat-card-glass ${item.color}`}
    >
      <div className="stat-icon-wrapper">{item.icon}</div>
      <div className="stat-content">
        <p className="stat-label">{item.label}</p>
        <h3 className="stat-value">{item.val}</h3>
        <span className="stat-trend">{item.trend}</span>
      </div>
    </motion.div>
  );
};

export default StatCard;