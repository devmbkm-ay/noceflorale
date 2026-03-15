import React from "react";
import { Check, ChevronRight } from "lucide-react";

interface Step {
  title: string;
  component: React.ReactNode;
}

interface ProgressBarProps {
  steps: Step[];
  currentStep: number;
  maxVisitedStep: number;
  onStepClick: (stepIndex: number) => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  steps,
  currentStep,
  maxVisitedStep,
  onStepClick,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-2">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center relative group ${
              idx <= maxVisitedStep ? "cursor-pointer" : ""
            }`}
            onClick={() =>
              idx <= maxVisitedStep ? onStepClick(idx) : null
            }
            role={idx <= maxVisitedStep ? "button" : undefined}
            tabIndex={idx <= maxVisitedStep ? 0 : undefined}
            onKeyDown={(e) => {
              if (e.key === "Enter" && idx <= maxVisitedStep) {
                onStepClick(idx);
              }
            }}
          >
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 
                ${
                  idx < currentStep
                    ? "bg-royal-600 border-royal-600 text-white"
                    : idx === currentStep
                    ? "border-royal-600 text-royal-600"
                    : idx <= maxVisitedStep
                    ? "border-gray-400 text-gray-500 hover:border-royal-400 hover:text-royal-500"
                    : "border-gray-300 text-gray-300"
                }
                ${
                  idx <= maxVisitedStep ? "hover:shadow-md" : ""
                }
                `}
            >
              {idx < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                <span className="text-sm">{idx + 1}</span>
              )}
            </div>
            <span
              className={`text-xs mt-2 text-center font-medium max-w-[90px] transition-all
                ${
                  idx === currentStep
                    ? "text-royal-600 font-bold"
                    : idx < currentStep
                    ? "text-gray-700"
                    : idx <= maxVisitedStep
                    ? "text-gray-600 group-hover:text-royal-500"
                    : "text-gray-400"
                }`}
            >
              {step.title}
            </span>
            {/* Connector line between steps */}
            {idx < steps.length - 1 && (
              <div className="hidden md:flex absolute left-full transform translate-x-1 items-center w-full">
                <div
                  className={`h-0.5 w-full ${
                    idx < currentStep
                      ? "bg-royal-500"
                      : "bg-gray-200"
                  } transition-all duration-500`}
                ></div>
                {idx < currentStep && (
                  <ChevronRight className="text-royal-500 w-4 h-4 ml-0.5 animate-pulse" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="relative mt-3 hidden md:block">
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full"></div>
        <div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-royal-600 rounded-full transition-all duration-500 ease-in-out"
          style={{
            width: `${
              (currentStep / (steps.length - 1)) * 100
            }%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressBar;
