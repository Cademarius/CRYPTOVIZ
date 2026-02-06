import type { SVGProps } from "react";

export default function WhaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Body */}
      <path d="M6 12c0-4 3-7 7-7 2.5 0 4.5 1 5.5 2.5L20 9c1 1.5.5 3-.5 4l-2 1.5c-1.5 1-3 2-5.5 2.5-3 .5-6-.5-7.5-2.5C3 12.5 3.5 10.5 6 12z" />
      {/* Tail */}
      <path d="M3 11c-.5-1.5-.5-3 1-4s2.5.5 2 2" />
      {/* Eye */}
      <circle cx="15" cy="9" r="0.75" fill="currentColor" stroke="none" />
      {/* Water spout */}
      <path d="M17 3c0-1 .5-1.5 1-1.5S19 2 19 3" />
      <path d="M16 2c0-1 .5-1.5 1-1.5" />
    </svg>
  );
}
