import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface FloatingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
    ({ className, label, value, ...props }, ref) => {
        const [isFocused, setIsFocused] = useState(false);
        const hasValue = value !== undefined && value !== "";

        // Determine if label should float
        const shouldFloat = isFocused || hasValue;

        return (
            <div className="relative group">
                <input
                    ref={ref}
                    className={cn(
                        "flex h-12 w-full border-2 border-black bg-transparent px-3 py-2 text-sm font-bold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-transparent focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
                        className
                    )}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    value={value}
                    placeholder={label} // Placeholder needed for CSS but we hide it
                    {...props}
                />
                <label
                    className={cn(
                        "absolute left-3 transition-all duration-200 pointer-events-none bg-white px-1 uppercase font-bold tracking-wider",
                        shouldFloat
                            ? "-top-2.5 text-[10px] text-black" // Floating state
                            : "top-3.5 text-xs text-gray-500"    // Resting state
                    )}
                >
                    {label}
                </label>
            </div>
        );
    }
);
FloatingInput.displayName = "FloatingInput";
