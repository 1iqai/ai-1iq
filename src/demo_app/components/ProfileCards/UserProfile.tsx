
import { useAuth } from '../../hooks/useAuth'
import { getRole } from '../../utility/getRole'

const UserProfile = () => {
    const { user } = useAuth()
    
    const initials = user.username
        ? user.username.slice(0, 2).toUpperCase()
        : "US"

    return (
        <>
            <div className='flex flex-row w-full gap-4'>
                {user.image ? (
                    <img
                        src={user.image}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 bg-brand-primary-100 text-brand-primary-600 rounded-full flex items-center justify-center font-semibold select-none">
                        {initials}
                    </div>
                )}
                <div className="text-left lg:block">
                    <p className="text-sm font-medium text-txt-primary-light dark:text-txt-primary-dark">
                        {user.username || "User"}
                    </p>
                    <p className="text-xs text-txt-secondary-light dark:text-txt-secondary-dark">
                        {getRole(user.role)}
                    </p>
                </div>
            </div>
        </>
    )
}

export default UserProfile