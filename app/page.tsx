'use client'

import { useEffect, useState } from 'react'

import TaskColumn from '@/components/TaskColumn'
import TaskFilters from '@/components/TaskFilters'
import TaskModal from '@/components/TaskModal'
import { useRouter } from 'next/navigation'

const HomePage = () => {
  const [tasks, setTasks] = useState([])
  const [filteredTasks, setFilteredTasks] = useState([])
  const [filters, setFilters] = useState({ search: "", assignee: "", tag: "" })

  return (
    <div>HomePage</div>
  )
}
export default HomePage