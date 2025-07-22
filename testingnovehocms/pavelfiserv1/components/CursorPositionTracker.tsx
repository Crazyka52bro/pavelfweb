"use client";

import { useEffect } from "react";

export default function CursorPositionTracker() {
useEffect(() => {
const handleMouseMove = (event: MouseEvent) => {
document.documentElement.style.setProperty("--cursor-x", event.clientX + "px");
document.documentElement.style.setProperty("--cursor-y", event.clientY + "px");
};


document.addEventListener("mousemove", handleMouseMove);
return () => {
  document.removeEventListener("mousemove", handleMouseMove);
};
}, []);

return null;
}