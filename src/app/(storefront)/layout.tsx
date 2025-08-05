import Header from '@/app/_components/header'
import React, { type PropsWithChildren } from 'react'

type Props = {}

function StoreFrontLayout({ children }: Props & PropsWithChildren) {
  return (
    <>
      <Header />
      {children}
    </>
  )
}

export default StoreFrontLayout
