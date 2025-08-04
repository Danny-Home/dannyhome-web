import { redirect } from 'next/navigation'
import React from 'react'


function AdminRootPage() {
  return redirect('/admin/overview')
}

export default AdminRootPage
