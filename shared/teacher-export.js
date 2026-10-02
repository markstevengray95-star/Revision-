(() => {
 'use strict';
 const xml=value=>String(value??'').replace(/[<>&"']/g,c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c])).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,'');
 function zip(files){
  const enc=new TextEncoder(),chunks=[],central=[];let offset=0;
  const crc=bytes=>{let n=0xffffffff;for(const b of bytes){n^=b;for(let i=0;i<8;i++)n=(n>>>1)^((n&1)?0xedb88320:0);}return (n^0xffffffff)>>>0;};
  const header=(size,values)=>{const bytes=new Uint8Array(size),d=new DataView(bytes.buffer);for(const [at,type,v]of values)d[type](at,v,true);return bytes;};
  for(const [name,content]of Object.entries(files)){
   const n=enc.encode(name),b=enc.encode(content),checksum=crc(b);
   const h=header(30,[[0,'setUint32',0x04034b50],[4,'setUint16',20],[10,'setUint16',0],[12,'setUint16',33],[14,'setUint32',checksum],[18,'setUint32',b.length],[22,'setUint32',b.length],[26,'setUint16',n.length]]);
   chunks.push(h,n,b);
   central.push(header(46,[[0,'setUint32',0x02014b50],[4,'setUint16',20],[6,'setUint16',20],[12,'setUint16',0],[14,'setUint16',33],[16,'setUint32',checksum],[20,'setUint32',b.length],[24,'setUint32',b.length],[28,'setUint16',n.length],[42,'setUint32',offset]]),n);
   offset+=h.length+n.length+b.length;
  }
  const size=central.reduce((s,b)=>s+b.length,0),count=Object.keys(files).length;
  return new Blob([...chunks,...central,header(22,[[0,'setUint32',0x06054b50],[8,'setUint16',count],[10,'setUint16',count],[12,'setUint32',size],[16,'setUint32',offset]])],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
 }
 function xlsx(rows){
  const letter=index=>{let out='';for(let n=index+1;n>0;n=Math.floor((n-1)/26))out=String.fromCharCode(65+(n-1)%26)+out;return out;};
  const sheet=rows.map((row,i)=>`<row r="${i+1}">${row.map((v,j)=>typeof v==='number'&&Number.isFinite(v)?`<c r="${letter(j)}${i+1}"><v>${v}</v></c>`:`<c r="${letter(j)}${i+1}" t="inlineStr"><is><t xml:space="preserve">${xml(v)}</t></is></c>`).join('')}</row>`).join('');
  return zip({
   '[Content_Types].xml':'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/></Types>',
   '_rels/.rels':'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
   'xl/workbook.xml':'<?xml version="1.0"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets><sheet name="Markbook" sheetId="1" r:id="rId1"/></sheets></workbook>',
   'xl/_rels/workbook.xml.rels':'<?xml version="1.0"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/></Relationships>',
   'xl/worksheets/sheet1.xml':`<?xml version="1.0" encoding="UTF-8"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>${sheet}</sheetData></worksheet>`
  });
 }
 function download(name,blob){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
 const api={xlsx,download,xml};if(typeof module!=='undefined')module.exports=api;else window.REVISION_TEACHER_EXPORT=api;
})();
