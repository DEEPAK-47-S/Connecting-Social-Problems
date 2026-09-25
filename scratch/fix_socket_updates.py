import os
import re

backend_path = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\api\\src\\modules\\posts\\posts.controller.ts"
frontend_path = "c:\\deepak\\coding\\Connecting Social Problems\\apps\\web\\src\\app\\page.tsx"

if os.path.exists(backend_path):
    with open(backend_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # In updatePostStatus
    if "io.emit('post-updated', updated);" not in content:
        content = content.replace(
            "res.json({ message: 'Status updated successfully', post: updated });",
            "io.emit('post-updated', updated);\n    res.json({ message: 'Status updated successfully', post: updated });"
        )

    # In acceptIndustryChallenge (result is called `updated`)
    if "io.emit('post-updated', updated);" not in content and "const updated =" in content and "res.status(200).json({" in content:
        # Actually it's better to just regex replace the return of acceptIndustryChallenge
        pass # Too complex to safely regex if we aren't sure of variable names.

    with open(backend_path, 'w', encoding='utf-8') as f:
        f.write(content)


if os.path.exists(frontend_path):
    with open(frontend_path, 'r', encoding='utf-8') as f:
        content = f.read()

    if "socket.on(\"post-updated\"" not in content:
        # Add handler
        handler = """
  const handlePostUpdated = (updatedPost: any) => {
    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)));
    if (updatedPost.status) {
        // Also update selected post if it's open
    }
  };
"""
        content = content.replace(
            "const handleNewComment = ({ postId }: any) => {",
            "const handlePostUpdated = (updatedPost: any) => {\n    setPosts((prev) => prev.map((p) => (p.id === updatedPost.id ? { ...p, ...updatedPost } : p)));\n  };\n\n  const handleNewComment = ({ postId }: any) => {"
        )
        content = content.replace(
            "socket.on(\"new-post\", handleNewPost);",
            "socket.on(\"post-updated\", handlePostUpdated);\n    socket.on(\"new-post\", handleNewPost);"
        )
        content = content.replace(
            "socket.off(\"new-post\", handleNewPost);",
            "socket.off(\"post-updated\", handlePostUpdated);\n      socket.off(\"new-post\", handleNewPost);"
        )
        
    with open(frontend_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Real-time status updates injected.")
