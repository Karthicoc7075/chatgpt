"use client";
import React, { useEffect, useState, useRef } from "react";
import MessageMarkdown from "./markdown";

export default function TypingMessage({ message, speed = 30 }) {
  const [visibleText, setVisibleText] = useState("");
  const indexRef = useRef(0);

  useEffect(() => {
    setVisibleText(""); // Reset when message changes
    indexRef.current = 0;

    if (!message?.content) return;

    const interval = setInterval(() => {
      setVisibleText((prev) => prev + message.content.charAt(indexRef.current));
      indexRef.current += 1;
      if (indexRef.current >= message.content.length) {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [message.content, speed]);

  return <MessageMarkdown content={{ ...message, content: visibleText }} />;
}
