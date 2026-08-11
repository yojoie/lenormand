import { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';

const styles = {
  wrapper: {
    display: 'inline-block',
    whiteSpace: 'pre-wrap'
  },
  srOnly: {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0,0,0,0)',
    border: 0
  }
};

export default function DecryptedText({
  text,
  speed = 50,
  maxIterations = 10,
  sequential = false,
  revealDirection = 'start',
  useOriginalCharsOnly = false,
  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+',
  className = '',
  parentClassName = '',
  encryptedClassName = '',
  animateOn = 'hover',
  clickMode = 'once',
  ...props
}) {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const [revealedIndices, setRevealedIndices] = useState(new Set());
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(animateOn !== 'click');
  const [direction, setDirection] = useState('forward');

  const containerRef = useRef(null);
  const orderRef = useRef([]);
  const pointerRef = useRef(0);
  const intervalRef = useRef(null);

  const availableChars = useMemo(() => {
    return useOriginalCharsOnly
      ? Array.from(new Set(text.split(''))).filter(char => char !== ' ')
      : characters.split('');
  }, [useOriginalCharsOnly, text, characters]);

  const shuffleText = useCallback(
    (originalText, currentRevealed) => {
      return originalText
        .split('')
        .map((char, i) => {
          if (char === ' ') return ' ';
          if (currentRevealed.has(i)) return originalText[i];
          return availableChars[Math.floor(Math.random() * availableChars.length)];
        })
        .join('');
    },
    [availableChars]
  );

  const computeOrder = useCallback(
    len => {
      const order = [];
      if (len <= 0) return order;
      if (revealDirection === 'start') {
        for (let i = 0; i < len; i++) order.push(i);
        return order;
      }
      if (revealDirection === 'end') {
        for (let i = len - 1; i >= 0; i--) order.push(i);
        return order;
      }
      // center
      const middle = Math.floor(len / 2);
      let offset = 0;
      while (order.length < len) {
        if (offset % 2 === 0) {
          const idx = middle + offset / 2;
          if (idx >= 0 && idx < len) order.push(idx);
        } else {
          const idx = middle - Math.ceil(offset / 2);
          if (idx >= 0 && idx < len) order.push(idx);
        }
        offset++;
      }
      return order.slice(0, len);
    },
    [revealDirection]
  );

  const fillAllIndices = useCallback(() => {
    const s = new Set();
    for (let i = 0; i < text.length; i++) s.add(i);
    return s;
  }, [text]);

  const removeRandomIndices = useCallback((set, count) => {
    const arr = Array.from(set);
    for (let i = 0; i < count && arr.length > 0; i++) {
      const idx = Math.floor(Math.random() * arr.length);
      arr.splice(idx, 1);
    }
    return new Set(arr);
  }, []);

  const encryptInstantly = useCallback(() => {
    const emptySet = new Set();
    setRevealedIndices(emptySet);
    setDisplayText(shuffleText(text, emptySet));
    setIsDecrypted(false);
  }, [text, shuffleText]);

  const triggerDecrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = computeOrder(text.length);
      pointerRef.current = 0;
      setRevealedIndices(new Set());
    } else {
      setRevealedIndices(new Set());
    }
    setDirection('forward');
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length]);

  const triggerEncrypt = useCallback(() => {
    if (sequential) {
      orderRef.current = [...computeOrder(text.length)].reverse();
      pointerRef.current = 0;
      setRevealedIndices(fillAllIndices());
    } else {
      setRevealedIndices(fillAllIndices());
    }
    setDirection('backward');
    setIsAnimating(true);
  }, [sequential, computeOrder, text.length, fillAllIndices]);

  // Animation loop
  useEffect(() => {
    if (!isAnimating) return;

    let iterationCount = 0;

    const tick = () => {
      if (sequential) {
        // Sequential mode: reveal/hide one character per tick
        const order = orderRef.current;
        if (direction === 'forward') {
          if (pointerRef.current < order.length) {
            const newSet = new Set(revealedIndicesRef.current);
            newSet.add(order[pointerRef.current]);
            revealedIndicesRef.current = newSet;
            setRevealedIndices(newSet);
            setDisplayText(shuffleText(text, newSet));
            pointerRef.current++;
          } else {
            setIsAnimating(false);
            setIsDecrypted(true);
            setHasAnimated(true);
            return;
          }
        } else {
          // backward
          if (pointerRef.current < order.length) {
            const newSet = new Set(revealedIndicesRef.current);
            newSet.delete(order[pointerRef.current]);
            revealedIndicesRef.current = newSet;
            setRevealedIndices(newSet);
            setDisplayText(shuffleText(text, newSet));
            pointerRef.current++;
          } else {
            setIsAnimating(false);
            setIsDecrypted(false);
            setDisplayText(shuffleText(text, new Set()));
            return;
          }
        }
      } else {
        // Non-sequential mode: random iterations
        if (direction === 'forward') {
          if (iterationCount >= maxIterations) {
            setRevealedIndices(fillAllIndices());
            setDisplayText(text);
            setIsAnimating(false);
            setIsDecrypted(true);
            setHasAnimated(true);
            return;
          }
          const progress = iterationCount / maxIterations;
          const totalChars = text.split('').filter(c => c !== ' ').length;
          const targetRevealed = Math.floor(progress * totalChars);
          const currentRevealed = Array.from(revealedIndicesRef.current).filter(i => text[i] !== ' ').length;

          if (currentRevealed < targetRevealed) {
            const unrevealed = [];
            for (let i = 0; i < text.length; i++) {
              if (text[i] !== ' ' && !revealedIndicesRef.current.has(i)) {
                unrevealed.push(i);
              }
            }
            if (unrevealed.length > 0) {
              const randomIdx = unrevealed[Math.floor(Math.random() * unrevealed.length)];
              const newSet = new Set(revealedIndicesRef.current);
              newSet.add(randomIdx);
              revealedIndicesRef.current = newSet;
              setRevealedIndices(newSet);
            }
          }
          setDisplayText(shuffleText(text, revealedIndicesRef.current));
          iterationCount++;
        } else {
          // backward (encrypt)
          if (iterationCount >= maxIterations) {
            setRevealedIndices(new Set());
            setDisplayText(shuffleText(text, new Set()));
            setIsAnimating(false);
            setIsDecrypted(false);
            return;
          }
          const newSet = removeRandomIndices(revealedIndicesRef.current, Math.ceil(text.length / maxIterations));
          revealedIndicesRef.current = newSet;
          setRevealedIndices(newSet);
          setDisplayText(shuffleText(text, newSet));
          iterationCount++;
        }
      }
    };

    intervalRef.current = setInterval(tick, speed);
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isAnimating, direction, speed, maxIterations, sequential, text, shuffleText, fillAllIndices, removeRandomIndices]);

  // Ref to track revealedIndices without re-triggering effect
  const revealedIndicesRef = useRef(revealedIndices);
  useEffect(() => {
    revealedIndicesRef.current = revealedIndices;
  }, [revealedIndices]);

  // Hover triggers
  const handleMouseEnter = useCallback(() => {
    if (animateOn !== 'hover' && animateOn !== 'inViewHover') return;
    if (isAnimating) return;
    if (isDecrypted && hasAnimated) return;
    triggerDecrypt();
  }, [animateOn, isAnimating, isDecrypted, hasAnimated, triggerDecrypt]);

  const handleMouseLeave = useCallback(() => {
    if (animateOn !== 'hover') return;
    if (isAnimating) return;
    if (!isDecrypted) return;
    if (clickMode === 'toggle') return;
    // For hover mode, re-encrypt on leave
    triggerEncrypt();
  }, [animateOn, isAnimating, isDecrypted, clickMode, triggerEncrypt]);

  // Click triggers
  const handleClick = useCallback(() => {
    if (animateOn !== 'click') return;
    if (isAnimating) return;
    if (isDecrypted) {
      if (clickMode === 'toggle') {
        triggerEncrypt();
      }
    } else {
      triggerDecrypt();
    }
  }, [animateOn, isAnimating, isDecrypted, clickMode, triggerDecrypt, triggerEncrypt]);

  // View trigger
  useEffect(() => {
    if (animateOn !== 'view' && animateOn !== 'inViewHover') return;
    if (hasAnimated) return;
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            triggerDecrypt();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [animateOn, hasAnimated, triggerDecrypt]);

  // Initialize display
  useEffect(() => {
    if (animateOn === 'click' && !isDecrypted) {
      setDisplayText(shuffleText(text, new Set()));
    } else if (animateOn === 'hover' || animateOn === 'inViewHover') {
      setDisplayText(shuffleText(text, new Set()));
    } else {
      setDisplayText(text);
    }
  }, [text, animateOn, shuffleText]);

  return (
    <span style={styles.wrapper} ref={containerRef} className={parentClassName}>
      <span style={styles.srOnly}>{text}</span>
      <motion.span
        className={className}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        style={{ display: 'inline-block' }}
        {...props}
      >
        {displayText.split('').map((char, i) => {
          const isRevealed = revealedIndices.has(i) || isDecrypted;
          return (
            <span
              key={i}
              className={isRevealed ? className : encryptedClassName}
              style={{ display: 'inline-block' }}
            >
              {char}
            </span>
          );
        })}
      </motion.span>
    </span>
  );
}
