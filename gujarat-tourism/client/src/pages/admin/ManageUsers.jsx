import React, { useState, useEffect } from 'react'
import Sidebar from '../../components/dashboard/Sidebar'
import Loader from '../../components/common/Loader'
import userService from '../../services/userService'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { format } from 'date-fns'
import { FiTrash2, FiShield, FiUserX, FiUserCheck } from 'react-icons/fi'

function ManageUsers() {
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    try {
      const data = await userService.getAllUsers()
      setUsers(data)
    } catch {
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId, role) {
    setBusyId(userId)
    try {
      await userService.updateUser(userId, { role })
      toast.success('Role updated')
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update role')
    } finally {
      setBusyId(null)
    }
  }

  async function handleToggleBan(user) {
    const nextBanned = !user.isBanned
    const label = nextBanned ? 'ban' : 'unban'
    if (!window.confirm(`${nextBanned ? 'Ban' : 'Unban'} ${user.name}?`)) return

    setBusyId(user._id)
    try {
      await userService.setUserBanned(user._id, nextBanned)
      toast.success(`User ${label}ned`)
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${label} user`)
    } finally {
      setBusyId(null)
    }
  }

  async function handleDelete(user) {
    if (!window.confirm(`Permanently delete ${user.name}? This cannot be undone.`)) return

    setBusyId(user._id)
    try {
      await userService.deleteUser(user._id)
      toast.success('User deleted')
      loadUsers()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete user')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 ml-0 lg:ml-64 p-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Manage Users</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Change roles, ban accounts, or remove users.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : users.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-12 text-center text-gray-500">
            No users found.
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-x-auto">
            <table className="w-full text-left min-w-[720px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Role</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Joined</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {users.map((user) => {
                  const isSelf = user._id === currentUser?._id
                  const isBusy = busyId === user._id

                  return (
                    <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                      <td className="px-4 py-3 font-medium">
                        {user.name}
                        {isSelf && (
                          <span className="ml-2 text-xs text-primary-600 dark:text-primary-400">(you)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">{user.email}</td>
                      <td className="px-4 py-3">
                        <select
                          className="input-field text-sm py-1 capitalize"
                          value={user.role}
                          disabled={isSelf || isBusy}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          aria-label={`Role for ${user.name}`}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        {user.isBanned ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200">
                            <FiUserX size={12} /> Banned
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200">
                            <FiUserCheck size={12} /> Active
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm whitespace-nowrap">
                        {user.createdAt ? format(new Date(user.createdAt), 'PP') : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            disabled={isSelf || isBusy}
                            onClick={() => handleToggleBan(user)}
                            className="p-2 text-orange-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-40"
                            title={user.isBanned ? 'Unban user' : 'Ban user'}
                            aria-label={user.isBanned ? 'Unban user' : 'Ban user'}
                          >
                            <FiShield />
                          </button>
                          <button
                            type="button"
                            disabled={isSelf || isBusy}
                            onClick={() => handleDelete(user)}
                            className="p-2 text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-40"
                            title="Delete user"
                            aria-label="Delete user"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default ManageUsers
