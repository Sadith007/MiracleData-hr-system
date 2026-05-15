<script>
const firebaseConfig = {
  apiKey: "AIzaSyAQkEdKFOrP8zvZE8snmkJZZVbi9ZYcnG4",
  authDomain: "hr-management-cloud.firebaseapp.com",
  projectId: "hr-management-cloud",
  storageBucket: "hr-management-cloud.firebasestorage.app",
  messagingSenderId: "3117790153",
  appId: "1:3117790153:web:0c268334e8378132316e18"
};
firebase.initializeApp(firebaseConfig);
const _db = firebase.firestore();
const HR_COLLECTION = 'hr_data';

const DEFAULT_EMPLOYEES = [{"id":1,"fullName":"John Smith","empId":"EMP001","email":"john@company.com","mobile":"0771234567","nic":"123456789V","dob":"1990-05-15","gender":"Male","maritalStatus":"Married","address":"Colombo","emergencyName":"Jane Smith","emergencyPhone":"0777654321","department":"IT","designation":"Senior Developer","doj":"2023-01-10","employmentType":"Permanent","status":"Active","location":"Colombo","salary":150000,"bankAccount":"123456789","bankName":"Commercial Bank","payMethod":"Bank Transfer","remarks":"Excellent performer"},{"id":2,"fullName":"Sarah Johnson","empId":"EMP002","email":"sarah@company.com","mobile":"0771234568","nic":"987654321V","dob":"1988-08-20","gender":"Female","maritalStatus":"Married","address":"Kandy","emergencyName":"Mike Johnson","emergencyPhone":"0777654322","department":"HR","designation":"HR Manager","doj":"2022-06-15","employmentType":"Permanent","status":"Active","location":"Kandy","salary":180000,"bankAccount":"987654321","bankName":"HSBC","payMethod":"Bank Transfer","remarks":"Great leader"}];
const DEFAULT_USERS = [{"id":"u1","username":"admin","password":"admin123","role":"ADMIN","status":"active"},{"id":"u2","username":"hr","password":"hr123","role":"HR","status":"active"},{"id":"u3","username":"viewer","password":"view123","role":"VIEWER","status":"active"}];

let DB = { employees: DEFAULT_EMPLOYEES, users: DEFAULT_USERS, pendingUsers: [], payrolls: [], leaves: [], documents: [], locations: [], trial: null, license: null, licenseKeys: [] };

async function sbGet(key) {
  try { const d = await _db.collection(HR_COLLECTION).doc(key).get(); return d.exists ? d.data().value : null; } catch(e) { return null; }
}
async function sbSet(key, value) {
  try { await _db.collection(HR_COLLECTION).doc(key).set({ value, updated_at: new Date().toISOString() }); } catch(e) { console.error(e); }
}
async function loadDB() {
  try {
    const [emp,users,pending,payrolls,trial,license,licenseKeys,leaves,documents,locData] = await Promise.all([sbGet('hr_employees'),sbGet('hr_users'),sbGet('hr_pending'),sbGet('hr_payrolls'),sbGet('hr_trial'),sbGet('hr_license'),sbGet('hr_license_keys'),sbGet('hr_leaves'),sbGet('hr_documents'),sbGet('hr_locations')]);
    DB.employees = emp ? JSON.parse(emp) : DEFAULT_EMPLOYEES;
    DB.users = users ? JSON.parse(users) : DEFAULT_USERS;
    DB.pendingUsers = pending ? JSON.parse(pending) : [];
    DB.payrolls = payrolls ? JSON.parse(payrolls) : [];
    DB.trial = trial ? JSON.parse(trial) : null;
    DB.license = license ? JSON.parse(license) : null;
    DB.licenseKeys = licenseKeys ? JSON.parse(licenseKeys) : [];
    DB.leaves = leaves ? JSON.parse(leaves) : [];
    DB.documents = documents ? JSON.parse(documents) : [];
    DB.locations = locData ? JSON.parse(locData) : [];
  } catch(e) { console.error('loadDB error',e); }
}
async function saveDB() {
  try {
    await Promise.all([
      sbSet('hr_employees', JSON.stringify(DB.employees)),
      sbSet('hr_users', JSON.stringify(DB.users)),
      sbSet('hr_pending', JSON.stringify(DB.pendingUsers)),
      sbSet('hr_payrolls', JSON.stringify(DB.payrolls)),
      sbSet('hr_trial', JSON.stringify(DB.trial)),
      sbSet('hr_license', JSON.stringify(DB.license)),
      sbSet('hr_license_keys', JSON.stringify(DB.licenseKeys||[])),
      sbSet('hr_leaves', JSON.stringify(DB.leaves||[])),
      sbSet('hr_documents', JSON.stringify((DB.documents||[]).map(d=>({...d,data:d.data?.substring(0,50000)||d.data})))),
      sbSet('hr_locations', JSON.stringify(DB.locations||[])),
    ]);
  } catch(e) { console.error('saveDB error',e); }
}

let currentUser = null, selectedEmployeeId = null, editingEmployeeId = null;

