import { Button } from '@/components/ui/button'
import { HydrateClient } from '@/trpc/server'
import { IconSearch, IconUser } from '@tabler/icons-react'
import Image from 'next/image'
import React from 'react'

type Props = {}

const Header = (props: Props) => {
  return (
    <HydrateClient>
      <header className='flex items-center'>
      <div className="grid grid-cols-3 w-5/6 mx-auto border-b border-neutral-300">
        <div className="col-span-2 flex items-center justify-end">
          <Image src='/logo-main.png' width={200} height={200} alt='Danny Home Logo' className="object-cover" />
        </div>
        <div className="col-span-1 flex items-center">
          <Button variant='ghost' size='icon'>
            <IconSearch />
          </Button>
          <Button variant='ghost' size='icon'>
            <IconUser />
          </Button>
        </div>
      </div>
    </header>
    </HydrateClient>
  )
}

export default Header
