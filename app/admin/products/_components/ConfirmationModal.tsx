'use client'

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export interface ConfirmationModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmText?: string;
    cancelText?: string;
    isConfirming?: boolean; 
}

export function ConfirmationModal({
    isOpen,
    title,
    message,
    onConfirm,
    onCancel,
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isConfirming = false
}: ConfirmationModalProps) {
    if (!isOpen) return null;

    const overlayVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 }, exit: { opacity: 0 } };
    const modalVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } };

    return (
        <motion.div
            className="fixed inset-0 z-50 flex justify-center items-center p-4 backdrop-blur-sm bg-transparent bg-opacity-50"
            variants={overlayVariants} initial="hidden" animate="visible" exit="exit"
            onClick={onCancel} 
        >
            <motion.div
                className="bg-white rounded-lg shadow-xl w-full max-w-md"
                variants={modalVariants}
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="p-6 text-center">
                    <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
                    <p className="text-sm text-gray-600 mb-6">{message}</p>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={onCancel}
                            disabled={isConfirming}
                            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isConfirming}
                            className="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-wait"
                        >
                            {isConfirming ? "Processando..." : confirmText}
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
} 