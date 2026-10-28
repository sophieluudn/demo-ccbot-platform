from pathlib import Path
p=Path('menus.js');s=p.read_text(encoding='utf-8-sig');s=s.replace('label="無（大分類）"','label="無（作為一級大分類）"');old="return this.flatNodes.filter(n=>n.children&&!excluded.has(n.id))";new="const options=[];function collect(nodes,ancestors=[]){nodes.forEach(n=>{const path=[...ancestors,n.label];if(!excluded.has(n.id))options.push({id:n.id,label:path.join(' > ')});if(n.children)collect(n.children,path)})}collect(this.nodes);return options";assert old in s;s=s.replace(old,new)
# A former leaf may become a parent when selected as a parent option.
s=s.replace("const target=draft.parent?this.flatNodes.find(n=>n.id===draft.parent).children:this.nodes;target.push(node)","const parent=draft.parent?this.flatNodes.find(n=>n.id===draft.parent):null;if(parent&&!parent.children)this.$set(parent,'children',[]);const target=parent?parent.children:this.nodes;target.push(node)")
p.write_text(s,encoding='utf-8')
