from pathlib import Path
for file in ['users.js','roles.js']:
 p=Path(file);s=p.read_text(encoding='utf-8-sig');assert 'v-for="p in projects"' in s;s=s.replace('v-for="p in projects"','v-for="p in projects.filter(project => project.enabled)"');p.write_text(s,encoding='utf-8')
