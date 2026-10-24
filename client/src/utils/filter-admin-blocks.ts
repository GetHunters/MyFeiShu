const ADMIN_KEYWORDS = ['工作量统计', '事项统计', '工作量平衡说明'];
const HIDE_STYLE = 'display:none !important';
const HIDE_CLASS = '__admin-only-hidden__';

function isHeading(tag: string): boolean {
  return /^H[1-6]$/.test(tag);
}

function findBlockContainer(el: Element): Element | null {
  let current: Element | null = el.parentElement;
  while (current && current.tagName !== 'BODY') {
    const tag = current.tagName;
    if (
      tag === 'SECTION' ||
      tag === 'DIV' ||
      tag === 'TABLE' ||
      tag === 'ARTICLE' ||
      tag === 'MAIN'
    ) {
      if (current.classList.contains(HIDE_CLASS)) return current;
      return current;
    }
    current = current.parentElement;
  }
  return el.parentElement;
}

function textMatchesKeyword(text: string): boolean {
  const trimmed = text.trim();
  return ADMIN_KEYWORDS.some((kw: string) => trimmed.includes(kw));
}

export function filterAdminBlocks(
  html: string,
  isAdmin: boolean,
): string {
  if (isAdmin || !html || !html.trim()) return html;

  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const adminOnlyEls = doc.querySelectorAll('.admin-only');
  adminOnlyEls.forEach((el) => {
    el.classList.add(HIDE_CLASS);
  });

  const allHeadings = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');
  allHeadings.forEach((heading) => {
    const text = heading.textContent || '';
    if (!textMatchesKeyword(text)) return;
    const container = findBlockContainer(heading);
    if (container) {
      container.classList.add(HIDE_CLASS);
    }
  });

  const styleId = '__admin-only-style__';
  if (!doc.getElementById(styleId)) {
    const style = doc.createElement('style');
    style.id = styleId;
    style.textContent = `.${HIDE_CLASS} { ${HIDE_STYLE}; }`;
    const head = doc.head;
    if (head) {
      head.appendChild(style);
    } else {
      const headEl = doc.createElement('head');
      headEl.appendChild(style);
      doc.documentElement.insertBefore(headEl, doc.documentElement.firstChild);
    }
  }

  const doctype = doc.doctype
    ? new XMLSerializer().serializeToString(doc.doctype)
    : '';
  const htmlString = doc.documentElement.outerHTML;
  return doctype ? `${doctype}\n${htmlString}` : htmlString;
}
