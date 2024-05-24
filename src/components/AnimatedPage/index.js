import React from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";

const animations = {
  initial: { opacity: 0, x: 0 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 0 },
};

const AnimatedPage = ({ children }) => {
  return (
    <motion.div
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
    >
      {children}
    </motion.div>
  );
};

AnimatedPage.propTypes = {
  children: PropTypes.any.isRequired,
};

export default AnimatedPage;
