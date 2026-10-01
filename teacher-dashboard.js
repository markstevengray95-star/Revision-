(() => {
  'use strict';

  const STORAGE_KEY = 'revision-teacher-dashboard-v1';
  const state = loadState();
  let selectedClassId = null;

  const $ = (id) => document.getElementById(id);
  const els = {
    classForm: $('class-form'),
    className: $('class-name'),
    classSubject: $('class-subject'),
    classLevel: $('class-level'),
    classYear: $('class-year'),
    classStudents: $('class-students'),
    classList: $('class-list'),
    classEmpty: $('class-empty'),
    classCountNote: $('class-count-note'),
    detailPanel: $('class-detail-panel'),
    detailTitle: $('class-detail-title'),
    detailMeta: $('class-detail-meta'),
    closeDetail: $('close-class-detail'),
    studentForm: $('student-form'),
    studentName: $('student-name'),
    rosterCount: $('roster-count'),
    rosterList: $('roster-list'),
    assignmentForm: $('assignment-form'),
    assignmentClass: $('assignment-class'),
    assignmentType: $('assignment-type'),
    assignmentTitle: $('assignment-title'),
    assignmentNotes: $('assignment-notes'),
    assignmentDue: $('assignment-due'),
    assignmentPoints: $('assignment-points'),
    assignmentLink: $('assignment-link'),
    assignmentSubmit: $('assignment-submit'),
    filterClass: $('assignment-filter-class'),
    filterStatus: $('assignment-filter-status'),
    assignmentList: $('assignment-list'),
    assignmentEmpty: $('assignment-empty'),
    metricClasses: $('metric-classes'),
    metricStudents: $('metric-students'),
    metricActive: $('metric-active'),
    metricDueWeek: $('metric-due-week'),
    notice: $('teacher-notice'),
    exportData: $('export-data'),
    importData: $('import-data')
  };

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      return normalizeState(saved);
    } catch {
      return normalizeState(null);
    }
  }

  function normalizeState(saved) {
    const classes = Array.isArray(saved?.classes) ? saved.classes : [];
    const assignments = Array.isArray(saved?.assignments) ? saved.assignments : [];
    return {
      version: 1,
      classes: classes.map((item) => ({
        id: String(item.id || uid()),
        name: cleanText(item.name, 60) || 'Untitled class',
        subject: cleanText(item.subject, 40) || 'Science',
        level: cleanText(item.level, 30) || 'GCSE',
        year: cleanText(item.year, 30),
        code: cleanCode(item.code) || createClassCode(),
        students: Array.isArray(item.students) ? item.students.map((name) => cleanText(name, 80)).filter(Boolean) : [],
        createdAt: Number(item.createdAt) || Date.now()
      })),
      assignments: assignments.map((item) => ({
        id: String(item.id || uid()),
        classId: String(item.classId || ''),
        type: ['homework', 'test', 'revision'].includes(item.type) ? item.type : 'homework',
        title: cleanText(item.title, 100) || 'Untitled assignment',
        notes: cleanText(item.notes, 1200),
        due: validDateString(item.due) ? item.due : todayString(),
        points: item.points === null || item.points === '' || item.points === undefined ? null : (Number.isFinite(Number(item.points)) && Number(item.points) >= 0 ? Number(item.points) : null),
        link: safeUrl(item.link),
        status: item.status === 'closed' ? 'closed' : 'active',
        createdAt: Number(item.createdAt) || Date.now()
      })).filter((item) => classes.some((group) => String(group.id) === item.classId))
    };
  }

  function cleanText(value, max) {
    return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
  }

  function cleanCode(value) {
    return String(value ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
  }

  function validDateString(value) {
    return /^\d{4}-\d{2}-\d{2}$/.test(String(value || '')) && !Number.isNaN(new Date(`${value}T12:00:00`).getTime());
  }

  function safeUrl(value) {
    const input = String(value || '').trim();
    if (!input) return '';
    try {
      const url = new URL(input);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function uid() {
    if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
    return `rev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  }

  function createClassCode() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    do {
      code = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    } while (state?.classes?.some?.((group) => group.code === code));
    return code;
  }

  function todayString() {
    const now = new Date();
    const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch {
      showNotice('Changes could not be saved in this browser. Check storage permissions.', 'error');
      return false;
    }
  }

  function showNotice(message, kind = 'success') {
    els.notice.textContent = message;
    els.notice.dataset.kind = kind;
    els.notice.hidden = false;
    window.clearTimeout(showNotice.timer);
    showNotice.timer = window.setTimeout(() => { els.notice.hidden = true; }, 4200);
  }

  function splitStudents(value) {
    const seen = new Set();
    return String(value || '').split(/[\n,;]+/).map((item) => cleanText(item, 80)).filter((item) => {
      if (!item) return false;
      const key = item.toLocaleLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function classById(id) {
    return state.classes.find((group) => group.id === id) || null;
  }

  function assignmentCountForClass(id, status = 'all') {
    return state.assignments.filter((item) => item.classId === id && (status === 'all' || item.status === status)).length;
  }

  function makeButton(label, action, id, className = 'mini-button') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = className;
    button.dataset.action = action;
    button.dataset.id = id;
    button.textContent = label;
    return button;
  }

  function render() {
    renderMetrics();
    renderClassOptions();
    renderClasses();
    renderAssignments();
    renderClassDetail();
  }

  function renderMetrics() {
    const active = state.assignments.filter((item) => item.status === 'active');
    const now = startOfToday();
    const week = new Date(now);
    week.setDate(week.getDate() + 7);
    const dueWeek = active.filter((item) => {
      const due = dateFromString(item.due);
      return due >= now && due <= week;
    }).length;
    els.metricClasses.textContent = String(state.classes.length);
    els.metricStudents.textContent = String(state.classes.reduce((sum, group) => sum + group.students.length, 0));
    els.metricActive.textContent = String(active.length);
    els.metricDueWeek.textContent = String(dueWeek);
  }

  function renderClassOptions() {
    const previousAssignment = els.assignmentClass.value;
    const previousFilter = els.filterClass.value || 'all';
    fillClassSelect(els.assignmentClass, 'Choose a class…', false);
    fillClassSelect(els.filterClass, 'All classes', true);
    if (state.classes.some((group) => group.id === previousAssignment)) els.assignmentClass.value = previousAssignment;
    if (previousFilter === 'all' || state.classes.some((group) => group.id === previousFilter)) els.filterClass.value = previousFilter;
    els.assignmentClass.disabled = state.classes.length === 0;
    els.assignmentSubmit.disabled = state.classes.length === 0;
  }

  function fillClassSelect(select, firstLabel, includeAll) {
    select.replaceChildren();
    const initial = document.createElement('option');
    initial.value = includeAll ? 'all' : '';
    initial.textContent = firstLabel;
    select.append(initial);
    state.classes.forEach((group) => {
      const option = document.createElement('option');
      option.value = group.id;
      option.textContent = group.name;
      select.append(option);
    });
  }

  function renderClasses() {
    els.classList.replaceChildren();
    els.classEmpty.hidden = state.classes.length > 0;
    els.classCountNote.textContent = `${state.classes.length} ${state.classes.length === 1 ? 'class' : 'classes'}`;

    state.classes.forEach((group) => {
      const card = document.createElement('article');
      card.className = 'class-card';
      if (group.id === selectedClassId) card.dataset.selected = 'true';

      const top = document.createElement('div');
      top.className = 'class-card-top';
      const copy = document.createElement('div');
      const title = document.createElement('h3');
      title.textContent = group.name;
      const meta = document.createElement('p');
      meta.textContent = [group.subject, group.level, group.year].filter(Boolean).join(' · ');
      copy.append(title, meta);
      const code = document.createElement('button');
      code.type = 'button';
      code.className = 'class-code';
      code.dataset.action = 'copy-code';
      code.dataset.id = group.id;
      code.title = 'Copy class code';
      code.textContent = group.code;
      top.append(copy, code);

      const stats = document.createElement('div');
      stats.className = 'class-stats';
      stats.append(stat(`${group.students.length}`, 'students'), stat(`${assignmentCountForClass(group.id, 'active')}`, 'active tasks'));

      const actions = document.createElement('div');
      actions.className = 'card-actions';
      actions.append(makeButton('Open class', 'open-class', group.id), makeButton('Assign', 'assign-class', group.id), makeButton('Delete', 'delete-class', group.id, 'mini-button danger'));
      card.append(top, stats, actions);
      els.classList.append(card);
    });
  }

  function stat(value, label) {
    const box = document.createElement('span');
    const strong = document.createElement('strong');
    strong.textContent = value;
    const small = document.createElement('small');
    small.textContent = label;
    box.append(strong, small);
    return box;
  }

  function renderClassDetail() {
    const group = classById(selectedClassId);
    els.detailPanel.hidden = !group;
    if (!group) return;
    els.detailTitle.textContent = group.name;
    els.detailMeta.textContent = `${[group.subject, group.level, group.year].filter(Boolean).join(' · ')} · class code ${group.code}`;
    els.rosterCount.textContent = `(${group.students.length})`;
    els.rosterList.replaceChildren();
    if (!group.students.length) {
      const empty = document.createElement('p');
      empty.className = 'roster-empty';
      empty.textContent = 'No students added yet.';
      els.rosterList.append(empty);
      return;
    }
    group.students.forEach((name, index) => {
      const row = document.createElement('div');
      row.className = 'roster-row';
      const label = document.createElement('span');
      label.textContent = name;
      const remove = makeButton('Remove', 'remove-student', `${group.id}:${index}`, 'text-button danger-text');
      row.append(label, remove);
      els.rosterList.append(row);
    });
  }

  function renderAssignments() {
    const classFilter = els.filterClass.value || 'all';
    const statusFilter = els.filterStatus.value || 'active';
    const visible = state.assignments
      .filter((item) => classFilter === 'all' || item.classId === classFilter)
      .filter((item) => statusFilter === 'all' || item.status === statusFilter)
      .sort((a, b) => a.due.localeCompare(b.due) || b.createdAt - a.createdAt);

    els.assignmentList.replaceChildren();
    els.assignmentEmpty.hidden = visible.length > 0;
    visible.forEach((item) => {
      const group = classById(item.classId);
      if (!group) return;
      const card = document.createElement('article');
      card.className = 'assignment-card';
      card.dataset.status = item.status;

      const header = document.createElement('div');
      header.className = 'assignment-card-header';
      const labels = document.createElement('div');
      labels.className = 'assignment-labels';
      const type = document.createElement('span');
      type.className = `type-badge ${item.type}`;
      type.textContent = capitalize(item.type);
      const status = document.createElement('span');
      status.className = `status-badge ${dueState(item)}`;
      status.textContent = statusLabel(item);
      labels.append(type, status);
      const className = document.createElement('span');
      className.className = 'assignment-class-name';
      className.textContent = group.name;
      header.append(labels, className);

      const title = document.createElement('h3');
      title.textContent = item.title;
      const details = document.createElement('p');
      details.className = 'assignment-details';
      details.textContent = `Due ${formatDate(item.due)}${item.points !== null ? ` · ${item.points} marks / points` : ''}`;
      card.append(header, title, details);

      if (item.notes) {
        const notes = document.createElement('p');
        notes.className = 'assignment-notes';
        notes.textContent = item.notes;
        card.append(notes);
      }
      if (item.link) {
        const link = document.createElement('a');
        link.className = 'resource-link';
        link.href = item.link;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'Open linked resource ↗';
        card.append(link);
      }

      const actions = document.createElement('div');
      actions.className = 'card-actions assignment-actions';
      actions.append(
        makeButton(item.status === 'closed' ? 'Reopen' : 'Close', 'toggle-assignment', item.id),
        makeButton('Duplicate', 'duplicate-assignment', item.id),
        makeButton('Delete', 'delete-assignment', item.id, 'mini-button danger')
      );
      card.append(actions);
      els.assignmentList.append(card);
    });
  }

  function capitalize(value) {
    return value ? value[0].toUpperCase() + value.slice(1) : '';
  }

  function startOfToday() {
    const value = new Date();
    value.setHours(0, 0, 0, 0);
    return value;
  }

  function dateFromString(value) {
    return new Date(`${value}T12:00:00`);
  }

  function dueState(item) {
    if (item.status === 'closed') return 'closed';
    const due = dateFromString(item.due);
    const today = startOfToday();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    if (due < today) return 'overdue';
    if (due < tomorrow) return 'today';
    return 'upcoming';
  }

  function statusLabel(item) {
    const stateName = dueState(item);
    return { closed: 'Closed', overdue: 'Overdue', today: 'Due today', upcoming: 'Active' }[stateName];
  }

  function formatDate(value) {
    const date = dateFromString(value);
    return new Intl.DateTimeFormat(undefined, { day: 'numeric', month: 'short', year: 'numeric' }).format(date);
  }

  els.classForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = cleanText(els.className.value, 60);
    if (!name) return;
    const group = {
      id: uid(),
      name,
      subject: cleanText(els.classSubject.value, 40),
      level: cleanText(els.classLevel.value, 30),
      year: cleanText(els.classYear.value, 30),
      code: createClassCode(),
      students: splitStudents(els.classStudents.value),
      createdAt: Date.now()
    };
    state.classes.push(group);
    selectedClassId = group.id;
    saveState();
    els.classForm.reset();
    els.classSubject.value = 'Physics';
    els.classLevel.value = 'GCSE';
    render();
    els.assignmentClass.value = group.id;
    showNotice(`${group.name} created. Class code: ${group.code}`);
  });

  els.classList.addEventListener('click', async (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const group = classById(button.dataset.id);
    if (!group) return;
    if (button.dataset.action === 'open-class') {
      selectedClassId = group.id;
      render();
      els.detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (button.dataset.action === 'assign-class') {
      els.assignmentClass.value = group.id;
      $('assign-work').scrollIntoView({ behavior: 'smooth', block: 'start' });
      els.assignmentTitle.focus({ preventScroll: true });
    } else if (button.dataset.action === 'copy-code') {
      try {
        await navigator.clipboard.writeText(group.code);
        showNotice(`Class code ${group.code} copied.`);
      } catch {
        showNotice(`Class code: ${group.code}`, 'info');
      }
    } else if (button.dataset.action === 'delete-class') {
      const linked = assignmentCountForClass(group.id, 'all');
      const message = linked ? `Delete ${group.name} and its ${linked} assignment${linked === 1 ? '' : 's'}?` : `Delete ${group.name}?`;
      if (!window.confirm(message)) return;
      state.classes = state.classes.filter((item) => item.id !== group.id);
      state.assignments = state.assignments.filter((item) => item.classId !== group.id);
      if (selectedClassId === group.id) selectedClassId = null;
      saveState();
      render();
      showNotice(`${group.name} deleted.`, 'info');
    }
  });

  els.closeDetail.addEventListener('click', () => {
    selectedClassId = null;
    renderClassDetail();
    renderClasses();
  });

  els.studentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const group = classById(selectedClassId);
    const name = cleanText(els.studentName.value, 80);
    if (!group || !name) return;
    if (group.students.some((student) => student.toLocaleLowerCase() === name.toLocaleLowerCase())) {
      showNotice(`${name} is already in this class.`, 'error');
      return;
    }
    group.students.push(name);
    els.studentForm.reset();
    saveState();
    render();
    showNotice(`${name} added to ${group.name}.`);
  });

  els.rosterList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action="remove-student"]');
    if (!button) return;
    const [classId, rawIndex] = button.dataset.id.split(':');
    const group = classById(classId);
    const index = Number(rawIndex);
    if (!group || !Number.isInteger(index) || !group.students[index]) return;
    const [removed] = group.students.splice(index, 1);
    saveState();
    render();
    showNotice(`${removed} removed from ${group.name}.`, 'info');
  });

  els.assignmentForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const group = classById(els.assignmentClass.value);
    const title = cleanText(els.assignmentTitle.value, 100);
    const due = els.assignmentDue.value;
    if (!group || !title || !validDateString(due)) {
      showNotice('Choose a class, add a title and select a valid due date.', 'error');
      return;
    }
    const rawPoints = els.assignmentPoints.value.trim();
    const linkInput = els.assignmentLink.value.trim();
    const link = safeUrl(linkInput);
    if (linkInput && !link) {
      showNotice('The resource link must start with http:// or https://.', 'error');
      return;
    }
    const assignment = {
      id: uid(),
      classId: group.id,
      type: ['homework', 'test', 'revision'].includes(els.assignmentType.value) ? els.assignmentType.value : 'homework',
      title,
      notes: cleanText(els.assignmentNotes.value, 1200),
      due,
      points: rawPoints === '' ? null : Math.max(0, Number(rawPoints)),
      link,
      status: 'active',
      createdAt: Date.now()
    };
    state.assignments.push(assignment);
    saveState();
    const keepClass = group.id;
    els.assignmentForm.reset();
    els.assignmentClass.value = keepClass;
    els.assignmentType.value = 'homework';
    els.assignmentDue.value = defaultDueDate();
    els.filterStatus.value = 'active';
    render();
    els.assignmentClass.value = keepClass;
    showNotice(`${capitalize(assignment.type)} assigned to ${group.name}.`);
  });

  els.filterClass.addEventListener('change', renderAssignments);
  els.filterStatus.addEventListener('change', renderAssignments);

  els.assignmentList.addEventListener('click', (event) => {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    const item = state.assignments.find((assignment) => assignment.id === button.dataset.id);
    if (!item) return;
    if (button.dataset.action === 'toggle-assignment') {
      item.status = item.status === 'closed' ? 'active' : 'closed';
      saveState();
      render();
      showNotice(`${item.title} ${item.status === 'closed' ? 'closed' : 'reopened'}.`, 'info');
    } else if (button.dataset.action === 'duplicate-assignment') {
      state.assignments.push({ ...item, id: uid(), title: `${item.title} (copy)`, status: 'active', createdAt: Date.now() });
      saveState();
      els.filterStatus.value = 'active';
      render();
      showNotice('Assignment duplicated.');
    } else if (button.dataset.action === 'delete-assignment') {
      if (!window.confirm(`Delete “${item.title}”?`)) return;
      state.assignments = state.assignments.filter((assignment) => assignment.id !== item.id);
      saveState();
      render();
      showNotice('Assignment deleted.', 'info');
    }
  });

  function defaultDueDate() {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return local.toISOString().slice(0, 10);
  }

  els.exportData.addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `revision-teacher-backup-${todayString()}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    showNotice('Teacher backup exported.');
  });

  els.importData.addEventListener('change', async () => {
    const file = els.importData.files?.[0];
    els.importData.value = '';
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      const imported = normalizeState(parsed);
      if (!window.confirm(`Import ${imported.classes.length} classes and ${imported.assignments.length} assignments? This replaces the current teacher dashboard data.`)) return;
      state.classes = imported.classes;
      state.assignments = imported.assignments;
      selectedClassId = null;
      saveState();
      render();
      showNotice('Teacher backup imported.');
    } catch {
      showNotice('That file is not a valid Revision teacher backup.', 'error');
    }
  });

  els.assignmentDue.value = defaultDueDate();
  render();
})();
