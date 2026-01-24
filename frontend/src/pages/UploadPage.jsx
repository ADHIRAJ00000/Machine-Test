import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Upload as UploadIcon, FileSpreadsheet, CheckCircle, List, Trash2 } from 'lucide-react';

const UploadPage = () => {
    const { userInfo } = useAuth();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [distributedLists, setDistributedLists] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [confirmingDelete, setConfirmingDelete] = useState(null);
    const [confirmingClear, setConfirmingClear] = useState(false);

    const fetchLists = async () => {
        try {
            const { data } = await axios.get('/api/upload/lists', {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            setDistributedLists(data);
        } catch (error) {
            console.error('Failed to load lists');
        }
    };

    useEffect(() => {
        fetchLists();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error('Please select a file');

        const formData = new FormData();
        formData.append('file', file);

        setLoading(true);
        try {
            await axios.post('/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`,
                },
            });
            toast.success('File uploaded and distributed successfully!');
            setFile(null);
            fetchLists();
        } catch (error) {
            toast.error(error.response?.data?.message || 'File upload failed');
        } finally {
            setLoading(false);
        }
    };

    const handleClearLists = async () => {
        try {
            await axios.delete('/api/upload/lists', {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('All lists cleared successfully');
            setConfirmingClear(false);
            fetchLists();
        } catch (error) {
            toast.error('Failed to clear lists');
        }
    };

    const handleDeleteItem = async (id) => {
        try {
            await axios.delete(`/api/upload/item/${id}`, {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            });
            toast.success('Task removed');
            setConfirmingDelete(null);
            fetchLists();
        } catch (error) {
            toast.error('Failed to remove task');
        }
    };

    const filteredLists = distributedLists.filter(item =>
        (item.firstName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.phone || '').includes(searchTerm) ||
        (item.assignedTo?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
                    Data Distribution Hub
                </h1>
                <p style={{ color: 'var(--text-muted)' }}>Upload your CSV/Excel files and let us assign tasks to your agents automatically.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>

                {/* Upload Section */}
                <div className="glass card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.2)', color: 'var(--primary)' }}>
                            <UploadIcon size={20} />
                        </div>
                        <h3 style={{ margin: 0 }}>Upload File</h3>
                    </div>

                    <form onSubmit={handleUpload} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div
                            style={{
                                border: '2px dashed var(--glass-border)',
                                borderRadius: '16px',
                                padding: '2.5rem 1rem',
                                textAlign: 'center',
                                backgroundColor: file ? 'rgba(99, 102, 241, 0.05)' : 'rgba(255,255,255,0.02)',
                                marginBottom: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            onClick={() => document.getElementById('file-upload').click()}
                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--primary)'; }}
                            onDragLeave={(e) => { e.preventDefault(); e.currentTarget.style.borderColor = 'var(--glass-border)'; }}
                            onDrop={(e) => {
                                e.preventDefault();
                                e.currentTarget.style.borderColor = 'var(--glass-border)';
                                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                                    setFile(e.dataTransfer.files[0]);
                                }
                            }}
                        >
                            <FileSpreadsheet size={56} style={{ color: file ? 'var(--primary)' : 'var(--text-muted)', marginBottom: '1rem', transition: 'color 0.3s' }} />
                            <p style={{ color: 'var(--text-main)', fontWeight: '500', marginBottom: '0.5rem' }}>
                                {file ? file.name : 'Click or Drag File Here'}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                Supported formats: .csv, .xlsx, .xls
                            </p>
                            <input
                                id="file-upload"
                                type="file"
                                accept=".csv, .xlsx, .xls"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.8rem' }} disabled={loading}>
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                    <span className="loader"></span> Processing...
                                </span>
                            ) : (
                                'Upload & Distribute'
                            )}
                        </button>
                    </form>
                </div>

                {/* Quick Info / Stats (Optional sweetener for "completely changed") */}
                <div className="glass card" style={{ background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ padding: '0.5rem', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399' }}>
                            <List size={20} />
                        </div>
                        <h3 style={{ margin: 0 }}>Summary</h3>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{distributedLists.length}</span>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Total Tasks</p>
                        </div>
                        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', textAlign: 'center' }}>
                            <span style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--primary)' }}>
                                {new Set(distributedLists.map(i => i.assignedTo?._id)).size}
                            </span>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Agents</p>
                        </div>
                        <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', textAlign: 'center', gridColumn: 'span 2' }}>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Distribution Logic</div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                <CheckCircle size={16} color="var(--secondary)" />
                                <span style={{ color: 'white' }}>Automated Load Balancing</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results Table Section */}
            <div className="glass card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>Tasks Overview</h2>
                        <p style={{ margin: '0.5rem 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>Manage and monitor distributed leads</p>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexGrow: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ position: 'relative', flexGrow: 1, maxWidth: '300px' }}>
                            {/* Reusing Search Icon simply implies it's a search box */}
                            <input
                                type="text"
                                placeholder="Search..."
                                className="glass-input"
                                style={{ width: '100%', paddingLeft: '1rem' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {confirmingClear ? (
                            <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(0,0,0,0.3)', padding: '0.25rem', borderRadius: '12px' }}>
                                <button
                                    onClick={handleClearLists}
                                    className="btn"
                                    style={{ backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                >
                                    Confirm
                                </button>
                                <button
                                    onClick={() => setConfirmingClear(false)}
                                    className="btn"
                                    style={{ backgroundColor: 'transparent', color: '#9ca3af', border: '1px solid #4b5563', padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <button
                                className="btn"
                                style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                onClick={() => setConfirmingClear(true)}
                            >
                                <Trash2 size={16} /> Clear All Data
                            </button>
                        )}
                    </div>
                </div>

                {distributedLists.length === 0 ? (
                    <div style={{ padding: '4rem 1rem', textAlign: 'center', border: '2px dashed var(--glass-border)', borderRadius: '16px' }}>
                        <FileSpreadsheet size={48} style={{ color: 'var(--text-muted)', opacity: 0.5, marginBottom: '1rem' }} />
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>No data available yet.</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Upload a file to get started.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto', borderRadius: '12px', border: '1px solid var(--glass-border)' }}>
                        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0' }}>
                            <thead>
                                <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Phone</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Agent</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                                    <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Notes</th>
                                    <th style={{ padding: '1rem', textAlign: 'right', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredLists.map((item, index) => (
                                    <tr key={item._id} style={{ background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)', transition: 'background 0.2s' }} className="hover-row">
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <div style={{ fontWeight: '500' }}>{item.firstName}</div>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{item.phone}</td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'white' }}>
                                                    {item.assignedTo?.name?.charAt(0) || '?'}
                                                </div>
                                                <span style={{ fontSize: '0.9rem' }}>{item.assignedTo?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)' }}>
                                            <span className={`badge ${(item.status || 'pending').toLowerCase().replace(' ', '-')}`}>
                                                {item.status || 'Pending'}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-muted)' }}>
                                            {item.notes}
                                        </td>
                                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--glass-border)', textAlign: 'right' }}>
                                            {confirmingDelete === item._id ? (
                                                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                                    <button
                                                        onClick={() => handleDeleteItem(item._id)}
                                                        className="btn"
                                                        style={{ padding: '0.3rem 0.6rem', backgroundColor: '#ef4444', color: 'white', border: 'none', fontSize: '0.75rem', borderRadius: '4px' }}
                                                    >
                                                        Confirm
                                                    </button>
                                                    <button
                                                        onClick={() => setConfirmingDelete(null)}
                                                        className="btn"
                                                        style={{ padding: '0.3rem 0.6rem', backgroundColor: '#374151', color: '#9ca3af', border: 'none', fontSize: '0.75rem', borderRadius: '4px' }}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => setConfirmingDelete(item._id)}
                                                    className="btn icon-btn"
                                                    style={{ color: '#f87171', opacity: 0.7, padding: '0.4rem' }}
                                                    title="Delete Task"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredLists.length === 0 && (
                            <p style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>No matches found for "{searchTerm}"</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default UploadPage;
