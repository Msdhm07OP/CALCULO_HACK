import React, { useState } from 'react';
import { useAccessibility } from '@context/AccessibilityContext';
import '../styles/AccessibilityToolbar.css';

/**
 * AccessibilityToolbar Component
 * Floating toolbar providing accessibility controls
 * Features: Font size adjustment, High contrast mode
 * Complies with WCAG 2.1 AA standards
 */
export const AccessibilityToolbar = () => {
  const {
    fontSize, setFontSize,
    highContrast, setHighContrast,
    dyslexiaFont, setDyslexiaFont,
    reduceMotion, setReduceMotion,
    cursorGuide, setCursorGuide
  } = useAccessibility();
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="accessibility-toolbar"
      role="region"
      aria-label="Accessibility controls"
    >
      {/* Expanded Controls Panel */}
      {expanded && (
        <div
          className="a11y-panel"
          aria-live="polite"
          aria-label="Accessibility options"
        >
          {/* Font Size Controls */}
          <div className="a11y-control-group" role="group" aria-labelledby="font-size-label">
            <label id="font-size-label" className="a11y-label">Text Size</label>
            <div className="a11y-button-group">
              <button
                onClick={() => setFontSize('small')}
                className={`a11y-btn ${fontSize === 'small' ? 'active' : ''}`}
                aria-pressed={fontSize === 'small'}
                aria-label="Decrease text size"
                title="Decrease text size (A−)"
              >
                A−
              </button>
              <button
                onClick={() => setFontSize('normal')}
                className={`a11y-btn ${fontSize === 'normal' ? 'active' : ''}`}
                aria-pressed={fontSize === 'normal'}
                aria-label="Normal text size"
                title="Normal text size (A)"
              >
                A
              </button>
              <button
                onClick={() => setFontSize('large')}
                className={`a11y-btn ${fontSize === 'large' ? 'active' : ''}`}
                aria-pressed={fontSize === 'large'}
                aria-label="Increase text size"
                title="Increase text size (A+)"
              >
                A+
              </button>
            </div>
          </div>

          <div className="a11y-divider" />

          {/* New Accessibility Toggles */}
          <div className="a11y-control-group">
            <button
              onClick={() => setDyslexiaFont(!dyslexiaFont)}
              className={`a11y-toggle-row ${dyslexiaFont ? 'active' : ''}`}
              aria-pressed={dyslexiaFont}
            >
              <span className="a11y-toggle-icon">✎</span>
              <span className="a11y-toggle-label">Dyslexia Friendly</span>
              <div className="a11y-switch" />
            </button>

            <button
              onClick={() => setReduceMotion(!reduceMotion)}
              className={`a11y-toggle-row ${reduceMotion ? 'active' : ''}`}
              aria-pressed={reduceMotion}
            >
              <span className="a11y-toggle-icon">🎬</span>
              <span className="a11y-toggle-label">Reduce Motion</span>
              <div className="a11y-switch" />
            </button>

            <button
              onClick={() => setCursorGuide(!cursorGuide)}
              className={`a11y-toggle-row ${cursorGuide ? 'active' : ''}`}
              aria-pressed={cursorGuide}
            >
              <span className="a11y-toggle-icon">⌖</span>
              <span className="a11y-toggle-label">Cursor Guide</span>
              <div className="a11y-switch" />
            </button>
          </div>

          <div className="a11y-divider" />

          {/* High Contrast Toggle */}
          <div className="a11y-control-group">
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`a11y-toggle-row ${highContrast ? 'active' : ''}`}
              aria-pressed={highContrast}
            >
              <span className="a11y-toggle-icon">◐</span>
              <span className="a11y-toggle-label">High Contrast</span>
              <div className="a11y-switch" />
            </button>
          </div>
        </div>
      )}

      {/* Main Toggle Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="a11y-main-btn"
        aria-expanded={expanded}
        aria-label={expanded ? 'Close accessibility options' : 'Open accessibility options'}
        title="Accessibility options"
      >
        ♿
      </button>
    </div>
  );
};

export default AccessibilityToolbar;
