import React from "react";
import { motion } from "framer-motion";
import type { HTMLMotionProps } from "framer-motion";
import { ClipLoader } from "react-spinners";

type Variant = "primary" | "secondary" | "success" | "danger" | "warning" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

export type EnhancedButtonProps = HTMLMotionProps<"button"> & {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    disabled?: boolean;
    icon?:  React.ElementType;
    children?: React.ReactNode;
};

export const EnhancedButton: React.FC<EnhancedButtonProps> = ({
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    icon: Icon,
    children,
    onClick,
    className = "",
    ...props
}: EnhancedButtonProps) => {
    const baseClasses = "inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-20 transform";

    const variants: Record<Variant,string> = {
        primary: "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl focus:ring-blue-500",
        secondary: "bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-700 dark:text-gray-200 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 shadow-md hover:shadow-lg focus:ring-gray-500",
        success: "bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl focus:ring-green-500",
        danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl focus:ring-red-500",
        warning: "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl focus:ring-yellow-500",
        outline: "border-2 border-gray-200 dark:border-gray-600 bg-transparent hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-gray-500",
        ghost: "bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-gray-500"
    };

    const sizes: Record<Size,string>= {
        sm: "px-3 py-2 text-sm",
        md: "px-4 py-3 text-base",
        lg: "px-6 py-4 text-lg",
        xl: "px-8 py-5 text-xl"
    };

    const disabledClasses = disabled || loading ? "opacity-50 cursor-not-allowed transform-none" : "hover:scale-105 active:scale-95";

    return (
        <>
            <motion.button
                whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
                whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
                className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${disabledClasses} ${className} w-full sm:w-auto`} // w-full on xs for responsiveness
                onClick={onClick}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <ClipLoader size={16} color="currentColor" />
                ) : Icon ? (
                    <Icon className="w-5 h-5" />
                ) : null}
                {children}
            </motion.button>
        </>
    );
};