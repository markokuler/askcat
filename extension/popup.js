// API Configuration
const API_BASE = 'https://askcat.vercel.app'; // Change to localhost:3000 for dev

// DOM Elements
const pageTitle = document.getElementById('pageTitle');
const pageUrl = document.getElementById('pageUrl');
const analyzeBtn = document.getElementById('analyzeBtn');
const outreachBtn = document.getElementById('outreachBtn');
const actions = document.getElementById('actions');
const loading = document.getElementById('loading');
const error = document.getElementById('error');
const results = document.getElementById('results');

// State
let pageContent = null;
let pageData = null;
let analysisResult = null;

// Page type labels
const PAGE_TYPE_LABELS = {
  'linkedin_job': '💼 LinkedIn Oglas za posao',
  'linkedin_company': '🏢 LinkedIn Kompanija',
  'linkedin_profile': '👤 LinkedIn Profil',
  'linkedin_other': '🔗 LinkedIn',
  'hiring_page': '📋 Stranica za zapošljavanje',
  'company_about': '🏢 O kompaniji',
  'company_homepage': '🌐 Homepage kompanije',
  'generic': '📄 Opšta stranica'
};

// Initialize popup
async function init() {
  try {
    // Get current tab info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    pageTitle.textContent = tab.title || 'Nepoznata stranica';
    pageUrl.textContent = new URL(tab.url).hostname;
    pageData = { url: tab.url, title: tab.title };

    // Get page content via content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageContent' });
    if (response && response.content) {
      pageContent = response.content;
      // Show detected page type
      const typeLabel = PAGE_TYPE_LABELS[pageContent.type] || PAGE_TYPE_LABELS['generic'];
      pageUrl.textContent = `${new URL(tab.url).hostname} • ${typeLabel}`;
    }
  } catch (err) {
    console.error('Init error:', err);
    pageTitle.textContent = 'Nije moguće učitati stranicu';
  }
}

// Show loading state
function showLoading(message = 'Analiziram...') {
  actions.style.display = 'none';
  loading.querySelector('span').textContent = message;
  loading.classList.add('active');
  error.classList.remove('active');
  results.classList.remove('active');
}

// Hide loading state
function hideLoading() {
  loading.classList.remove('active');
  actions.style.display = 'flex';
}

// Show error
function showError(message) {
  hideLoading();
  error.textContent = message;
  error.classList.add('active');
}

// Analyze page
async function analyzePage() {
  if (!pageContent) {
    showError('Nije moguće pročitati sadržaj stranice. Probaj osvežiti stranicu.');
    return;
  }

  showLoading('Analiziram stranicu...');

  try {
    // pageContent is an object with { type, metadata, text }
    const contentToSend = typeof pageContent === 'string'
      ? pageContent.substring(0, 15000)
      : { ...pageContent, text: (pageContent.text || '').substring(0, 15000) };

    const response = await fetch(`${API_BASE}/api/analyze-page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageContent: contentToSend,
        pageUrl: pageData.url,
        pageTitle: pageData.title
      })
    });

    if (!response.ok) {
      throw new Error('API greška');
    }

    const data = await response.json();
    analysisResult = data;
    displayResults(data);
  } catch (err) {
    console.error('Analyze error:', err);
    showError('Greška pri analizi. Proveri da li je AskCat API dostupan.');
  }
}

// Display results
function displayResults(data) {
  hideLoading();

  let html = '';

  // Show extracted signals
  if (data.signals) {
    html += `
      <div class="result-card">
        <div class="type" style="color: #059669;">📊 Izvučeni signali</div>
        <div class="desc">${data.signals}</div>
      </div>
    `;
  }

  // Show matched employees
  if (data.employees && data.employees.length > 0) {
    data.employees.forEach(emp => {
      html += `
        <div class="result-card employee">
          <div class="type">👤 Employee</div>
          <div class="name">${emp.name}</div>
          <div class="desc">${emp.role} • ${emp.match}</div>
        </div>
      `;
    });
  }

  // Show matched projects
  if (data.projects && data.projects.length > 0) {
    data.projects.forEach(proj => {
      html += `
        <div class="result-card project">
          <div class="type">📋 Project</div>
          <div class="name">${proj.name}</div>
          <div class="desc">${proj.match}</div>
        </div>
      `;
    });
  }

  // Show matched repos
  if (data.repositories && data.repositories.length > 0) {
    data.repositories.forEach(repo => {
      html += `
        <div class="result-card repo">
          <div class="type">📦 Repository</div>
          <div class="name">${repo.name}</div>
          <div class="desc">${repo.match}</div>
        </div>
      `;
    });
  }

  // Show response if no structured data
  if (data.response && !data.employees) {
    html += `
      <div class="result-card">
        <div class="desc">${data.response}</div>
      </div>
    `;
  }

  results.innerHTML = html;
  results.classList.add('active');
}

// Generate outreach email
async function generateOutreach() {
  if (!pageContent) {
    showError('Nije moguće pročitati sadržaj stranice.');
    return;
  }

  showLoading('Generišem outreach email...');

  try {
    // pageContent is an object with { type, metadata, text }
    const contentToSend = typeof pageContent === 'string'
      ? pageContent.substring(0, 15000)
      : { ...pageContent, text: (pageContent.text || '').substring(0, 15000) };

    const response = await fetch(`${API_BASE}/api/analyze-page`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        pageContent: contentToSend,
        pageUrl: pageData.url,
        pageTitle: pageData.title,
        generateOutreach: true
      })
    });

    if (!response.ok) {
      throw new Error('API greška');
    }

    const data = await response.json();
    displayEmail(data);
  } catch (err) {
    console.error('Outreach error:', err);
    showError('Greška pri generisanju emaila.');
  }
}

// Display email
function displayEmail(data) {
  hideLoading();

  const emailHtml = `
    <div class="email-box">
      <div class="header">
        <h3>📧 Outreach Email</h3>
      </div>
      ${data.subject ? `
        <div class="subject">
          <div class="label">Subject</div>
          <div class="text">${data.subject}</div>
        </div>
      ` : ''}
      <div class="body">${data.email || data.response || 'Nije moguće generisati email.'}</div>
      <button class="copy-btn" id="copyEmail">
        📋 Kopiraj email
      </button>
    </div>
  `;

  results.innerHTML = emailHtml;
  results.classList.add('active');

  // Copy button handler
  document.getElementById('copyEmail').addEventListener('click', () => {
    const emailText = data.subject
      ? `Subject: ${data.subject}\n\n${data.email}`
      : data.email || data.response;

    navigator.clipboard.writeText(emailText).then(() => {
      document.getElementById('copyEmail').innerHTML = '✅ Kopirano!';
      setTimeout(() => {
        document.getElementById('copyEmail').innerHTML = '📋 Kopiraj email';
      }, 2000);
    });
  });
}

// Event listeners
analyzeBtn.addEventListener('click', analyzePage);
outreachBtn.addEventListener('click', generateOutreach);

// Initialize
init();
