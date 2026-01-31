import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalBikes: 0,
    totalUsers: 0,
    totalRevenue: 0,
    activeBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    monthlyGrowth: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Checking...');
  const [dataSource, setDataSource] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  // Test backend connection with multiple endpoints
  const testBackendConnection = async () => {
    const endpoints = [
      'http://localhost:5000/',
      'http://localhost:5000/api/',
      'http://localhost:5000/api/admin/setup',
      'http://localhost:5000/api/admin/auth/login'
    ];
    
    for (const endpoint of endpoints) {
      try {
        console.log(`🔍 Testing: ${endpoint}`);
        const response = await axios.get(endpoint, { timeout: 3000 });
        console.log(`✅ Endpoint accessible: ${endpoint}`);
        return { success: true, endpoint };
      } catch (error) {
        console.log(`❌ ${endpoint} not accessible: ${error.message}`);
      }
    }
    
    return { success: false, endpoint: null };
  };

  const checkAuth = async () => {
    // Check both possible token names
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token_admin');
    
    console.log("🔍 Checking auth with token:", token ? "Present" : "Missing");
    
    if (!token) {
      console.log("❌ No admin token found, redirecting to login");
      navigate('/admin/login');
      return;
    }

    try {
      setConnectionStatus('Testing connection...');
      
      // First test if backend is accessible
      const connection = await testBackendConnection();
      
      if (!connection.success) {
        console.log("⚠️ Backend not reachable, using mock data");
        loadMockData();
        setError('Backend server not reachable. Using demo data.');
        setConnectionStatus('❌ No connection');
        setLoading(false);
        return;
      }

      console.log(`✅ Backend found at: ${connection.endpoint}`);
      setConnectionStatus('Checking session...');
      
      // Try to authenticate
      try {
        // Try check-session endpoint
        const sessionResponse = await axios.get('http://localhost:5000/api/admin/auth/check-session', {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Cache-Control': 'no-cache'
          },
          timeout: 5000
        });

        if (sessionResponse.data.success) {
          setUser(sessionResponse.data.user);
          console.log("✅ Authenticated as:", sessionResponse.data.user.email);
          fetchDashboardData(token);
          return;
        }
      } catch (sessionError) {
        console.log("⚠️ Session check failed:", sessionError.message);
        
        // Try auto-login with default credentials
        try {
          const loginResponse = await axios.post('http://localhost:5000/api/admin/simple-login', {
            email: 'admin@example.com',
            password: '123456'
          }, {
            timeout: 5000
          });
          
          if (loginResponse.data.success) {
            const newToken = loginResponse.data.token;
            localStorage.setItem('adminToken', newToken);
            localStorage.setItem('token_admin', newToken);
            localStorage.setItem('adminUser', JSON.stringify(loginResponse.data.user));
            
            setUser(loginResponse.data.user);
            console.log("✅ Auto-login successful:", loginResponse.data.user.email);
            fetchDashboardData(newToken);
            return;
          }
        } catch (loginError) {
          console.log("❌ Auto-login also failed");
        }
      }
      
      // If we reach here, authentication failed
      throw new Error('Authentication failed');
      
    } catch (error) {
      console.error("❌ Auth check failed:", error.message);
      
      // Create demo user for UI
      setUser({
        name: 'Administrator',
        email: 'admin@example.com',
        role: 'admin'
      });
      
      // Use mock data
      loadMockData();
      setError('Authentication failed. Using demo mode.');
      setConnectionStatus('⚠️ Demo Mode');
      setLoading(false);
    }
  };

  const fetchDashboardData = async (token) => {
    try {
      setConnectionStatus('Fetching dashboard data...');
      console.log("📊 Fetching dashboard data...");
      
      // Try the dashboard endpoint
      const response = await axios.get('http://localhost:5000/api/admin/dashboard', {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        },
        timeout: 10000
      });
      
      console.log("📦 Dashboard API Response:", response.data);
      
      if (response.data.success) {
        // Set data source info
        setDataSource('✅ REAL DATABASE');
        
        // Set REAL stats from database
        if (response.data.stats) {
          setStats({
            totalBookings: response.data.stats.totalBookings || 0,
            totalBikes: response.data.stats.totalBikes || 0,
            totalUsers: response.data.stats.totalUsers || 0,
            totalRevenue: response.data.stats.totalRevenue || 0,
            activeBookings: response.data.stats.activeBookings || 0,
            pendingBookings: response.data.stats.pendingBookings || 0,
            cancelledBookings: response.data.stats.cancelledBookings || 0,
            monthlyGrowth: response.data.stats.monthlyGrowth || 0
          });
        }
        
        // Set REAL recent bookings
        if (response.data.recentBookings) {
          setRecentBookings(response.data.recentBookings);
        }
        
        setConnectionStatus('✅ Real data loaded');
        setError('');
        
      } else {
        throw new Error(response.data.message || 'API returned failure');
      }
      
    } catch (error) {
      console.error('❌ Dashboard fetch error:', {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        url: error.config?.url
      });
      
      setConnectionStatus('❌ Dashboard endpoint not found');
      
      if (error.response?.status === 404) {
        setError('Dashboard endpoint (api/admin/dashboard) not found on backend.');
        setDataSource('⚠️ Endpoint Missing');
      } else if (error.response?.status === 401) {
        setError('Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token_admin');
        navigate('/admin/login');
        return;
      } else if (error.code === 'ERR_NETWORK') {
        setError('Cannot connect to backend server.');
        setDataSource('❌ No Connection');
      } else {
        setError(`Error: ${error.message}`);
        setDataSource('⚠️ Error');
      }
      
      // Fall back to mock data
      loadMockData();
      
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    console.log("🔄 Loading mock data...");
    setDataSource('⚠️ DEMO DATA');
    
    // Mock data for demonstration
    setStats({
      totalBookings: 42,
      totalBikes: 8,
      totalUsers: 15,
      totalRevenue: 12500,
      activeBookings: 3,
      pendingBookings: 2,
      cancelledBookings: 1,
      monthlyGrowth: 12.5
    });
    
    setRecentBookings([
      { 
        _id: '1', 
        user: { name: 'Raj Sharma', email: 'raj@example.com' }, 
        bike: { name: 'Mountain Bike Pro' }, 
        totalPrice: 800, 
        status: 'Confirmed', 
        createdAt: new Date() 
      },
      { 
        _id: '2', 
        user: { name: 'Priya Singh', email: 'priya@example.com' }, 
        bike: { name: 'City Commuter' }, 
        totalPrice: 600, 
        status: 'Pending', 
        createdAt: new Date(Date.now() - 86400000) 
      },
      { 
        _id: '3', 
        user: { name: 'Amit Kumar', email: 'amit@example.com' }, 
        bike: { name: 'Road Racer' }, 
        totalPrice: 1200, 
        status: 'Completed', 
        createdAt: new Date(Date.now() - 172800000) 
      }
    ]);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('token_admin');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  const retryConnection = async () => {
    setLoading(true);
    setError('');
    setConnectionStatus('Retrying...');
    
    // Test backend connection first
    const connection = await testBackendConnection();
    
    if (connection.success) {
      console.log(`✅ Backend found at: ${connection.endpoint}`);
      
      // If backend is alive, try to re-authenticate
      const token = localStorage.getItem('adminToken') || localStorage.getItem('token_admin');
      if (token) {
        fetchDashboardData(token);
      } else {
        navigate('/admin/login');
      }
    } else {
      setError('Backend server not reachable. Make sure backend is running on port 5000.');
      setConnectionStatus('❌ No connection');
      loadMockData();
      setLoading(false);
    }
  };

  const goToBackendTest = () => {
    window.open('http://localhost:5000/', '_blank');
  };

  const goToDashboardEndpoint = () => {
    window.open('http://localhost:5000/api/admin/dashboard', '_blank');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'confirmed':
      case 'completed':
      case 'active':
        return '#10b981';
      case 'pending':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusBadge = (status) => (
    <span style={{
      padding: '4px 10px',
      borderRadius: '12px',
      fontSize: '12px',
      fontWeight: '600',
      backgroundColor: getStatusColor(status) + '20',
      color: getStatusColor(status),
      border: `1px solid ${getStatusColor(status)}30`
    }}>
      {status || 'Unknown'}
    </span>
  );

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid rgba(255,255,255,0.3)',
          borderTopColor: 'white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '20px'
        }}></div>
        <h3>Loading Admin Dashboard</h3>
        <p style={{ marginTop: '10px', opacity: 0.8 }}>{connectionStatus}</p>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      {/* Connection Status Bar */}
      <div style={{
        background: dataSource.includes('REAL') ? '#dcfce7' : '#fef3c7',
        border: `1px solid ${dataSource.includes('REAL') ? '#bbf7d0' : '#fde68a'}`,
        borderRadius: '10px',
        padding: '15px 20px',
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: dataSource.includes('REAL') ? '#10b981' : 
                       dataSource.includes('DEMO') ? '#f59e0b' : '#ef4444'
          }}></div>
          <div>
            <div style={{ fontWeight: '600', color: '#1f2937' }}>
              {dataSource.includes('REAL') ? '✅ Connected to Real Database' : 
               dataSource.includes('DEMO') ? '⚠️ Using Demo Data' : '❌ Connection Issue'}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>
              {connectionStatus} • Backend: http://localhost:5000
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={goToBackendTest}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Test Backend
          </button>
          <button 
            onClick={retryConnection}
            style={{
              padding: '8px 16px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Error Message - Show when endpoint is missing */}
      {error && error.includes('Dashboard endpoint') && (
        <div style={{
          marginBottom: '20px',
          padding: '20px',
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '10px',
          color: '#856404'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>⚠️ Backend Setup Required:</strong> 
              <p style={{ margin: '8px 0 0 0' }}>
                The admin dashboard endpoint is not configured on your backend.
              </p>
              <p style={{ margin: '5px 0', fontSize: '14px' }}>
                Your backend is running but missing the <code>/api/admin/dashboard</code> route.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={goToDashboardEndpoint}
                style={{
                  padding: '8px 16px',
                  background: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Check Endpoint
              </button>
              <button 
                onClick={() => window.open('http://localhost:5000/api/admin/setup', '_blank')}
                style={{
                  padding: '8px 16px',
                  background: '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Admin Setup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        padding: '20px',
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div>
          <h1 style={{ margin: 0, color: '#333' }}>Admin Dashboard</h1>
          <div style={{ marginTop: '8px', color: '#6b7280', fontSize: '14px' }}>
            Welcome back, <strong>{user?.name || 'Administrator'}</strong> • Role: {user?.role || 'Admin'}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: '600', color: '#333' }}>{user?.email || 'admin@example.com'}</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              Data Source: {dataSource}
            </div>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Info Box about Demo Mode */}
      {dataSource.includes('DEMO') && (
        <div style={{
          marginBottom: '20px',
          padding: '15px',
          background: '#e3f2fd',
          border: '1px solid #bbdefb',
          borderRadius: '8px',
          color: '#1565c0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ fontSize: '20px' }}>💡</div>
            <div>
              <strong>Demo Mode Active</strong>
              <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>
                You're viewing demo data. To see real data, ensure your backend has:
                1. MongoDB connection working
                2. <code>/api/admin/dashboard</code> endpoint implemented
                3. Real booking data in your database
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #10b981',
          position: 'relative'
        }}>
          {dataSource.includes('DEMO') && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '10px',
              background: '#fef3c7',
              color: '#92400e',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '600'
            }}>
              DEMO
            </div>
          )}
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Total Revenue</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '10px' }}>
            ₹{stats.totalRevenue.toLocaleString()}
          </div>
          {stats.monthlyGrowth !== 0 && (
            <div style={{
              fontSize: '14px',
              color: stats.monthlyGrowth >= 0 ? '#10b981' : '#ef4444',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}>
              {stats.monthlyGrowth >= 0 ? '↗' : '↘'} 
              {Math.abs(stats.monthlyGrowth)}% this month
            </div>
          )}
        </div>
        
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #3b82f6',
          position: 'relative'
        }}>
          {dataSource.includes('DEMO') && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '10px',
              background: '#fef3c7',
              color: '#92400e',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '600'
            }}>
              DEMO
            </div>
          )}
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Total Bookings</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '10px' }}>
            {stats.totalBookings}
          </div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              background: '#dcfce7',
              color: '#166534'
            }}>
              {stats.activeBookings} Active
            </span>
            <span style={{
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              background: '#fef3c7',
              color: '#92400e'
            }}>
              {stats.pendingBookings} Pending
            </span>
            <span style={{
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600',
              background: '#fee2e2',
              color: '#991b1b'
            }}>
              {stats.cancelledBookings} Cancelled
            </span>
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #8b5cf6',
          position: 'relative'
        }}>
          {dataSource.includes('DEMO') && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '10px',
              background: '#fef3c7',
              color: '#92400e',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '600'
            }}>
              DEMO
            </div>
          )}
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Total Users</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '10px' }}>
            {stats.totalUsers}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Registered Customers
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #f59e0b',
          position: 'relative'
        }}>
          {dataSource.includes('DEMO') && (
            <div style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              fontSize: '10px',
              background: '#fef3c7',
              color: '#92400e',
              padding: '2px 6px',
              borderRadius: '10px',
              fontWeight: '600'
            }}>
              DEMO
            </div>
          )}
          <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Available Bikes</h3>
          <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '10px' }}>
            {stats.totalBikes}
          </div>
          <div style={{ fontSize: '14px', color: '#6b7280' }}>
            Total in Fleet
          </div>
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px',
        position: 'relative'
      }}>
        {dataSource.includes('DEMO') && (
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            fontSize: '10px',
            background: '#fef3c7',
            color: '#92400e',
            padding: '2px 6px',
            borderRadius: '10px',
            fontWeight: '600'
          }}>
            DEMO DATA
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ margin: 0, color: '#333' }}>Recent Bookings</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              padding: '4px 10px',
              background: '#f3f4f6',
              borderRadius: '12px',
              fontSize: '12px',
              color: '#6b7280'
            }}>
              {recentBookings.length} records
            </span>
          </div>
        </div>
        
        {recentBookings.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: '600' }}>Customer</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: '600' }}>Bike</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: '600' }}>Amount</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: '600' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#6b7280', fontWeight: '600' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((booking, index) => (
                  <tr key={booking._id || index} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '12px' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#333' }}>
                          {booking.user?.name || 'Unknown Customer'}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {booking.user?.email || ''}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '12px', color: '#333' }}>
                      {booking.bike?.name || 'Unknown Bike'}
                    </td>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#333' }}>
                      ₹{booking.totalPrice || 0}
                    </td>
                    <td style={{ padding: '12px' }}>
                      {getStatusBadge(booking.status)}
                    </td>
                    <td style={{ padding: '12px', color: '#6b7280' }}>
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '40px 20px',
            color: '#9ca3af',
            background: '#f9fafb',
            borderRadius: '8px'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '10px' }}>No recent bookings found</div>
            <div style={{ fontSize: '14px' }}>
              {dataSource.includes('DEMO') 
                ? 'Demo mode: Bookings will appear when connected to real database' 
                : 'Bookings will appear here when customers make reservations'}
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '30px'
      }}>
        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <button 
            onClick={() => alert('This would open bike management in a real app')}
            style={{
              padding: '15px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Manage Bikes
          </button>
          <button 
            onClick={() => alert('This would open user management in a real app')}
            style={{
              padding: '15px',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Manage Users
          </button>
          <button 
            onClick={() => alert('This would open booking management in a real app')}
            style={{
              padding: '15px',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Manage Bookings
          </button>
          <button 
            onClick={() => alert('This would open settings in a real app')}
            style={{
              padding: '15px',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'left',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            Settings
          </button>
        </div>
      </div>

      {/* Backend Info */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '20px',
        border: '1px solid #e9ecef'
      }}>
        <h4 style={{ margin: '0 0 15px 0', color: '#333' }}>Backend Status</h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Server</div>
            <div style={{ fontWeight: '600', color: '#333' }}>http://localhost:5000</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Status</div>
            <div style={{ 
              fontWeight: '600', 
              color: connectionStatus.includes('✅') ? '#10b981' : '#f59e0b'
            }}>
              {connectionStatus}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Data Source</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{dataSource}</div>
          </div>
          <div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Last Updated</div>
            <div style={{ fontWeight: '600', color: '#333' }}>{new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        textAlign: 'center',
        color: '#6b7280',
        fontSize: '14px',
        borderTop: '1px solid #e5e7eb'
      }}>
        <div>© {new Date().getFullYear()} Bike Rental Admin Dashboard</div>
        <div style={{ marginTop: '5px', fontSize: '12px' }}>
          Status: {dataSource} | Backend: http://localhost:5000 | Updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;