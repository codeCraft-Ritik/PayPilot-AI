import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'danger' | 'mono';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs';

  const variantClasses = {
    default: 'bg-surface-subtle text-foreground border-border',
    accent: 'bg-accent-subtle text-accent border-accent-border',
    success: 'bg-success-subtle text-success border-success-border',
    warning: 'bg-warning-subtle text-warning border-warning-border',
    danger: 'bg-danger-subtle text-danger border-danger-border',
    mono: 'bg-surface-subtle text-foreground font-mono border-border',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 font-medium rounded border ${variantClasses} ${sizeClasses} ${className}`}
    >
      {children}
    </span>
  );
};
