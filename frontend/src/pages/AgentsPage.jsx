import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { UserPlus, Mail, Phone, Lock, Search, Trash2 } from 'lucide-react';

const AgentsPage = () => {
    const { userInfo } = useAuth();
    const [agents, setAgents] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
    });

    const [confirmingDelete, setConfirmingDelete] = useState(null);

    const fetchAgents = async () => {
        try {
            const { data } = await axios.get('/api/users/agents', {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            setAgents(data);
        } catch (error) {
            toast.error('Failed to load agents');
        }
    };

    useEffect(() => {
        fetchAgents();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/users/agents', formData, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('Agent added successfully');
            setFormData({ name: '', email: '', mobile: '', password: '' });
            fetchAgents();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to add agent');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`/api/users/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('Agent deleted');
            setConfirmingDelete(null);
            fetchAgents();
        } catch (error) {
            toast.error('Failed to delete agent');
        }
    };

    return (
        <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
            <div className="glass card">
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <UserPlus /> Add New Agent
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Name</label>
                        <input
                            type="text"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="agent@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Mobile Number (with Country Code)</label>
                        <input
                            type="text"
                            placeholder="+91 9876543210"
                            value={formData.mobile}
                            onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Create Agent
                    </button>
                </form>
            </div>

            <div className="glass card">
                <h2 style={{ marginBottom: '1.5rem' }}>Registered Agents</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {agents.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)' }}>No agents registered yet.</p>
                    ) : (
                        agents.map((agent) => (
                            <div key={agent._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <h4 style={{ color: 'white' }}>{agent.name}</h4>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Mail size={14} /> {agent.email}
                                    </p>
                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                        <Phone size={14} /> {agent.mobile}
                                    </p>
                                </div>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', color: 'var(--accent)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        AGENT
                                    </div>
                                    {confirmingDelete === agent._id ? (
                                        <div style={{ display: 'flex', gap: '0.25rem' }}>
                                            <button
                                                onClick={() => handleDelete(agent._id)}
                                                className="btn"
                                                style={{ padding: '0.4rem', backgroundColor: 'rgba(220, 38, 38, 0.2)', color: '#ef4444', border: '1px solid rgba(220, 38, 38, 0.4)' }}
                                            >
                                                Confirm
                                            </button>
                                            <button
                                                onClick={() => setConfirmingDelete(null)}
                                                className="btn"
                                                style={{ padding: '0.4rem', backgroundColor: 'rgba(107, 114, 128, 0.2)', color: '#9ca3af', border: '1px solid rgba(107, 114, 128, 0.4)' }}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setConfirmingDelete(agent._id)}
                                            className="btn"
                                            style={{ padding: '0.4rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentsPage;
