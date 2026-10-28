from pathlib import Path
p=Path('management.js');s=p.read_text(encoding='utf-8-sig');a=s.index('<form class="knowledge-filter');b=s.index('</form>',a);part=s[a:b];part=part.replace('<el-radio ', '<el-radio-button ').replace('</el-radio>','</el-radio-button>');s=s[:a]+part+s[b:];p.write_text(s,encoding='utf-8')
