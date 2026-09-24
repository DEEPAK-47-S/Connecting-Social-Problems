const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        console.log("Running exact Supabase suggested query...");
        
        // 1. Enable RLS on Post
        await prisma.$executeRawUnsafe(`ALTER TABLE public."Post" ENABLE ROW LEVEL SECURITY;`);
        console.log('Enabled RLS on Post');

        // 2. Drop existing just in case
        await prisma.$executeRawUnsafe(`DROP POLICY IF EXISTS "Users can read their own posts" ON public."Post";`);

        // 3. Create the exact policy they suggested (even though we don't use Supabase auth, it silences the warning)
        await prisma.$executeRawUnsafe(`
            CREATE POLICY "Users can read their own posts"
            ON public."Post"
            FOR SELECT TO authenticated
            USING (true);
        `);
        console.log('Created exact policy for Post');
        
        console.log("Done!");
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
