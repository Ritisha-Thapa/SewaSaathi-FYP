import React from "react";

/**
 * A simple pulsing loading skeleton.
 * @param {string} className - Tailwind classes to define shape, size, and margin.
 */
const Skeleton = ({ className, ...props }) => {
    return (
        <div
            className={`animate-pulse bg-gray-200 rounded-md ${className}`}
            {...props}
        />
    );
};

export default Skeleton;
