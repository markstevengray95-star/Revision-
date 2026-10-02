const assert = require("node:assert/strict"),
  fs = require("node:fs"),
  path = require("node:path"),
  vm = require("node:vm");
const root = path.resolve(__dirname, "..");
let csvBlob,
  clicked,
  attached = false;
const window = {},
  document = {
    createElement: (tag) => ({
      tag,
      click() {
        clicked = { download: this.download, href: this.href, attached };
      },
      remove() {
        attached = false;
      },
    }),
    body: {
      append() {
        attached = true;
      },
    },
  };
const context = vm.createContext({
  window,
  document,
  Blob,
  URL: {
    createObjectURL(blob) {
      csvBlob = blob;
      return "blob:results";
    },
    revokeObjectURL() {},
  },
  setTimeout() {},
});
vm.runInContext(
  fs.readFileSync(path.join(root, "shared/activity-ui.js"), "utf8"),
  context,
);
const ui = window.REVISION_ACTIVITY_UI;
assert.equal(ui.lessonLink({ lessonHref: "javascript:alert(1)" }), null);
assert.equal(ui.lessonLink({ lessonHref: "courses/../private" }), null);
assert.equal(ui.lessonLink({ lessonHref: "https://external.invalid" }), null);
assert.equal(
  ui.lessonLink({ lessonHref: "courses/gcse/index.html?topic=p1" }).href,
  "courses/gcse/index.html?topic=p1",
);
assert.equal(ui.percent(3, 4), 75);
assert.equal(ui.percent(0, 0), 0);
ui.downloadCSV("results.csv", [
  ["Name", "Feedback", "Score"],
  ["Student, A", 'A "quoted" comment\nSecond line', 3],
  ['=HYPERLINK("bad")', "@formula", "-1"],
]);
assert.equal(clicked.download, "results.csv");
assert.equal(clicked.attached, true);
assert.equal(csvBlob.type, "text/csv;charset=utf-8");
csvBlob
  .text()
  .then((text) => {
    assert.ok(
      text.includes('"Student, A","A ""quoted"" comment\nSecond line","3"'),
    );
    assert.ok(text.includes('"\'=HYPERLINK(""bad"")","\'@formula","\'-1"'));
    console.log(
      "Activity results passed: CSV escaping, spreadsheet formula protection, download attachment, safe lesson links and percentage summaries.",
    );
  })
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
