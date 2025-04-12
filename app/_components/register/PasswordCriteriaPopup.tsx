'use client';

import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi'; // Ícones de check e X

interface CriteriaStatus {
  minLength: boolean;
  uppercase: boolean;
  number: boolean;
}

interface PasswordCriteriaPopupProps {
  criteria: CriteriaStatus;
}

const popupVariants = {
  hidden: { opacity: 0, x: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

const PasswordCriteriaPopup = ({ criteria }: PasswordCriteriaPopupProps) => {
  return (
    <motion.div
      variants={popupVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      className="absolute left-full top-0 ml-4 p-4 w-64 bg-green-100 border border-green-300 rounded-md shadow-lg z-20"
    >

      <h4 className="text-sm font-semibold text-green-800 mb-2">Critérios da Senha:</h4>
      <ul className="space-y-1 text-xs text-green-700">
        <li className="flex items-center">
          {criteria.minLength ? (
            <FiCheckCircle className="text-green-600 mr-2" />
          ) : (
            <FiXCircle className="text-red-500 mr-2" />
          )}
          Mínimo 8 caracteres
        </li>
        <li className="flex items-center">
          {criteria.uppercase ? (
            <FiCheckCircle className="text-green-600 mr-2" />
          ) : (
            <FiXCircle className="text-red-500 mr-2" />
          )}
          Pelo menos uma letra maiúscula
        </li>
        <li className="flex items-center">
          {criteria.number ? (
            <FiCheckCircle className="text-green-600 mr-2" />
          ) : (
            <FiXCircle className="text-red-500 mr-2" />
          )}
          Pelo menos um número
        </li>
      </ul>
    </motion.div>
  );
};

export default PasswordCriteriaPopup; 