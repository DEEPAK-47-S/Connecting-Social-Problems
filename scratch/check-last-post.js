const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const post = await prisma.post.findFirst({
    orderBy: { createdAt: 'desc' },
  });
  console.log("Post Title:", post.title);
  console.log("Image URL starts with:", post.imageUrl ? post.imageUrl.substring(0, 30) : 'null');
  console.log("Image URL length:", post.imageUrl ? post.imageUrl.length : 0);
  process.exit(0);
}
check();
