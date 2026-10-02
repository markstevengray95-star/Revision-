"""Import the supplied Word banks without rewriting their text. Python standard library only.

Usage: python scripts/import-question-docs.py --sources C:/path/to/Word/files
Generated data and original diagram bytes are committed; builds do not need the Word files.
"""
import argparse,collections,hashlib,html,json,pathlib,re,xml.etree.ElementTree as ET,zipfile
from html.parser import HTMLParser

ROOT=pathlib.Path(__file__).resolve().parents[1]
W='{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'
M='{http://schemas.openxmlformats.org/officeDocument/2006/math}'
A='{http://schemas.openxmlformats.org/drawingml/2006/main}'
WP='{http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing}'
R='{http://schemas.openxmlformats.org/officeDocument/2006/relationships}'
MC='{http://schemas.openxmlformats.org/markup-compatibility/2006}'
SYMBOL={'F03D':'=','F0B4':'×','F02B':'+','F02D':'−','F057':'Ω','F0B1':'±','F062':'β','F067':'γ','F061':'α','F0AE':'→'}
FILES={'physics':'Physics question bank (3).docx','chemistry':'Chemistry question bank (3).docx','biology':'Biology question bank (2).docx'}
esc=lambda s:html.escape(str(s),quote=True)

def svg_units(markup):
    # Browser font sizes clamp at 5000 px. Word EMUs must become points before rendering.
    markup=re.sub(r'\b(x|y|x1|x2|y1|y2|width|height|font-size|stroke-width)="(-?[\d.]+)"',lambda m:m.group(1)+'="'+str(float(m.group(2))/12700)+'"',markup)
    markup=re.sub(r'viewBox="([\d. -]+)"',lambda m:'viewBox="'+' '.join(str(float(v)/12700) for v in m.group(1).split())+'"',markup)
    return re.sub(r'translate\((-?[\d.]+) (-?[\d.]+)\)',lambda m:'translate('+str(float(m.group(1))/12700)+' '+str(float(m.group(2))/12700)+')',markup)

def clean_alternates(n):
    for child in list(n):
        if child.tag==MC+'AlternateContent':
            chosen=child.find(MC+'Choice')
            if chosen is None:chosen=child.find(MC+'Fallback')
            offset=list(n).index(child);n.remove(child)
            if chosen is not None:
                for add in list(chosen):n.insert(offset,add);offset+=1;clean_alternates(add)
        else:clean_alternates(child)

def text(n):
    if n.tag in (W+'t',M+'t'):return n.text or ''
    if n.tag==W+'sym':return SYMBOL[n.get(W+'char')]
    if n.tag==W+'tab':return '\t'
    if n.tag in (W+'br',W+'cr'):return '\n'
    return ''.join(text(c) for c in n)

def math(n):
    kind=n.tag.split('}')[-1]
    child=lambda key:math(n.find(M+key)) if n.find(M+key) is not None else '<mrow></mrow>'
    if kind.endswith('Pr') or kind in ('ctrlPr','sty','type','jc','sz','rFonts'):return ''
    if kind in ('oMath','oMathPara','num','den','e','sub','sup'):return '<mrow>'+''.join(math(c) for c in n)+'</mrow>'
    if kind=='f':return '<mfrac>'+child('num')+child('den')+'</mfrac>'
    if kind=='sSub':return '<msub>'+child('e')+child('sub')+'</msub>'
    if kind=='sSup':return '<msup>'+child('e')+child('sup')+'</msup>'
    if kind=='sSubSup':return '<msubsup>'+child('e')+child('sub')+child('sup')+'</msubsup>'
    if kind=='sPre':return '<mmultiscripts>'+child('e')+'<mprescripts/>'+child('sub')+child('sup')+'</mmultiscripts>'
    if kind in ('r','t'):return '<mtext>'+esc(text(n))+'</mtext>'
    raise ValueError('Unsupported source equation node '+kind)

