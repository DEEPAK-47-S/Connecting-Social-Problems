const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const dirFile = path.join(dir, file);
    const dirent = fs.statSync(dirFile);
    if (dirent.isDirectory()) {
      // Exclude node_modules and .next
      if (!['node_modules', '.next', '.git', 'dist'].includes(file)) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (['.ts', '.tsx', '.js', '.jsx', '.css', '.md', '.json'].includes(path.extname(dirFile))) {
        filelist.push(dirFile);
      }
    }
  }
  return filelist;
};

const srcDirs = [
  path.join(__dirname, '..', 'apps', 'web', 'src'),
  path.join(__dirname, '..', 'apps', 'api', 'src'),
  path.join(__dirname, '..', 'packages', 'db', 'prisma'),
  path.join(__dirname, '..', 'apps', 'web', 'public') // for title tags, but page.tsx handles most
];

let changedFiles = 0;

for (const dir of srcDirs) {
  if (fs.existsSync(dir)) {
    const files = walkSync(dir);
    for (const file of files) {
      let content = fs.readFileSync(file, 'utf8');
      const original = content;
      
      // Replace variations
      content = content.replace(/SocialImpact/g, 'Connecting Social Problem');
      content = content.replace(/Social Impact/g, 'Connecting Social Problem');
      content = content.replace(/social impact/g, 'connecting social problem');
      
      if (content !== original) {
        fs.writeFileSync(file, content, 'utf8');
        console.log('Updated:', file);
        changedFiles++;
      }
    }
  }
}

console.log(`Finished renaming in ${changedFiles} files.`);
