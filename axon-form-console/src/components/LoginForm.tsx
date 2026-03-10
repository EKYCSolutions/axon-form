// import { Button } from '@/components/ui/button';
// import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
// import { Input } from '@/components/ui/input';
// import { cn } from '@/lib/utils';
// import type { ComponentProps, FormEvent } from 'react';

// export function LoginForm({
//   identity,
//   password,
//   isSubmitting,
//   onIdentityChange,
//   onPasswordChange,
//   onSubmit,
//   className,
//   ...props
// }: ComponentProps<'form'> & {
//   identity: string;
//   password: string;
//   isSubmitting: boolean;
//   onIdentityChange: (value: string) => void;
//   onPasswordChange: (value: string) => void;
//   onSubmit: (event: FormEvent<HTMLFormElement>) => void;
// }) {
//   return (
//     <form
//       className={cn('flex flex-col gap-6', className)}
//       onSubmit={onSubmit}
//       {...props}
//     >
//       <FieldGroup>
//         <div className='flex flex-col items-center gap-1 text-center'>
//           <h1 className='text-2xl font-bold'>Login to your account</h1>
//           <p className='text-sm text-balance text-muted-foreground'>
//             Sign in with your PocketBase superuser account
//           </p>
//         </div>
//         <Field>
//           <FieldLabel htmlFor='identity'>Email or Username</FieldLabel>
//           <Input
//             id='identity'
//             type='text'
//             placeholder='m@example.com'
//             value={identity}
//             onChange={(event) => onIdentityChange(event.target.value)}
//             required
//           />
//         </Field>
//         <Field>
//           <FieldLabel htmlFor='password'>Password</FieldLabel>
//           <Input
//             id='password'
//             type='password'
//             value={password}
//             onChange={(event) => onPasswordChange(event.target.value)}
//             required
//           />
//         </Field>
//         <Field>
//           <Button type='submit' disabled={isSubmitting}>
//             {isSubmitting ? 'Signing in...' : 'Login'}
//           </Button>
//         </Field>
//       </FieldGroup>
//     </form>
//   );
// }

import { Button } from '@/components/ui/button';
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { ComponentProps, FormEvent } from 'react';

export function LoginForm({
  identity,
  password,
  isSubmitting,
  onIdentityChange,
  onPasswordChange,
  onSubmit,
  className,
  ...props
}: ComponentProps<'form'> & {
  identity: string;
  password: string;
  isSubmitting: boolean;
  onIdentityChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <form
      className={cn('flex flex-col gap-6', className)}
      {...props}
      onSubmit={onSubmit}
    >
      <FieldGroup>
        <div className='flex flex-col items-center gap-1 text-center'>
          <h1 className='text-2xl font-medium'>Login to your account</h1>
          <p className='text-sm text-balance text-muted-foreground'>
            Enter your email below to login to your account
          </p>
        </div>
        <Field>
          <FieldLabel htmlFor='email'>Email</FieldLabel>
          <Input
            id='email'
            type='email'
            value={identity}
            placeholder='test@example.com'
            onChange={(event) => onIdentityChange(event.target.value)}
            required
          />
        </Field>
        <Field>
          <div className='flex items-center'>
            <FieldLabel htmlFor='password'>Password</FieldLabel>
          </div>
          <Input
            id='password'
            type='password'
            value={password}
            placeholder='Enter your password'
            onChange={(event) => onPasswordChange(event.target.value)}
            required
          />
        </Field>
        <FieldSeparator />
        <Field>
          <Button type='submit'>
            {' '}
            {isSubmitting ? 'Logging in...' : 'Login'}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