class Converter:
    def __init__(self,z,subject):
        self.z=z;self.subject=subject;self.assets=[];self.shapes=[]
        self.rels={n.get('Id'):n.get('Target') for n in ET.fromstring(z.read('word/_rels/document.xml.rels'))}
    def image(self,n):
        blip=n.find('.//'+A+'blip')
        if blip is None:return ''
        target=self.rels[blip.get(R+'embed')];raw=self.z.read('word/'+target)
        name=self.subject+'-'+pathlib.Path(target).name;relative='tools/question-bank/source/assets/'+name
        dest=ROOT/relative;dest.parent.mkdir(parents=True,exist_ok=True);dest.write_bytes(raw)
        item={'path':relative,'sha256':hashlib.sha256(raw).hexdigest(),'bytes':len(raw)}
        if item not in self.assets:self.assets.append(item)
        extent=n.find('.//'+WP+'extent');width=round(int(extent.get('cx'))/9525) if extent is not None else 560
        # Word's auto-generated alt text is sometimes unrelated to the science figure.
        return '<img class="source-diagram" src="assets/'+esc(name)+'" alt="Original diagram from the '+self.subject+' question bank" style="width:'+str(width)+'px" loading="lazy">'
    def grouped(self,n):
        """Keep editable Word labels grouped with pictures, in their original coordinates."""
        group=next((c for c in n.iter() if c.tag.split('}')[-1]=='wgp'),None)
        if group is None:return None
        def render(c):
            kind=c.tag.split('}')[-1]
            if kind in ('wgp','grpSp'):
                props=next(x for x in c if x.tag.split('}')[-1]=='grpSpPr');xf=props.find(A+'xfrm')
                off=xf.find(A+'off');ext=xf.find(A+'ext');co=xf.find(A+'chOff');ce=xf.find(A+'chExt')
                sx=int(ext.get('cx'))/int(ce.get('cx'));sy=int(ext.get('cy'))/int(ce.get('cy'))
                return f'<g transform="translate({off.get("x")} {off.get("y")}) scale({sx} {sy}) translate({-int(co.get("x"))} {-int(co.get("y"))})">'+''.join(render(x) for x in c if x.tag.split('}')[-1] in ('wgp','grpSp','pic','wsp'))+'</g>'
            props=next(x for x in c if x.tag.split('}')[-1]=='spPr');xf=props.find(A+'xfrm');off=xf.find(A+'off');ext=xf.find(A+'ext');x=int(off.get('x'));y=int(off.get('y'));w=int(ext.get('cx'));h=int(ext.get('cy'))
            if kind=='pic':
                src=re.search(r'src="([^"]+)"',self.image(c)).group(1)
                return f'<image href="{src}" x="{x}" y="{y}" width="{w}" height="{h}"/>'
            box=c.find('.//'+W+'txbxContent')
            if box is None:
                geom=props.find(A+'prstGeom')
                if geom is not None and geom.get('prst')=='line':
                    flip=xf.get('flipV')=='1';ln=props.find(A+'ln');stroke=int(ln.get('w','12700')) if ln is not None else 12700
                    return f'<line x1="{x}" y1="{y+h if flip else y}" x2="{x+w}" y2="{y if flip else y+h}" stroke="#111" stroke-width="{stroke}"/>'
                raise ValueError('Unsupported grouped source shape')
            fill='<rect x="'+str(x)+'" y="'+str(y)+'" width="'+str(w)+'" height="'+str(h)+'" fill="white"/>' if props.find(A+'solidFill') is not None else ''
            return fill+f'<text x="{x+91440}" y="{y+160000}" font-family="Arial,sans-serif" font-size="139700" fill="#111">{esc(text(box))}</text>'
        extent=n.find('.//'+WP+'extent');w=int(extent.get('cx'));h=int(extent.get('cy'))
        return svg_units(f'<svg class="source-diagram" viewBox="0 0 {w} {h}" style="width:{round(w/9525)}px;height:auto" role="img" aria-label="Original grouped science diagram and labels">'+render(group)+'</svg>')
    def composite(self,n,previous=None):
        """Retain Word's positioned connectors, label boxes and covering shapes over a diagram."""
        pt=12700;page_width=468*pt;images=[];overlays=[];bounds=[]
        ind=n.find(W+'pPr/'+W+'ind');left=sum(int(ind.get(W+k,'0')) for k in ('left','firstLine'))*635 if ind is not None else 0
        x=left;y=20*pt if previous is not None else 0;line_height=0
        for drawing in n.findall('.//'+W+'drawing'):
            inline=drawing.find(WP+'inline')
            if inline is not None:
                ext=inline.find(WP+'extent');width=int(ext.get('cx'));height=int(ext.get('cy'))
                if x+width>page_width and x>left:x=left;y+=line_height+12*pt;line_height=0
                img=self.image(drawing);src=re.search(r'src="([^"]+)"',img).group(1)
                images.append(f'<image href="{src}" x="{x}" y="{y}" width="{width}" height="{height}"/>');bounds.append((x+width,y+height));x+=width;line_height=max(line_height,height)
            else:
                anchor=drawing.find(WP+'anchor')
                if anchor is not None:overlays.append((anchor,20*pt if previous is not None else 0))
        if previous is not None:
            overlays.extend((d.find(WP+'anchor'),0) for d in previous.findall('.//'+W+'drawing') if d.find('.//'+W+'txbxContent') is not None)
        shapes=[]
        for anchor,shift in sorted(overlays,key=lambda pair:int(pair[0].get('relativeHeight','0'))):
            px=anchor.find(WP+'positionH/'+WP+'posOffset');py=anchor.find(WP+'positionV/'+WP+'posOffset');ext=anchor.find(WP+'extent')
            if px is None or py is None or ext is None:raise ValueError('Unsupported source drawing position')
            xx=int(px.text);yy=int(py.text)+shift;ww=int(ext.get('cx'));hh=int(ext.get('cy'));bounds.append((xx+ww,yy+hh))
            box=anchor.find('.//'+W+'txbxContent');geom=anchor.find('.//'+A+'prstGeom')
            if box is not None:
                shapes.append(f'<text x="{xx+91440}" y="{yy+160000}" fill="#111" font-family="Arial,sans-serif" font-size="{11*pt}">{esc(text(box))}</text>')
            elif geom is not None and geom.get('prst')=='line':
                transform=anchor.find('.//'+A+'xfrm');flip=transform is not None and transform.get('flipV')=='1'
                shapes.append(f'<line x1="{xx}" y1="{yy+hh if flip else yy}" x2="{xx+ww}" y2="{yy if flip else yy+hh}" stroke="#111" stroke-width="{pt}"/>')
            elif geom is not None and geom.get('prst')=='rect':shapes.append(f'<rect x="{xx}" y="{yy}" width="{ww}" height="{hh}" fill="white"/>')
            else:raise ValueError('Unsupported source drawing shape')
        width=max(page_width,max(b[0] for b in bounds));height=max(b[1] for b in bounds)+12*pt
        plain=''.join(self.inline(c) for c in n if c.tag!=W+'r')
        extras=''.join(self.inline(r) for r in n.findall(W+'r') if not r.findall(W+'drawing'))
        return svg_units(f'<div class="source-composite"><svg viewBox="0 0 {width} {height}" role="img" aria-label="Original positioned science diagram and labels">'+''.join(images+shapes)+'</svg>')+extras+plain+'</div>'
    def inline(self,n):
        tag=n.tag
        if tag in (W+'t',):return esc(n.text or '')
        if tag==W+'sym':return esc(SYMBOL[n.get(W+'char')])
        if tag==W+'tab':return '<span class="source-tab">\t</span>'
        if tag in (W+'br',W+'cr'):return '<br>' if n.get(W+'type')!='page' else ''
        if tag in (M+'oMath',M+'oMathPara'):return '<math xmlns="http://www.w3.org/1998/Math/MathML">'+math(n)+'</math>'
        if tag==W+'drawing':
            grouped=self.grouped(n)
            if grouped:return grouped
            picture=self.image(n)
            if picture:return picture
            box=n.find('.//'+W+'txbxContent')
            if box is not None:return '<span class="source-label">'+''.join(self.block(p) for p in box)+'</span>'
            if n.find('.//'+A+'prstGeom') is not None:self.shapes.append(n)
            return ''
        if tag.endswith('Pr') or tag in (W+'bookmarkStart',W+'bookmarkEnd',W+'proofErr',W+'lastRenderedPageBreak'):return ''
        content=''.join(self.inline(c) for c in n)
        if tag==W+'r':
            prop=n.find(W+'rPr')
            if prop is not None:
                vert=prop.find(W+'vertAlign')
                if vert is not None:
                    t={'subscript':'sub','superscript':'sup'}.get(vert.get(W+'val'))
                    if t:content='<'+t+'>'+content+'</'+t+'>'
                for key,t in [('b','strong'),('i','em'),('u','u')]:
                    p=prop.find(W+key)
                    if p is not None and p.get(W+'val') not in ('0','false','none'):content='<'+t+'>'+content+'</'+t+'>'
        return content
    def block(self,n):
        if n.tag==W+'p':
            body=self.inline(n)
            if not text(n).strip() and not n.findall('.//'+A+'blip') and not n.findall('.//'+M+'oMath'):return ''
            return '<p>'+body+'</p>'
        if n.tag==W+'tbl':
            rows=list(n.findall(W+'tr'));out=['<div class="source-table-wrap" tabindex="0" aria-label="Original question or mark scheme table"><table>']
            for i,row in enumerate(rows):
                out.append('<tr>');col=0
                for cell in row.findall(W+'tc'):
                    props=cell.find(W+'tcPr');span=props.find(W+'gridSpan') if props is not None else None
                    width=int(span.get(W+'val')) if span is not None else 1
                    merge=props.find(W+'vMerge') if props is not None else None
                    if merge is not None and merge.get(W+'val')!='restart':col+=width;continue
                    height=1
                    if merge is not None:
                        for later in rows[i+1:]:
                            lc=0;found=False
                            for c in later.findall(W+'tc'):
                                cp=c.find(W+'tcPr');s=cp.find(W+'gridSpan') if cp is not None else None;cw=int(s.get(W+'val')) if s is not None else 1
                                vm=cp.find(W+'vMerge') if cp is not None else None
                                if lc==col and vm is not None and vm.get(W+'val')!='restart':found=True
                                lc+=cw
                            if not found:break
                            height+=1
                    tag='th' if i==0 else 'td'
                    attrs=(f' colspan="{width}"' if width>1 else '')+(f' rowspan="{height}"' if height>1 else '')+(' scope="col"' if i==0 else '')
                    out.append('<'+tag+attrs+'>'+''.join(self.block(c) for c in cell if c.tag in (W+'p',W+'tbl'))+'</'+tag+'>');col+=width
                out.append('</tr>')
            out.append('</table></div>');return ''.join(out)
        return ''

