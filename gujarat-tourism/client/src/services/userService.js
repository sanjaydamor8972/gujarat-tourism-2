import api from './api'

const userService = {
  getAllUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },

  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data)
    return response.data
  },

  setUserBanned: async (id, isBanned) => {
    const response = await api.patch(`/users/${id}/ban`, { isBanned })
    return response.data
  },

  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`)
    return response.data
  },
}

export default userService
