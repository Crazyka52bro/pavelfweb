"use client";

import { CSSProperties, forwardRef, useEffect, useRef } from "react";
import styles from "./background.module.scss";

interface BackgroundProps {
  className?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
  fill?: boolean; // Přidání vlastnosti fill
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky"; // Přidání vlastnosti position
}

const Background = forwardRef<HTMLDivElement, BackgroundProps>(
  ({ children, className, style, ...rest }, forwardedRef) => {
    const backgroundRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (forwardedRef) {
        if (typeof forwardedRef === "function") {
          forwardedRef(backgroundRef.current);
        } else if ("current" in forwardedRef) {
          forwardedRef.current = backgroundRef.current;
        }
      }
    }, [forwardedRef]);

    return (
      <div
        ref={backgroundRef}
        fill
        className={[styles.mask, className].filter(Boolean).join(" ")}
        style={style}
        {...rest}
      >
        {children}
      </div>
    );
  }
);

Background.displayName = "Background";

export default Background;