def split_parts(blocks):
    root=next((re.match(r'^\s*(\d{2})\b',b['text']).group(1) for b in blocks if re.match(r'^\s*\d{2}\b',b['text'])),None)
    starts=[i for i,b in enumerate(blocks) if root and re.match(r'^\s*'+root+r'\.\d+\b',b['text'])]
    if not starts:
        label=next((re.match(r'^\s*(\d{2})\b',b['text']).group(1) for b in blocks if re.match(r'^\s*\d{2}\b',b['text'])),'Answer')
        return [],[{'label':label,'blocks':blocks,'marks':sum(int(m) for b in blocks for m in re.findall(r'\[(\d+) marks?\]',b['text']))}]
    parts=[]
    for index,start in enumerate(starts):
        chunk=blocks[start:starts[index+1] if index+1<len(starts) else len(blocks)]
        parts.append({'label':re.match(r'^\s*(\d{2}\.\d+)',chunk[0]['text']).group(1),'blocks':chunk,'marks':sum(int(m) for b in chunk for m in re.findall(r'\[(\d+) marks?\]',b['text']))})
    context=blocks[:starts[0]]
    initial_marks=sum(int(m) for b in context for m in re.findall(r'\[(\d+) marks?\]',b['text']))
    if initial_marks:
        parts.insert(0,{'label':root+'.1','blocks':context,'marks':initial_marks});context=[]
    return context,parts

