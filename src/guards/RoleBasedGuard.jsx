import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

RoleBasedGuard.propTypes = {
    accessibleRoles: PropTypes.array,
    children: PropTypes.node
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.role) {
            if (!accessibleRoles.includes(user.role)) {
                if (user.role === 'owner') {
                    navigate('/dashboard/owner', { replace: true });
                } else {
                    navigate('/dashboard/user', { replace: true });
                }
            }
        }
    }, [accessibleRoles, user, navigate]);

    if (!accessibleRoles.includes(user?.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="rounded-md bg-red-50 p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">
                                    Permission Denied
                                </h3>
                                <div className="mt-2 text-sm text-red-700">
                                    <p>
                                        You do not have permission to access this page
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return <>{children}</>;
} 