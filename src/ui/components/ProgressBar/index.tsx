/**
 * Reusable ProgressBar component for MiniPaint application
 */

import {getCompletionRateColor} from "@/ui/utils/completionColors";

interface ProgressBarProps {
    className?: string;
    completionRate: number;
    withLabel?: boolean;
}

export function ProgressBar({
    className = '',
    withLabel = false,
    completionRate,
}: ProgressBarProps) {
    const color = getCompletionRateColor(completionRate);
    return (
    <div className="w-full">
        {withLabel ? (
            <div className={`font-extrabold text-${color.substring(3)}`}>{completionRate}%</div>
        ) : null}
        <div className={`w-full h-3 bg-gray-200 rounded-full ${className}`}>
            <div
                className={`h-3 rounded-full ${getCompletionRateColor(completionRate)}`}
                style={{ width: `${completionRate}%` }}
                role="progressbar"
                aria-valuenow={completionRate}
                aria-valuemin={0}
                aria-valuemax={100}
            ></div>
        </div>
    </div>
    );
}
