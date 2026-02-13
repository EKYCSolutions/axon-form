import { cn } from '@/lib/utils';

interface IProps {
  title: string;
  className?: string;
}

export default function Header({ title, className }: IProps) {
  return <h2 className={cn('text-3xl', className)}>{title}</h2>;
}
