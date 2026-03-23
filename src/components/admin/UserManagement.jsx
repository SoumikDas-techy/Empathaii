import { useState, useEffect } from 'react'
import { PencilIcon, TrashIcon, UserPlusIcon, ChevronRightIcon, MagnifyingGlassIcon, KeyIcon, ArrowLeftIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline'
import userService from '../../services/userService';

export default function UserManagement() {
    const [activeTab, setActiveTab] = useState('student')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSchool, setSelectedSchool] = useState(null)
    const [resetPasswordUser, setResetPasswordUser] = useState(null)
    const [newPassword, setNewPassword] = useState('')
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingUser, setEditingUser] = useState(null)
    const [expandedRow, setExpandedRow] = useState(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'student',
        password: '',
        className: '',
        school: '',
        parentName: '',
        phoneNumber: '',
        dateOfBirth: '',
        address: '',
        bloodGroup: '',
        emergencyContact: '',
        license: '',
        department: '',
    })

    const roles = [
        { id: 'student', label: 'Students' },
        { id: 'school_admin', label: 'School Admin' },
        { id: 'psychologist', label: 'Psychologists' },
        { id: 'content_admin', label: 'Content Admins' },
    ]

    const addButtonLabels = {
        student: "Add Students",
        school_admin: "Add School Admins",
        psychologist: "Add Psychologists",
        content_admin: "Add Content Admins",
    }

    const roleTitles = {
        student: "Student",
        school_admin: "School Admin",
        psychologist: "Psychologist",
        content_admin: "Content Admin",
    }

    useEffect(() => {
        loadUsers()
    }, [activeTab, selectedSchool, searchTerm])

    const loadUsers = async () => {
        setLoading(true)
        setError(null)

        try {
            let response

            if (searchTerm) {
                console.log('Searching users:', { activeTab, searchTerm })
                response = await userService.searchUsers(activeTab, searchTerm)
            } else if (selectedSchool && activeTab === 'student') {
                console.log('Loading users by school:', { activeTab, selectedSchool })
                response = await userService.getUsersByRoleAndSchool(activeTab, selectedSchool)
            } else if (activeTab) {
                console.log('Loading users by role:', activeTab)
                response = await userService.getUsersByRole(activeTab)
            } else {
                console.log('Loading all users')
                response = await userService.getAllUsers()
            }

            setUsers(response.data)
            console.log('Users loaded:', response.data.length)
        } catch (err) {
            console.error('Error loading users:', err)
            setError(err.response?.data?.message || 'Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    const generatePassword = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        let pass = ''
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setFormData(prev => ({ ...prev, password: pass }))
    }

    const generatePasswordForReset = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
        let pass = ''
        for (let i = 0; i < 12; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        setNewPassword(pass)
    }

    const handleOpenModal = (user = null) => {
        if (user) {
            setEditingUser(user)
            setFormData({
                ...user,
                password: '',
            })
        } else {
            setEditingUser(null)
            setFormData({
                name: '',
                email: '',
                role: activeTab,
                password: '',
                className: '',
                school: activeTab === 'student' && selectedSchool ? selectedSchool : '',
                parentName: '',
                phoneNumber: '',
                dateOfBirth: '',
                address: '',
                bloodGroup: '',
                emergencyContact: '',
                license: '',
                department: '',
            })
            generatePassword()
        }
        setIsModalOpen(true)
    }

    const handleSaveUser = async () => {
        if (!formData.name || !formData.email || !formData.password) {
            alert('Please fill in all required fields')
            return
        }

        setLoading(true)

        try {
            if (editingUser) {
                console.log('Updating user:', editingUser.id)
                const response = await userService.updateUser(editingUser.id, formData)
                console.log('User updated:', response.data)
                alert('User updated successfully!')
            } else {
                console.log('Creating new user:', formData)
                const userData = {
                    ...formData,
                    role: formData.role.toUpperCase()
                }
                const response = await userService.createUser(userData)
                console.log('User created:', response.data)
                alert('User created successfully!')
            }

            setIsModalOpen(false)
            setEditingUser(null)
            
            await loadUsers()
            
        } catch (err) {
            console.error('Error saving user:', err)
            const errorMessage = err.response?.data?.message || 'Failed to save user'
            alert('Error: ' + errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteUser = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return
        }

        setLoading(true)

        try {
            console.log('Deleting user:', id)
            await userService.deleteUser(id)
            console.log('User deleted successfully')
            alert('User deleted successfully!')
            
            await loadUsers()
            
        } catch (err) {
            console.error('Error deleting user:', err)
            const errorMessage = err.response?.data?.message || 'Failed to delete user'
            alert('Error: ' + errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handleResetPassword = (user) => {
        setResetPasswordUser(user)
        generatePasswordForReset()
    }

    const confirmResetPassword = async () => {
        if (!resetPasswordUser || !newPassword) {
            alert('Please generate a password first')
            return
        }

        setLoading(true)

        try {
            console.log('Resetting password for user:', resetPasswordUser.id)
            const response = await userService.resetPassword(resetPasswordUser.id, newPassword)
            console.log('Password reset response:', response.data)
            alert('Password reset successfully!\nNew Password: ' + response.data.newPassword)
            setResetPasswordUser(null)
            setNewPassword('')
        } catch (err) {
            console.error('Error resetting password:', err)
            const errorMessage = err.response?.data?.message || 'Failed to reset password'
            alert('Error: ' + errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const toggleRow = (userId) => {
        setExpandedRow(expandedRow === userId ? null : userId)
    }

    const filteredUsers = users
        .filter(u => u.role?.toLowerCase() === activeTab.toLowerCase())
        .filter(u => !selectedSchool || u.school === selectedSchool)
        .filter(u => {
            if (!searchTerm) return true
            const search = searchTerm.toLowerCase()
            return (
                u.name?.toLowerCase().includes(search) ||
                u.email?.toLowerCase().includes(search) ||
                (u.school && u.school.toLowerCase().includes(search)) ||
                (u.parentName && u.parentName.toLowerCase().includes(search)) ||
                (u.phoneNumber && u.phoneNumber.includes(search))
            )
        })

    const getSchoolsData = () => {
        const studentUsers = users.filter(u => u.role?.toLowerCase() === 'student')
            .filter(u => !searchTerm ||
                u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (u.school && u.school.toLowerCase().includes(searchTerm.toLowerCase()))
            )

        const schoolsMap = {}
        studentUsers.forEach(u => {
            const schoolName = u.school || 'Unknown School'
            if (!schoolsMap[schoolName]) {
                schoolsMap[schoolName] = { count: 0, students: [] }
            }
            schoolsMap[schoolName].count++
            schoolsMap[schoolName].students.push(u)
        })

        return schoolsMap
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-center">
                    <p className="text-red-600 font-semibold">{error}</p>
                    <button
                        onClick={loadUsers}
                        className="mt-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    const schoolsData = getSchoolsData()
    const schoolNames = Object.keys(schoolsData)

    return (
        <div>
            <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex space-x-8">
                    {roles.map((role) => (
                        <button
                            key={role.id}
                            onClick={() => {
                                setActiveTab(role.id)
                                setExpandedRow(null)
                                setSelectedSchool(null)
                            }}
                            className={
                                activeTab === role.id
                                    ? 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm border-purple-600 text-purple-600'
                                    : 'whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }
                        >
                            {role.label}
                        </button>
                    ))}
                </nav>
            </div>

            <div className="mb-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                    <div className="flex items-center gap-3">
                        {selectedSchool && activeTab === 'student' && (
                            <button
                                onClick={() => setSelectedSchool(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                            </button>
                        )}
                        <h3 className="text-lg font-medium text-gray-900">
                            {selectedSchool ? selectedSchool + ' Students' : 'Manage ' + (roles.find(r => r.id === activeTab)?.label || '')}
                        </h3>
                    </div>
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700"
                    >
                        <UserPlusIcon className="w-5 h-5 mr-2" />
                        {addButtonLabels[activeTab] || "Add User"}
                    </button>
                </div>

                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, school, parent name, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                    />
                    {searchTerm && (
                        <button
                            onClick={() => setSearchTerm('')}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                        >
                            <span className="text-sm">Clear</span>
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'student' && !selectedSchool ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {schoolNames.length === 0 ? (
                        <div className="col-span-full text-center text-gray-500 py-10">
                            No schools found matching your search.
                        </div>
                    ) : (
                        schoolNames.map(schoolName => (
                            <div
                                key={schoolName}
                                onClick={() => setSelectedSchool(schoolName)}
                                className="bg-white overflow-hidden rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group"
                            >
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                                            <BuildingLibraryIcon className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <div className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1 rounded-full">
                                            {schoolsData[schoolName].count} Students
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1">{schoolName}</h3>
                                    <p className="text-sm text-gray-500">Click to view student list</p>
                                </div>
                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                    <div className="flex -space-x-2 overflow-hidden">
                                        {schoolsData[schoolName].students.slice(0, 5).map((student) => (
                                            <div
                                                key={student.id}
                                                className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-purple-200 flex items-center justify-center text-xs font-bold text-purple-700"
                                                title={student.name}
                                            >
                                                {student.name.charAt(0)}
                                            </div>
                                        ))}
                                        {schoolsData[schoolName].count > 5 && (
                                            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                                                +{schoolsData[schoolName].count - 5}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            {activeTab === 'student' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8"></th>
                                            )}
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                            {activeTab === 'student' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                            )}
                                            {activeTab === 'student' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                                            )}
                                            {activeTab === 'school_admin' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                                            )}
                                            {activeTab === 'psychologist' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">License ID</th>
                                            )}
                                            {activeTab === 'content_admin' && (
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                                            )}
                                            <th className="relative px-6 py-3">
                                                <span className="sr-only">Actions</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredUsers.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-8 text-center">
                                                    <div className="text-gray-500">
                                                        <p className="text-sm">No users found.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <UserTableRow
                                                    key={user.id}
                                                    user={user}
                                                    activeTab={activeTab}
                                                    expandedRow={expandedRow}
                                                    toggleRow={toggleRow}
                                                    handleOpenModal={handleOpenModal}
                                                    handleResetPassword={handleResetPassword}
                                                    handleDeleteUser={handleDeleteUser}
                                                />
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {isModalOpen && (
                <UserModal
                    editingUser={editingUser}
                    activeTab={activeTab}
                    roleTitles={roleTitles}
                    formData={formData}
                    setFormData={setFormData}
                    generatePassword={generatePassword}
                    handleSaveUser={handleSaveUser}
                    setIsModalOpen={setIsModalOpen}
                />
            )}

            {resetPasswordUser && (
                <ResetPasswordModal
                    resetPasswordUser={resetPasswordUser}
                    newPassword={newPassword}
                    generatePasswordForReset={generatePasswordForReset}
                    confirmResetPassword={confirmResetPassword}
                    setResetPasswordUser={setResetPasswordUser}
                />
            )}
        </div>
    )
}

function UserTableRow({ user, activeTab, expandedRow, toggleRow, handleOpenModal, handleResetPassword, handleDeleteUser }) {
    return (
        <>
            <tr className="hover:bg-gray-50 transition-colors">
                {activeTab === 'student' && (
                    <td className="px-6 py-4 whitespace-nowrap">
                        <button
                            onClick={() => toggleRow(user.id)}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                        >
                            <ChevronRightIcon
                                className={
                                    expandedRow === user.id
                                        ? "w-5 h-5 transition-transform duration-300 rotate-90 text-purple-600"
                                        : "w-5 h-5 transition-transform duration-300"
                                }
                            />
                        </button>
                    </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{user.email}</div>
                </td>
                {activeTab === 'student' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.className}</td>
                )}
                {activeTab === 'student' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.school}</td>
                )}
                {activeTab === 'school_admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.school}</td>
                )}
                {activeTab === 'psychologist' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.license}</td>
                )}
                {activeTab === 'content_admin' && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.department}</td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                        onClick={() => handleOpenModal(user)}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        title="Edit User"
                    >
                        <PencilIcon className="w-5 h-5 inline" />
                    </button>
                    <button
                        onClick={() => handleResetPassword(user)}
                        className="text-purple-600 hover:text-purple-900 mr-3"
                        title="Reset Password"
                    >
                        <KeyIcon className="w-5 h-5 inline" />
                    </button>
                    <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete User"
                    >
                        <TrashIcon className="w-5 h-5 inline" />
                    </button>
                </td>
            </tr>
            {activeTab === 'student' && expandedRow === user.id && (
                <tr>
                    <td colSpan="6" className="p-0 border-0">
                        <div className="bg-purple-50 px-6 py-6 border-t border-purple-100">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                <DetailItem emoji="👨‍👩‍👧" label="Parent Name" value={user.parentName} />
                                <DetailItem emoji="📞" label="Phone Number" value={user.phoneNumber} />
                                <DetailItem emoji="🎂" label="Date of Birth" value={user.dateOfBirth} />
                                <DetailItem emoji="🩸" label="Blood Group" value={user.bloodGroup} />
                                <DetailItem emoji="🚨" label="Emergency Contact" value={user.emergencyContact} />
                                <DetailItem emoji="📍" label="Address" value={user.address} />
                            </div>
                        </div>
                    </td>
                </tr>
            )}
        </>
    )
}

function DetailItem({ emoji, label, value }) {
    return (
        <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
            <p className="text-xs uppercase tracking-wide text-gray-400 mb-1 flex items-center gap-2">
                <span>{emoji}</span>
                {label}
            </p>
            <p className="text-sm font-semibold text-gray-800">
                {value || "N/A"}
            </p>
        </div>
    )
}

function UserModal({ editingUser, activeTab, roleTitles, formData, setFormData, generatePassword, handleSaveUser, setIsModalOpen }) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setIsModalOpen(false)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
                    <div>
                        <h3 className="text-lg leading-6 font-medium text-gray-900">
                            {editingUser ? 'Edit ' + (roleTitles[activeTab] || 'User') : 'Create New ' + (roleTitles[activeTab] || 'User')}
                        </h3>
                        <div className="mt-4 space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Aarav Sharma"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="e.g., aarav.sharma@example.com"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Password</label>
                                <div className="mt-1 flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        readOnly={!editingUser}
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300"
                                        placeholder={editingUser ? "(Unchanged)" : "Generate a password"}
                                    />
                                    <button
                                        type="button"
                                        onClick={generatePassword}
                                        className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100"
                                    >
                                        Generate
                                    </button>
                                </div>
                            </div>

                            {activeTab === 'student' && (
                                <>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Class</label>
                                            <select
                                                value={formData.className}
                                                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="">Select Class</option>
                                                <option value="1st Standard">1st Standard</option>
                                                <option value="2nd Standard">2nd Standard</option>
                                                <option value="3rd Standard">3rd Standard</option>
                                                <option value="4th Standard">4th Standard</option>
                                                <option value="5th Standard">5th Standard</option>
                                                <option value="6th Standard">6th Standard</option>
                                                <option value="7th Standard">7th Standard</option>
                                                <option value="8th Standard">8th Standard</option>
                                                <option value="9th Standard">9th Standard</option>
                                                <option value="10th Standard">10th Standard</option>
                                                <option value="11th Standard">11th Standard</option>
                                                <option value="12th Standard">12th Standard</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">School</label>
                                            <input
                                                type="text"
                                                value={formData.school}
                                                onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                                placeholder="e.g., Delhi Public School"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Parent/Guardian Name</label>
                                            <input
                                                type="text"
                                                value={formData.parentName}
                                                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                                                placeholder="e.g., Rajesh Sharma"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                            <input
                                                type="tel"
                                                value={formData.phoneNumber}
                                                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                                placeholder="+91 98765 43210"
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                                            <input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Blood Group</label>
                                            <select
                                                value={formData.bloodGroup}
                                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                            >
                                                <option value="">Select Blood Group</option>
                                                <option value="A+">A+</option>
                                                <option value="A-">A-</option>
                                                <option value="B+">B+</option>
                                                <option value="B-">B-</option>
                                                <option value="AB+">AB+</option>
                                                <option value="AB-">AB-</option>
                                                <option value="O+">O+</option>
                                                <option value="O-">O-</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Emergency Contact</label>
                                        <input
                                            type="tel"
                                            value={formData.emergencyContact}
                                            onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                            placeholder="+91 98765 43211"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Address</label>
                                        <textarea
                                            value={formData.address}
                                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            rows="2"
                                            placeholder="e.g., Sector 12, Dwarka, New Delhi"
                                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                        />
                                    </div>
                                </>
                            )}

                            {activeTab === 'school_admin' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">School Name</label>
                                    <input
                                        type="text"
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                            )}

                            {activeTab === 'psychologist' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">License ID</label>
                                    <input
                                        type="text"
                                        value={formData.license}
                                        onChange={(e) => setFormData({ ...formData, license: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    />
                                </div>
                            )}

                            {activeTab === 'content_admin' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Department</label>
                                    <select
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                                    >
                                        <option value="">Select Department</option>
                                        <option value="Curriculum">Curriculum</option>
                                        <option value="Assessment">Assessment</option>
                                        <option value="Technical">Technical</option>
                                    </select>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                            type="button"
                            onClick={handleSaveUser}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 sm:col-start-2 sm:text-sm"
                        >
                            Save
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ResetPasswordModal({ resetPasswordUser, newPassword, generatePasswordForReset, confirmResetPassword, setResetPasswordUser }) {
    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setResetPasswordUser(null)}></div>
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
                <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
                    <div>
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-purple-100">
                            <KeyIcon className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="mt-3 text-center sm:mt-5">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Reset Password
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-500">
                                    Reset password for <span className="font-semibold text-gray-900">{resetPasswordUser.name}</span>
                                </p>
                            </div>
                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-700 text-left mb-2">
                                    New Password
                                </label>
                                <div className="flex rounded-md shadow-sm">
                                    <input
                                        type="text"
                                        readOnly
                                        value={newPassword}
                                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-l-md focus:ring-purple-500 focus:border-purple-500 sm:text-sm border-gray-300 bg-gray-50"
                                    />
                                    <button
                                        type="button"
                                        onClick={generatePasswordForReset}
                                        className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        Regenerate
                                    </button>
                                </div>
                                <p className="mt-2 text-xs text-gray-500 text-left">
                                    <strong>Important:</strong> Copy this password before confirming.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                        <button
                            type="button"
                            onClick={confirmResetPassword}
                            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 sm:col-start-2 sm:text-sm"
                        >
                            Confirm Reset
                        </button>
                        <button
                            type="button"
                            onClick={() => setResetPasswordUser(null)}
                            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:col-start-1 sm:text-sm"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}