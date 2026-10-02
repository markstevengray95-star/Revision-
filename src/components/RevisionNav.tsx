const links=[['home','Dashboard','/index.html'],['gcse','GCSE Science','/courses/gcse/index.html'],['alevel','A-level Science','/courses/alevel/index.html'],['practice','Practise','/practice.html'],['equations','Equation Practice','/tools/equation-practice/index.html'],['tools','Practice tools','/index.html#tools'],['student','My Work','/student.html'],['teacher','Teacher','/teacher.html'],['pricing','Pricing','/pricing.html']];

export default function RevisionNav({active}: {active: string}) {
  return <header className="revision-bar">
    <div className="revision-bar-inner">
      <a className="revision-wordmark" href="/index.html">Spark<svg className="spark-bolt" aria-hidden="true" viewBox="0 0 12 18" focusable="false"><path d="M7.2 0 1.4 9h4L3.8 18 10.6 7.2H6.8z" fill="currentColor"/></svg></a>
      <nav className="revision-nav" aria-label="Spark app">{links.map(([key,label,url])=><a key={key} href={url} aria-current={active===key?'page':undefined}>{label}</a>)}</nav>
    </div>
  </header>;
}
