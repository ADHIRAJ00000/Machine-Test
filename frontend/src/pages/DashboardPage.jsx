import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users, FileText, CheckCircle } from 'lucide-react';

const DashboardPage = () => {
    const { userInfo } = useAuth();
    const [stats, setStats] = useState({ agents: 0, items: 0 });
    const [myList, setMyList] = useState([]);

    const getBadgeClass = (status) => {
        if (!status) return 'badge pending';
        return `badge ${status.toLowerCase().replace(' ', '-')}`;
    };

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                if (userInfo.role === 'admin') {
                    const { data: agents } = await axios.get('/api/users/agents', {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    const { data: lists } = await axios.get('/api/upload/lists', {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    setStats({
                        agents: Array.isArray(agents) ? agents.length : 0,
                        items: Array.isArray(lists) ? lists.length : 0
                    });
                } else {
                    const { data: list } = await axios.get(`/api/upload/agent-list/${userInfo._id}`, {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    });
                    setMyList(Array.isArray(list) ? list : []);
                }
            } catch (error) {
                console.error('Error fetching dashboard data', error);
            }
        };
        fetchDashboardData();
    }, [userInfo]);

    return (
        <div className="animate-fade-in">
            <h1 style={{ marginBottom: '2rem' }}>Hello, {userInfo.name} 👋</h1>

            {userInfo.role === 'admin' ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
                    <div className="glass card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '12px', color: 'var(--primary)' }}>
                                <Users size={32} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)' }}>Total Agents</p>
                                <h3>{stats.agents}</h3>
                            </div>
                        </div>
                    </div>
                    <div className="glass card">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ padding: '1rem', background: 'rgba(236, 72, 153, 0.1)', borderRadius: '12px', color: 'var(--secondary)' }}>
                                <FileText size={32} />
                            </div>
                            <div>
                                <p style={{ color: 'var(--text-muted)' }}>Total Items</p>
                                <h3>{stats.items}</h3>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="glass card">
                    <h2 style={{ marginBottom: '1.5rem' }}>My Tasks</h2>
                    {myList.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No tasks assigned to you yet.</p>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--glass-border)' }}>
                                        <th style={{ padding: '1rem' }}>Name</th>
                                        <th style={{ padding: '1rem' }}>Phone</th>
                                        <th style={{ padding: '1rem' }}>Notes</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {myList.map((item) => (
                                        <tr key={item._id} style={{ borderBottom: '1px solid var(--glass-border)' }}>
                                            <td style={{ padding: '1rem' }}>{item.firstName}</td>
                                            <td style={{ padding: '1rem' }}>{item.phone}</td>
                                            <td style={{ padding: '1rem' }}>{item.notes}</td>
                                            <td style={{ padding: '1rem' }}>
                                                <span className={getBadgeClass(item.status)}>
                                                    {item.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <select
                                                    value={item.status || 'Pending'}
                                                    onChange={async (e) => {
                                                        const newStatus = e.target.value;
                                                        try {
                                                            await axios.put(`/api/upload/item/${item._id}`,
                                                                { status: newStatus },
                                                                { headers: { Authorization: `Bearer ${userInfo.token}` } }
                                                            );
                                                            setMyList(myList.map(i => i._id === item._id ? { ...i, status: newStatus } : i));
                                                        } catch (error) {
                                                            console.error('Error updating status', error);
                                                        }
                                                    }}
                                                    className="glass-input"
                                                    style={{ padding: '0.25rem 0.5rem', width: 'auto' }}
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Called">Called</option>
                                                    <option value="Interested">Interested</option>
                                                    <option value="Not Interested">Not Interested</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
