import { cn } from '@/lib/utils';

interface IProps {
  className?: string;
  //
  title: string;
  description?: string;
}

export default function FormHeader({ title, description, className }: IProps) {
  return (
    <div className={cn('', className)}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}