def sections(blocks):
    rows=[];current=None;mode=None;topic=''
    for b in blocks:
        t=b['text'].strip()
        if re.match(r'^(Physics|Chemistry|Biology)\s+4\.\d+\s',t):topic=t;continue
        if re.match(r'^Question\s*\(',t):
            if current:rows.append(current)
            current={'topic':topic,'heading':t,'question':[],'scheme':[],'model':[],'partial':[]};mode='question';continue
        if t.startswith('Mark scheme'):mode='scheme';continue
        if t.startswith('Full-marks answer'):mode='model';continue
        if t.startswith('Partial answer and commentary') or t.startswith('Example and commentary'):mode='partial';continue
        if current and mode and (b['html'] or t):current[mode].append(b)
    if current:rows.append(current)
    return rows

def verify_source_text(blocks,markup,label):
    # Positioned diagram labels and isotope prescripts change DOM reading order.
    # Check every original non-whitespace character survives, including symbols.
    class Visible(HTMLParser):
        def __init__(self):super().__init__();self.value=''
        def handle_data(self,data):self.value+=data
    parser=Visible();parser.feed(markup)
    original=''.join(b['text'] for b in blocks)
    chars=lambda value:collections.Counter(re.sub(r'\s+','',value))
    if chars(original)!=chars(parser.value):raise ValueError('Source text lost or changed: '+label)

