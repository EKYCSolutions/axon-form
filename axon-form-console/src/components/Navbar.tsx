import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  getCurrentSuperuserProfile,
  logoutSuperuser,
} from '@/services/PocketBaseService';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';

export default function Navbar() {
  const navigate = useNavigate();
  const profile = getCurrentSuperuserProfile();
  const profileTitle =
    profile?.email ?? profile?.username ?? profile?.name ?? 'Superuser';
  const profileSubtitle = [
    profile?.name && profile?.name !== profileTitle ? profile.name : null,
    profile?.username && profile?.username !== profileTitle
      ? `@${profile.username}`
      : null,
    profile?.id ? `ID: ${profile.id}` : null,
  ]
    .filter(Boolean)
    .join(' · ');
  const avatarText = profileTitle
    .split(/[.\s@_-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((value) => value[0]?.toUpperCase())
    .join('');

  function onLogout() {
    logoutSuperuser();
    toast.success('Logged out');
    navigate('/login', { replace: true });
  }

  return (
    <header className='border-b border-border bg-background/95 backdrop-blur'>
      <div className='mx-auto flex w-full max-w-[1600px] items-center justify-between gap-4 px-4 py-3 md:px-8'>
        <div>
          <p className='text-md text-muted-foreground'>Axon Form Console</p>
        </div>
        <div className='flex items-center gap-3'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type='button'
                size='icon'
                variant='outline'
                className='rounded-full font-medium'
                aria-label='Open profile menu'
              >
                {avatarText || 'SU'}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-72'>
              <DropdownMenuLabel className='space-y-1'>
                <p className='text-sm font-semibold leading-tight'>
                  {profileTitle}
                </p>
                {profileSubtitle ? (
                  <p className='text-xs text-muted-foreground'>
                    {profileSubtitle}
                  </p>
                ) : null}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant='destructive'
                onSelect={(event) => {
                  event.preventDefault();
                  onLogout();
                }}
              >
                <LogOut className='size-4' />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
