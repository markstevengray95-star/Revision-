(() => {
  "use strict";
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  const link = (text, href, className = "teacher-button") => {
    const a = el("a", text, className);
    a.href = href;
    return a;
  };
  const button = (text, action, id, className = "mini-button") => {
    const b = el("button", text, className);
    b.type = "button";
    b.dataset.action = action;
    b.dataset.id = id;
    return b;
  };
  function lessonLink(q) {
    const href = q.lessonHref;
    if (
      typeof href !== "string" ||
      !href.startsWith("courses/") ||
      href.includes("..") ||
      href.includes("\\")
    )
      return null;
    return link(href.startsWith('courses/homework-assets/') ? "Open task figure →" : "Revise this lesson →", href, "resource-link");
  }
  function taskFigure(q) {
    const resource=window.REVISION_HOMEWORK_RESOURCES?.fromHref(q.lessonHref);
    if(!resource)return null;
    const figure=el('figure',undefined,'homework-figure'),img=el('img');
    img.src=resource.href;img.alt=resource.alt;img.loading='lazy';img.width=640;
    figure.append(img,el('figcaption',resource.title));return figure;
  }
  function downloadCSV(name, rows) {
    const quote = (v) =>
      '"' +
      String(v ?? "")
        .replace(/"/g, '""')
        .replace(/^[=+@\-\t\r]/, "'$&") +
      '"';
    const blob = new Blob(
      ["\uFEFF" + rows.map((r) => r.map(quote).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob),
      a = link("", url);
    a.download = name;
    a.hidden = true;
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const percent = (a, b) => (b ? Math.round((a / b) * 100) : 0);
  window.REVISION_ACTIVITY_UI = {
    el,
    link,
    button,
    lessonLink,
    taskFigure,
    downloadCSV,
    percent,
  };
})();