def marking_examples(row):
    """Use only explicitly awarded scores. Commentary and inline score tags stay hidden until checked."""
    blocks=row['partial'];awards=[(i,re.search(r'(\d+)\s*(?:marks?\s*)?out of\s*(\d+)\s*(?:marks?\s*)?(?:is\s*)?awarded',b['text'],re.I)) for i,b in enumerate(blocks)];awards=[(i,m) for i,m in awards if m]
    result=[];answers=[];seen=set();_,parts=split_parts(row['question'])
    for b in blocks:
        t=re.sub(r'\[[^\]]*\]','',b['text']).strip();ref=re.match(r'^(\d{2}(?:\.\d+)?)\b',t)
        if ref:
            if ref.group(1) in seen:break
            seen.add(ref.group(1))
        if answers and not ref and re.search(r'\b(?:Level [123]|marks? (?:is |are )?(?:awarded|given)|student|candidate|response|Indicative content|error carried forward)\b',t,re.I):break
        if re.search(r'out\s+of\s+\d+.*awarded',t,re.I):break
        answers.append(b)
    root=re.match(r'^\s*(\d{2})',row['question'][0]['text']).group(1)
    def strip_marks(value):
        # Mark labels may be split across bold/italic runs. Match their visible text,
        # then remove only those characters while retaining the formatted answer.
        class Tokens(HTMLParser):
            def __init__(self):super().__init__(convert_charrefs=True);self.items=[];self.plain=''
            def handle_starttag(self,tag,attrs):self.items.append(('tag',self.get_starttag_text()))
            def handle_startendtag(self,tag,attrs):self.items.append(('tag',self.get_starttag_text()))
            def handle_endtag(self,tag):self.items.append(('tag','</'+tag+'>'))
            def handle_data(self,data):self.items.append(('text',len(self.plain),data));self.plain+=data
        parser=Tokens();parser.feed(value);remove=set()
        for match in re.finditer(r'\[(?:\s*\d\b[^\]]*|[^\]]*\bmarks?\b[^\]]*)\]|[✓✘✔]',parser.plain,re.I):remove.update(range(match.start(),match.end()))
        return ''.join(item[1] if item[0]=='tag' else esc(''.join(c for i,c in enumerate(item[2],item[1]) if i not in remove)) for item in parser.items)
    for end,match in awards:
        if not answers:continue
        maximum=int(match.group(2));_,parts=split_parts(row['question'])
        labelled=[re.match(r'^\s*(\d{2}(?:\.\d+)?)\b',b['text']).group(1) for b in answers if re.match(r'^\s*(\d{2}(?:\.\d+)?)\b',b['text'])]
        relevant=[p for p in parts if p['label'] in labelled]
        if sum(p['marks'] for p in relevant)!=maximum:
            relevant=[p for p in relevant if p['marks']==maximum]
        if not relevant and len(parts)==1 and parts[0]['marks']==maximum:relevant=parts
        if sum(p['marks'] for p in relevant)!=maximum:continue
        selected=answers
        if len(relevant)==1:
            label=relevant[0]['label'];first_answer=next((i for i,b in enumerate(answers) if re.match(r'^\s*'+re.escape(label)+r'\b',b['text'])),None)
            if first_answer is not None:
                end_answer=next((i for i,b in enumerate(answers[first_answer+1:],first_answer+1) if re.match(r'^\s*'+root+r'\.\d+\b',b['text'])),len(answers));selected=answers[first_answer:end_answer]
        else:label=' & '.join(p['label'] for p in relevant)
        answer=''.join('<p>'+esc(re.match(r'^\s*\d{2}(?:\.\d+)?',b['text']).group(0))+'</p>' if re.match(r'^\s*\d{2}(?:\.\d+)?',b['text']) and re.search(r'not stated; student just|[Nn]o mark awarded for',re.sub(r'\[[^\]]*\]','',b['text'])) else b['html'] for b in selected)
        # Remove mark labels, never scientific wording. The complete original commentary remains in review.
        answer=strip_marks(answer)
        if re.search(r'(?:marks? awarded|Level [123]|mark awarded|awarded.*mark)',html.unescape(re.sub('<[^>]*>','',answer)),re.I):continue
        result.append({'label':label,'score':int(match.group(1)),'max':maximum,'answerHtml':answer,'feedbackHtml':''.join(b['html'] for b in blocks)})
        labels={p['label'] for p in relevant};model=[];include=len(labels)!=1
        for b in row['model']:
            ref=re.match(r'^\s*(\d{2}(?:\.\d+)?)\b',b['text'])
            if ref:include=ref.group(1) in labels
            if include:model.append(b['html'])
        model_html=strip_marks(''.join(model))
        if model_html and len(relevant)>0:result.append({'label':label,'score':maximum,'max':maximum,'answerHtml':model_html,'feedbackHtml':'<p>This is the supplied full-marks answer. Compare it with the mark scheme.</p>'+''.join(model)})
    return result

