"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Globe, Mail } from "lucide-react";
import type { ComponentType, SVGProps } from "react";
import type { SocialIconKey } from "@/lib/constants";

type IconProps = SVGProps<SVGSVGElement>;

function GitHubIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12Z" />
    </svg>
  );
}

function LinkedInIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function GitFutIcon({ className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      {...props}
    >
      <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.759 2.759c.641-.22 1.383-.073 1.898.441.879.88.879 2.307 0 3.187-.878.878-2.306.878-3.186 0-.511-.512-.656-1.25-.441-1.891l-2.716-2.716v4.61c.214.204.354.492.354.811 0 .617-.5 1.117-1.117 1.117-.616 0-1.117-.5-1.117-1.117 0-.319.14-.607.354-.811v-4.61c-.214-.204-.354-.492-.354-.811 0-.32.14-.608.354-.812l-2.76-2.76-4.606 4.606c-.603.604-.603 1.582 0 2.188l10.48 10.48c.604.603 1.582.603 2.188 0l10.48-10.48c.603-.604.603-1.583 0-2.188z" />
    </svg>
  );
}

const SOCIAL_ICONS: Record<SocialIconKey, ComponentType<IconProps>> = {
  gitfut: GitFutIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  mail: Mail,
  globe: Globe,
};

type SocialIconLinkProps = {
  href: string;
  ariaLabel: string;
  gradientClass: string;
  icon: SocialIconKey;
  external?: boolean;
  onClick?: () => void;
};

export function SocialIconLink({
  href,
  ariaLabel,
  gradientClass,
  icon,
  external = true,
  onClick,
}: SocialIconLinkProps) {
  const prefersReducedMotion = useReducedMotion();
  const Icon = SOCIAL_ICONS[icon];

  return (
    <motion.a
      href={href}
      aria-label={ariaLabel}
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${gradientClass} text-white glow-effect hover-lift transition-colors`}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
      whileTap={prefersReducedMotion ? undefined : { scale: 0.95 }}
    >
      <Icon className="h-5 w-5" aria-hidden="true" />
    </motion.a>
  );
}

export { SOCIAL_ICONS };
