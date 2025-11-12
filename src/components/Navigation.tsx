'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from './lib/auth/useAuth'

// Define types for navigation items
interface NavItem {
    href: string
    label: string
    isButton?: boolean
    onClick?: () => void
}

export default function Navigation() {
    const pathname = usePathname()
    const { isAuthenticated, isAdmin, user, logout } = useAuth()

    const handleLogout = () => {
        logout()
        window.location.href = '/'
    }

    // Color palette based on #884499
    const colors = {
        primary: '#884499',
        primaryLight: '#9a5aaa',
        primaryDark: '#773388',
        primaryLighter: '#ac75bb',
        primaryDarker: '#662277',
        background: '#faf7fb',
        textPrimary: '#1f2937',
        textSecondary: '#6b7280',
        textLight: '#9ca3af',
        border: '#e9d9ee',
        hoverLight: '#f3edf5'
    }

    // Navigation items base
    const baseNavItems: NavItem[] = [
        { href: '/', label: 'Sự Kiện' },
    ]

    // Admin nav item - only show if user is admin
    const adminNavItem: NavItem = { href: '/admin', label: 'Quản Lý' }

    // Auth nav items - ✅ Fixed Vietnamese typo
    const authNavItems: NavItem[] = isAuthenticated
        ? [
            { href: '/dashboard', label: 'Dashboard' },
            {
                href: '#',
                label: 'Đăng Xuất', // ✅ Fixed: Đăng Xuất
                onClick: handleLogout,
                isButton: true
            }
        ]
        : [
            { href: '/login', label: 'Đăng Nhập' } // ✅ Fixed: Đăng Nhập
        ]

    // Combine nav items based on user role
    const navItems: NavItem[] = [
        ...baseNavItems,
        ...(isAdmin ? [adminNavItem] : []),
        ...authNavItems
    ]

    return (
        <nav style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(136, 68, 153, 0.1)',
            borderBottom: `1px solid ${colors.border}`,
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 2rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '70px'
            }}>
                {/* Logo */}
                <Link href="/" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    textDecoration: 'none',
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: colors.textPrimary
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: colors.primary,
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        boxShadow: `0 2px 8px ${colors.primary}40`
                    }}>
                        C
                    </div>
                    <span style={{
                        background: `linear-gradient(135deg, ${colors.primary}, ${colors.primaryLight})`,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        C-Event
                    </span>
                </Link>

                {/* User Info & Navigation Items */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2rem'
                }}>
                    {/* User Info - Only show when authenticated */}
                    {isAuthenticated && user && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            padding: '0.5rem 1rem',
                            backgroundColor: colors.background,
                            borderRadius: '8px',
                            border: `1px solid ${colors.border}`,
                            boxShadow: `0 1px 3px ${colors.primary}10`
                        }}>
                            <div style={{
                                width: '32px',
                                height: '32px',
                                backgroundColor: colors.primary,
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '0.875rem',
                                fontWeight: 'bold',
                                boxShadow: `0 2px 4px ${colors.primary}40`
                            }}>
                                {user.name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    color: colors.textPrimary
                                }}>
                                    {user.name || user.email}
                                </span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{
                                        fontSize: '0.75rem',
                                        color: colors.textSecondary
                                    }}>
                                        {user.email}
                                    </span>
                                    {isAdmin && (
                                        <span style={{
                                            fontSize: '0.625rem',
                                            backgroundColor: colors.primary,
                                            color: 'white',
                                            padding: '0.125rem 0.5rem',
                                            borderRadius: '12px',
                                            fontWeight: '500',
                                            boxShadow: `0 1px 3px ${colors.primary}40`
                                        }}>
                                            QUẢN TRỊ VIÊN
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Items */}
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href
                            const isButton = item.isButton // ✅ Fixed: TypeScript knows this is optional

                            if (isButton) {
                                return (
                                    <button
                                        key={item.label}
                                        onClick={item.onClick} // ✅ Fixed: TypeScript knows this is optional
                                        style={{
                                            border: 'none',
                                            cursor: 'pointer',
                                            padding: '0.75rem 1.25rem',
                                            borderRadius: '8px',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            transition: 'all 0.2s',
                                            backgroundColor: colors.primary,
                                            color: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            boxShadow: `0 2px 4px ${colors.primary}40`
                                        }}
                                        onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = colors.primaryDark
                                            e.currentTarget.style.boxShadow = `0 4px 8px ${colors.primary}60`
                                        }}
                                        onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = colors.primary
                                            e.currentTarget.style.boxShadow = `0 2px 4px ${colors.primary}40`
                                        }}
                                    >
                                        {item.label}
                                    </button>
                                )
                            }

                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    style={{
                                        textDecoration: 'none',
                                        padding: '0.75rem 1.25rem',
                                        borderRadius: '8px',
                                        fontSize: '0.95rem',
                                        fontWeight: '500',
                                        transition: 'all 0.2s',
                                        backgroundColor: isActive ? colors.primary : 'transparent',
                                        color: isActive ? 'white' : colors.textSecondary,
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        boxShadow: isActive ? `0 2px 8px ${colors.primary}40` : 'none'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = colors.hoverLight
                                            e.currentTarget.style.color = colors.primary
                                            e.currentTarget.style.boxShadow = `0 2px 4px ${colors.primary}20`
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        if (!isActive) {
                                            e.currentTarget.style.backgroundColor = 'transparent'
                                            e.currentTarget.style.color = colors.textSecondary
                                            e.currentTarget.style.boxShadow = 'none'
                                        }
                                    }}
                                >
                                    {item.label}
                                    {item.href === '/admin' && isAdmin && (
                                        <span style={{
                                            width: '6px',
                                            height: '6px',
                                            backgroundColor: colors.primaryLighter,
                                            borderRadius: '50%',
                                            boxShadow: `0 0 6px ${colors.primaryLighter}`
                                        }}></span>
                                    )}
                                </Link>
                            )
                        })}
                    </div>
                </div>
            </div>
        </nav>
    )
}