import os
import re

file_path = r"c:\deepak\coding\Connecting Social Problems\apps\web\src\app\admin\page.tsx"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. State
content = content.replace(
    '  const [userToDelete, setUserToDelete] = useState<any | null>(null);', 
    '  const [userToDelete, setUserToDelete] = useState<any | null>(null);\n  const [selectedUserIds, setSelectedUserIds] = useState<Set<string>>(new Set());\n  const [showBulkUserModal, setShowBulkUserModal] = useState(false);\n  const [isBulkDeletingUsers, setIsBulkDeletingUsers] = useState(false);'
)

# 2. handleBulkDeleteUsers
handler_block = """  const handleConfirmDeleteUser = async () => {
    try {
      setDeleting(true);
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`${API}/api/admin/users/${userToDelete.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error("Failed to delete user");
      
      setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
      setUserToDelete(null);
    } catch (error) {
      console.error(error);
      alert("Error deleting user");
    } finally {
      setDeleting(false);
    }
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

content = re.sub(r'  const handleConfirmDeleteUser = async \(\) => \{.*?\n  \};', handler_block, content, flags=re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)

print("State successfully injected!")
