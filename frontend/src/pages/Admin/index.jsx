import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import BASE_URL from '../../utils/api';

const EMPTY = { title: '', author: '', genre: '', price: '', originalPrice: '', stock: '', description: '', bestSeller: false };
const GENRES = ['Love', 'Fiction', 'History', 'Literature', 'Poetry'];

function AdminDashboard() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState(EMPTY);
    const [editingId, setEditingId] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [preview, setPreview] = useState('');
    const [saving, setSaving] = useState(false);
    const [deletingId, setDeletingId] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const { getToken } = useAuth();

    useEffect(() => { fetchBooks(); }, []);

    async function fetchBooks() {
        const token = await getToken();
        const res = await fetch(`${BASE_URL}/api/books`, {  
            headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setBooks(data.books);
        setLoading(false);
    }

    function openAdd() {
        setForm(EMPTY);
        setImageFile(null);
        setPreview('');
        setEditingId(null);
        setFormOpen(true);
    }

    function openEdit(book) {
        setForm({
            title: book.title,
            author: book.author,
            genre: book.genre,
            price: book.price,
            originalPrice: book.originalPrice || '',
            stock: book.stock,
            description: book.description || '',
            bestSeller: book.bestSeller || false,
        });
        setPreview(book.image);
        setImageFile(null);
        setEditingId(book._id);
        setFormOpen(true);
    }

    function closeForm() {
        setFormOpen(false);
        setEditingId(null);
        setForm(EMPTY);
        setPreview('');
        setImageFile(null);
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }

    function handleImage(e) {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setPreview(URL.createObjectURL(file));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        const token = await getToken();

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('author', form.author);
        fd.append('description', form.description);
        fd.append('price', form.price);
        fd.append('originalPrice', form.originalPrice);
        fd.append('stock', form.stock);
        fd.append('genre', form.genre);
        fd.append('bestSeller', form.bestSeller);
        if (imageFile) fd.append('image', imageFile);

        const url = editingId ? `${BASE_URL}/api/books/${editingId}` : `${BASE_URL}/api/books`;
        const method = editingId ? 'PUT' : 'POST';

        const res = await fetch(url, { 
            method,
            headers: { Authorization: `Bearer ${token}` },
            body: fd,
        });
        const data = await res.json();

        if (!res.ok) {
            console.error('Save failed:', data);
            setSaving(false);
            return;
        }

        if (editingId) {
            setBooks(prev => prev.map(b => b._id === editingId ? data.book : b));
        } else {
            setBooks(prev => [data.book, ...prev]);
        }

        setSaving(false);
        closeForm();
    }

    async function handleDelete(id) {
        if (!confirm('Delete this book?')) return;
        setDeletingId(id);
        const token = await getToken();
        await fetch(`${BASE_URL}/api/books/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        setBooks(prev => prev.filter(b => b._id !== id));
        setDeletingId(null);
        if (editingId === id) closeForm();
    }

    return (
        <div className="dash-container">

            {/* ── LEFT: table ── */}
            <div className={`dash-left ${formOpen ? 'shrink' : ''}`}>
                <div className="dash-panel-header">
                    <div>
                        <h1 className="dash-title">Books</h1>
                        <span className="dash-count">{books.length} titles</span>
                    </div>
                    <button className="dash-add-btn" onClick={openAdd}>+ Add Book</button>
                </div>

                {loading ? (
                    <div className="dash-empty">Loading books...</div>
                ) : books.length === 0 ? (
                    <div className="dash-empty">No books yet. Add your first one →</div>
                ) : (
                    <div className="dash-table-wrap">
                        <table className="dash-table">
                            <thead>
                                <tr>
                                    <th>Cover</th>
                                    <th>Title</th>
                                    <th>Author</th>
                                    <th>Genre</th>
                                    <th>Price</th>
                                    <th>Orig. Price</th>
                                    <th>Stock</th>
                                    <th>⭐</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {books.map(book => (
                                    <tr key={book._id} className={editingId === book._id ? 'row-active' : ''}>
                                        <td>
                                            <img className="dash-thumb" src={book.image} alt={book.title} />
                                        </td>
                                        <td className="dash-book-title">{book.title}</td>
                                        <td className="dash-muted">{book.author}</td>
                                        <td><span className="dash-badge">{book.genre}</span></td>
                                        <td>₹{Number(book.price).toFixed(0)}</td>
                                        <td className="dash-muted">
                                            {book.originalPrice ? `₹${Number(book.originalPrice).toFixed(0)}` : '—'}
                                        </td>
                                        <td>
                                            <span className={`dash-stock ${book.stock === 0 ? 'out' : ''}`}>
                                                {book.stock}
                                            </span>
                                        </td>
                                        <td>{book.bestSeller ? '⭐' : '—'}</td>
                                        <td>
                                            <div className="dash-row-actions">
                                                <button className="dash-edit-btn" onClick={() => openEdit(book)}>Edit</button>
                                                <button
                                                    className="dash-delete-btn"
                                                    onClick={() => handleDelete(book._id)}
                                                    disabled={deletingId === book._id}
                                                >
                                                    {deletingId === book._id ? '...' : 'Delete'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── RIGHT: form panel ── */}
            {formOpen && (
                <div className="dash-right">
                    <div className="dash-panel-header">
                        <h2 className="dash-form-title">{editingId ? 'Edit Book' : 'Add New Book'}</h2>
                        <button className="dash-close-btn" onClick={closeForm}>✕</button>
                    </div>

                    <form className="dash-form" onSubmit={handleSubmit}>
                        <div
                            className="dash-image-upload"
                            onClick={() => document.getElementById('coverInput').click()}
                        >
                            {preview
                                ? <img src={preview} alt="Cover" />
                                : <div className="dash-image-placeholder">
                                    <span>📷</span>
                                    <p>Click to upload cover</p>
                                </div>
                            }
                        </div>
                        <input id="coverInput" type="file" accept="image/*" onChange={handleImage} hidden />
                        <p className="dash-image-hint">JPG, PNG or WEBP</p>

                        <div className="dash-field">
                            <label>Title</label>
                            <input name="title" value={form.title} onChange={handleChange} required placeholder="Book title" />
                        </div>

                        <div className="dash-field">
                            <label>Author</label>
                            <input name="author" value={form.author} onChange={handleChange} required placeholder="Author name" />
                        </div>

                        <div className="dash-field-row">
                            <div className="dash-field">
                                <label>Genre</label>
                                <select name="genre" value={form.genre} onChange={handleChange} required>
                                    <option value="">Select</option>
                                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="dash-field">
                                <label>Price (₹)</label>
                                <input
                                    name="price" type="number" min="0" step="0.01"
                                    value={form.price} onChange={handleChange} required placeholder="0.00"
                                />
                            </div>
                            <div className="dash-field">
                                <label>Orig. Price (₹)</label>
                                <input
                                    name="originalPrice" type="number" min="0" step="0.01"
                                    value={form.originalPrice} onChange={handleChange} placeholder="Leave blank if no offer"
                                />
                            </div>
                            <div className="dash-field">
                                <label>Stock</label>
                                <input
                                    name="stock" type="number" min="0"
                                    value={form.stock} onChange={handleChange} required placeholder="0"
                                />
                            </div>
                        </div>

                        <div className="dash-field">
                            <label>Description</label>
                            <textarea name="description" value={form.description} onChange={handleChange} rows={4} placeholder="Short description..." />
                        </div>

                        <div className="dash-field dash-field--checkbox">
                            <label className="dash-checkbox-label">
                                <input type="checkbox" name="bestSeller" checked={form.bestSeller} onChange={handleChange} />
                                <span>Mark as Best Seller</span>
                            </label>
                        </div>

                        <div className="dash-form-actions">
                            <button type="button" className="dash-cancel-btn" onClick={closeForm}>Cancel</button>
                            <button type="submit" className="dash-save-btn" disabled={saving}>
                                {saving ? 'Saving...' : editingId ? 'Save Changes' : 'Add Book'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;