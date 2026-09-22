const fs = require('fs');

const file = 'apps/web/src/app/admin/page.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add User state and API logic
if (!content.includes('const [activeTab, setActiveTab]')) {
  content = content.replace(
    'const [error, setError] = useState("");',
    `const [error, setError] = useState("");

  // Tabs & Users
  const [activeTab, setActiveTab] = useState<"complaints" | "users">("complaints");
  const [users, setUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any | null>(null);`
  );
}

if (!content.includes('const fetchUsers = useCallback')) {
  content = content.replace(
    '// Load all complaints',
    `// Load all users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(\`\${API}/api/admin/users\`, {
        headers: adminToken ? { Authorization: \`Bearer \${adminToken}\` } : {},
      });
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [adminToken]);

  useEffect(() => {
    if (adminToken && activeTab === "users") {
      fetchUsers();
    }
  }, [adminToken, activeTab, fetchUsers]);

  const handleConfirmDeleteUser = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(\`\${API}/api/admin/users/\${userToDelete.id}\`, {
        method: "DELETE",
        headers: adminToken ? { Authorization: \`Bearer \${adminToken}\` } : {},
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setToastMessage(\`Deleted user "\${userToDelete.email}" successfully.\`);
      setUserToDelete(null);
      setTimeout(() => setToastMessage(""), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to delete user.");
    } finally {
      setDeleting(false);
    }
  };

  // Load all complaints`
  );
}

// 2. Add Tab Switcher UI below metrics grid
if (!content.includes('onClick={() => setActiveTab(')) {
  content = content.replace(
    '{/* Filter & Action Toolbar */}',
    `{/* Tab Switcher */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab("complaints")}
            className={\`px-6 py-2 rounded-xl text-sm font-bold transition \${
              activeTab === "complaints"
                ? "bg-indigo-600 text-white shadow-lg"
                : isDark
                ? "bg-zinc-900 text-zinc-400 hover:text-white"
                : "bg-white text-zinc-600 border hover:text-zinc-900"
            }\`}
          >
            Complaints Management
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={\`px-6 py-2 rounded-xl text-sm font-bold transition \${
              activeTab === "users"
                ? "bg-indigo-600 text-white shadow-lg"
                : isDark
                ? "bg-zinc-900 text-zinc-400 hover:text-white"
                : "bg-white text-zinc-600 border hover:text-zinc-900"
            }\`}
          >
            Users Management
          </button>
        </div>

        {/* Users Tab View */}
        {activeTab === "users" && (
          <div className={\`p-6 rounded-3xl border shadow-xl \${isDark ? "bg-zinc-900/90 border-zinc-800" : "bg-white border-zinc-200"}\`}>
            <h2 className={\`text-xl font-black mb-4 \${isDark ? "text-white" : "text-zinc-900"}\`}>Registered Users</h2>
            
            {loadingUsers ? (
              <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className={\`border-b \${isDark ? "border-zinc-800 text-zinc-400" : "border-zinc-200 text-zinc-500"}\`}>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs">User / Email</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs">Role</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs">Organization</th>
                      <th className="p-3 font-bold uppercase tracking-wider text-xs text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} className={\`border-b transition hover:bg-zinc-500/5 \${isDark ? "border-zinc-800/50" : "border-zinc-100"}\`}>
                        <td className="p-3">
                          <div className={\`font-bold \${isDark ? "text-white" : "text-zinc-900"}\`}>{u.name}</div>
                          <div className="text-xs text-zinc-500">{u.email}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-2 py-1 bg-indigo-500/10 text-indigo-500 rounded-lg text-xs font-bold">{u.role}</span>
                        </td>
                        <td className="p-3 text-zinc-500 text-xs font-medium">
                          {u.companyName || "N/A"} {u.sector ? \`(\${u.sector})\` : ""}
                        </td>
                        <td className="p-3 text-right">
                          {u.role !== "SUPERADMIN" && (
                            <button
                              onClick={() => setUserToDelete(u)}
                              className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition"
                              title="Delete User"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Delete User Modal */}
        {userToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
            <div className={\`max-w-md w-full rounded-3xl p-6 shadow-2xl border \${isDark ? "bg-zinc-950 border-zinc-800" : "bg-white border-zinc-200"}\`}>
              <div className="flex items-center gap-3 text-rose-500 mb-4">
                <AlertTriangle className="h-6 w-6" />
                <h3 className={\`text-xl font-black \${isDark ? "text-white" : "text-zinc-900"}\`}>Delete User</h3>
              </div>
              <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
                Are you sure you want to permanently delete <strong className={isDark ? "text-white" : "text-zinc-900"}>{userToDelete.email}</strong>? 
                This action is irreversible and will cascade to all their data.
              </p>
              <div className="flex items-center gap-3 justify-end">
                <button
                  onClick={() => setUserToDelete(null)}
                  disabled={deleting}
                  className={\`px-4 py-2 rounded-xl text-sm font-bold transition \${isDark ? "text-zinc-400 hover:text-white hover:bg-zinc-900" : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"}\`}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDeleteUser}
                  disabled={deleting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-bold flex items-center gap-2 transition disabled:opacity-50"
                >
                  {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  <span>Delete Permanently</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "complaints" && (
          <>
            {/* Filter & Action Toolbar */}`
  );

  content = content.replace(
    '</main>',
    `          </>
        )}
      </main>`
  );
}

fs.writeFileSync(file, content);
console.log("Updated admin page with User tab");
