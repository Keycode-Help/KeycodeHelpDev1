import React from "react";
import {
  Clock,
  Shield,
  CreditCard,
  Key,
  UserCheck,
  ChevronRight,
  Lock,
  Zap,
  Headphones,
  CheckCircle,
  ClipboardList,
  KeyRound,
  X,
  Timer,
  DollarSign,
  BadgeCheck,
  HelpCircle,
  Eye,
  EyeOff,
  Search,
  Check,
  Loader2,
  LogIn,
  AlertTriangle,
  Crown,
} from "lucide-react";

export const Icons = {
  clock: Clock,
  shield: Shield,
  creditCard: CreditCard,
  key: Key,
  userCheck: UserCheck,
  chevronRight: ChevronRight,
  lock: Lock,
  zap: Zap,
  headphones: Headphones,
  checkCircle: CheckCircle,
  clipboardList: ClipboardList,
  keyRound: KeyRound,
  x: X,
  timer: Timer,
  dollarSign: DollarSign,
  badgeCheck: BadgeCheck,
  helpCircle: HelpCircle,
  eye: Eye,
  eyeOff: EyeOff,
  search: Search,
  check: Check,
  loader: Loader2,
  logIn: LogIn,
};

export function Icon({ name, size = 24, className = "", ...props }) {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <LucideIcon
      size={size}
      className={`stroke-current ${className}`}
      {...props}
    />
  );
}
