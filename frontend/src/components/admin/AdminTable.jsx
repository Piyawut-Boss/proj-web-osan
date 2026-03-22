import './AdminTable.css';

const AdminTable = ({ columns, data, onEdit, onDelete, loading }) => {
  if (loading) return <div className="loading-spinner"><div className="spinner" /></div>;

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>{columns.map(col => <th key={col.key}>{col.label}</th>)}<th>Actions</th></tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={columns.length + 1} className="empty-row">ยังไม่มีข้อมูล</td></tr>
          ) : data.map(row => (
            <tr key={row.id}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.render ? col.render(row[col.key], row) : (row[col.key] || <span style={{ color: 'var(--text-light)' }}>—</span>)}
                </td>
              ))}
              <td>
                <div className="action-btns">
                  <button className="btn btn-sm btn-edit" onClick={() => onEdit(row)}>✏️ แก้ไข</button>
                  <button className="btn btn-sm btn-del" onClick={() => { if (window.confirm('ยืนยันการลบ?')) onDelete(row.id); }}>🗑️ ลบ</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminTable;
