"use client";

import { useState, useEffect, useCallback } from "react";
import { aiService, validateResponse } from "@/lib/ai-service";
import { AIContext, AIResponse } from "@/types/ai";

interface AICompanionProps {
  context?: AIContext;
  onResponse?: (response: AIResponse) => void;
}

export default function AICompanion({ context, onResponse }: AICompanionProps) {
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(
    null,
  );
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const generateResponse = useCallback(
    async (ctx: AIContext) => {
      setIsLoading(true);
      try {
        const response = await aiService.generateResponse(ctx);
        if (validateResponse(response)) {
          setCurrentResponse(response);
          onResponse?.(response);
        } else {
          console.warn("AI response failed validation:", response);
        }
      } catch (error) {
        console.error("Failed to generate AI response:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [onResponse],
  );

  // Generate initial greeting
  useEffect(() => {
    if (!currentResponse) {
      generateResponse({ action: "started_challenge" });
    }
  }, [generateResponse, currentResponse]);

  // React to context changes
  useEffect(() => {
    if (context) {
      generateResponse(context);
    }
  }, [context, generateResponse]);

  const getMessageStyle = (type: string) => {
    switch (type) {
      case "celebration":
        return "bg-yellow-100 border-yellow-300 text-yellow-800";
      case "question":
        return "bg-blue-100 border-blue-300 text-blue-800";
      case "hint":
        return "bg-green-100 border-green-300 text-green-800";
      default:
        return "bg-gray-100 border-gray-300 text-gray-800";
    }
  };

  if (!isVisible || !currentResponse) return null;

  return (
    <div className="absolute bottom-4 right-4 max-w-xs z-10">
      <div
        className={`border rounded-lg p-4 shadow-lg ${getMessageStyle(currentResponse.type)}`}
      >
        <div className="flex items-center mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mr-2 text-sm">
            AI
          </div>
          <span className="font-semibold text-sm">AI Companion</span>
          <button
            onClick={() => setIsVisible(false)}
            className="ml-auto text-gray-500 hover:text-gray-700 text-sm"
          >
            ×
          </button>
        </div>
        <p className="text-sm mb-2">{currentResponse.message}</p>
        {isLoading && <div className="text-xs text-gray-500">Thinking...</div>}
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 capitalize">
            {currentResponse.type}
          </span>
          <button
            onClick={() => generateResponse({ action: "user_request" })}
            className="text-xs bg-white text-gray-700 px-2 py-1 rounded border hover:bg-gray-50"
            disabled={isLoading}
          >
            Ask Again
          </button>
        </div>
      </div>
    </div>
  );
}
