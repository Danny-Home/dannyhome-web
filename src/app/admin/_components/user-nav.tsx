'use client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { UserAvatarProfile } from '@/components/user-avatar-profile';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
// import { SignOutButton, useUser } from '@clerk/nextjs';

import { useRouter } from 'next/navigation';
export function UserNav() {
  // const { user } = useUser();
  const { data: session } = useSession();
  const router = useRouter();

  if (session?.user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={'icon'} variant='ghost' className='relative h-8 w-8 rounded-full'>
            <UserAvatarProfile user={session.user} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className='w-56'
          align='end'
          sideOffset={10}
          forceMount
        >
          <DropdownMenuLabel className='font-normal'>
            <div className='flex flex-col space-y-1'>
              <p className='text-sm leading-none font-medium'>
                {session?.user.name}
              </p>
              <p className='text-muted-foreground text-xs leading-none'>
                {session?.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>New Team</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            {/* <Button variant='secondary' size='sm' asChild> */}
                    <Link href='/api/auth/signout'>
                      Sign out
                    </Link>
                  {/* </Button> */}
            {/* <SignOutButton redirectUrl='/auth/sign-in' /> */}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }
}
