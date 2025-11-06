    'use client'
    import Link from 'next/link'
    import { usePathname } from 'next/navigation'

    export default function Navigation() {
        const pathname = usePathname()

    const navItems = [
        { href: '/', label: 'Sự Kiện' },
        { href: '/admin', label: 'Quản Lý' },
        { href: '/login', label: 'Đăng Nhập' }
    ]

    return (
        <nav style={{
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            borderBottom: '1px solid #e5e7eb',
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
                    color: '#1f2937'
                }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        backgroundColor: '#884499',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '1.5rem',
                        fontWeight: 'bold'
                    }}>
                        C
                    </div>
                    <span>C-Event</span>
                </Link>

                {/* Navigation Items */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {navItems.map((item) => (
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
                                backgroundColor: pathname === item.href ? '#884499' : 'transparent',
                                color: pathname === item.href ? 'white' : '#6b7280',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    )
}