def main():
    arg=argparse.ArgumentParser();arg.add_argument('--sources',type=pathlib.Path,required=True);args=arg.parse_args()
    bank={'version':1,'subjects':{},'sets':[]};manifest={'sources':[],'assets':[],'counts':{}}
    for subject,file in FILES.items():
        source=args.sources/file
        with zipfile.ZipFile(source) as z:
            root=ET.fromstring(z.read('word/document.xml'));clean_alternates(root);conv=Converter(z,subject)
            body=list(root.find(W+'body'))
            blocks=[{'index':i,'text':text(n),'html':conv.block(n)} for i,n in enumerate(body) if n.tag in (W+'p',W+'tbl')]
            for b in blocks:
                n=body[b['index']]
                if n.findall('.//'+A+'blip') and any(d.find('.//'+A+'prstGeom') is not None and d.find('.//'+A+'blip') is None for d in n.findall('.//'+W+'drawing')):
                    previous=body[b['index']-1] if b['index']==6 and subject=='biology' else None
                    b['html']=conv.composite(n,previous)
                    if previous is not None:
                        prior=next(p for p in blocks if p['index']==b['index']-1)
                        prior['html']='<p>'+''.join(conv.inline(r) for r in previous.findall(W+'r') if not r.findall(W+'drawing'))+'</p>'
            rows=sections(blocks)
            for i,row in enumerate(rows):
                context,parts=split_parts(row['question']);question_html=''.join(b['html'] for b in row['question'])
                title=re.sub(r'\s+',' ',row['heading'].split(')',1)[1]).strip();details=re.search(r'Question\s*\((.*?)\)',row['heading'],re.S).group(1)
                item={'id':f'{subject}-{i+1:02}','subject':subject,'level':'gcse','topic':row['topic'],'title':title,'sourceHeading':row['heading'],'details':details,'scope':'combined' if 'combined' in details.lower() else 'triple','questionHtml':question_html,'contextHtml':''.join(b['html'] for b in context),'parts':[{'label':p['label'],'marks':p['marks'],'html':''.join(b['html'] for b in p['blocks'])} for p in parts],'schemeHtml':''.join(b['html'] for b in row['scheme']),'modelHtml':''.join(b['html'] for b in row['model']),'partialHtml':''.join(b['html'] for b in row['partial']),'markingExamples':marking_examples(row),'sourceFile':file,'sourceQuestionBlocks':[b['index'] for b in row['question']]}
                item['marks']=sum(p['marks'] for p in item['parts'])
                for section,key in [('question','questionHtml'),('scheme','schemeHtml'),('model','modelHtml'),('partial','partialHtml')]:verify_source_text(row[section],item[key],item['id']+' '+section)
                if not item['schemeHtml'] or not item['marks']:raise ValueError('Missing marks/scheme: '+item['id'])
                bank['sets'].append(item)
            bank['subjects'][subject]={'name':subject.capitalize(),'sets':len(rows)}
            manifest['sources'].append({'subject':subject,'file':file,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'sets':len(rows),'questionBlocks':sum(len(r['question']) for r in rows),'textSha256':hashlib.sha256('\n'.join(b['text'] for b in blocks).encode()).hexdigest(),'mathCount':len(root.findall('.//'+M+'oMath')),'shapeCount':len(conv.shapes)})
            manifest['assets'].extend(conv.assets)
    target=ROOT/'tools/question-bank/source';target.mkdir(parents=True,exist_ok=True)
    (target/'bank.json').write_text(json.dumps(bank,ensure_ascii=False,separators=(',',':'))+'\n',encoding='utf8')
    manifest['counts']={'sets':len(bank['sets']),'parts':sum(len(s['parts']) for s in bank['sets']),'markingExamples':sum(len(s['markingExamples']) for s in bank['sets']),'modelAnswers':sum(bool(s['modelHtml']) for s in bank['sets']),'assets':len(manifest['assets'])}
    (target/'source-manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(json.dumps(manifest['counts']))
    print('Sets without model blocks:',[s['id'] for s in bank['sets'] if not s['modelHtml']])
    print('Sets without scored examples:',[s['id'] for s in bank['sets'] if not s['markingExamples']])

if __name__=='__main__':main()
