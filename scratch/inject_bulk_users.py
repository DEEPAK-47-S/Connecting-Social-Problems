import os
import re

file_path = r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\admin\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. State
state_block = """  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  // Bulk User States
  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());
  const [showBulkUserModal, setShowBulkUserModal] = useState(false);
  const [isBulkDeletingUsers, setIsBulkDeletingUsers] = useState(false);"""
content = content.replace("  const [userToDelete, setUserToDelete] = useState<any>(null);\n  const [deleting, setDeleting] = useState(false);", state_block)

# 2. handleBulkDeleteUsers
handler_block = """  const handleConfirmDeleteUser = async () => {
    // ... (existing)
  };

  const handleBulkDeleteUsers = async () => {
    try {
      setIsBulkDeletingUsers(true);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/admin/users/bulk-delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ userIds: Array.from(selectedUserIds) })
      });

      if (!res.ok) throw new Error("Failed to delete users");
      
      setUsers(prev => prev.filter(u => !selectedUserIds.has(u.id)));
      setSelectedUserIds(new Set());
      setShowBulkUserModal(false);
    } catch (error) {
      console.error(error);
      alert("Error bulk deleting users");
    } finally {
      setIsBulkDeletingUsers(false);
    }
  };"""
# Replacing the function signature to safely append after handleConfirmDeleteUser
content = re.sub(r'(const handleConfirmDeleteUser = async \(\) => \{.*?\n  \};)', r'\1\n\n  const handleBulkDeleteUsers = async () => {\n    try {\n      setIsBulkDeletingUsers(true);\n      const token = localStorage.getItem("admin_token");\n      const res = await fetch(`${API}/api/admin/users/bulk-delete`, {\n        method: "POST",\n        headers: {\n          "Content-Type": "application/json",\n          Authorization: `Bearer ${token}`\n        },\n        body: JSON.stringify({ userIds: Array.from(selectedUserIds) })\n      });\n\n      if (!res.ok) throw new Error("Failed to delete users");\n      \n      setUsers(prev => prev.filter(u => !selectedUserIds.has(u.id)));\n      setSelectedUserIds(new Set());\n      setShowBulkUserModal(false);\n    } catch (error) {\n      console.error(error);\n      alert("Error bulk deleting users");\n    } finally {\n      setIsBulkDeletingUsers(false);\n    }\n  };', content, flags=re.DOTALL)

# 3. Table Headers & Toolbar
thead_pattern = r'(<h2 className=\{`text-xl font-black mb-4 text-zinc-900 dark:text-white`\}>Registered Users</h2>)'
toolbar = """\\1
  {selectedUserIds.size > 0 && (
    <div className="flex items-center gap-3 bg-rose-950/40 border border-rose-500/40 px-4 py-2 rounded-2xl mb-4 animate-in fade-in w-fit">
      <span className="text-xs font-bold text-rose-700 dark:text-rose-300">
        {selectedUserIds.size} {selectedUserIds.size === 1 ? "user" : "users"} selected
      </span>
      <button
        onClick={() => setShowBulkUserModal(true)}
        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-600/30 transition text-white"
      >
        <Trash2 className="h-3.5 w-3.5" />
        <span>Delete Selected ({selectedUserIds.size})</span>
      </button>
    </div>
  )}"""
content = re.sub(thead_pattern, toolbar, content)

thead_th_pattern = r'(<tr className=\{`border-b border-zinc-200 text-zinc-500 dark:border-zinc-800 dark:text-zinc-400`\}>)'
th_check = """\\1
  <th className="p-3 w-10">
    <input 
      type="checkbox" 
      className="rounded border-zinc-300 dark:border-zinc-700 bg-transparent text-indigo-600 focus:ring-indigo-500"
      checked={users.length > 0 && users.filter(u => u.role !== 'SUPERADMIN').length > 0 && selectedUserIds.size === users.filter(u => u.role !== 'SUPERADMIN').length}
      onChange={(e) => {
        if (e.target.checked) {
          setSelectedUserIds(new Set(users.filter(u => u.role !== 'SUPERADMIN').map(u => u.id)));
        } else {
          setSelectedUserIds(new Set());
        }
      }}
    />
  </th>"""
content = re.sub(thead_th_pattern, th_check, content)

# 4. Table Body Checkbox
tbody_pattern = r'(<tr key=\{u\.id\} className=\{`border-b transition hover:bg-zinc-500/5 border-zinc-100 dark:border-zinc-800`\}>)'
td_check = """\\1
  <td className="p-3">
    {u.role !== 'SUPERADMIN' && (
      <input 
        type="checkbox" 
        className="rounded border-zinc-300 dark:border-zinc-700 bg-transparent text-indigo-600 focus:ring-indigo-500"
        checked={selectedUserIds.has(u.id)}
        onChange={(e) => {
          const newSet = new Set(selectedUserIds);
          if (e.target.checked) newSet.add(u.id);
          else newSet.delete(u.id);
          setSelectedUserIds(newSet);
        }}
      />
    )}
  </td>"""
content = re.sub(tbody_pattern, td_check, content)

# 5. Bulk Modal
modal_pattern = r'(</svg>\n\s*<span>Delete Permanently</span>\n\s*</button>\n\s*</div>\n\s*</div>\n\s*</div>\n\s*\)}\n)'
bulk_modal = """\\1
  {showBulkUserModal && (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-white/50 dark:bg-zinc-900/75 animate-in fade-in backdrop-blur-sm">
      <div className={`max-w-md w-full rounded-3xl p-6 shadow-md border bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800`}>
        <div className="flex items-center gap-3 text-rose-500 mb-4">
          <AlertTriangle className="h-6 w-6" />
          <h3 className={`text-xl font-black text-zinc-900 dark:text-white`}>Bulk Delete Users</h3>
        </div>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
          Are you sure you want to permanently delete <strong className="text-zinc-900 dark:text-white">{selectedUserIds.size} selected users</strong>? 
          This action is irreversible, will delete all their data, and instantly log them out globally.
        </p>
        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => setShowBulkUserModal(false)}
            disabled={isBulkDeletingUsers}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition text-zinc-600 hover:text-zinc-900 dark:text-zinc-100 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-white dark:hover:bg-white dark:bg-zinc-800`}
          >
            Cancel
          </button>
          <button
            onClick={handleBulkDeleteUsers}
            disabled={isBulkDeletingUsers}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-50"
          >
            {isBulkDeletingUsers ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            <span>Delete {selectedUserIds.size} Users</span>
          </button>
        </div>
      </div>
    </div>
  )}
"""
content = re.sub(modal_pattern, bulk_modal, content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("UI successfully injected!")
