interface VerificationBadgeProps {
  verified: boolean;
  className?: string;
}

export default function VerificationBadge({ verified, className = '' }: VerificationBadgeProps) {
  if (!verified) return null;

  return (
    <img
      src="/assets/generated/orange-badge.dim_64x64.png"
      alt="Verified"
      className={`inline-block ${className}`}
      style={{ width: '20px', height: '20px' }}
    />
  );
}
