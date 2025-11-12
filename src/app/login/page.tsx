import LoginForm from '../../components/auth/LoginForm'

export default function LoginPage() {
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #8888cc 0%, #bb5688 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                padding: '2.5rem',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#1f2937',
                        marginBottom: '0.5rem'
                    }}>
                        Đăng Nhập
                    </h1>
                    <p style={{ color: '#6b7280' }}>
                        Truy cập hệ thống quản lý sự kiện
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}