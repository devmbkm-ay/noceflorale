import React from 'react';
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export interface StepperProps {
  steps: Array<{
    title: string;
    description?: string;
  }>;
  currentStep: number;
  onStepClick?: (step: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  currentStep,
  onStepClick,
  className,
}) => {
  return (
    <div className={cn("w-full", className)}>
      <nav aria-label="Progress">
        <ol className="space-y-4 md:flex md:space-x-8 md:space-y-0">
          {steps.map((step, index) => (
            <li key={index} className="md:flex-1">
              <div
                className={cn(
                  "group flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",
                  index < currentStep
                    ? "border-indigo-600"
                    : index === currentStep
                    ? "border-indigo-400"
                    : "border-gray-200"
                )}
              >
                <button
                  type="button"
                  onClick={() => onStepClick?.(index)}
                  className={cn(
                    "flex items-center text-left text-sm font-medium",
                    index <= currentStep ? "cursor-pointer" : "cursor-not-allowed",
                    index < currentStep
                      ? "text-indigo-600"
                      : index === currentStep
                      ? "text-indigo-600"
                      : "text-gray-500",
                    onStepClick ? "hover:text-indigo-800" : ""
                  )}
                  disabled={index > currentStep}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full mr-2",
                      index < currentStep
                        ? "bg-indigo-600 text-white"
                        : index === currentStep
                        ? "border-2 border-indigo-600 text-indigo-600"
                        : "border-2 border-gray-300 text-gray-500"
                    )}
                  >
                    {index < currentStep ? (
                      <CheckIcon className="h-5 w-5" />
                    ) : (
                      <span>{index + 1}</span>
                    )}
                  </span>
                  <span className="text-sm">{step.title}</span>
                </button>
                {step.description && (
                  <span
                    className={cn(
                      "text-xs",
                      index <= currentStep ? "text-gray-600" : "text-gray-400"
                    )}
                  >
                    {step.description}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};