function showLoading() { if(document.getElementById('loadingOverlay'))return; const el=document.createElement('div'); el.className='loading-overlay'; el.id='loadingOverlay'; el.innerHTML='<div class="spinner"></div>'; document.body.appendChild(el); }
function hideLoading() { const el=document.getElementById('loadingOverlay'); if(el)el.remove(); }
function showToast(message,type='success') { const t=document.createElement('div'); t.className=`toast ${type}`; t.textContent=message; document.body.appendChild(t); setTimeout(()=>t.classList.add('show'),10); setTimeout(()=>{t.classList.remove('show');setTimeout(()=>t.remove(),300);},3000); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }
function openModal(id) { document.getElementById(id).classList.add('open'); }
document.addEventListener('click',e=>{ if(e.target.classList.contains('modal')&&e.target.classList.contains('open'))e.target.classList.remove('open'); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape')document.querySelectorAll('.modal.open').forEach(m=>m.classList.remove('open')); });

function exportProfilePDF(emp) {
  const pdfContent=`<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Employee Profile - ${emp.fullName}</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:40px;background:white;color:#1e293b}.header{background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:white;padding:30px;border-radius:12px;margin-bottom:30px;text-align:center}.header h1{font-size:28px;margin-bottom:8px}.header p{font-size:14px;opacity:0.9}.section{margin-bottom:25px}.section-title{font-size:16px;font-weight:bold;color:#3B82F6;border-left:4px solid #3B82F6;padding-left:12px;margin-bottom:15px}.info-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.info-card{background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:12px}.info-card label{font-size:10px;text-transform:uppercase;color:#64748b;display:block;margin-bottom:5px}.info-card span{font-size:14px;font-weight:500;color:#1e293b}.footer{margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;text-align:center;font-size:10px;color:#94a3b8}@media print{.header{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="header"><h1>Employee Profile</h1><p>${emp.empId} · ${emp.department}</p></div><div class="section"><div class="section-title">Personal Information</div><div class="info-grid"><div class="info-card"><label>Full Name</label><span>${emp.fullName||'-'}</span></div><div class="info-card"><label>Employee ID</label><span>${emp.empId||'-'}</span></div><div class="info-card"><label>Email</label><span>${emp.email||'-'}</span></div><div class="info-card"><label>Mobile</label><span>${emp.mobile||'-'}</span></div><div class="info-card"><label>NIC</label><span>${emp.nic||'-'}</span></div><div class="info-card"><label>Date of Birth</label><span>${emp.dob||'-'}</span></div><div class="info-card"><label>Gender</label><span>${emp.gender||'-'}</span></div><div class="info-card"><label>Marital Status</label><span>${emp.maritalStatus||'-'}</span></div></div></div><div class="section"><div class="section-title">Employment Details</div><div class="info-grid"><div class="info-card"><label>Department</label><span>${emp.department||'-'}</span></div><div class="info-card"><label>Designation</label><span>${emp.designation||'-'}</span></div><div class="info-card"><label>Date of Joining</label><span>${emp.doj||'-'}</span></div><div class="info-card"><label>Employment Type</label><span>${emp.employmentType||'-'}</span></div><div class="info-card"><label>Work Location</label><span>${emp.location||'-'}</span></div><div class="info-card"><label>Status</label><span>${emp.status||'Active'}</span></div></div></div><div class="section"><div class="section-title">Salary & Bank Details</div><div class="info-grid"><div class="info-card"><label>Basic Salary</label><span>LKR ${(emp.salary||0).toLocaleString()}</span></div><div class="info-card"><label>Bank Name</label><span>${emp.bankName||'-'}</span></div><div class="info-card"><label>Bank Account</label><span>${emp.bankAccount||'-'}</span></div><div class="info-card"><label>Payment Method</label><span>${emp.payMethod||'-'}</span></div></div></div><div class="footer">Generated on ${new Date().toLocaleString()} | HR Management System</div></body></html>`;
  const opt={margin:[0.5,0.5,0.5,0.5],filename:`Employee_Profile_${emp.empId}.pdf`,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4',orientation:'portrait'}};
  const el=document.createElement('div'); el.innerHTML=pdfContent; document.body.appendChild(el);
  if(window.html2pdf){html2pdf().set(opt).from(el).save().then(()=>{document.body.removeChild(el);showToast('PDF exported!','success');});}else{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=()=>{html2pdf().set(opt).from(el).save().then(()=>{document.body.removeChild(el);showToast('PDF exported!','success');});};document.head.appendChild(s);}
}

function exportPayrollPDF(emp,payrollData,month) {
  const gross=payrollData.basicSalary+payrollData.transport+payrollData.meal+payrollData.otherAllow;
  const deds=payrollData.epf+payrollData.etf+payrollData.tax+payrollData.otherDeductions;
  const net=gross-deds;
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:40px;background:white;color:#1e293b}.header{background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:white;padding:30px;border-radius:12px;margin-bottom:20px;text-align:center}.header h1{font-size:28px}.header p{font-size:14px;opacity:.9}.emp-det{background:#f8fafc;padding:15px;border-radius:8px;margin-bottom:20px;display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:12px}.emp-det strong{color:#3B82F6}table{width:100%;border-collapse:collapse;margin-bottom:15px;font-size:12px}th{background:#3B82F6;color:white;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #e2e8f0}td:last-child{text-align:right}.tot{font-weight:700;background:#f1f5f9}.net{background:linear-gradient(135deg,#10B981,#059669);color:white;padding:15px;border-radius:8px;text-align:center}.net .label{font-size:14px;opacity:.9}.net .amt{font-size:28px;font-weight:700;margin-top:5px}.foot{margin-top:30px;padding-top:15px;border-top:1px solid #e2e8f0;text-align:center;font-size:10px;color:#94a3b8}@media print{.header,.net{-webkit-print-color-adjust:exact;print-color-adjust:exact}}</style></head><body><div class="header"><h1>PAYSLIP</h1><p>${month}</p></div><div class="emp-det"><div><strong>Employee ID:</strong> ${emp.empId}</div><div><strong>Name:</strong> ${emp.fullName}</div><div><strong>Department:</strong> ${emp.department}</div><div><strong>Designation:</strong> ${emp.designation}</div></div><table><thead><tr><th>Earnings</th><th>Amount</th></tr></thead><tbody><tr><td>Basic Salary</td><td>LKR ${payrollData.basicSalary.toLocaleString()}</td></tr><tr><td>Transport</td><td>LKR ${payrollData.transport.toLocaleString()}</td></tr><tr><td>Meal</td><td>LKR ${payrollData.meal.toLocaleString()}</td></tr><tr><td>Other</td><td>LKR ${payrollData.otherAllow.toLocaleString()}</td></tr><tr class="tot"><td>Gross Earnings</td><td>LKR ${gross.toLocaleString()}</td></tr></tbody></table><table><thead><tr><th>Deductions</th><th>Amount</th></tr></thead><tbody><tr><td>EPF (8%)</td><td>LKR ${payrollData.epf.toLocaleString()}</td></tr><tr><td>ETF (3%)</td><td>LKR ${payrollData.etf.toLocaleString()}</td></tr><tr><td>PAYE Tax</td><td>LKR ${payrollData.tax.toLocaleString()}</td></tr><tr><td>Other</td><td>LKR ${payrollData.otherDeductions.toLocaleString()}</td></tr><tr class="tot"><td>Total Deductions</td><td>LKR ${deds.toLocaleString()}</td></tr></tbody></table><div class="net"><div class="label">NET SALARY</div><div class="amt">LKR ${net.toLocaleString()}</div></div><div class="foot">Generated on ${new Date().toLocaleString()} | HR Management System</div></body></html>`;
  const opt={margin:[0.5,0.5,0.5,0.5],filename:`Payslip_${emp.empId}_${month}.pdf`,image:{type:'jpeg',quality:0.98},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4',orientation:'portrait'}};
  const el=document.createElement('div'); el.innerHTML=html; document.body.appendChild(el);
  if(window.html2pdf){html2pdf().set(opt).from(el).save().then(()=>{document.body.removeChild(el);showToast('Payslip exported!','success');});}else{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=()=>{html2pdf().set(opt).from(el).save().then(()=>{document.body.removeChild(el);showToast('Payslip exported!','success');});};document.head.appendChild(s);}
}

function handleLogin() {
  const username=document.getElementById('loginUsername').value.trim();
  const password=document.getElementById('loginPassword').value;
  const errorDiv=document.getElementById('loginError');
  if(!username||!password){errorDiv.textContent='Please enter both username and password';return;}
  errorDiv.textContent='';
  const user=DB.users.find(u=>u.username===username&&u.password===password&&u.status==='active');
  if(user){
    currentUser=user;
    document.getElementById('loginView').style.display='none';
    const app=document.getElementById('mainApp'); app.style.display='flex'; app.classList.add('visible');
    setupApp(); renderEmployeeList();
    showToast('Welcome back, '+username+'!','success');
    checkTrialStatus();
    loadDB().then(()=>renderEmployeeList());
  } else { errorDiv.textContent='Invalid username or password'; }
}

function handleRegister() {
  const username=document.getElementById('regUser').value.trim();
  const password=document.getElementById('regPass').value;
  const password2=document.getElementById('regPass2').value;
  const role=document.getElementById('regRole').value;
  const dept=document.getElementById('regDept').value.trim();
  const msgDiv=document.getElementById('regMessage');
  if(!username||!password){msgDiv.textContent='Username and password required';return;}
  if(password.length<4){msgDiv.textContent='Password must be at least 4 characters';return;}
  if(password!==password2){msgDiv.textContent='Passwords do not match';return;}
  if(role==='DEPT_VIEWER'&&!dept){msgDiv.textContent='Department required for DEPT_VIEWER';return;}
  if(DB.users.find(u=>u.username===username)){msgDiv.textContent='Username already exists';return;}
  DB.pendingUsers.push({id:Date.now(),username,password_hash:password,role,department:dept,requested_at:new Date().toISOString()});
  saveDB(); msgDiv.style.color='var(--success)'; msgDiv.textContent='✓ Request submitted! Admin will approve.';
  setTimeout(()=>{document.getElementById('loginView').style.display='flex';document.getElementById('registerView').style.display='none';msgDiv.textContent='';},2000);
}

function showRegisterForm(show) {
  document.getElementById('loginView').style.display=show?'none':'flex';
  document.getElementById('registerView').style.display=show?'flex':'none';
}

function handleLogout() {
  currentUser=null; selectedEmployeeId=null;
  document.getElementById('mainApp').style.display='none';
  document.getElementById('mainApp').classList.remove('visible');
  document.getElementById('loginView').style.display='flex';
  document.getElementById('loginUsername').value='';
  document.getElementById('loginPassword').value='';
  showToast('Logged out successfully','success');
}

function setupApp() {
  const rb=document.getElementById('userRoleBadge');
  rb.textContent=`${currentUser.username.toUpperCase()} · ${currentUser.role}`;
  const canEdit=currentUser.role==='ADMIN'||currentUser.role==='HR';
  document.getElementById('addEmployeeBtn').style.display=canEdit?'flex':'none';
  document.getElementById('attendanceBtn').style.display=canEdit?'inline-flex':'none';
  document.getElementById('attHistBtn').style.display='inline-flex';
  document.getElementById('leaveBtn').style.display='inline-flex';
  document.getElementById('docsBtn').style.display='inline-flex';
  document.getElementById('reportsBtn').style.display=canEdit?'inline-flex':'none';
  document.getElementById('payrollBtn').style.display=canEdit?'inline-flex':'none';
  document.getElementById('userMgmtBtn').style.display=currentUser.role==='ADMIN'?'inline-flex':'none';
  document.getElementById('locationBtn').style.display='inline-flex';
}

function renderEmployeeList() {
  const search=document.getElementById('searchInput')?.value.toLowerCase()||'';
  let emps=DB.employees;
  if(currentUser?.role==='DEPT_VIEWER') emps=DB.employees.filter(e=>e.department===currentUser.department);
  const filtered=emps.filter(e=>(e.fullName?.toLowerCase().includes(search)||e.empId?.toLowerCase().includes(search)||e.department?.toLowerCase().includes(search)));
  const container=document.getElementById('employeeListContainer');
  if(!container)return;
  if(!filtered.length){container.innerHTML='<div style="padding:1rem;text-align:center;color:var(--muted);">No employees found</div>';return;}
  container.innerHTML=filtered.map(emp=>`<div class="emp-card ${selectedEmployeeId===emp.id?'active':''}" onclick="selectEmployee(${emp.id})"><div class="avatar" style="overflow:hidden;padding:0;">${emp.photo?`<img class='avatar-img' src='${emp.photo}'>`:`<span>${emp.fullName?.charAt(0)||'?'}</span>`}</div><div class="emp-info"><div class="emp-name">${emp.fullName||'Unnamed'}</div><div class="emp-meta">${emp.empId||''} · ${emp.department||'-'}</div></div><div class="status-dot" style="background:${emp.status==='Active'?'#14C47E':'#F05252'}"></div></div>`).join('');
}

function selectEmployee(id) { selectedEmployeeId=id; renderEmployeeList(); renderDetail(id); }

function renderDetail(id) {
  const emp=DB.employees.find(e=>e.id==id);
  const container=document.getElementById('detailContainer');
  if(!emp){container.innerHTML='<div class="empty-state"><span>👤</span><p>Select an employee to view profile</p></div>';return;}
  const canEdit=currentUser?.role==='ADMIN'||currentUser?.role==='HR';
  const empPayrolls=DB.payrolls.filter(p=>p.employeeId==id).sort((a,b)=>b.month.localeCompare(a.month));
  container.innerHTML=`
    <div class="profile-header">
      <div class="profile-avatar" style="overflow:hidden;padding:0;position:relative;cursor:pointer;" onclick="openPhotoEditForEmp(${emp.id})" title="Click to change photo">${emp.photo?`<img class='profile-avatar-img' src='${emp.photo}'>`:`<span>${emp.fullName?.charAt(0)||'E'}</span>`}<div style="position:absolute;inset:0;background:rgba(0,0,0,0.4);border-radius:18px;display:flex;align-items:center;justify-content:center;opacity:0;transition:0.2s;font-size:1.2rem;" class='photo-hover-overlay'>📷</div></div>
      <div class="profile-info">
        <h2>${emp.fullName||'—'}</h2>
        <div class="profile-title">${emp.designation||'Staff'} · ${emp.department||'-'}</div>
        <span class="badge-status" style="background:${emp.status==='Active'?'rgba(20,196,126,0.15)':'rgba(240,82,82,0.15)'};color:${emp.status==='Active'?'#14C47E':'#F05252'};border:1px solid ${emp.status==='Active'?'rgba(20,196,126,0.3)':'rgba(240,82,82,0.3)'};">${emp.status||'Active'}</span>
      </div>
      <div style="margin-left:auto;display:flex;gap:8px;align-items:flex-start;flex-wrap:wrap;">
        <button class="btn btn-success btn-sm" onclick='exportProfilePDF(${JSON.stringify(emp).replace(/"/g,"&quot;")})'>📄 Export PDF</button>
        <button class="btn btn-sm" onclick="openDocsForEmp(${emp.id})" style="background:rgba(155,114,248,0.15);border-color:rgba(155,114,248,0.3);color:var(--accent2);">📁 Docs</button>
        <button class="btn btn-sm" onclick="openLeaveForEmp(${emp.id})" style="background:rgba(248,184,78,0.12);border-color:rgba(248,184,78,0.3);color:var(--warning);">🏖️ Leave</button>
        ${canEdit?`<button class="btn btn-sm" onclick="editEmployee(${emp.id})">✏ Edit</button><button class="btn btn-sm btn-danger" onclick="deleteEmployeeConfirm(${emp.id})">🗑 Delete</button>`:''}
      </div>
    </div>
    <div class="section-title">Personal Details</div>
    <div class="info-grid">
      <div class="info-card"><label>Email</label><span>${emp.email||'-'}</span></div>
      <div class="info-card"><label>Mobile</label><span>${emp.mobile||'-'}</span></div>
      <div class="info-card"><label>NIC</label><span>${emp.nic||'-'}</span></div>
      <div class="info-card"><label>Date of Birth</label><span>${emp.dob||'-'}</span></div>
      <div class="info-card"><label>Address</label><span>${emp.address||'-'}</span></div>
      <div class="info-card"><label>Emergency Contact</label><span>${emp.emergencyName||'-'} (${emp.emergencyPhone||'-'})</span></div>
    </div>
    <div class="section-title">Employment Details</div>
    <div class="info-grid">
      <div class="info-card"><label>Employee ID</label><span>${emp.empId||'-'}</span></div>
      <div class="info-card"><label>Department</label><span>${emp.department||'-'}</span></div>
      <div class="info-card"><label>Designation</label><span>${emp.designation||'-'}</span></div>
      <div class="info-card"><label>Date of Joining</label><span>${emp.doj||'-'}</span></div>
      <div class="info-card"><label>Employment Type</label><span>${emp.employmentType||'-'}</span></div>
      <div class="info-card"><label>Work Location</label><span>${emp.location||'-'}</span></div>
    </div>
    ${currentUser?.role!=='VIEWER'?`
    <div class="section-title">Salary & Bank Details</div>
    <div class="info-grid">
      <div class="info-card"><label>Basic Salary</label><span>LKR ${(emp.salary||0).toLocaleString()}</span></div>
      <div class="info-card"><label>Bank Name</label><span>${emp.bankName||'-'}</span></div>
      <div class="info-card"><label>Bank Account</label><span>${emp.bankAccount||'-'}</span></div>
      <div class="info-card"><label>Payment Method</label><span>${emp.payMethod||'-'}</span></div>
    </div>
    <div class="section-title">Payroll History</div>
    <div class="info-grid">
      ${empPayrolls.length?empPayrolls.map(p=>`<div class="info-card"><label>${p.month}</label><span>Net: LKR ${(p.netSalary||0).toLocaleString()}</span></div>`).join(''):'<div class="info-card"><span>No payroll records yet</span></div>'}
    </div>`:''}
  `;
}

function editEmployee(id) {
  const emp=DB.employees.find(e=>e.id==id); if(!emp)return;
  editingEmployeeId=id;
  document.getElementById('modalTitle').textContent=`Edit Employee - ${emp.fullName}`;
  ['empFullName','empEmail','empMobile','empNic','empDob','empAddress','empEmergeName','empEmergePhone','empId','empDept','empDesignation','empDoj','empLocation','empBankAccount','empBankName','empRemarks'].forEach(f=>{
    const map={empFullName:'fullName',empEmail:'email',empMobile:'mobile',empNic:'nic',empDob:'dob',empAddress:'address',empEmergeName:'emergencyName',empEmergePhone:'emergencyPhone',empId:'empId',empDept:'department',empDesignation:'designation',empDoj:'doj',empLocation:'location',empBankAccount:'bankAccount',empBankName:'bankName',empRemarks:'remarks'};
    document.getElementById(f).value=emp[map[f]]||'';
  });
  document.getElementById('empSalary').value=emp.salary||'';
  document.getElementById('empGender').value=emp.gender||'Male';
  document.getElementById('empMarital').value=emp.maritalStatus||'Single';
  document.getElementById('empType').value=emp.employmentType||'Permanent';
  document.getElementById('empStatus').value=emp.status||'Active';
  document.getElementById('empPayMethod').value=emp.payMethod||'Bank Transfer';
  // Load existing photo
  currentEmpPhotoData = emp.photo || null;
  const pz = document.getElementById('photoUploadZone');
  if (pz) {
    if (emp.photo) {
      pz.innerHTML = `<img src="${emp.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;"><button class="photo-remove" onclick="removeEmpPhoto(event)" style="display:flex;">✕</button>`;
    } else {
      pz.innerHTML = '<span class="upload-icon">📷</span><span class="upload-hint">Click to<br>upload</span><button class="photo-remove" onclick="removeEmpPhoto(event)" style="display:none;">✕</button>';
    }
  }
  // Sync empIdQuick
  const eiq = document.getElementById('empIdQuick'); if(eiq) eiq.value = emp.empId||'';
  refreshEmpLocationDropdown();
  openModal('empModal');
}

function deleteEmployeeConfirm(id) {
  if(confirm('Are you sure you want to delete this employee?')){
    DB.employees=DB.employees.filter(e=>e.id!=id);
    DB.payrolls=DB.payrolls.filter(p=>p.employeeId!=id);
    saveDB();
    if(selectedEmployeeId==id){selectedEmployeeId=null;renderDetail(null);}
    renderEmployeeList(); showToast('Employee deleted','success');
  }
}

function saveEmployee() {
  const empData={
    fullName:document.getElementById('empFullName').value,
    email:document.getElementById('empEmail').value,
    mobile:document.getElementById('empMobile').value,
    nic:document.getElementById('empNic').value,
    dob:document.getElementById('empDob').value,
    gender:document.getElementById('empGender').value,
    maritalStatus:document.getElementById('empMarital').value,
    address:document.getElementById('empAddress').value,
    emergencyName:document.getElementById('empEmergeName').value,
    emergencyPhone:document.getElementById('empEmergePhone').value,
    empId:document.getElementById('empId').value,
    department:document.getElementById('empDept').value,
    designation:document.getElementById('empDesignation').value,
    doj:document.getElementById('empDoj').value,
    employmentType:document.getElementById('empType').value,
    status:document.getElementById('empStatus').value,
    location:document.getElementById('empLocation').value,
    salary:parseFloat(document.getElementById('empSalary').value)||0,
    bankAccount:document.getElementById('empBankAccount').value,
    bankName:document.getElementById('empBankName').value,
    payMethod:document.getElementById('empPayMethod').value,
    remarks:document.getElementById('empRemarks').value
  };
  if(currentEmpPhotoData!==null){empData.photo=currentEmpPhotoData;} if(editingEmployeeId){const idx=DB.employees.findIndex(e=>e.id==editingEmployeeId);if(idx!==-1){empData.id=editingEmployeeId;DB.employees[idx]={...DB.employees[idx],...empData};}}
  else{empData.id=Date.now();DB.employees.push(empData);}
  saveDB(); closeModal('empModal'); renderEmployeeList();
  if(selectedEmployeeId)renderDetail(selectedEmployeeId);
  showToast('Employee saved successfully','success'); editingEmployeeId=null;
}

function openPayroll() {
  const select=document.getElementById('payrollEmpSelect');
  select.innerHTML=DB.employees.map(emp=>`<option value="${emp.id}" data-salary="${emp.salary||0}">${emp.fullName} (${emp.empId})</option>`).join('');
  select.onchange=function(){const salary=select.options[select.selectedIndex]?.dataset.salary||0;document.getElementById('payBasic').value=salary;document.getElementById('payEpf').value=salary*0.08;document.getElementById('payEtf').value=salary*0.03;calculatePayroll();loadPayrollHistory();};
  document.getElementById('payMonth').value=new Date().toISOString().slice(0,7);
  if(select.options.length>0){select.selectedIndex=0;select.onchange();}
  loadPayrollHistory(); openModal('payrollModal');
}

function calculatePayroll() {
  const basic=parseFloat(document.getElementById('payBasic').value)||0;
  const transport=parseFloat(document.getElementById('payTransport').value)||0;
  const meal=parseFloat(document.getElementById('payMeal').value)||0;
  const otherAllow=parseFloat(document.getElementById('payOtherAllow').value)||0;
  const epf=parseFloat(document.getElementById('payEpf').value)||0;
  const etf=parseFloat(document.getElementById('payEtf').value)||0;
  const tax=parseFloat(document.getElementById('payTax').value)||0;
  const otherDed=parseFloat(document.getElementById('payOtherDed').value)||0;
  const gross=basic+transport+meal+otherAllow;
  const deds=epf+etf+tax+otherDed;
  const net=gross-deds;
  document.getElementById('payrollSummary').innerHTML=`<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;"><div><strong style="color:var(--text2);font-size:0.75rem;text-transform:uppercase;">Gross Earnings</strong><br><span style="font-size:1.2rem;font-weight:700;color:var(--text);">LKR ${gross.toLocaleString()}</span></div><div><strong style="color:var(--text2);font-size:0.75rem;text-transform:uppercase;">Total Deductions</strong><br><span style="font-size:1.2rem;font-weight:700;color:var(--danger);">LKR ${deds.toLocaleString()}</span></div><div style="grid-column:span 2;background:rgba(20,196,126,0.15);border:1px solid rgba(20,196,126,0.25);border-radius:10px;padding:12px;text-align:center;"><span style="font-size:0.72rem;text-transform:uppercase;letter-spacing:1px;color:var(--success);">Net Salary</span><br><span style="font-size:1.6rem;font-weight:800;font-family:'Syne',sans-serif;color:var(--success);">LKR ${net.toLocaleString()}</span></div></div>`;
  return{grossEarnings:gross,totalDeductions:deds,netSalary:net};
}

function loadPayrollHistory() {
  const empId=parseInt(document.getElementById('payrollEmpSelect').value);
  const empPayrolls=DB.payrolls.filter(p=>p.employeeId===empId).sort((a,b)=>b.month.localeCompare(a.month));
  const div=document.getElementById('payrollHistory');
  if(!empPayrolls.length){div.innerHTML='<div class="info-card"><span>No previous payslips</span></div>';return;}
  div.innerHTML=`<div class="section-title">Previous Payslips</div><div class="info-grid">${empPayrolls.map(p=>`<div class="info-card"><label>${p.month}</label><span>Net: LKR ${(p.netSalary||0).toLocaleString()}</span></div>`).join('')}</div>`;
}

function savePayslip() {
  const empId=parseInt(document.getElementById('payrollEmpSelect').value);
  const month=document.getElementById('payMonth').value;
  if(!month){showToast('Please enter a month','error');return;}
  const basic=parseFloat(document.getElementById('payBasic').value)||0;
  const transport=parseFloat(document.getElementById('payTransport').value)||0;
  const meal=parseFloat(document.getElementById('payMeal').value)||0;
  const otherAllow=parseFloat(document.getElementById('payOtherAllow').value)||0;
  const epf=parseFloat(document.getElementById('payEpf').value)||0;
  const etf=parseFloat(document.getElementById('payEtf').value)||0;
  const tax=parseFloat(document.getElementById('payTax').value)||0;
  const otherDed=parseFloat(document.getElementById('payOtherDed').value)||0;
  const gross=basic+transport+meal+otherAllow;
  const deds=epf+etf+tax+otherDed;
  const net=gross-deds;
  const xi=DB.payrolls.findIndex(p=>p.employeeId===empId&&p.month===month);
  const pd={id:xi!==-1?DB.payrolls[xi].id:Date.now(),employeeId:empId,month,basicSalary:basic,transport,meal,otherAllow,epf,etf,tax,otherDeductions:otherDed,grossEarnings:gross,totalDeductions:deds,netSalary:net,createdAt:new Date().toISOString()};
  if(xi!==-1){DB.payrolls[xi]=pd;showToast('Payslip updated','success');}else{DB.payrolls.push(pd);showToast('Payslip saved','success');}
  saveDB(); loadPayrollHistory(); if(selectedEmployeeId)renderDetail(selectedEmployeeId);
}

function exportCurrentPayroll() {
  const empId=parseInt(document.getElementById('payrollEmpSelect').value);
  const month=document.getElementById('payMonth').value;
  const emp=DB.employees.find(e=>e.id===empId);
  if(!emp){showToast('Employee not found','error');return;}
  const pd={basicSalary:parseFloat(document.getElementById('payBasic').value)||0,transport:parseFloat(document.getElementById('payTransport').value)||0,meal:parseFloat(document.getElementById('payMeal').value)||0,otherAllow:parseFloat(document.getElementById('payOtherAllow').value)||0,epf:parseFloat(document.getElementById('payEpf').value)||0,etf:parseFloat(document.getElementById('payEtf').value)||0,tax:parseFloat(document.getElementById('payTax').value)||0,otherDeductions:parseFloat(document.getElementById('payOtherDed').value)||0};
  exportPayrollPDF(emp,pd,month);
}

function openUserManagement() {
  renderUserList(); renderPendingList();
  const mb=document.querySelector('#userModal .modal-body');
  const ex=document.getElementById('licenseAdminSection'); if(ex)ex.remove();
  if(currentUser?.role==='ADMIN'){const div=document.createElement('div');div.id='licenseAdminSection';div.innerHTML=renderLicenseSection();mb.appendChild(div);}
  openModal('userModal');
}

function renderUserList() {
  document.getElementById('userListContainer').innerHTML=`<h4 style="margin-bottom:15px;font-family:'Syne',sans-serif;">System Users</h4><table class="user-table"><thead><tr><th>Username</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead><tbody>${DB.users.map(u=>`<tr><td>${u.username}${u.username===currentUser?.username?' (You)':''}</td><td><span class="badge-status" style="background:${u.role==='ADMIN'?'rgba(240,82,82,0.15)':'rgba(20,196,126,0.12)'};color:${u.role==='ADMIN'?'var(--danger)':'var(--success)'};border:1px solid ${u.role==='ADMIN'?'rgba(240,82,82,0.3)':'rgba(20,196,126,0.3)'};">${u.role}</span></td><td style="color:${u.status==='active'?'var(--success)':'var(--danger)'}">${u.status}</td><td>${u.username!==currentUser?.username?`<button class="btn btn-sm btn-danger" onclick="deleteUser('${u.id}')">Delete</button>`:''}<button class="btn btn-sm" onclick="resetPassword('${u.id}')">Reset PW</button></td></tr>`).join('')}</tbody></table>`;
}

function renderPendingList() {
  const c=document.getElementById('pendingUsersContainer');
  if(!DB.pendingUsers.length){c.innerHTML='<div class="info-card"><span style="color:var(--muted);">No pending approvals</span></div>';return;}
  c.innerHTML=`<table class="user-table"><thead><tr><th>Username</th><th>Role</th><th>Department</th><th>Requested</th><th>Actions</th></tr></thead><tbody>${DB.pendingUsers.map(p=>`<tr><td>${p.username}</td><td>${p.role}</td><td>${p.department||'-'}</td><td>${new Date(p.requested_at).toLocaleDateString()}</td><td><button class="btn btn-sm btn-success" onclick="approveUser(${p.id})">Approve</button> <button class="btn btn-sm btn-danger" onclick="rejectUser(${p.id})">Reject</button></td></tr>`).join('')}</tbody></table>`;
}

function addUser() {
  const username=document.getElementById('newUsername').value.trim();
  const password=document.getElementById('newPassword').value;
  const role=document.getElementById('newRole').value;
  const dept=document.getElementById('newDept').value.trim();
  const msgDiv=document.getElementById('userMsg');
  if(!username||!password){msgDiv.textContent='Username and password required';return;}
  if(password.length<4){msgDiv.textContent='Password must be at least 4 characters';return;}
  if(DB.users.find(u=>u.username===username)){msgDiv.textContent='Username already exists';return;}
  DB.users.push({id:'u'+Date.now(),username,password,role,department:role==='DEPT_VIEWER'?dept:null,status:'active'});
  saveDB();
  document.getElementById('newUsername').value='';document.getElementById('newPassword').value='';document.getElementById('newDept').value='';
  msgDiv.style.color='var(--success)';msgDiv.textContent='✓ User added successfully';
  renderUserList();setTimeout(()=>msgDiv.textContent='',2000);
}

function deleteUser(id) { if(confirm('Delete this user?')){DB.users=DB.users.filter(u=>u.id!==id);saveDB();renderUserList();showToast('User deleted','success');} }
function resetPassword(id) { const p=prompt('Enter new password (min 4):');if(p&&p.length>=4){const u=DB.users.find(x=>x.id===id);if(u){u.password=p;saveDB();showToast('Password reset','success');}}else if(p){showToast('Password must be at least 4 chars','error');} }
function approveUser(pid) { const p=DB.pendingUsers.find(x=>x.id===pid);if(p){DB.users.push({id:'u'+Date.now(),username:p.username,password:p.password_hash,role:p.role,department:p.department,status:'active'});DB.pendingUsers=DB.pendingUsers.filter(x=>x.id!==pid);saveDB();renderPendingList();renderUserList();showToast(`User ${p.username} approved`,'success');} }
function rejectUser(pid) { if(confirm('Reject this request?')){DB.pendingUsers=DB.pendingUsers.filter(p=>p.id!==pid);saveDB();renderPendingList();showToast('Request rejected','success');} }

let chartMonthly,chartDept,chartDeptAvg,chartEmpTrend;
function openReports() { const go=()=>{renderReportOverview();openModal('reportsModal');}; if(window.Chart){go();return;} const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js';s.onload=go;document.head.appendChild(s); }
function switchReport(pane,btn) { document.querySelectorAll('#reportsModal .report-pane').forEach(p=>p.classList.remove('active'));document.querySelectorAll('#reportsModal .report-tab').forEach(b=>b.classList.remove('active'));document.getElementById('rp'+pane.charAt(0).toUpperCase()+pane.slice(1)).classList.add('active');btn.classList.add('active');if(pane==='overview')renderReportOverview();if(pane==='monthly')renderMonthlyReport();if(pane==='dept')renderDeptReport();if(pane==='emp')renderEmpPayrollHistory(); }
function renderReportOverview() {
  const payrolls=DB.payrolls,employees=DB.employees;
  const avgSalary=employees.length?Math.round(employees.reduce((s,e)=>s+(e.salary||0),0)/employees.length):0;
  const activeEmps=employees.filter(e=>e.status==='Active').length;
  const thisMonth=new Date().toISOString().slice(0,7);
  const thisMonthPay=payrolls.filter(p=>p.month===thisMonth).reduce((s,p)=>s+(p.netSalary||0),0);
  const totalPayroll=payrolls.reduce((s,p)=>s+(p.netSalary||0),0);
  document.getElementById('rKpiGrid').innerHTML=`<div class="kpi-card"><div class="kv" style="color:var(--accent)">${employees.length}</div><div class="kl">Total Employees</div></div><div class="kpi-card"><div class="kv" style="color:var(--success)">${activeEmps}</div><div class="kl">Active</div></div><div class="kpi-card"><div class="kv" style="color:var(--accent2)">LKR ${(avgSalary/1000).toFixed(1)}K</div><div class="kl">Avg Salary</div></div><div class="kpi-card"><div class="kv" style="color:var(--warning)">LKR ${(thisMonthPay/1000).toFixed(0)}K</div><div class="kl">This Month</div></div><div class="kpi-card"><div class="kv" style="color:var(--success)">LKR ${(totalPayroll/1000000).toFixed(2)}M</div><div class="kl">Total Payroll</div></div><div class="kpi-card"><div class="kv" style="color:var(--danger)">${employees.filter(e=>e.status!=='Active').length}</div><div class="kl">Inactive</div></div>`;
  const months=[...new Set(payrolls.map(p=>p.month))].sort().slice(-12);
  const monthData=months.map(m=>payrolls.filter(p=>p.month===m).reduce((s,p)=>s+(p.netSalary||0),0));
  setTimeout(()=>{
    if(chartMonthly)chartMonthly.destroy();
    const ctx=document.getElementById('chartMonthly');if(!ctx||!window.Chart)return;
    chartMonthly=new Chart(ctx,{type:'line',data:{labels:months,datasets:[{label:'Net Payroll',data:monthData,borderColor:'#4F8EF7',backgroundColor:'rgba(79,142,247,0.1)',fill:true,tension:0.4,pointBackgroundColor:'#4F8EF7'}]},options:{responsive:true,plugins:{legend:{labels:{color:'#8FA3CC'}}},scales:{x:{ticks:{color:'#4A6080'}},y:{ticks:{color:'#4A6080',callback:v=>'LKR '+v.toLocaleString()}}}}});
    if(chartDept)chartDept.destroy();
    const depts={};employees.forEach(e=>{depts[e.department||'Unknown']=(depts[e.department||'Unknown']||0)+(e.salary||0);});
    const ctx2=document.getElementById('chartDept');if(!ctx2)return;
    chartDept=new Chart(ctx2,{type:'doughnut',data:{labels:Object.keys(depts),datasets:[{data:Object.values(depts),backgroundColor:['#4F8EF7','#9B72F8','#14C47E','#F8B84E','#F05252','#38C9A8']}]},options:{responsive:true,plugins:{legend:{labels:{color:'#8FA3CC'}}}}});
  },100);
}
function renderMonthlyReport() {
  const sel=document.getElementById('rMonthSel');
  const months=[...new Set(DB.payrolls.map(p=>p.month))].sort().reverse();
  if(!months.length){document.getElementById('rMonthlyTable').innerHTML='<div style="color:var(--muted);text-align:center;padding:2rem;">No payroll data yet</div>';return;}
  if(sel.options.length===0)sel.innerHTML=months.map(m=>`<option value="${m}">${m}</option>`).join('');
  const month=sel.value||months[0];
  const rows=DB.payrolls.filter(p=>p.month===month);
  const empFn=id=>DB.employees.find(e=>e.id===id);
  const total=rows.reduce((s,r)=>s+(r.netSalary||0),0);
  document.getElementById('rMonthlyTable').innerHTML=`<table class="report-table"><thead><tr><th>Emp ID</th><th>Name</th><th>Dept</th><th>Basic</th><th>Gross</th><th>EPF</th><th>ETF</th><th>Net Pay</th></tr></thead><tbody>${rows.map(r=>{const e=empFn(r.employeeId);return`<tr><td>${e?.empId||'—'}</td><td>${e?.fullName||'—'}</td><td>${e?.department||'—'}</td><td>LKR ${(r.basicSalary||0).toLocaleString()}</td><td>LKR ${(r.grossEarnings||0).toLocaleString()}</td><td>LKR ${(r.epf||0).toLocaleString()}</td><td>LKR ${(r.etf||0).toLocaleString()}</td><td><strong>LKR ${(r.netSalary||0).toLocaleString()}</strong></td></tr>`;}).join('')}<tr style="background:rgba(79,142,247,0.08);font-weight:700;"><td colspan="7" style="text-align:right;">Total Net Payroll:</td><td>LKR ${total.toLocaleString()}</td></tr></tbody></table>`;
}
function renderDeptReport() {
  const depts={};DB.employees.forEach(e=>{const d=e.department||'Unknown';if(!depts[d])depts[d]={count:0,totalSalary:0};depts[d].count++;depts[d].totalSalary+=e.salary||0;});
  const labels=Object.keys(depts);const avgs=labels.map(d=>Math.round(depts[d].totalSalary/depts[d].count));
  setTimeout(()=>{if(chartDeptAvg)chartDeptAvg.destroy();const ctx=document.getElementById('chartDeptAvg');if(!ctx||!window.Chart)return;chartDeptAvg=new Chart(ctx,{type:'bar',data:{labels,datasets:[{label:'Avg Salary',data:avgs,backgroundColor:'rgba(155,114,248,0.7)',borderColor:'#9B72F8',borderWidth:1}]},options:{responsive:true,plugins:{legend:{labels:{color:'#8FA3CC'}}},scales:{x:{ticks:{color:'#4A6080'}},y:{ticks:{color:'#4A6080',callback:v=>'LKR '+v.toLocaleString()}}}}});},100);
  document.getElementById('rDeptTable').innerHTML=`<table class="report-table"><thead><tr><th>Department</th><th>Employees</th><th>Total Salary</th><th>Avg Salary</th></tr></thead><tbody>${labels.map(d=>`<tr><td>${d}</td><td>${depts[d].count}</td><td>LKR ${depts[d].totalSalary.toLocaleString()}</td><td>LKR ${Math.round(depts[d].totalSalary/depts[d].count).toLocaleString()}</td></tr>`).join('')}</tbody></table>`;
}
function renderEmpPayrollHistory() {
  const sel=document.getElementById('rEmpSel');
  if(sel.options.length===0)sel.innerHTML=DB.employees.map(e=>`<option value="${e.id}">${e.fullName} (${e.empId})</option>`).join('');
  const empId=parseInt(sel.value);
  const records=DB.payrolls.filter(p=>p.employeeId===empId).sort((a,b)=>a.month.localeCompare(b.month));
  const months=records.map(r=>r.month);const nets=records.map(r=>r.netSalary||0);
  setTimeout(()=>{if(chartEmpTrend)chartEmpTrend.destroy();const ctx=document.getElementById('chartEmpTrend');if(!ctx||!window.Chart)return;chartEmpTrend=new Chart(ctx,{type:'line',data:{labels:months,datasets:[{label:'Net Salary',data:nets,borderColor:'#14C47E',backgroundColor:'rgba(20,196,126,0.1)',fill:true,tension:0.4}]},options:{responsive:true,plugins:{legend:{labels:{color:'#8FA3CC'}}},scales:{x:{ticks:{color:'#4A6080'}},y:{ticks:{color:'#4A6080',callback:v=>'LKR '+v.toLocaleString()}}}}});},100);
  document.getElementById('rEmpTable').innerHTML=records.length?`<table class="report-table"><thead><tr><th>Month</th><th>Basic</th><th>Allowances</th><th>EPF</th><th>Net Pay</th><th>Absent</th><th>OT Hrs</th></tr></thead><tbody>${records.map(r=>`<tr><td>${r.month}</td><td>LKR ${(r.basicSalary||0).toLocaleString()}</td><td>LKR ${((r.transport||0)+(r.meal||0)+(r.otherAllow||0)).toLocaleString()}</td><td>LKR ${(r.epf||0).toLocaleString()}</td><td><strong>LKR ${(r.netSalary||0).toLocaleString()}</strong></td><td>${r.absentDays||0}</td><td>${r.overtimeHrs||0}</td></tr>`).join('')}</tbody></table>`:'<div style="color:var(--muted);text-align:center;padding:1.5rem;">No payroll records</div>';
}
function exportReportPDF() {
  const month=document.getElementById('rMonthSel')?.value;if(!month)return;
  const rows=DB.payrolls.filter(p=>p.month===month);const empFn=id=>DB.employees.find(e=>e.id===id);const total=rows.reduce((s,r)=>s+(r.netSalary||0),0);
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:30px;color:#1e293b}.hdr{background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:white;padding:20px;border-radius:10px;margin-bottom:20px;text-align:center}.hdr h1{font-size:20px}.hdr p{font-size:11px;opacity:.9}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#3B82F6;color:white;padding:7px;text-align:left}td{padding:6px 7px;border-bottom:1px solid #e2e8f0}tr:nth-child(even) td{background:#f8fafc}.tot td{background:#1e293b!important;color:white;font-weight:700}</style></head><body><div class="hdr"><h1>Payroll Report — ${month}</h1><p>Generated: ${new Date().toLocaleString()}</p></div><table><thead><tr><th>Emp ID</th><th>Name</th><th>Dept</th><th>Basic</th><th>Gross</th><th>EPF</th><th>ETF</th><th>Net Pay</th></tr></thead><tbody>${rows.map(r=>{const e=empFn(r.employeeId);return`<tr><td>${e?.empId||'—'}</td><td>${e?.fullName||'—'}</td><td>${e?.department||'—'}</td><td>LKR ${(r.basicSalary||0).toLocaleString()}</td><td>LKR ${(r.grossEarnings||0).toLocaleString()}</td><td>LKR ${(r.epf||0).toLocaleString()}</td><td>LKR ${(r.etf||0).toLocaleString()}</td><td>LKR ${(r.netSalary||0).toLocaleString()}</td></tr>`;}).join('')}<tr class="tot"><td colspan="7" style="text-align:right">Total Net Payroll</td><td>LKR ${total.toLocaleString()}</td></tr></tbody></table></body></html>`;
  const el=document.createElement('div');el.innerHTML=html;document.body.appendChild(el);
  const loadAndExport=()=>html2pdf().set({margin:[0.4,0.3],filename:`Payroll_Report_${month}.pdf`,image:{type:'jpeg',quality:0.95},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4',orientation:'landscape'}}).from(el).save().then(()=>{document.body.removeChild(el);showToast('Report exported!','success');});
  if(window.html2pdf)loadAndExport();else{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=loadAndExport;document.head.appendChild(s);}
}

function openLeave() { if(!DB.leaves)DB.leaves=[]; populateLeaveSelects(); openModal('leaveModal'); switchLeaveTab('apply',document.querySelector('#leaveModal .report-tab')); }
function openLeaveForEmp(empId) { if(!DB.leaves)DB.leaves=[]; populateLeaveSelects(); document.getElementById('lvEmpSel').value=empId; document.getElementById('lvBalEmpSel').value=empId; openModal('leaveModal'); switchLeaveTab('apply',document.querySelector('#leaveModal .report-tab')); }
function populateLeaveSelects() {
  const opts=DB.employees.map(e=>`<option value="${e.id}">${e.fullName} (${e.empId})</option>`).join('');
  ['lvEmpSel','lvBalEmpSel'].forEach(id=>{const el=document.getElementById(id);if(el)el.innerHTML=opts;});
  const fOpts='<option value="">All Employees</option>'+opts;
  const lvFil=document.getElementById('lvFilterEmp');if(lvFil)lvFil.innerHTML=fOpts;
  renderLeaveList();renderLeaveBalances();
}
function switchLeaveTab(tab,btn) {
  document.querySelectorAll('#leaveModal .report-pane').forEach(p=>p.classList.remove('active'));
  document.querySelectorAll('#leaveModal .report-tab').forEach(b=>b.classList.remove('active'));
  const map={apply:'lvApply',requests:'lvRequests',balances:'lvBalances'};
  document.getElementById(map[tab]).classList.add('active');
  if(btn)btn.classList.add('active');
  if(tab==='requests')renderLeaveList();if(tab==='balances')renderLeaveBalances();
}
function calcLeaveDays() { const f=document.getElementById('lvFrom').value,t=document.getElementById('lvTo').value;if(f&&t){const d=Math.round((new Date(t)-new Date(f))/(1000*60*60*24))+1;document.getElementById('lvDays').value=d>0?d:0;} }
function submitLeave() {
  const empId=parseInt(document.getElementById('lvEmpSel').value);
  const type=document.getElementById('lvType').value,from=document.getElementById('lvFrom').value,to=document.getElementById('lvTo').value,days=parseFloat(document.getElementById('lvDays').value)||0;
  const status=document.getElementById('lvStatus').value,reason=document.getElementById('lvReason').value.trim();
  const msg=document.getElementById('lvMsg');
  if(!from||!to||!days){msg.style.color='var(--danger)';msg.textContent='Please fill in all date fields';return;}
  if(!DB.leaves)DB.leaves=[];
  DB.leaves.push({id:Date.now(),employeeId:empId,type,from,to,days,status,reason,createdAt:new Date().toISOString()});
  saveDB();msg.style.color='var(--success)';msg.textContent='✓ Leave request saved!';
  setTimeout(()=>msg.textContent='',2500);
  ['lvFrom','lvTo','lvDays','lvReason'].forEach(id=>document.getElementById(id).value='');
  showToast('Leave request saved','success');
}
function renderLeaveList() {
  if(!DB.leaves)DB.leaves=[];
  const ef=document.getElementById('lvFilterEmp')?.value,sf=document.getElementById('lvFilterStatus')?.value;
  let list=DB.leaves;if(ef)list=list.filter(l=>l.employeeId==ef);if(sf)list=list.filter(l=>l.status===sf);
  list=list.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
  const c=document.getElementById('lvListContainer');
  if(!list.length){c.innerHTML='<div style="color:var(--muted);text-align:center;padding:2rem;">No leave requests found</div>';return;}
  c.innerHTML=list.map(l=>{
    const emp=DB.employees.find(e=>e.id===l.employeeId);
    const sc=l.status==='Approved'?'leave-approved':l.status==='Rejected'?'leave-rejected':'leave-pending';
    return`<div class="leave-card"><div style="font-size:1.6rem;">${l.type==='Sick'?'🤒':l.type==='Annual'?'🌴':l.type==='Casual'?'😊':l.type==='Maternity'?'👶':l.type==='Nopay'?'⛔':'📋'}</div><div class="leave-card-info"><strong>${emp?.fullName||'Unknown'} <span class="doc-type-badge">${l.type}</span></strong><small>${l.from} → ${l.to} · ${l.days} day${l.days!==1?'s':''} · ${l.reason||'No reason'}</small></div><span class="leave-status-pill ${sc}">${l.status}</span>${currentUser?.role==='ADMIN'||currentUser?.role==='HR'?`<div style="display:flex;gap:4px;"><button class="btn btn-sm btn-success" style="padding:3px 8px;" onclick="updateLeaveStatus(${l.id},'Approved')">✓</button><button class="btn btn-sm btn-danger" style="padding:3px 8px;" onclick="updateLeaveStatus(${l.id},'Rejected')">✗</button><button class="btn btn-sm btn-danger" style="padding:3px 8px;" onclick="deleteLeave(${l.id})">🗑</button></div>`:''}</div>`;
  }).join('');
}
function updateLeaveStatus(id,status) { const l=DB.leaves.find(x=>x.id===id);if(l){l.status=status;saveDB();renderLeaveList();showToast(`Leave ${status.toLowerCase()}`,'success');} }
function deleteLeave(id) { if(confirm('Delete this leave request?')){DB.leaves=DB.leaves.filter(l=>l.id!==id);saveDB();renderLeaveList();showToast('Deleted','success');} }
function renderLeaveBalances() {
  const empId=parseInt(document.getElementById('lvBalEmpSel')?.value);
  const emp=DB.employees.find(e=>e.id===empId);
  if(!emp||!DB.leaves){document.getElementById('lvBalanceDisplay').innerHTML='';return;}
  const year=new Date().getFullYear();
  const myLeaves=DB.leaves.filter(l=>l.employeeId===empId&&l.status==='Approved'&&l.from.startsWith(year));
  const used=type=>myLeaves.filter(l=>l.type===type).reduce((s,l)=>s+l.days,0);
  const entitlements={Annual:14,Casual:7,Sick:7,Maternity:84,Nopay:999};
  document.getElementById('lvBalanceDisplay').innerHTML=`<div style="font-weight:600;margin-bottom:10px;">${emp.fullName} — ${year} Leave Balance</div><div class="leave-balance-grid">${Object.entries(entitlements).map(([t,ent])=>{const u=used(t);const rem=Math.max(0,ent-u);return`<div class="leave-balance-card"><div class="lb-val" style="color:${rem>3?'var(--success)':rem>0?'var(--warning)':'var(--danger)'}">${t==='Nopay'?'∞':rem}</div><div class="lb-lbl">${t} Remaining</div><div style="font-size:0.68rem;color:var(--muted);margin-top:2px;">${u} used${t!=='Nopay'?' / '+ent+' total':''}</div></div>`;}).join('')}</div>${myLeaves.length?`<div style="font-size:0.72rem;color:var(--muted);margin-top:6px;">${myLeaves.length} approved requests · ${myLeaves.reduce((s,l)=>s+l.days,0)} total days</div>`:'<div style="font-size:0.78rem;color:var(--muted);">No approved leaves this year</div>'}`;
}
function exportLeavePDF() {
  if(!DB.leaves)return;
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:30px;color:#1e293b}h1{color:#3B82F6;font-size:18px;margin-bottom:4px}p{font-size:11px;color:#64748b;margin-bottom:16px}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#3B82F6;color:white;padding:7px}td{padding:6px 8px;border-bottom:1px solid #e2e8f0}.pend{color:#F59E0B}.appr{color:#10B981}.rej{color:#EF4444}</style></head><body><h1>Leave Report</h1><p>Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>Employee</th><th>Type</th><th>From</th><th>To</th><th>Days</th><th>Reason</th><th>Status</th></tr></thead><tbody>${DB.leaves.map(l=>{const e=DB.employees.find(x=>x.id===l.employeeId);const cls=l.status==='Approved'?'appr':l.status==='Rejected'?'rej':'pend';return`<tr><td>${e?.fullName||'—'}</td><td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.days}</td><td>${l.reason||'—'}</td><td class="${cls}">${l.status}</td></tr>`;}).join('')}</tbody></table></body></html>`;
  const el=document.createElement('div');el.innerHTML=html;document.body.appendChild(el);
  const go=()=>html2pdf().set({margin:[0.4,0.4],filename:'Leave_Report.pdf',image:{type:'jpeg',quality:0.95},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4'}}).from(el).save().then(()=>{document.body.removeChild(el);showToast('Leave report exported!','success');});
  if(window.html2pdf)go();else{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=go;document.head.appendChild(s);}
}

function openAttHistory() {
  const sel=document.getElementById('ahEmpSel');sel.innerHTML=DB.employees.map(e=>`<option value="${e.id}">${e.fullName} (${e.empId})</option>`).join('');
  document.getElementById('ahMonth').value=new Date().toISOString().slice(0,7);renderAttHistory();openModal('attHistModal');
}
function renderAttHistory() {
  const empId=parseInt(document.getElementById('ahEmpSel').value);const month=document.getElementById('ahMonth').value;if(!empId||!month)return;
  const payroll=DB.payrolls.find(p=>p.employeeId===empId&&p.month===month);
  const [year,mon]=month.split('-').map(Number);const daysInMonth=new Date(year,mon,0).getDate();const firstDay=new Date(year,mon-1,1).getDay();
  const present=payroll?(payroll.workingDays||(26-(payroll.absentDays||0))):'—';const absent=payroll?(payroll.absentDays||0):'—';const leave=payroll?(payroll.leaveDays||0):'—';const ot=payroll?(payroll.overtimeHrs||0):'—';
  document.getElementById('ahSummaryBar').innerHTML=`<div class="att-summary-card"><div class="val" style="color:var(--success)">${present}</div><div class="lbl">Days Present</div></div><div class="att-summary-card"><div class="val" style="color:var(--danger)">${absent}</div><div class="lbl">Absent</div></div><div class="att-summary-card"><div class="val" style="color:var(--warning)">${leave}</div><div class="lbl">Leave Days</div></div><div class="att-summary-card"><div class="val" style="color:var(--accent)">${ot}</div><div class="lbl">OT Hours</div></div>`;
  const dayNames=['Su','Mo','Tu','We','Th','Fr','Sa'];
  let cal=`<div class="att-calendar">`;dayNames.forEach(d=>{cal+=`<div class="att-cal-head">${d}</div>`;});
  for(let i=0;i<firstDay;i++)cal+=`<div class="att-cal-empty"></div>`;
  for(let d=1;d<=daysInMonth;d++){const date=new Date(year,mon-1,d);const dow=date.getDay();const isWkd=dow===0||dow===6;const isToday=date.toDateString()===new Date().toDateString();let cls=isWkd?'att-cal-weekend':'att-cal-present';if(payroll&&!isWkd){const totalWD=daysInMonth-Math.floor(daysInMonth*2/7);if(d>totalWD-(payroll.absentDays||0))cls='att-cal-absent';if(d>totalWD-(payroll.absentDays||0)-(payroll.leaveDays||0)&&d<=totalWD-(payroll.absentDays||0))cls='att-cal-leave';}if(isToday)cls+=' att-cal-today';cal+=`<div class="att-cal-day ${cls}">${d}</div>`;}
  cal+=`</div>`;document.getElementById('ahCalendar').innerHTML=cal;
  document.getElementById('ahTable').innerHTML=payroll?`<div class="section-title" style="margin-top:0;">Payroll for this Month</div><table class="report-table"><thead><tr><th>Item</th><th>Amount</th></tr></thead><tbody><tr><td>Basic Salary</td><td>LKR ${(payroll.basicSalary||0).toLocaleString()}</td></tr><tr><td>Overtime Pay</td><td>LKR ${(payroll.otherAllow||0).toLocaleString()}</td></tr><tr><td>Absent Deduction</td><td style="color:var(--danger)">- LKR ${Math.round((payroll.basicSalary||0)/26*(payroll.absentDays||0)).toLocaleString()}</td></tr><tr><td>EPF (8%)</td><td style="color:var(--danger)">- LKR ${(payroll.epf||0).toLocaleString()}</td></tr><tr><td>ETF (3%)</td><td style="color:var(--danger)">- LKR ${(payroll.etf||0).toLocaleString()}</td></tr><tr style="font-weight:700;"><td>Net Salary</td><td style="color:var(--success)">LKR ${(payroll.netSalary||0).toLocaleString()}</td></tr></tbody></table>`:'<div style="color:var(--muted);text-align:center;padding:1.5rem;">No payroll record for this month.</div>';
}
function exportAttHistPDF() {
  const empId=parseInt(document.getElementById('ahEmpSel').value);const month=document.getElementById('ahMonth').value;const emp=DB.employees.find(e=>e.id===empId);const pay=DB.payrolls.find(p=>p.employeeId===empId&&p.month===month);
  if(!emp){showToast('Select an employee','error');return;}
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:30px;color:#1e293b}.hdr{background:linear-gradient(135deg,#3B82F6,#8B5CF6);color:white;padding:20px;border-radius:10px;margin-bottom:20px;text-align:center}table{width:100%;border-collapse:collapse;font-size:11px}th{background:#3B82F6;color:white;padding:7px}td{padding:7px 8px;border-bottom:1px solid #e2e8f0}</style></head><body><div class="hdr"><h1>Attendance Report — ${month}</h1><p>${emp.fullName} · ${emp.empId} · ${emp.department}</p></div>${pay?`<table><thead><tr><th>Item</th><th>Value</th></tr></thead><tbody><tr><td>Days Present</td><td>${pay.workingDays||'—'}</td></tr><tr><td>Absent Days</td><td>${pay.absentDays||0}</td></tr><tr><td>Leave Days</td><td>${pay.leaveDays||0}</td></tr><tr><td>OT Hours</td><td>${pay.overtimeHrs||0}</td></tr><tr><td>Basic Salary</td><td>LKR ${(pay.basicSalary||0).toLocaleString()}</td></tr><tr><td>Net Salary</td><td><strong>LKR ${(pay.netSalary||0).toLocaleString()}</strong></td></tr></tbody></table>`:'<p>No payroll record for this month.</p>'}</body></html>`;
  const el=document.createElement('div');el.innerHTML=html;document.body.appendChild(el);
  const go=()=>html2pdf().set({margin:[0.4,0.4],filename:`Attendance_${emp.empId}_${month}.pdf`,image:{type:'jpeg',quality:0.95},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4'}}).from(el).save().then(()=>{document.body.removeChild(el);showToast('Exported!','success');});
  if(window.html2pdf)go();else{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=go;document.head.appendChild(s);}
}

function openDocs() {
  if(!DB.documents)DB.documents=[];
  const sel=document.getElementById('docEmpSel');sel.innerHTML=DB.employees.map(e=>`<option value="${e.id}">${e.fullName} (${e.empId})</option>`).join('');
  setupDocDropZone();renderDocList();openModal('docsModal');
}
function openDocsForEmp(empId) { openDocs();document.getElementById('docEmpSel').value=empId;renderDocList(); }
function setupDocDropZone() {
  const dz=document.getElementById('docDropZone');const fi=document.getElementById('docFileInput');
  if(!dz||dz._setup)return;dz._setup=true;
  dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag-over');});dz.addEventListener('dragleave',()=>dz.classList.remove('drag-over'));
  dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('drag-over');[...e.dataTransfer.files].forEach(handleDocFile);});
  fi.addEventListener('change',function(){[...this.files].forEach(handleDocFile);this.value='';});
}
function handleDocFile(file) {
  if(!DB.documents)DB.documents=[];
  const empId=parseInt(document.getElementById('docEmpSel').value);const cat=document.getElementById('docCatSel').value;
  if(file.size>5*1024*1024){showToast('File too large (max 5MB)','error');return;}
  const reader=new FileReader();reader.onload=e=>{DB.documents.push({id:Date.now()+Math.random(),employeeId:empId,category:cat,name:file.name,size:file.size,type:file.type,data:e.target.result,uploadedAt:new Date().toISOString(),uploadedBy:currentUser?.username||'system'});saveDB();renderDocList();showToast(`${file.name} uploaded!`,'success');};reader.readAsDataURL(file);
}
function renderDocList() {
  if(!DB.documents)DB.documents=[];
  const empId=parseInt(document.getElementById('docEmpSel')?.value);const docs=DB.documents.filter(d=>d.employeeId===empId).sort((a,b)=>b.uploadedAt.localeCompare(a.uploadedAt));
  const c=document.getElementById('docListContainer');
  if(!docs.length){c.innerHTML='<div style="text-align:center;color:var(--muted);padding:1.5rem;">No documents uploaded for this employee</div>';return;}
  c.innerHTML=docs.map(d=>{const icon=d.type?.includes('pdf')?'📄':d.type?.includes('image')?'🖼️':d.type?.includes('word')||d.name.endsWith('.doc')?'📝':'📎';const size=d.size>1024*1024?(d.size/1024/1024).toFixed(1)+'MB':Math.round(d.size/1024)+'KB';return`<div class="doc-item"><div class="doc-icon">${icon}</div><div class="doc-info"><strong>${d.name}<span class="doc-type-badge">${d.category}</span></strong><small>${size} · Uploaded ${new Date(d.uploadedAt).toLocaleDateString()} by ${d.uploadedBy}</small></div><button class="btn btn-sm" onclick="downloadDoc(${d.id})">⬇ Download</button><button class="btn btn-sm btn-danger" onclick="deleteDoc(${d.id})" style="padding:5px 8px;">🗑</button></div>`;}).join('');
}
function downloadDoc(id) { const doc=DB.documents?.find(d=>d.id===id);if(!doc){showToast('Not found','error');return;}const a=document.createElement('a');a.href=doc.data;a.download=doc.name;a.click();showToast('Downloading...','success'); }
function deleteDoc(id) { if(!confirm('Delete this document?'))return;DB.documents=DB.documents.filter(d=>d.id!==id);saveDB();renderDocList();showToast('Deleted','success'); }

let attendanceRawHeaders=[],attendanceRawRows=[],attendanceMapped=[];
function openAttendance() { resetAttendance();document.getElementById('attPayMonth').value=new Date().toISOString().slice(0,7);openModal('attendanceModal'); }
function resetAttendance() {
  attendanceRawHeaders=[];attendanceRawRows=[];attendanceMapped=[];
  document.getElementById('attStep1').style.display='block';document.getElementById('attStep2').style.display='none';document.getElementById('attPreviewSection').style.display='none';document.getElementById('attGenResult').style.display='none';
  if(document.getElementById('attManualInput'))document.getElementById('attManualInput').value='';if(document.getElementById('attFileInput'))document.getElementById('attFileInput').value='';
}
async function handleAttFile(file) {
  const name=file.name.toLowerCase();
  if(name.endsWith('.json')){const text=await file.text();parseAttJSON(text);}
  else if(name.endsWith('.xlsx')||name.endsWith('.xls')){parseAttExcel(file);}
  else{const text=await file.text();parseAttCSVText(text);}
}
function parseAttExcel(file) {
  const loadXLSX=cb=>{if(window.XLSX){cb();return;}const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';s.onload=cb;document.head.appendChild(s);};
  loadXLSX(()=>{const reader=new FileReader();reader.onload=e=>{try{const wb=XLSX.read(e.target.result,{type:'array'});const ws=wb.Sheets[wb.SheetNames[0]];const data=XLSX.utils.sheet_to_json(ws,{header:1,defval:''});if(data.length<2){showToast('File appears empty','error');return;}attendanceRawHeaders=data[0].map(String);attendanceRawRows=data.slice(1).filter(r=>r.some(c=>c!==''));showColumnMapper();}catch(err){showToast('Error reading Excel: '+err.message,'error');}};reader.readAsArrayBuffer(file);});
}
function parseAttCSVText(text) {
  const lines=text.trim().split(/\r?\n/).filter(l=>l.trim());if(lines.length<2){showToast('File has no data rows','error');return;}
  const delim=detectAttDelimiter(lines[0]);attendanceRawHeaders=parseAttCSVLine(lines[0],delim);attendanceRawRows=lines.slice(1).map(l=>parseAttCSVLine(l,delim));showColumnMapper();
}
function parseAttJSON(text) { try{const data=JSON.parse(text);const arr=Array.isArray(data)?data:Object.values(data)[0];if(!arr||!arr.length){showToast('No data in JSON','error');return;}attendanceRawHeaders=Object.keys(arr[0]);attendanceRawRows=arr.map(row=>attendanceRawHeaders.map(h=>row[h]??''));showColumnMapper();}catch(e){showToast('Invalid JSON','error');} }
function detectAttDelimiter(line) { const c={',': (line.match(/,/g)||[]).length,'\t':(line.match(/\t/g)||[]).length,';':(line.match(/;/g)||[]).length,'|':(line.match(/\|/g)||[]).length};return Object.entries(c).sort((a,b)=>b[1]-a[1])[0][0]; }
function parseAttCSVLine(line,delim) { const r=[];let cur='',inQ=false;for(let i=0;i<line.length;i++){if(line[i]==='"'){inQ=!inQ;continue;}if(line[i]===delim&&!inQ){r.push(cur.trim());cur='';continue;}cur+=line[i];}r.push(cur.trim());return r; }
function parseAttendanceInput() { const text=document.getElementById('attManualInput').value.trim();if(!text){showToast('Please upload or paste data','error');return;}parseAttCSVText(text); }
function loadSampleAttendance() { const s=`EmpID,EmployeeName,WorkingDays,LeaveDays,AbsentDays,OvertimeHours\n`+DB.employees.slice(0,5).map(e=>`${e.empId},${e.fullName},26,1,0,4`).join('\n');document.getElementById('attManualInput').value=s;showToast('Sample data loaded!','success'); }
function showColumnMapper() {
  document.getElementById('attStep1').style.display='block';document.getElementById('attStep2').style.display='block';document.getElementById('attPreviewSection').style.display='none';
  const fds=[{key:'empId',label:'Employee ID / Code',required:true},{key:'empName',label:'Employee Name',required:false},{key:'workDays',label:'Working Days Present',required:false},{key:'leaveDays',label:'Leave Days',required:false},{key:'absentDays',label:'Absent / Unpaid Leave',required:false},{key:'overtimeHrs',label:'Overtime Hours',required:false}];
  const autoMatch=label=>{const l=label.toLowerCase();return attendanceRawHeaders.findIndex(h=>{const h2=h.toLowerCase().replace(/[\s_-]/g,'');if(l.includes('id')||l.includes('code'))return h2.includes('id')||h2.includes('code')||h2.includes('emp');if(l.includes('name'))return h2.includes('name');if(l.includes('working')||l.includes('present'))return h2.includes('work')||h2.includes('present');if(l.includes('leave'))return h2.includes('leave');if(l.includes('absent'))return h2.includes('absent')||h2.includes('unpaid');if(l.includes('overtime'))return h2.includes('ot')||h2.includes('overtime');return false;});};
  const opts=['— Not in file —',...attendanceRawHeaders];
  document.getElementById('attColMap').innerHTML=fds.map(fd=>{const ai=autoMatch(fd.label);const sv=ai>=0?attendanceRawHeaders[ai]:'';return`<div><label>${fd.label}${fd.required?' <span style="color:var(--danger)">*</span>':''}</label><select id="map_${fd.key}">${opts.map(o=>`<option value="${o}" ${o===sv?'selected':''}>${o}</option>`).join('')}</select></div>`;}).join('');
}
function processAttendanceMapping() {
  const getCol=key=>{const v=document.getElementById('map_'+key)?.value;return(v&&v!=='— Not in file —')?v:null;};
  const idCol=getCol('empId');if(!idCol){showToast('Employee ID column is required','error');return;}
  const nmCol=getCol('empName'),wdCol=getCol('workDays'),ldCol=getCol('leaveDays'),adCol=getCol('absentDays'),otCol=getCol('overtimeHrs');
  const ci=col=>col?attendanceRawHeaders.indexOf(col):-1;
  const idIdx=ci(idCol),nmIdx=ci(nmCol),wdIdx=ci(wdCol),ldIdx=ci(ldCol),adIdx=ci(adCol),otIdx=ci(otCol);
  attendanceMapped=attendanceRawRows.map(row=>{const empId=(row[idIdx]||'').toString().trim();const emp=DB.employees.find(e=>e.empId?.toLowerCase()===empId.toLowerCase()||e.fullName?.toLowerCase()===empId.toLowerCase());return{rawId:empId,rawName:nmIdx>=0?(row[nmIdx]||'').toString().trim():'',workDays:wdIdx>=0?parseFloat(row[wdIdx])||0:null,leaveDays:ldIdx>=0?parseFloat(row[ldIdx])||0:0,absentDays:adIdx>=0?parseFloat(row[adIdx])||0:0,overtimeHrs:otIdx>=0?parseFloat(row[otIdx])||0:0,emp:emp||null,matched:!!emp};}).filter(r=>r.rawId);
  renderAttendancePreview();
}
function renderAttendancePreview() {
  if(!attendanceMapped.length){showToast('No rows to display','error');return;}
  const matched=attendanceMapped.filter(r=>r.matched).length;const unmatched=attendanceMapped.length-matched;const totalAbs=attendanceMapped.reduce((s,r)=>s+r.absentDays,0);
  document.getElementById('attSummaryBar').innerHTML=`<div class="att-summary-card"><div class="val" style="color:var(--accent)">${attendanceMapped.length}</div><div class="lbl">Total Rows</div></div><div class="att-summary-card"><div class="val" style="color:var(--success)">${matched}</div><div class="lbl">Matched</div></div><div class="att-summary-card"><div class="val" style="color:var(--danger)">${unmatched}</div><div class="lbl">Not Found</div></div><div class="att-summary-card"><div class="val" style="color:var(--warning)">${totalAbs}</div><div class="lbl">Absent Days</div></div>`;
  const wd=parseFloat(document.getElementById('attWorkingDays')?.value)||26;
  document.getElementById('attPreviewTable').innerHTML=`<thead><tr><th>Emp ID</th><th>Name</th><th>Match</th><th>Days</th><th>Leave</th><th>Absent</th><th>OT Hrs</th><th>Est. Net Pay</th></tr></thead><tbody>${attendanceMapped.map(r=>{let estNet='';if(r.emp){const daily=r.emp.salary/wd;const gross=r.emp.salary-daily*r.absentDays+(r.emp.salary/wd/8)*r.overtimeHrs*1.5;estNet=`<span class="att-match-ok">LKR ${Math.round(gross*0.92).toLocaleString()}</span>`;}return`<tr><td>${r.rawId}</td><td>${r.rawName||(r.emp?.fullName||'—')}</td><td>${r.matched?`<span class="att-match-ok">✓ ${r.emp.fullName}</span>`:`<span class="att-match-err">✗ Not found</span>`}</td><td>${r.workDays!==null?r.workDays:'—'}</td><td>${r.leaveDays}</td><td>${r.absentDays>0?`<span class="att-match-warn">${r.absentDays}</span>`:r.absentDays}</td><td>${r.overtimeHrs}</td><td>${estNet||'<span style="color:var(--muted)">—</span>'}</td></tr>`;}).join('')}</tbody>`;
  document.getElementById('attPreviewSection').style.display='block';
}
async function generatePayrollFromAttendance() {
  const month=document.getElementById('attPayMonth').value;const wd=parseFloat(document.getElementById('attWorkingDays').value)||26;
  if(!month){showToast('Please select payroll month','error');return;}
  const matched=attendanceMapped.filter(r=>r.matched);if(!matched.length){showToast('No matched employees','error');return;}
  let created=0,updated=0;
  for(const r of matched){const emp=r.emp;const basic=emp.salary||0;const daily=basic/wd;const absentDed=daily*(r.absentDays||0);const otPay=(basic/wd/8)*1.5*(r.overtimeHrs||0);const gross=basic-absentDed+otPay;const epf=Math.round(basic*0.08);const etf=Math.round(basic*0.03);const net=Math.round(gross-epf);const pd={id:Date.now()+Math.random(),employeeId:emp.id,month,basicSalary:basic,transport:0,meal:0,otherAllow:Math.round(otPay),epf,etf,tax:0,otherDeductions:0,grossEarnings:Math.round(gross),totalDeductions:epf+etf,netSalary:net,absentDays:r.absentDays||0,leaveDays:r.leaveDays||0,overtimeHrs:r.overtimeHrs||0,createdAt:new Date().toISOString()};const xi=DB.payrolls.findIndex(p=>p.employeeId===emp.id&&p.month===month);if(xi!==-1){DB.payrolls[xi]=pd;updated++;}else{DB.payrolls.push(pd);created++;}}
  await saveDB();const skipped=attendanceMapped.length-matched.length;
  document.getElementById('attGenResult').style.display='block';document.getElementById('attGenResult').innerHTML=`<div style="font-weight:700;font-size:1rem;margin-bottom:8px;color:var(--success);">✅ Payroll Generated Successfully!</div><div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;font-size:0.82rem;"><div>📝 <strong>${created}</strong> new payslips</div><div>🔄 <strong>${updated}</strong> updated</div><div>⚠️ <strong>${skipped}</strong> skipped</div></div><div style="margin-top:8px;font-size:0.75rem;color:var(--text2);">Month: <strong>${month}</strong> · EPF 8% + ETF 3% auto-deducted</div>`;
  showToast(`Payroll done! ${created} created, ${updated} updated`,'success');
}
function exportAttendanceSummaryPDF() {
  if(!attendanceMapped.length){showToast('No data to export','error');return;}
  const month=document.getElementById('attPayMonth').value||new Date().toISOString().slice(0,7);const wd=parseFloat(document.getElementById('attWorkingDays').value)||26;
  const rows=attendanceMapped.map(r=>{if(!r.emp)return`<tr style="color:#ef4444"><td>${r.rawId}</td><td>${r.rawName}</td><td>Not Found</td><td>—</td><td>${r.absentDays}</td><td>${r.overtimeHrs}</td><td>—</td></tr>`;const daily=r.emp.salary/wd;const gross=r.emp.salary-daily*r.absentDays+(r.emp.salary/wd/8)*r.overtimeHrs*1.5;const net=Math.round(gross*0.92);return`<tr><td>${r.emp.empId}</td><td>${r.emp.fullName}</td><td>${r.emp.department||'—'}</td><td>${r.workDays??wd-r.absentDays}</td><td>${r.absentDays}</td><td>${r.overtimeHrs}</td><td>LKR ${net.toLocaleString()}</td></tr>`;}).join('');
  const html=`<!DOCTYPE html><html><head><meta charset="UTF-8"><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;padding:30px;color:#1e293b}h1{font-size:20px;color:#3B82F6;margin-bottom:4px}p{font-size:11px;color:#64748b;margin-bottom:16px}table{width:100%;border-collapse:collapse;font-size:10px}th{background:#3B82F6;color:white;padding:7px;text-align:left}td{padding:6px 7px;border-bottom:1px solid #e2e8f0}</style></head><body><h1>Attendance Summary — ${month}</h1><p>Generated: ${new Date().toLocaleString()}</p><table><thead><tr><th>Emp ID</th><th>Name</th><th>Dept</th><th>Days</th><th>Absent</th><th>OT Hrs</th><th>Est. Net</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
  const el=document.createElement('div');el.innerHTML=html;document.body.appendChild(el);
  const go=()=>html2pdf().set({margin:[0.4,0.3],filename:`Attendance_${month}.pdf`,image:{type:'jpeg',quality:0.95},html2canvas:{scale:2},jsPDF:{unit:'in',format:'a4',orientation:'landscape'}}).from(el).save().then(()=>{document.body.removeChild(el);showToast('PDF exported!','success');});
  if(window.html2pdf)go();else{const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';s.onload=go;document.head.appendChild(s);}
}

const TRIAL_DAYS=30;const ADMIN_CONTACT='Miracle Data | +94 77 XXX XXXX';
function generateLicenseKey(seed) { const chars='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';let key='';let s=seed||Date.now();for(let i=0;i<16;i++){s=(s*1664525+1013904223)&0xFFFFFFFF;key+=chars[Math.abs(s)%chars.length];if((i+1)%4===0&&i<15)key+='-';}return key; }
function validateLicenseKey(key) { if(!/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(key))return false;return DB.licenseKeys&&DB.licenseKeys.some(k=>k.key===key&&k.status==='active'); }
async function checkTrialStatus() {
  if(currentUser?.role==='ADMIN'){updateTrialBadge('licensed','👑 Admin');return true;}
  const now=new Date();
  if(DB.license&&DB.license.status==='active'){const exp=new Date(DB.license.expiresAt);if(!DB.license.expiresAt||now<exp){updateTrialBadge('licensed','✅ Licensed');return true;}}
  if(!DB.trial){DB.trial={startDate:now.toISOString(),endDate:new Date(now.getTime()+TRIAL_DAYS*86400000).toISOString()};await saveDB();}
  const trialEnd=new Date(DB.trial.endDate);const msLeft=trialEnd-now;const daysLeft=Math.ceil(msLeft/(1000*60*60*24));
  if(msLeft<=0){showLockScreen();return false;}
  if(daysLeft<=5){updateTrialBadge('warn',`⚠️ ${daysLeft}d left`);showTrialWarningPopup(daysLeft);}
  else{updateTrialBadge('ok',`⏳ Trial: ${daysLeft}d left`);}
  return true;
}
function updateTrialBadge(type,text) { const b=document.getElementById('trialBadge');if(!b)return;b.style.display='inline-flex';b.className=`trial-badge trial-${type==='ok'?'ok':type==='warn'?'warn':'licensed'}`;b.textContent=text; }
function showLockScreen() { document.getElementById('lockContactInfo').textContent=ADMIN_CONTACT;document.getElementById('lockScreen').style.display='flex'; }
function hideLockScreen() { document.getElementById('lockScreen').style.display='none'; }
let warningShown=false;
function showTrialWarningPopup(daysLeft) { if(warningShown)return;warningShown=true;const p=document.createElement('div');p.className='trial-warning-popup';p.style.position='fixed';p.innerHTML=`<button class="popup-close" onclick="this.parentElement.remove()">✕</button><h4>⚠️ Trial Ending Soon</h4><p>Expires in <strong>${daysLeft} day${daysLeft!==1?'s':''}</strong>. Contact admin to activate a license.</p><p style="margin-top:6px;font-size:0.72rem;color:var(--muted)">${ADMIN_CONTACT}</p>`;document.body.appendChild(p);setTimeout(()=>{if(p.parentElement)p.remove();},10000); }
async function activateLicense() {
  const raw=document.getElementById('licenseKeyInput').value.trim().toUpperCase();const errDiv=document.getElementById('licenseError');errDiv.textContent='';
  if(!raw){errDiv.textContent='Please enter a license key';return;}
  if(validateLicenseKey(raw)){const lic=DB.licenseKeys.find(k=>k.key===raw);if(lic)lic.status='used';DB.license={status:'active',key:raw,activatedAt:new Date().toISOString(),expiresAt:null};await saveDB();hideLockScreen();updateTrialBadge('licensed','✅ Licensed');showToast('License activated! 🎉','success');}
  else{errDiv.textContent='Invalid or already used license key';document.getElementById('licenseKeyInput').style.borderColor='var(--danger)';setTimeout(()=>document.getElementById('licenseKeyInput').style.borderColor='',2000);}
}
function formatLicenseInput(input) { let val=input.value.replace(/[^A-Z0-9]/gi,'').toUpperCase();let f='';for(let i=0;i<val.length&&i<16;i++){if(i>0&&i%4===0)f+='-';f+=val[i];}input.value=f; }
function renderLicenseSection() {
  if(currentUser?.role!=='ADMIN')return'';
  const trial=DB.trial;const license=DB.license;const trialStart=trial?new Date(trial.startDate).toLocaleDateString():'Not started';const trialEnd=trial?new Date(trial.endDate).toLocaleDateString():'-';const daysLeft=trial?Math.max(0,Math.ceil((new Date(trial.endDate)-new Date())/86400000)):0;const keys=DB.licenseKeys||[];
  return`<hr style="margin:20px 0;border:none;border-top:1px solid rgba(255,255,255,0.07);"><div class="license-section"><h4>🔑 License & Trial Management</h4><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:1rem;"><div class="info-card"><label>Trial Started</label><span>${trialStart}</span></div><div class="info-card"><label>Trial Ends</label><span>${trialEnd} (${daysLeft}d left)</span></div><div class="info-card"><label>License Status</label><span style="color:${license?.status==='active'?'var(--success)':'var(--warning)'}">${license?.status==='active'?'✅ Licensed':'⏳ Trial'}</span></div><div class="info-card"><label>License Key</label><span style="font-family:'DM Mono',monospace;font-size:0.75rem;">${license?.key||'None'}</span></div></div><div style="margin-bottom:1rem;"><div style="font-size:0.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Extend Trial</div><div style="display:flex;gap:8px;flex-wrap:wrap;"><select id="extendDays" style="background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.09);border-radius:8px;padding:6px 10px;color:var(--text);font-size:0.8rem;"><option value="7">+7 days</option><option value="14">+14 days</option><option value="30" selected>+30 days</option><option value="60">+60 days</option><option value="90">+90 days</option><option value="365">+1 Year</option></select><button class="btn btn-primary btn-sm" onclick="extendTrial()">Extend Trial</button><button class="btn btn-sm" style="background:rgba(20,196,126,0.15);border-color:rgba(20,196,126,0.3);color:var(--success);" onclick="generateNewLicenseKey()">🔑 Generate Key</button></div></div><div><div style="font-size:0.7rem;color:var(--muted);text-transform:uppercase;letter-spacing:1px;margin-bottom:8px;">Generated Keys (${keys.length})</div>${keys.length>0?keys.map(k=>`<div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;"><div class="license-key-display" style="flex:1;font-size:0.85rem;">${k.key}</div><span style="font-size:0.7rem;padding:3px 8px;border-radius:20px;background:${k.status==='active'?'rgba(20,196,126,0.12)':'rgba(100,100,100,0.12)'};color:${k.status==='active'?'var(--success)':'var(--muted)'};">${k.status}</span><button class="btn btn-sm" onclick="copyToClipboard('${k.key}')" style="padding:4px 8px;">📋</button></div>`).join(''):'<div style="color:var(--muted);font-size:0.8rem;">No keys generated yet</div>'}</div><div id="licenseAdminMsg" style="margin-top:8px;font-size:0.75rem;min-height:1rem;"></div></div>`;
}
async function extendTrial() {
  const days=parseInt(document.getElementById('extendDays').value);const now=new Date();
  if(!DB.trial){DB.trial={startDate:now.toISOString(),endDate:new Date(now.getTime()+days*86400000).toISOString()};}
  else{const ce=new Date(DB.trial.endDate);const base=ce>now?ce:now;DB.trial.endDate=new Date(base.getTime()+days*86400000).toISOString();}
  await saveDB();const msg=document.getElementById('licenseAdminMsg');if(msg){msg.style.color='var(--success)';msg.textContent=`✓ Trial extended by ${days} days. New end: ${new Date(DB.trial.endDate).toLocaleDateString()}`;}
  openUserManagement();showToast(`Trial extended by ${days} days`,'success');
}
async function generateNewLicenseKey() {
  if(!DB.licenseKeys)DB.licenseKeys=[];const newKey=generateLicenseKey(Date.now()+Math.random()*1e9);DB.licenseKeys.push({key:newKey,status:'active',createdAt:new Date().toISOString()});await saveDB();openUserManagement();showToast('License key generated!','success');
}
function copyToClipboard(text) { navigator.clipboard.writeText(text).then(()=>showToast('License key copied! 📋','success')); }

document.addEventListener('DOMContentLoaded', async function() {
  document.getElementById('loginBtn').addEventListener('click',handleLogin);
  document.getElementById('loginUsername').addEventListener('keypress',e=>{if(e.key==='Enter')handleLogin();});
  document.getElementById('loginPassword').addEventListener('keypress',e=>{if(e.key==='Enter')handleLogin();});
  document.getElementById('showRegisterBtn').addEventListener('click',()=>showRegisterForm(true));
  document.getElementById('backToLoginBtn').addEventListener('click',()=>showRegisterForm(false));
  document.getElementById('registerSubmitBtn').addEventListener('click',handleRegister);
  document.getElementById('regRole').addEventListener('change',function(){document.getElementById('deptFieldReg').style.display=this.value==='DEPT_VIEWER'?'block':'none';});
  document.getElementById('logoutBtn').addEventListener('click',handleLogout);
  const dz=document.getElementById('attDropZone');if(dz){dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('drag-over');});dz.addEventListener('dragleave',()=>dz.classList.remove('drag-over'));dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('drag-over');if(e.dataTransfer.files[0])handleAttFile(e.dataTransfer.files[0]);});}
  const afi=document.getElementById('attFileInput');if(afi)afi.addEventListener('change',function(){if(this.files[0])handleAttFile(this.files[0]);});
  document.getElementById('addEmployeeBtn').addEventListener('click',()=>{editingEmployeeId=null;document.getElementById('modalTitle').textContent='New Employee';document.querySelectorAll('#empModal input,#empModal select,#empModal textarea').forEach(el=>el.value='');document.getElementById('empGender').value='Male';document.getElementById('empMarital').value='Single';document.getElementById('empType').value='Permanent';document.getElementById('empStatus').value='Active';document.getElementById('empPayMethod').value='Bank Transfer'; currentEmpPhotoData=null; refreshEmpLocationDropdown(); const pzr=document.getElementById('photoUploadZone'); if(pzr){pzr.innerHTML='<span class="upload-icon">📷</span><span class="upload-hint">Click to<br>upload</span><button class="photo-remove" onclick="removeEmpPhoto(event)" style="display:none;">✕</button>';} const eiq2=document.getElementById('empIdQuick'); if(eiq2)eiq2.value=''; document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));document.querySelector('.tab-btn[data-tab="0"]').classList.add('active');document.getElementById('tab0').classList.add('active');openModal('empModal');});
  document.getElementById('saveEmpBtn').addEventListener('click',saveEmployee);
  document.getElementById('refreshListBtn').addEventListener('click',async()=>{showLoading();await loadDB();hideLoading();renderEmployeeList();if(selectedEmployeeId)renderDetail(selectedEmployeeId);showToast('Data refreshed','success');});
  document.getElementById('searchInput').addEventListener('input',renderEmployeeList);
  document.getElementById('attendanceBtn').addEventListener('click',openAttendance);
  document.getElementById('attHistBtn').addEventListener('click',openAttHistory);
  document.getElementById('leaveBtn').addEventListener('click',openLeave);
  document.getElementById('docsBtn').addEventListener('click',openDocs);
  document.getElementById('reportsBtn').addEventListener('click',openReports);
  document.getElementById('payrollBtn').addEventListener('click',openPayroll);
  document.getElementById('savePayslipBtn').addEventListener('click',savePayslip);
  document.getElementById('exportPayrollPdfBtn').addEventListener('click',exportCurrentPayroll);
  document.getElementById('userMgmtBtn').addEventListener('click',openUserManagement);
  document.getElementById('locationBtn').addEventListener('click',openLocations);
  document.getElementById('addUserBtn').addEventListener('click',addUser);
  document.getElementById('newRole').addEventListener('change',function(){document.getElementById('newDeptField').style.display=this.value==='DEPT_VIEWER'?'block':'none';});
  document.querySelectorAll('.tab-btn').forEach(btn=>{btn.addEventListener('click',function(){const tabId=this.getAttribute('data-tab');document.querySelectorAll('.tab-btn').forEach(b=>b.classList.remove('active'));document.querySelectorAll('.tab-pane').forEach(p=>p.classList.remove('active'));this.classList.add('active');document.getElementById(`tab${tabId}`).classList.add('active');});});
});

// ========== PHOTO UPLOAD FUNCTIONS ==========
let currentEmpPhotoData = null;

function handleEmpPhotoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Image too large (max 2MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    currentEmpPhotoData = e.target.result;
    const zone = document.getElementById('photoUploadZone');
    zone.innerHTML = `<img src="${currentEmpPhotoData}" style="width:100%;height:100%;object-fit:cover;border-radius:16px;"><button class="photo-remove" onclick="removeEmpPhoto(event)" style="display:flex;">✕</button>`;
  };
  reader.readAsDataURL(file);
}

function removeEmpPhoto(event) {
  event.stopPropagation();
  currentEmpPhotoData = null;
  const zone = document.getElementById('photoUploadZone');
  if (zone) {
    zone.innerHTML = `<span class="upload-icon">📷</span><span class="upload-hint">Click to<br>upload</span><button class="photo-remove" onclick="removeEmpPhoto(event)" style="display:none;">✕</button>`;
  }
  document.getElementById('empPhotoInput').value = '';
}

function openPhotoEditForEmp(id) {
  const emp = DB.employees.find(e => e.id == id);
  if (!emp) return;
  // Create a quick photo edit popup
  const existing = document.getElementById('quickPhotoPopup');
  if (existing) existing.remove();
  const popup = document.createElement('div');
  popup.id = 'quickPhotoPopup';
  popup.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(8px);z-index:2000;display:flex;align-items:center;justify-content:center;';
  popup.innerHTML = `
    <div style="background:rgba(10,16,32,0.9);border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:2rem;text-align:center;max-width:320px;width:90%;box-shadow:0 32px 64px rgba(0,0,0,0.6);">
      <div style="font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;margin-bottom:1rem;background:linear-gradient(135deg,#EEF2FF,#C7D2FE);-webkit-background-clip:text;-webkit-text-fill-color:transparent;">Change Profile Photo</div>
      <div style="width:100px;height:100px;border-radius:20px;overflow:hidden;margin:0 auto 1.2rem;background:linear-gradient(135deg,#4F8EF7,#9B72F8);display:flex;align-items:center;justify-content:center;font-size:2rem;font-weight:700;color:white;">
        ${emp.photo ? `<img src="${emp.photo}" style="width:100%;height:100%;object-fit:cover;">` : (emp.fullName?.charAt(0)||'?')}
      </div>
      <label style="display:block;background:linear-gradient(135deg,rgba(79,142,247,0.8),rgba(155,114,248,0.7));border:none;border-radius:10px;padding:0.7rem 1.2rem;color:white;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;font-size:0.85rem;margin-bottom:8px;transition:all 0.2s;">
        📷 Upload New Photo
        <input type="file" accept="image/*" style="display:none;" onchange="applyPhotoToEmp(event, ${id})">
      </label>
      ${emp.photo ? `<button onclick="clearEmpPhoto(${id})" style="display:block;width:100%;background:rgba(240,82,82,0.15);border:1px solid rgba(240,82,82,0.3);border-radius:10px;padding:0.6rem;color:#F87171;font-size:0.82rem;cursor:pointer;font-family:'DM Sans',sans-serif;margin-bottom:8px;">🗑 Remove Photo</button>` : ''}
      <button onclick="document.getElementById('quickPhotoPopup').remove()" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:10px;padding:0.6rem 1.2rem;color:var(--text2);font-size:0.82rem;cursor:pointer;font-family:'DM Sans',sans-serif;">Cancel</button>
    </div>`;
  popup.addEventListener('click', e => { if (e.target === popup) popup.remove(); });
  document.body.appendChild(popup);
}

function applyPhotoToEmp(event, id) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 2 * 1024 * 1024) { showToast('Image too large (max 2MB)', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    const emp = DB.employees.find(x => x.id == id);
    if (emp) {
      emp.photo = e.target.result;
      saveDB();
      document.getElementById('quickPhotoPopup')?.remove();
      renderEmployeeList();
      renderDetail(id);
      showToast('Profile photo updated!', 'success');
    }
  };
  reader.readAsDataURL(file);
}

function clearEmpPhoto(id) {
  const emp = DB.employees.find(x => x.id == id);
  if (emp) {
    delete emp.photo;
    saveDB();
    document.getElementById('quickPhotoPopup')?.remove();
    renderEmployeeList();
    renderDetail(id);
    showToast('Photo removed', 'success');
  }
}


// ========== COMPANY LOCATIONS ==========
if (!DB.locations) DB.locations = [];

const LOC_TYPE_ICONS = { HQ:'🏛', Branch:'🏢', Office:'💼', Warehouse:'🏭', Factory:'⚙️' };
const LOC_TYPE_CSS   = { HQ:'loc-type-hq', Branch:'loc-type-branch', Office:'loc-type-office', Warehouse:'loc-type-warehouse', Factory:'loc-type-factory' };

let activeLocId = null;

function openLocations() {
  if (!DB.locations) DB.locations = [];
  activeLocId = null;
  renderLocList();
  // show placeholder, hide detail bar
  document.getElementById('locMapPlaceholder').style.display = 'flex';
  document.getElementById('locDetailBar').style.display = 'none';
  document.getElementById('locMapWrap').querySelectorAll('iframe').forEach(f=>f.remove());
  openModal('locationModal');
}

function renderLocList() {
  if (!DB.locations) DB.locations = [];
  const search = (document.getElementById('locSearchInput')?.value||'').toLowerCase();
  const locs = DB.locations.filter(l =>
    l.name.toLowerCase().includes(search) ||
    l.address.toLowerCase().includes(search) ||
    (l.type||'').toLowerCase().includes(search)
  );
  // update badge
  const badge = document.getElementById('locTotalBadge');
  if (badge) badge.textContent = DB.locations.length + ' location' + (DB.locations.length!==1?'s':'');

  const container = document.getElementById('locListContainer');
  if (!container) return;
  if (!locs.length) {
    container.innerHTML = `<div style="padding:1.2rem;text-align:center;color:var(--muted);font-size:0.8rem;">${search ? 'No results found' : 'No locations yet.<br>Add your first one below!'}</div>`;
    return;
  }
  container.innerHTML = locs.map(loc => {
    const empCount = DB.employees.filter(e => e.location === loc.name).length;
    const icon = LOC_TYPE_ICONS[loc.type] || '📍';
    return `<div class="loc-item ${activeLocId===loc.id?'active':''}" onclick="selectLocation(${loc.id})">
      <div class="loc-item-icon">${icon}</div>
      <div class="loc-item-info">
        <div class="loc-item-name">${loc.name}</div>
        <div class="loc-item-type">${loc.type||'Office'} · ${loc.address.split(',')[0]}</div>
      </div>
      ${empCount>0?`<span class="loc-emp-count">👤 ${empCount}</span>`:''}
    </div>`;
  }).join('');
}

function selectLocation(id) {
  const loc = DB.locations.find(l => l.id === id);
  if (!loc) return;
  activeLocId = id;
  renderLocList();

  // Build Google Maps embed URL using address
  const query = encodeURIComponent(loc.address + ', ' + loc.name);
  const mapWrap = document.getElementById('locMapWrap');

  // Remove old iframe
  mapWrap.querySelectorAll('iframe').forEach(f => f.remove());
  document.getElementById('locMapPlaceholder').style.display = 'none';

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://maps.google.com/maps?q=${query}&output=embed&z=15`;
  iframe.style.cssText = 'width:100%;height:100%;border:none;display:block;';
  iframe.loading = 'lazy';
  iframe.referrerPolicy = 'no-referrer-when-downgrade';
  mapWrap.appendChild(iframe);

  // Update detail bar
  const empCount = DB.employees.filter(e => e.location === loc.name).length;
  document.getElementById('locDetailName').textContent = loc.name;
  document.getElementById('locDetailAddr').textContent = loc.address;
  document.getElementById('locDetailTags').innerHTML = `
    <span class="loc-tag ${LOC_TYPE_CSS[loc.type]||'loc-type-office'}">${LOC_TYPE_ICONS[loc.type]||'📍'} ${loc.type||'Office'}</span>
    ${empCount>0?`<span class="loc-tag" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:var(--text2);">👤 ${empCount} employee${empCount!==1?'s':''}</span>`:''}
    ${loc.phone?`<span class="loc-tag" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:var(--text2);">📞 ${loc.phone}</span>`:''}
    ${loc.manager?`<span class="loc-tag" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:var(--text2);">👔 ${loc.manager}</span>`:''}
  `;
  document.getElementById('locDetailBar').style.display = 'block';
}

function addLocation() {
  const name    = document.getElementById('locNameInput').value.trim();
  const address = document.getElementById('locAddrInput').value.trim();
  const type    = document.getElementById('locTypeInput').value;
  const phone   = document.getElementById('locPhoneInput').value.trim();
  const manager = document.getElementById('locManagerInput').value.trim();
  if (!name || !address) { showToast('Name and address are required', 'error'); return; }
  if (!DB.locations) DB.locations = [];
  if (DB.locations.find(l => l.name.toLowerCase() === name.toLowerCase())) {
    showToast('A location with this name already exists', 'error'); return;
  }
  const newLoc = { id: Date.now(), name, address, type, phone, manager, createdAt: new Date().toISOString() };
  DB.locations.push(newLoc);
  saveDB();
  // clear form
  ['locNameInput','locAddrInput','locPhoneInput','locManagerInput'].forEach(id => {
    const el = document.getElementById(id); if(el) el.value = '';
  });
  document.getElementById('locTypeInput').value = 'Branch';
  renderLocList();
  // auto-select new location
  selectLocation(newLoc.id);
  showToast('Location added: ' + name, 'success');
  // Also update empLocation dropdown in modal if open
  refreshEmpLocationDropdown();
}

function deleteActiveLocation() {
  if (!activeLocId) return;
  const loc = DB.locations.find(l => l.id === activeLocId);
  if (!loc) return;
  if (!confirm(`Remove "${loc.name}" from locations?`)) return;
  DB.locations = DB.locations.filter(l => l.id !== activeLocId);
  saveDB();
  activeLocId = null;
  renderLocList();
  // hide detail bar + show placeholder
  document.getElementById('locDetailBar').style.display = 'none';
  document.getElementById('locMapWrap').querySelectorAll('iframe').forEach(f=>f.remove());
  document.getElementById('locMapPlaceholder').style.display = 'flex';
  showToast('Location removed', 'success');
}

function openInGoogleMaps() {
  const loc = DB.locations.find(l => l.id === activeLocId);
  if (!loc) return;
  const q = encodeURIComponent(loc.address + ' ' + loc.name);
  window.open('https://www.google.com/maps/search/?api=1&query=' + q, '_blank');
}

function refreshEmpLocationDropdown() {
  // If employee modal is open, refresh location datalist
  const dl = document.getElementById('empLocationList');
  if (dl && DB.locations) {
    dl.innerHTML = DB.locations.map(l => `<option value="${l.name}">`).join('');
  }
}

</script>
