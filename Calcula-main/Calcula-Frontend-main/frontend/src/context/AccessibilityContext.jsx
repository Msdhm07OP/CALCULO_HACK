import React, { createContext, useContext, useState, useEffect } from 'react';

// Create the accessibility context
const AccessibilityContext = createContext();

/**
 * AccessibilityProvider - Global state management for accessibility preferences
 * Manages font size and high contrast mode
 * Persists user preferences to localStorage
 * Complies with WCAG 2.1 AA and Indian accessibility standards (GIGW, RPwD Act 2016)
 */
export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState('normal');
  const [highContrast, setHighContrast] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('a11y-fontSize');
      const savedHighContrast = localStorage.getItem('a11y-highContrast');

      if (savedFontSize) setFontSize(savedFontSize);
      if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast));
    } catch (e) {
      console.error('Error loading accessibility preferences:', e);
    }
  }, []);

  // Update localStorage and DOM when fontSize changes
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [cursorGuide, setCursorGuide] = useState(false);

  // Initialize from localStorage on mount
  useEffect(() => {
    try {
      const savedFontSize = localStorage.getItem('a11y-fontSize');
      const savedHighContrast = localStorage.getItem('a11y-highContrast');
      const savedDyslexia = localStorage.getItem('a11y-dyslexia');
      const savedMotion = localStorage.getItem('a11y-motion');
      const savedCursor = localStorage.getItem('a11y-cursor');

      if (savedFontSize) setFontSize(savedFontSize);
      if (savedHighContrast) setHighContrast(JSON.parse(savedHighContrast));
      if (savedDyslexia) setDyslexiaFont(JSON.parse(savedDyslexia));
      if (savedMotion) setReduceMotion(JSON.parse(savedMotion));
      if (savedCursor) setCursorGuide(JSON.parse(savedCursor));
    } catch (e) {
      console.error('Error loading accessibility preferences:', e);
    }
  }, []);

  // Update localStorage and DOM when fontSize changes
  useEffect(() => {
    localStorage.setItem('a11y-fontSize', fontSize);
    document.documentElement.setAttribute('data-font-size', fontSize);
  }, [fontSize]);

  // Update localStorage and DOM when highContrast changes
  useEffect(() => {
    localStorage.setItem('a11y-highContrast', JSON.stringify(highContrast));
    document.documentElement.classList.toggle('high-contrast', highContrast);
  }, [highContrast]);

  // Update Dyslexia Font
  useEffect(() => {
    localStorage.setItem('a11y-dyslexia', JSON.stringify(dyslexiaFont));
    document.documentElement.classList.toggle('dyslexia-mode', dyslexiaFont);
  }, [dyslexiaFont]);

  // Update Reduce Motion
  useEffect(() => {
    localStorage.setItem('a11y-motion', JSON.stringify(reduceMotion));
    document.documentElement.classList.toggle('reduce-motion', reduceMotion);
  }, [reduceMotion]);

  // Update Cursor Guide
  useEffect(() => {
    localStorage.setItem('a11y-cursor', JSON.stringify(cursorGuide));
    document.documentElement.classList.toggle('cursor-guide-mode', cursorGuide);
  }, [cursorGuide]);

  const value = {
    fontSize,
    highContrast,
    dyslexiaFont,
    reduceMotion,
    cursorGuide,
    setFontSize,
    setHighContrast,
    setDyslexiaFont,
    setReduceMotion,
    setCursorGuide,
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

/**
 * Custom hook to use accessibility context
 * Usage: const { fontSize, highContrast, setFontSize, setHighContrast } = useAccessibility();
 */
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
