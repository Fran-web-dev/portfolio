"use client";

import { createElement, useEffect, useRef, useState } from "react";
import "./TextType.css";

const TextType = ({
  text = "",
  texts = undefined,
  as: Component = "div",
  typingSpeed = 50,
  initialDelay = 0,
  pauseDuration = 2000,
  puaseDuration = undefined,
  deletingSpeed = 30,
  loop = true,
  className = "",
  showCursor = true,
  hideCursorWhileTyping = false,
  cursorCharacter = "|",
  cursorClassName = "",
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed = undefined,
  variableSpeedEnabled = undefined,
  variableSpeedMin = undefined,
  variableSpeedMax = undefined,
  onSentenceComplete = undefined,
  startOnVisible = false,
  reverseMode = false,
  ...props
}) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isVisible, setIsVisible] = useState(!startOnVisible);

  const containerRef = useRef(null);
  const startedRef = useRef(false);

  const normalizedText = text ?? texts ?? "";
  const normalizedPauseDuration = puaseDuration ?? pauseDuration;
  const normalizedVariableSpeed =
    variableSpeed ??
    (variableSpeedEnabled
      ? {
          min: variableSpeedMin ?? typingSpeed,
          max: variableSpeedMax ?? typingSpeed,
        }
      : undefined);

  const textArray = Array.isArray(normalizedText)
    ? normalizedText
    : [normalizedText];

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setIsVisible(true);
            break;
          }
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (!isVisible || textArray.length === 0) return;

    const currentRawText = String(textArray[currentTextIndex] ?? "");
    const currentText = reverseMode
      ? currentRawText.split("").reverse().join("")
      : currentRawText;

    const getSpeed = () => {
      if (!normalizedVariableSpeed) return typingSpeed;

      const min = normalizedVariableSpeed.min ?? typingSpeed;
      const max = normalizedVariableSpeed.max ?? typingSpeed;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const shouldPause =
      (!isDeleting && displayedText.length === currentText.length) ||
      (isDeleting && displayedText.length === 0);

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (displayedText.length < currentText.length) {
            setDisplayedText(currentText.slice(0, displayedText.length + 1));
            return;
          }

          if (textArray.length > 0) {
            if (onSentenceComplete) {
              onSentenceComplete(currentRawText, currentTextIndex);
            }

            if (loop || currentTextIndex < textArray.length - 1) {
              setIsDeleting(true);
            }
          }
          return;
        }

        if (displayedText.length > 0) {
          setDisplayedText(currentText.slice(0, displayedText.length - 1));
          return;
        }

        setIsDeleting(false);
        if (loop || currentTextIndex < textArray.length - 1) {
          setCurrentTextIndex((prev) => (prev + 1) % textArray.length);
        }
      },
      (() => {
        if (displayedText.length === 0 && !startedRef.current)
          return initialDelay;
        if (shouldPause) return normalizedPauseDuration;
        return isDeleting ? deletingSpeed : getSpeed();
      })(),
    );

    startedRef.current = true;

    return () => clearTimeout(timeout);
  }, [
    displayedText,
    isDeleting,
    isVisible,
    textArray,
    currentTextIndex,
    typingSpeed,
    deletingSpeed,
    initialDelay,
    normalizedPauseDuration,
    normalizedVariableSpeed,
    loop,
    reverseMode,
    onSentenceComplete,
  ]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return "inherit";
    return textColors[currentTextIndex % textColors.length];
  };

  const shouldHideCursor =
    hideCursorWhileTyping &&
    (displayedText.length < String(textArray[currentTextIndex] ?? "").length ||
      isDeleting);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props,
    },
    <span
      className="text-type__content"
      style={{ color: getCurrentTextColor() }}
    >
      {displayedText}
    </span>,
    showCursor && (
      <span
        className={`text-type__cursor ${cursorClassName} ${
          shouldHideCursor ? "text-type__cursor--hidden" : ""
        }`}
        style={{ animationDuration: `${cursorBlinkDuration}s` }}
      >
        {cursorCharacter}
      </span>
    ),
  );
};

export default TextType;
