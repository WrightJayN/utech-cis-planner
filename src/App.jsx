import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const STORAGE_KEY = "utech_cis_planner_v1";
const MAX_SEM_CREDITS = 18;

const GRADE_POINTS = {
  "A+": 4.3, "A": 4.0, "A-": 3.7,
  "B+": 3.3, "B": 3.0, "B-": 2.7,
  "C+": 2.3, "C": 2.0, "C-": 1.7,
  "D+": 1.3, "D": 1.0, "F": 0.0,
};
const GRADE_OPTS = Object.keys(GRADE_POINTS);

// ─────────────────────────────────────────────────────────────────────────────
// DARK THEME TOKENS
// ─────────────────────────────────────────────────────────────────────────────
const T = {
  bg:        "#0a0e1a",
  bgElev:    "#121826",
  bgElev2:   "#1a2236",
  border:    "#2a3550",
  borderHi:  "#3d4d75",
  text:      "#e6ebf5",
  textDim:   "#8a93ad",
  textMute:  "#5a6485",
  accent:    "#6b8aff",     // primary indigo
  accentHi:  "#8aa3ff",
  gold:      "#f0b84a",
  goldHi:    "#ffd27a",
  green:     "#4ade80",
  red:       "#f87171",
  inputBg:   "#0f1524",
};

// ─────────────────────────────────────────────────────────────────────────────
// ELECTIVE POOLS
// ─────────────────────────────────────────────────────────────────────────────
export const IS_ELECTIVES = [
  { id: "CIS2001",  name: "Data Analysis",                       prereqs: ["STA2020"],  credits: 4, cat: "IS Elective" },
  { id: "CIS4002",  name: "Business Process Management",         prereqs: [],           credits: 3, cat: "IS Elective" },
  { id: "CIS3002",  name: "Digital Marketing",                   prereqs: [],           credits: 3, cat: "IS Elective" },
  { id: "CIS3005",  name: "IS Leadership and Management",        prereqs: ["MKT2001"],  credits: 3, cat: "IS Elective" },
];

export const SCIT_ELECTIVES = [
  { id: "CIT4017",  name: "Decision Science",                            prereqs: [],              credits: 3, cat: "SCIT Elective" },
  { id: "CIT4001",  name: "Software Implementation",                     prereqs: ["CMP2019"],     credits: 3, cat: "SCIT Elective" },
  { id: "CIT3012",  name: "Advanced Databases",                          prereqs: ["CMP2018"],     credits: 4, cat: "SCIT Elective" },
  { id: "CIT3023",  name: "Intro to Human Computer Interaction",         prereqs: ["CIT2011"],     credits: 4, cat: "SCIT Elective" },
  { id: "CIS3008",  name: "User Experience Research",                    prereqs: [],              credits: 4, cat: "SCIT Elective" },
  { id: "CIT2011",  name: "Web Programming",                             prereqs: ["INT1001"],     credits: 3, cat: "SCIT Elective" },
  { id: "CIT4034",  name: "Web System Design & Implementation",          prereqs: ["CIT2009"],     credits: 4, cat: "SCIT Elective" },
  { id: "CIT3013",  name: "Database Administration",                     prereqs: ["CIT3012"],     credits: 4, cat: "SCIT Elective" },
  { id: "CMP1026",  name: "Computer Networks",                           prereqs: [],              credits: 3, cat: "SCIT Elective" },
  { id: "CMP3025",  name: "Computer Hardware",                           prereqs: [],              credits: 3, cat: "SCIT Elective" },
  { id: "CIT3027",  name: "Mobile Computing",                            prereqs: ["CIT2011"],     credits: 4, cat: "SCIT Elective" },
  { id: "CIT4011",  name: "Computer Graphics",                           prereqs: [],              credits: 4, cat: "SCIT Elective" },
  { id: "CNS2003",  name: "Virtualised System",                          prereqs: ["CMP1026"],     credits: 4, cat: "SCIT Elective" },
  { id: "CIT3030",  name: "System & Software Security",                  prereqs: [],              credits: 3, cat: "SCIT Elective" },
  { id: "CIT3017",  name: "Network Administration & Technical Support",  prereqs: ["CMP1026"],     credits: 3, cat: "SCIT Elective" },
];

export const EXTERNAL_ELECTIVES = [
  { id: "ACC2001E", name: "Introduction to Financial Accounting",               prereqs: [],            credits: 3, cat: "External Elective" },
  { id: "FIN3011",  name: "Financial Business Venture",                         prereqs: ["ACC2001E"],  credits: 3, cat: "External Elective" },
  { id: "FIN3001",  name: "Financial Management",                               prereqs: ["ACC2001E"],  credits: 3, cat: "External Elective" },
  { id: "MKT2004",  name: "New Venture Marketing",                              prereqs: ["MKT2001"],   credits: 3, cat: "External Elective" },
  { id: "ACC2009",  name: "Management Accounting for Entrepreneurs",            prereqs: ["ACC2001E"],  credits: 3, cat: "External Elective" },
  { id: "LAW2001",  name: "Business Law",                                       prereqs: ["COM1024"],   credits: 3, cat: "External Elective" },
  { id: "LLB3001",  name: "ICT Law",                                            prereqs: [],            credits: 3, cat: "External Elective" },
  { id: "MKT3023E", name: "Innovation & Development: Products, Services & Markets", prereqs: ["MKT2001"], credits: 3, cat: "External Elective" },
  { id: "STA3005",  name: "Multivariate Data Analysis",                         prereqs: ["STA2020"],   credits: 3, cat: "External Elective" },
  { id: "HEA1019",  name: "Healthcare Delivery Systems",                        prereqs: [],            credits: 3, cat: "External Elective" },
  { id: "HEA1035",  name: "Principles of Healthcare Management",                prereqs: [],            credits: 3, cat: "External Elective" },
  { id: "EPI4001",  name: "Principles of Epidemiology",                         prereqs: [],            credits: 3, cat: "External Elective" },
  { id: "ISD3011",  name: "Land and Geographic Information Systems",            prereqs: [],            credits: 3, cat: "External Elective" },
  { id: "ENT4010",  name: "Digital Entrepreneurship",                           prereqs: [],            credits: 3, cat: "External Elective" },
];

export const UNIV_ELECTIVES = [
  ...EXTERNAL_ELECTIVES,
  { id: "PSY2001",  name: "Organisational Psychology",    prereqs: [], credits: 3, cat: "University Elective" },
  { id: "SOC1001",  name: "Introduction to Sociology",   prereqs: [], credits: 3, cat: "University Elective" },
  { id: "ECO1001",  name: "Principles of Economics",     prereqs: [], credits: 3, cat: "University Elective" },
  { id: "COM3001",  name: "Business Communication",      prereqs: [], credits: 3, cat: "University Elective" },
];

const ALL_ELECTIVE_POOL = {
  IS_SCIT_EXT: [...IS_ELECTIVES, ...SCIT_ELECTIVES, ...EXTERNAL_ELECTIVES],
  UNIV:        UNIV_ELECTIVES,
  IS:          IS_ELECTIVES,
  SCIT:        SCIT_ELECTIVES,
  EXT:         EXTERNAL_ELECTIVES,
};

// ─────────────────────────────────────────────────────────────────────────────
// CURRICULUM — Data Analytics
// ─────────────────────────────────────────────────────────────────────────────
const DA_COURSES = [
  { id:"INT1001",      name:"Information Technology",                      credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"PSY1002",      name:"Introduction to Psychology",                  credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"ENS3001",      name:"Environmental Studies / Material Science",    credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"MAT1047",      name:"College Mathematics 1B",                      credits:4, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"COM1024",      name:"Academic Literacy for Undergraduates",        credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"CNS1003",      name:"Computer Practice",                           credits:2, prereqs:[], coreqs:[], level:1, sem:1 },

  { id:"CIS1000",      name:"Programming for Data Analytics",              credits:4, prereqs:[], coreqs:[], level:1, sem:2 },
  { id:"COM2016",      name:"Critical Thinking & Reading",                 credits:3, prereqs:["COM1024"], coreqs:[], level:1, sem:2 },
  { id:"CMP1026_NET",  name:"Computer Networks OR Web Programming",        credits:3, prereqs:[], coreqs:[], level:1, sem:2 },
  { id:"MAT1008",      name:"Discrete Mathematics",                        credits:3, prereqs:["MAT1047"], coreqs:[], level:1, sem:2 },
  { id:"ACC1002",      name:"Fundamentals of Accounting 1",                credits:3, prereqs:[], coreqs:[], level:1, sem:2 },
  { id:"CSP1001",      name:"Community Service Project",                   credits:1, prereqs:[], coreqs:[], level:1, sem:2 },

  { id:"STA2020",      name:"Introductory Statistics",                     credits:3, prereqs:["MAT1047"], coreqs:[], level:2, sem:1 },
  { id:"CIS1002",      name:"Data Visualization",                          credits:3, prereqs:[], coreqs:[], level:2, sem:1 },
  { id:"CMP2018",      name:"Database Design",                             credits:3, prereqs:["INT1001"], coreqs:[], level:2, sem:1 },
  { id:"CIT3031",      name:"Data Protection and Regulation",              credits:3, prereqs:[], coreqs:[], level:2, sem:1 },
  { id:"CIT3021",      name:"Foundation of Information Systems",           credits:3, prereqs:["INT1001"], coreqs:[], level:2, sem:1 },

  { id:"CMP2019",      name:"Software Engineering: Analysis & Design",     credits:3, prereqs:["INT1001"], coreqs:[], level:2, sem:2 },
  { id:"CIS2001",      name:"Data Analysis",                               credits:4, prereqs:["STA2020"], coreqs:[], level:2, sem:2 },
  { id:"STA2014",      name:"Regression Analysis",                         credits:3, prereqs:["STA2020"], coreqs:[], level:2, sem:2 },
  { id:"MAT2003",      name:"Calculus I",                                  credits:3, prereqs:["MAT1047"], coreqs:[], level:2, sem:2 },
  { id:"MKT2001",      name:"Fundamentals of Marketing",                   credits:3, prereqs:["COM1024"], coreqs:[], level:2, sem:2 },

  { id:"CIT4024",      name:"IT Project Management",                       credits:3, prereqs:["INT1001"], coreqs:[], level:3, sem:1 },
  { id:"CIS3000",      name:"IS Architecture & Infrastructure",            credits:3, prereqs:["CIT3021"], coreqs:[], level:3, sem:1 },
  { id:"CIT3012",      name:"Advanced Databases",                          credits:4, prereqs:["CMP2018"], coreqs:[], level:3, sem:1 },
  { id:"HUM3010",      name:"Professional, Ethical & Legal Implications",  credits:3, prereqs:["COM1024"], coreqs:["CMP2019"], level:3, sem:1 },
  { id:"MAN3001",      name:"Organization and Management",                 credits:3, prereqs:[], coreqs:[], level:3, sem:1 },

  { id:"RES3024",      name:"Computing Research Methods",                  credits:3, prereqs:["COM1024"], coreqs:[], level:3, sem:2 },
  { id:"CIS3003",      name:"E-Business Fundamentals",                     credits:3, prereqs:["CIT3021"], coreqs:[], level:3, sem:2 },
  { id:"CIT4038",      name:"Introduction to Machine Learning",            credits:3, prereqs:["CIS2001"], coreqs:[], level:3, sem:2 },
  { id:"ENT3001",      name:"Entrepreneurship",                            credits:3, prereqs:[], coreqs:[], level:3, sem:2 },
  { id:"STA2016",      name:"Design of Experiments",                       credits:3, prereqs:["STA2020"], coreqs:[], level:3, sem:2 },

  { id:"PRJ4020",      name:"Major Project",                               credits:3, prereqs:["RES3024"], coreqs:[], level:4, sem:1 },
  { id:"CIS4004",      name:"Big Data Analytics & Warehousing",            credits:3, prereqs:["CIS2001"], coreqs:[], level:4, sem:1 },
  { id:"CIT4017",      name:"Decision Science",                            credits:3, prereqs:[], coreqs:[], level:4, sem:1 },
  { id:"CIS3001",      name:"Auditing for IS Professionals",               credits:3, prereqs:["CIT4024"], coreqs:[], level:4, sem:1 },
  { id:"DA_IS_ELEC_4A", name:"IS Elective / Internship",                  credits:3, prereqs:[], coreqs:[], level:4, sem:1, elective:"IS_SCIT_EXT" },

  { id:"CIS4003",      name:"Software Quality Assurance",                  credits:3, prereqs:["CMP2019"], coreqs:[], level:4, sem:2 },
  { id:"CIS4000",      name:"IS Strategic Management",                     credits:3, prereqs:["CIS3000"], coreqs:[], level:4, sem:2 },
  { id:"CIT4036",      name:"Professional Development Seminar",            credits:1, prereqs:[], coreqs:[], level:4, sem:2, note:"Level 4" },
  { id:"DA_UNIV_ELEC", name:"University Elective",                         credits:3, prereqs:[], coreqs:[], level:4, sem:2, elective:"UNIV" },
  { id:"DA_EXT_ELEC",  name:"External / SCIT / IS Elective",               credits:3, prereqs:[], coreqs:[], level:4, sem:2, elective:"IS_SCIT_EXT" },
];

// ─────────────────────────────────────────────────────────────────────────────
// CURRICULUM — Technology Entrepreneurship
// ─────────────────────────────────────────────────────────────────────────────
const TE_COURSES = [
  { id:"INT1001",      name:"Information Technology",                      credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"PSY1002",      name:"Introduction to Psychology",                  credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"ENS3001",      name:"Environmental Studies / Material Science",    credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"MAT1047",      name:"College Mathematics 1B",                      credits:4, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"COM1024",      name:"Academic Literacy for Undergraduates",        credits:3, prereqs:[], coreqs:[], level:1, sem:1 },
  { id:"CNS1003",      name:"Computer Practice",                           credits:2, prereqs:[], coreqs:[], level:1, sem:1 },

  { id:"CIS1000",      name:"Programming for Data Analytics",              credits:4, prereqs:[], coreqs:[], level:1, sem:2 },
  { id:"COM2016",      name:"Critical Thinking & Reading",                 credits:3, prereqs:["COM1024"], coreqs:[], level:1, sem:2 },
  { id:"CMP1026_NET",  name:"Computer Networks OR Web Programming",        credits:3, prereqs:[], coreqs:[], level:1, sem:2 },
  { id:"MAT1008",      name:"Discrete Mathematics",                        credits:3, prereqs:["MAT1047"], coreqs:[], level:1, sem:2 },
  { id:"ACC1002",      name:"Fundamentals of Accounting 1",                credits:3, prereqs:[], coreqs:[], level:1, sem:2 },
  { id:"CSP1001",      name:"Community Service Project",                   credits:1, prereqs:[], coreqs:[], level:1, sem:2 },

  { id:"STA2020",      name:"Introductory Statistics",                     credits:3, prereqs:["MAT1047"], coreqs:[], level:2, sem:1 },
  { id:"CIS1002",      name:"Data Visualization",                          credits:3, prereqs:[], coreqs:[], level:2, sem:1 },
  { id:"CMP2018",      name:"Database Design",                             credits:3, prereqs:["INT1001"], coreqs:[], level:2, sem:1 },
  { id:"CIT3031",      name:"Data Protection and Regulation",              credits:3, prereqs:[], coreqs:[], level:2, sem:1 },
  { id:"CIT3021",      name:"Foundation of Information Systems",           credits:3, prereqs:["INT1001"], coreqs:[], level:2, sem:1 },

  { id:"CMP2019",      name:"Software Engineering: Analysis & Design",     credits:3, prereqs:["INT1001"], coreqs:[], level:2, sem:2 },
  { id:"HUM3010",      name:"Professional, Ethical & Legal Implications",  credits:3, prereqs:["COM1024"], coreqs:["CMP2019"], level:2, sem:2 },
  { id:"MKT2001",      name:"Fundamentals of Marketing",                   credits:3, prereqs:["COM1024"], coreqs:[], level:2, sem:2 },
  { id:"CIS2000",      name:"Technology Start-Up",                         credits:3, prereqs:[], coreqs:[], level:2, sem:2 },
  { id:"ACC2001",      name:"Introduction to Financial Accounting",        credits:3, prereqs:[], coreqs:[], level:2, sem:2 },

  { id:"CIT4024",      name:"IT Project Management",                       credits:3, prereqs:["INT1001"], coreqs:[], level:3, sem:1 },
  { id:"CIS3000",      name:"IS Architecture & Infrastructure",            credits:3, prereqs:["CIT3021"], coreqs:[], level:3, sem:1 },
  { id:"CIS2002",      name:"Technology Business Acceleration",            credits:4, prereqs:["CIS2000"], coreqs:[], level:3, sem:1 },
  { id:"RES3024",      name:"Computer Research Methods",                   credits:3, prereqs:["COM1024"], coreqs:[], level:3, sem:1 },
  { id:"CIS3002",      name:"Digital Marketing",                           credits:3, prereqs:["MKT2001"], coreqs:[], level:3, sem:1 },

  { id:"CIS3003",      name:"E-Business Fundamentals",                     credits:3, prereqs:["CIT3021"], coreqs:[], level:3, sem:2 },
  { id:"CIS3004",      name:"IS Innovation & Intrapreneurship",            credits:3, prereqs:["CIT3021"], coreqs:[], level:3, sem:2 },
  { id:"CIS3005",      name:"IS Leadership & Management",                  credits:3, prereqs:["CIT4024"], coreqs:[], level:3, sem:2 },
  { id:"MKT3023",      name:"Innovation & Development: Products, Services & Markets", credits:3, prereqs:["MKT2001"], coreqs:[], level:3, sem:2 },
  { id:"MAN3001",      name:"Organisation & Management",                   credits:3, prereqs:[], coreqs:[], level:3, sem:2 },

  { id:"PRJ4020",      name:"Major Project",                               credits:3, prereqs:["RES3024"], coreqs:[], level:4, sem:1 },
  { id:"CIS4001",      name:"Technology Entrepreneurship Project",         credits:3, prereqs:["CIS2002"], coreqs:[], level:4, sem:1 },
  { id:"CIS3001",      name:"Auditing for IS Professionals",               credits:3, prereqs:["CIT4024"], coreqs:[], level:4, sem:1 },
  { id:"TE_IS_ELEC_4A", name:"IS Elective / Internship",                  credits:3, prereqs:[], coreqs:[], level:4, sem:1, elective:"IS_SCIT_EXT" },

  { id:"CIS4003",      name:"Software Quality Assurance",                  credits:3, prereqs:["CMP2019"], coreqs:[], level:4, sem:2 },
  { id:"CIS4000",      name:"IS Strategic Management",                     credits:3, prereqs:["CIS3000"], coreqs:[], level:4, sem:2 },
  { id:"CIT4036",      name:"Professional Development Seminar",            credits:1, prereqs:[], coreqs:[], level:4, sem:2, note:"Level 4" },
  { id:"TE_UNIV_ELEC", name:"University Elective",                         credits:3, prereqs:[], coreqs:[], level:4, sem:2, elective:"UNIV" },
  { id:"TE_EXT_ELEC",  name:"External / SCIT / IS Elective",               credits:3, prereqs:[], coreqs:[], level:4, sem:2, elective:"IS_SCIT_EXT" },
  { id:"INE3011",      name:"Business Process Engineering",                credits:3, prereqs:[], coreqs:[], level:4, sem:2 },
];

const TRACK_DATA = {
  da: { label: "Data Analytics",              courses: DA_COURSES },
  te: { label: "Technology Entrepreneurship", courses: TE_COURSES },
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function buildCourseMap(courses) { return Object.fromEntries(courses.map(c => [c.id, c])); }

function initStates(courses) {
  const s = {};
  courses.forEach(c => { s[c.id] = c.prereqs.length === 0 ? "available" : "locked"; });
  return s;
}

function computeStates(saved, courses) {
  const result = { ...saved };
  const inProg = new Set(Object.entries(result).filter(([, v]) => v === "in-progress").map(([k]) => k));
  courses.forEach(c => {
    if (result[c.id] === "completed" || result[c.id] === "in-progress") return;
    const prereqsDone = c.prereqs.every(p => result[p] === "completed");
    const coreqsMet = !c.coreqs?.length || c.coreqs.every(p => result[p] === "completed" || inProg.has(p));
    result[c.id] = prereqsDone && coreqsMet ? "available" : "locked";
  });
  return result;
}

function calcGPA(states, grades, courses) {
  let pts = 0, cr = 0;
  courses.forEach(c => {
    if (states[c.id] === "completed" && grades[c.id] && GRADE_POINTS[grades[c.id]] !== undefined) {
      pts += GRADE_POINTS[grades[c.id]] * c.credits;
      cr += c.credits;
    }
  });
  return cr > 0 ? (pts / cr).toFixed(2) : null;
}

const defaultSlot = (name = "Plan A", trackId = "da") => ({
  name,
  trackId,
  states: initStates(TRACK_DATA[trackId].courses),
  grades: {},
  pickedElectives: {},
  extraElecSlots: [],
  studentName: "",
  studentId: "",
  startYear: "",
});

// safer confirm/prompt for sandboxed iframes
const safeConfirm = (msg) => { try { return window.confirm(msg); } catch { return true; } };
const safePrompt  = (msg, dflt) => { try { return window.prompt(msg, dflt); } catch { return dflt; } };

// ─────────────────────────────────────────────────────────────────────────────
// STATUS VISUAL CONFIG (DARK)
// ─────────────────────────────────────────────────────────────────────────────
const STATUS_META = {
  locked:        { label: "Locked",      bg: "#161c2c", border: "#252d44", text: "#4a5470" },
  available:     { label: "Available",   bg: "#1c2030", border: "#3d4d75", text: "#c8d2ee" },
  "in-progress": { label: "In Progress", bg: "#16203a", border: "#5a78d6", text: "#a8bcff" },
  completed:     { label: "Completed",   bg: "#142a1f", border: "#3d8a5f", text: "#7fe2a8" },
  elective:      { label: "Elective",    bg: "#2a2110", border: "#8a6620", text: "#f0c878" },
};

// ─────────────────────────────────────────────────────────────────────────────
// TOOLTIP
// ─────────────────────────────────────────────────────────────────────────────
function Tooltip({ children, text }) {
  const [show, setShow] = useState(false);
  if (!text) return children;
  return (
    <div style={{ position: "relative" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}>
      {children}
      {show && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 8px)", left: "50%",
          transform: "translateX(-50%)",
          background: T.bgElev2, border: `1px solid ${T.borderHi}`,
          color: T.text, fontSize: 10, padding: "6px 10px",
          borderRadius: 5, whiteSpace: "pre-wrap", maxWidth: 240,
          zIndex: 9999, pointerEvents: "none", lineHeight: 1.6,
          boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
        }}>{text}</div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ELECTIVE PICKER MODAL
// ─────────────────────────────────────────────────────────────────────────────
function ElectivePicker({ slotId, slotLabel, poolKey, onClose, onPick, pickedElectives, states }) {
  const [search, setSearch] = useState("");
  const pool = ALL_ELECTIVE_POOL[poolKey] || ALL_ELECTIVE_POOL.IS_SCIT_EXT;
  const alreadyPicked = Object.entries(pickedElectives)
    .filter(([k, v]) => k !== slotId && v).map(([, v]) => v);

  const grouped = pool.reduce((acc, e) => {
    if (!acc[e.cat]) acc[e.cat] = [];
    const q = search.toLowerCase();
    if (!q || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
      acc[e.cat].push(e);
    return acc;
  }, {});

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: T.bgElev, border: `1px solid ${T.border}`,
        borderRadius: 12, width: "100%", maxWidth: 540,
        maxHeight: "84vh", display: "flex", flexDirection: "column",
        overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }} onClick={e => e.stopPropagation()}>

        <div style={{ padding: "18px 20px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 2, color: T.accent, textTransform: "uppercase", marginBottom: 3 }}>
                Elective Selection
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: T.text }}>
                {slotLabel || "Choose an Elective"}
              </div>
            </div>
            <button onClick={onClose} style={{
              background: T.bgElev2, border: "none", borderRadius: 6,
              width: 28, height: 28, cursor: "pointer", fontSize: 13, color: T.textDim,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
          <input autoFocus placeholder="Search modules…" value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: "100%", marginTop: 12, background: T.inputBg,
              border: `1px solid ${T.border}`, color: T.text,
              fontSize: 12, padding: "7px 12px", borderRadius: 6,
              fontFamily: "'DM Mono', monospace", outline: "none",
            }} />
        </div>

        <div style={{ overflowY: "auto", padding: "10px 16px 16px", flex: 1 }}>
          {Object.entries(grouped).map(([cat, items]) => items.length === 0 ? null : (
            <div key={cat} style={{ marginBottom: 14 }}>
              <div style={{
                fontSize: 9, letterSpacing: 2, color: T.accent, textTransform: "uppercase",
                marginBottom: 6, paddingBottom: 4, borderBottom: `1px solid ${T.border}`,
              }}>{cat}</div>
              {items.map(e => {
                const taken = alreadyPicked.includes(e.id);
                const current = pickedElectives[slotId] === e.id;
                const prereqMet = e.prereqs.every(p => states[p] === "completed");
                const dimmed = e.prereqs.length > 0 && !prereqMet;
                return (
                  <div key={e.id}
                    onClick={() => !taken && onPick(slotId, e.id)}
                    title={dimmed ? `Prereqs needed: ${e.prereqs.join(", ")}` : ""}
                    style={{
                      padding: "8px 12px", borderRadius: 6, cursor: taken ? "not-allowed" : "pointer",
                      marginBottom: 4, display: "flex", alignItems: "center", gap: 10,
                      background: current ? "#16203a" : taken ? T.bgElev2 : T.bgElev2,
                      border: `1px solid ${current ? T.accent : T.border}`,
                      opacity: taken || dimmed ? 0.45 : 1,
                      transition: "all 0.12s",
                    }}>
                    <div style={{
                      width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                      background: current ? T.accent : T.bgElev,
                      border: `1.5px solid ${current ? T.accent : T.borderHi}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "#fff", fontSize: 10,
                    }}>{current ? "✓" : ""}</div>
                    <div style={{ flex: 1 }}>
                      <span style={{ fontSize: 10, color: T.textMute, marginRight: 8 }}>{e.id}</span>
                      <span style={{ fontSize: 12, color: current ? T.accentHi : T.text, fontWeight: current ? 600 : 400 }}>{e.name}</span>
                      {dimmed && <span style={{ fontSize: 9, color: T.textMute, marginLeft: 6 }}>· prereq needed</span>}
                      {taken && <span style={{ fontSize: 9, color: T.textMute, marginLeft: 6 }}>· already picked</span>}
                    </div>
                    <span style={{ fontSize: 10, color: T.textDim, flexShrink: 0 }}>{e.credits}cr</span>
                  </div>
                );
              })}
            </div>
          ))}
          {Object.values(grouped).every(arr => arr.length === 0) && (
            <div style={{ textAlign: "center", color: T.textMute, fontSize: 12, padding: "20px 0" }}>
              No modules match your search.
            </div>
          )}
        </div>

        <div style={{ padding: "10px 16px", borderTop: `1px solid ${T.border}`, display: "flex", gap: 8 }}>
          {pickedElectives[slotId] && (
            <button onClick={() => onPick(slotId, null)} style={{
              background: "#2a1414", border: `1px solid ${T.red}`, color: T.red,
              borderRadius: 5, padding: "7px 14px", cursor: "pointer", fontSize: 11,
            }}>Clear</button>
          )}
          <button onClick={onClose} style={{
            flex: 1, padding: "8px", background: T.bgElev2,
            border: `1px solid ${T.border}`, color: T.textDim, borderRadius: 6,
            cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11,
          }}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PLANS MODAL
// ─────────────────────────────────────────────────────────────────────────────
function PlansModal({ slots, current, onSwitch, onNew, onDelete, onClose }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 1000,
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
      backdropFilter: "blur(4px)",
    }} onClick={onClose}>
      <div style={{
        background: T.bgElev, border: `1px solid ${T.border}`, borderRadius: 12,
        width: "100%", maxWidth: 360, padding: 22,
        boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15, color: T.text, marginBottom: 14 }}>
          Degree Plans
        </div>
        {slots.map((s, i) => (
          <div key={i} style={{ display: "flex", gap: 7, marginBottom: 7 }}>
            <div onClick={() => onSwitch(i)} style={{
              flex: 1, padding: "9px 12px", borderRadius: 6, cursor: "pointer",
              background: current === i ? "#16203a" : T.bgElev2,
              border: `1.5px solid ${current === i ? T.accent : T.border}`,
              color: current === i ? T.accentHi : T.textDim,
              fontSize: 12, fontWeight: current === i ? 600 : 400,
              transition: "all 0.12s",
            }}>
              {s.name} · <span style={{ fontSize: 10, opacity: 0.65 }}>{TRACK_DATA[s.trackId]?.label}</span>
              {current === i ? " ✓" : ""}
            </div>
            {slots.length > 1 && (
              <button onClick={() => onDelete(i)} style={{
                background: "#2a1414", border: `1px solid ${T.red}`, color: T.red,
                padding: "6px 10px", borderRadius: 5, cursor: "pointer", fontSize: 11,
              }}>✕</button>
            )}
          </div>
        ))}
        <button onClick={onNew} style={{
          width: "100%", padding: "9px", background: T.bgElev2,
          border: `1.5px dashed ${T.borderHi}`, color: T.accent, borderRadius: 6,
          cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, marginTop: 4,
        }}>+ New Plan</button>
        <button onClick={onClose} style={{
          width: "100%", padding: "8px", background: "transparent",
          border: `1px solid ${T.border}`, color: T.textDim, borderRadius: 6,
          cursor: "pointer", fontFamily: "'DM Mono', monospace", fontSize: 11, marginTop: 8,
        }}>Done</button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COURSE CARD
// ─────────────────────────────────────────────────────────────────────────────
function CourseCard({ course, state, grade, onCycle, onGrade, onElectivePick, pickedElectives, states, flash, onRemoveExtra }) {
  const isElective = !!course.elective;
  const displayState = isElective && state === "available" ? "elective" : state;
  const meta = STATUS_META[displayState] || STATUS_META.locked;
  const isLocked = state === "locked";

  const missingPre = course.prereqs.filter(p => states[p] !== "completed");
  const missingCo = (course.coreqs || []).filter(p => states[p] !== "completed" && states[p] !== "in-progress");
  const tooltipLines = isLocked ? [
    missingPre.length ? `Prereqs needed: ${missingPre.join(", ")}` : null,
    missingCo.length ? `Co-req (same sem ok): ${missingCo.join(", ")}` : null,
  ].filter(Boolean).join("\n") : null;

  const pickedId = isElective && pickedElectives?.[course.id];
  const poolKey = course.elective;
  const allPool = poolKey ? ALL_ELECTIVE_POOL[poolKey] || [] : [];
  const pickedInfo = pickedId ? allPool.find(e => e.id === pickedId) : null;
  const displayName = pickedInfo ? pickedInfo.name : course.name;
  const displayCode = pickedInfo ? pickedInfo.id : course.id;

  return (
    <Tooltip text={tooltipLines}>
      <div
        className={`cis-card${isLocked ? " locked" : ""}${flash ? " flash" : ""}`}
        onClick={() => !isLocked && onCycle(course.id)}
        style={{
          background: meta.bg, border: `1.5px solid ${meta.border}`,
          borderRadius: 8, padding: "11px 13px",
          transition: "all 0.15s ease", cursor: isLocked ? "default" : "pointer",
        }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 6 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 9, color: T.textMute, letterSpacing: 1, marginBottom: 3, display: "flex", gap: 5, flexWrap: "wrap" }}>
              <span>{displayCode}</span>
              {course.note && <span style={{ color: T.accent, opacity: 0.8 }}>· {course.note}</span>}
              {course.coreqs?.length > 0 && <span style={{ color: T.gold, opacity: 0.85 }}>· co-req</span>}
            </div>
            <div style={{ fontSize: 12, color: meta.text, lineHeight: 1.4, fontWeight: displayState === "completed" ? 500 : 400 }}>
              {displayName}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 3, flexShrink: 0 }}>
            <span style={{ fontSize: 10, color: meta.text, opacity: 0.65 }}>{pickedInfo ? pickedInfo.credits : course.credits}cr</span>
            {displayState === "completed" && <span style={{ fontSize: 12, color: T.green }}>✓</span>}
            {displayState === "in-progress" && <span style={{ fontSize: 11, color: T.accentHi }}>▶</span>}
            {displayState === "elective" && <span style={{ fontSize: 11, color: T.gold }}>⚙</span>}
            {displayState === "locked" && <span style={{ fontSize: 11, opacity: 0.45 }}>🔒</span>}
          </div>
        </div>

        {displayState === "completed" && (
          <div style={{ marginTop: 8 }} onClick={e => e.stopPropagation()}>
            <select value={grade || ""} onChange={e => onGrade(course.id, e.target.value)}
              style={{
                background: "#142a1f", border: `1px solid ${T.green}`,
                color: grade ? T.green : T.textMute, fontSize: 10,
                padding: "3px 6px", borderRadius: 4, width: "100%",
                fontFamily: "'DM Mono', monospace", cursor: "pointer", outline: "none",
              }}>
              <option value="">— enter grade —</option>
              {GRADE_OPTS.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        )}

        {isElective && state !== "locked" && (
          <button onClick={e => { e.stopPropagation(); onElectivePick(course.id); }}
            style={{
              marginTop: 8, width: "100%", fontSize: 9, padding: "4px 0",
              background: "#2a2110", border: `1px solid ${T.gold}`,
              color: T.goldHi, borderRadius: 4, cursor: "pointer",
              fontFamily: "'DM Mono', monospace", letterSpacing: 1,
            }}>
            {pickedId ? "✎ change elective" : "+ pick elective"}
          </button>
        )}

        {onRemoveExtra && (
          <button onClick={e => { e.stopPropagation(); onRemoveExtra(course.id); }}
            style={{
              marginTop: 6, width: "100%", fontSize: 9, padding: "3px 0",
              background: "transparent", border: `1px dashed ${T.border}`,
              color: T.textMute, borderRadius: 4, cursor: "pointer",
              fontFamily: "'DM Mono', monospace",
            }}>
            ✕ remove slot
          </button>
        )}
      </div>
    </Tooltip>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function CISPlanner() {
  const [slots, setSlots] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const d = JSON.parse(raw);
        if (d.slots) return d.slots.map(s => ({
          ...defaultSlot(s.name, s.trackId || "da"), ...s,
          states: computeStates(s.states || {}, TRACK_DATA[s.trackId || "da"].courses),
        }));
      }
    } catch { }
    return [defaultSlot("Plan A", "da")];
  });

  const [currentSlot, setCurrentSlot] = useState(0);
  const [view, setView] = useState("full");
  const [focusIdx, setFocusIdx] = useState(0);
  const [showUnlocked, setShowUnlocked] = useState(false);
  const [electiveModal, setElectiveModal] = useState(null);
  const [showPlansModal, setShowPlansModal] = useState(false);
  const [flashId, setFlashId] = useState(null);

  const slot = slots[Math.min(currentSlot, slots.length - 1)] || defaultSlot();
  const track = slot.trackId || "da";
  const COURSES = TRACK_DATA[track].courses;
  const COURSE_MAP = buildCourseMap(COURSES);
  const { states, grades, pickedElectives, extraElecSlots = [], studentName, studentId, startYear } = slot;

  // Build map including extras for openElectiveModal lookups
  const extraMap = Object.fromEntries((extraElecSlots || []).map(e => [e.id, e]));

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ slots, currentSlot })); } catch { }
  }, [slots, currentSlot]);

  const updateSlot = useCallback((fn) => {
    setSlots(prev => {
      const next = [...prev];
      const idx = Math.min(currentSlot, next.length - 1);
      next[idx] = { ...next[idx], ...fn(next[idx]) };
      return next;
    });
  }, [currentSlot]);

  const cycleState = useCallback((id) => {
    updateSlot(s => {
      const cur = s.states[id];
      if (cur === "locked") return s;
      const course = COURSE_MAP[id] || (s.extraElecSlots || []).find(e => e.id === id);
      const isElec = !!(course?.elective || course?.pool);
      let next;
      if (isElec) {
        next = cur === "available" || cur === "elective" ? "in-progress" : cur === "in-progress" ? "completed" : "available";
      } else {
        const order = ["available", "in-progress", "completed"];
        const i = order.indexOf(cur);
        next = i === -1 ? "available" : order[(i + 1) % order.length];
      }
      if (next === "completed") {
        setFlashId(id);
        setTimeout(() => setFlashId(null), 700);
      }
      return { states: computeStates({ ...s.states, [id]: next }, COURSES) };
    });
  }, [updateSlot, COURSE_MAP, COURSES]);

  const setGrade = useCallback((id, g) => {
    updateSlot(s => ({ grades: { ...s.grades, [id]: g } }));
  }, [updateSlot]);

  const pickElective = useCallback((slotId, electiveId) => {
    updateSlot(s => ({ pickedElectives: { ...s.pickedElectives, [slotId]: electiveId } }));
    setElectiveModal(null);
  }, [updateSlot]);

  // FIX: lookup extras OR base courses
  const openElectiveModal = useCallback((courseId) => {
    const base = COURSE_MAP[courseId];
    const extra = extraMap[courseId];
    if (!base && !extra) return;
    setElectiveModal({
      slotId: courseId,
      slotLabel: extra?.label || base?.name || "Choose Elective",
      poolKey: extra?.pool || base?.elective || "IS_SCIT_EXT",
    });
  }, [COURSE_MAP, extraMap]);

  const addExtraElecSlot = useCallback((semLevel, semNum) => {
    const id = `EXTRA_ELEC_${semLevel}_${semNum}_${Date.now()}`;
    updateSlot(s => ({
      extraElecSlots: [...(s.extraElecSlots || []), { id, label: "Additional Elective", pool: "IS_SCIT_EXT", level: semLevel, sem: semNum }],
      states: { ...s.states, [id]: "available" },
    }));
  }, [updateSlot]);

  const removeExtraSlot = useCallback((id) => {
    updateSlot(s => {
      const newStates = { ...s.states }; delete newStates[id];
      const newGrades = { ...s.grades }; delete newGrades[id];
      const newPicked = { ...s.pickedElectives }; delete newPicked[id];
      return {
        extraElecSlots: (s.extraElecSlots || []).filter(e => e.id !== id),
        states: newStates, grades: newGrades, pickedElectives: newPicked,
      };
    });
  }, [updateSlot]);

  const allCoursesWithExtra = [
    ...COURSES,
    ...(extraElecSlots || []).map(e => ({
      id: e.id, name: e.label, credits: 3, prereqs: [], coreqs: [],
      level: e.level, sem: e.sem, elective: e.pool || "IS_SCIT_EXT",
    })),
  ];
  const completedCr = allCoursesWithExtra.filter(c => states[c.id] === "completed")
    .reduce((s, c) => s + (pickedElectives[c.id] ? (ALL_ELECTIVE_POOL[c.elective || "IS_SCIT_EXT"]?.find(e => e.id === pickedElectives[c.id])?.credits || c.credits) : c.credits), 0);
  const totalCr = allCoursesWithExtra.reduce((s, c) => s + c.credits, 0);
  const progress = Math.round((completedCr / totalCr) * 100);
  const gpa = calcGPA(states, grades, allCoursesWithExtra);
  const unlockedList = COURSES.filter(c => states[c.id] === "available" && !c.elective);

  const allSems = [1, 2, 3, 4].flatMap(lv => [1, 2].map(sm => {
    const base = COURSES.filter(c => c.level === lv && c.sem === sm);
    const extras = (extraElecSlots || [])
      .filter(e => e.level === lv && e.sem === sm)
      .map(e => ({ id: e.id, name: e.label, credits: 3, prereqs: [], coreqs: [], level: lv, sem: sm, elective: e.pool || "IS_SCIT_EXT", _extra: true }));
    return { level: lv, sem: sm, label: `Year ${lv} · Semester ${sm}`, courses: [...base, ...extras] };
  }));

  // ── EXPORT / IMPORT / PRINT ─ robust against sandboxed iframes
  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.rel = "noopener";
    a.style.display = "none";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  };

  const exportData = () => {
    try {
      const blob = new Blob([JSON.stringify({ slots, currentSlot }, null, 2)], { type: "application/json" });
      triggerDownload(blob, "utech_cis_plan.json");
    } catch (err) {
      alert("Export failed: " + err.message);
    }
  };

  const importData = () => {
    const input = document.createElement("input");
    input.type = "file"; input.accept = ".json,application/json";
    input.onchange = e => {
      const file = e.target.files[0]; if (!file) return;
      const r = new FileReader();
      r.onload = ev => {
        try {
          const d = JSON.parse(ev.target.result);
          if (d.slots) {
            setSlots(d.slots.map(s => ({
              ...defaultSlot(s.name, s.trackId || "da"), ...s,
              states: computeStates(s.states || {}, TRACK_DATA[s.trackId || "da"].courses),
            })));
            setCurrentSlot(d.currentSlot || 0);
          }
        } catch (err) { alert("Import failed: " + err.message); }
      };
      r.readAsText(file);
    };
    input.click();
  };

  const printPlan = () => {
    const rows = allCoursesWithExtra.map(c => {
      const pi = pickedElectives[c.id] ? ALL_ELECTIVE_POOL[c.elective || "IS_SCIT_EXT"]?.find(e => e.id === pickedElectives[c.id]) : null;
      const code = pi ? pi.id : c.id;
      const name = pi ? pi.name : c.name;
      return `Y${c.level}S${c.sem}  ${code.padEnd(16)}${name.padEnd(48)}${c.credits}cr  ${(states[c.id] || "").padEnd(14)}${grades[c.id] || ""}`;
    }).join("\n");

    const html = `<!doctype html><html><head><title>UTech CIS Plan</title>
<style>body{font:12px/1.7 ui-monospace,Menlo,Consolas,monospace;color:#111;padding:24px;background:#fff}h1{font:600 16px sans-serif;margin:0 0 4px}small{color:#666}pre{white-space:pre-wrap}</style>
</head><body>
<h1>UTech Jamaica — BSc CIS · ${TRACK_DATA[track].label}</h1>
<small>${studentName ? "Student: " + studentName + "  " : ""}${studentId ? "ID: " + studentId : ""}${startYear ? "  Start: " + startYear : ""}</small>
<p><b>GPA:</b> ${gpa || "N/A"} &nbsp; <b>Credits:</b> ${completedCr}/${totalCr} (${progress}%)</p>
<pre>${"─".repeat(90)}
Y.S   Code              Name                                              Cr    Status        Grade
${"─".repeat(90)}
${rows}</pre>
<script>window.onload=function(){setTimeout(function(){window.print();},250);};</script>
</body></html>`;

    // Try popup first
    let w = null;
    try { w = window.open("", "_blank"); } catch {}
    if (w && w.document) {
      w.document.open(); w.document.write(html); w.document.close();
      return;
    }
    // Fallback: hidden iframe print
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0"; iframe.style.bottom = "0";
    iframe.style.width = "0"; iframe.style.height = "0"; iframe.style.border = "0";
    document.body.appendChild(iframe);
    const doc = iframe.contentWindow.document;
    doc.open(); doc.write(html); doc.close();
    iframe.onload = () => {
      try { iframe.contentWindow.focus(); iframe.contentWindow.print(); } catch {}
      setTimeout(() => document.body.removeChild(iframe), 1000);
    };
  };

  // Render a semester block
  const renderSem = (semObj) => {
    const inProg = semObj.courses.filter(c => states[c.id] === "in-progress").reduce((s, c) => s + c.credits, 0);
    const active = semObj.courses.filter(c => states[c.id] === "in-progress" || states[c.id] === "completed").reduce((s, c) => s + c.credits, 0);
    const warn = inProg > MAX_SEM_CREDITS;
    return (
      <div key={`${semObj.level}-${semObj.sem}`}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 10, color: T.textMute, letterSpacing: 2, textTransform: "uppercase" }}>Semester {semObj.sem}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 9 }}>
            {warn && <span style={{ color: T.red, fontWeight: 600 }} title="Over 18 credits in-progress">⚠ overload</span>}
            <span style={{ color: active > 0 ? T.gold : T.textMute }}>{active}cr active</span>
            <div style={{ width: 36, height: 3, background: T.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${Math.min(100, (inProg / MAX_SEM_CREDITS) * 100)}%`, background: warn ? T.red : T.accent, borderRadius: 2 }} />
            </div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {semObj.courses.map(course => (
            <CourseCard key={course.id} course={course} state={states[course.id] || "available"}
              grade={grades[course.id]} onCycle={cycleState} onGrade={setGrade}
              onElectivePick={openElectiveModal} pickedElectives={pickedElectives}
              states={states} flash={flashId === course.id}
              onRemoveExtra={course._extra ? removeExtraSlot : null} />
          ))}
        </div>
        <button
          onClick={() => addExtraElecSlot(semObj.level, semObj.sem)}
          style={{
            marginTop: 7, width: "100%", padding: "5px 0",
            background: "transparent", border: `1.5px dashed ${T.border}`,
            color: T.textMute, borderRadius: 6, cursor: "pointer",
            fontSize: 10, fontFamily: "'DM Mono', monospace",
            transition: "all 0.13s",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accentHi; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMute; }}>
          + add elective slot
        </button>
      </div>
    );
  };

  // Track switcher — uses safeConfirm
  const switchTrackForSlot = (newTrack) => {
    if (!safeConfirm(`Switch to ${TRACK_DATA[newTrack].label}? Course states will reset for this plan.`)) return;
    updateSlot(() => ({
      ...defaultSlot(slot.name, newTrack),
      studentName: slot.studentName,
      studentId: slot.studentId,
      startYear: slot.startYear,
    }));
  };

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Mono', 'Courier New', monospace", color: T.text, paddingBottom: 80 }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Syne:wght@600;700;800&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-track { background: ${T.bg}; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: ${T.borderHi}; }
        .cis-card { transition: all 0.15s ease; }
        .cis-card:hover:not(.locked) { transform: translateY(-2px); box-shadow: 0 4px 18px rgba(107,138,255,0.18); }
        .cis-card.locked { opacity: 0.45; }
        .cis-card.flash { animation: pop 0.55s ease; }
        @keyframes pop { 0%{transform:scale(1)} 35%{transform:scale(1.04)} 100%{transform:scale(1)} }
        .cis-btn { background:${T.bgElev2}; border:1.5px solid ${T.border}; color:${T.textDim}; font-family:'DM Mono',monospace;
          font-size:11px; padding:6px 13px; cursor:pointer; border-radius:5px;
          transition:all 0.13s; white-space:nowrap; }
        .cis-btn:hover { background:#1a2540; color:${T.accentHi}; border-color:${T.accent}; }
        .cis-btn.on { background:#16203a; color:${T.accentHi}; border-color:${T.accent}; }
        .cis-tab { background:transparent; border:none; border-bottom:2.5px solid transparent;
          color:${T.textMute}; font-family:'DM Mono',monospace; font-size:11px;
          padding:9px 18px; cursor:pointer; transition:all 0.13s; }
        .cis-tab.on { color:${T.accentHi}; border-bottom-color:${T.accent}; }
        .cis-tab:hover:not(.on) { color:${T.text}; }
        select, input { outline:none; }
        select option { background: ${T.bgElev}; color: ${T.text}; }
        ::placeholder { color: ${T.textMute}; }
        @media(max-width:600px) { .semgrid { grid-template-columns:1fr!important } }
      `}</style>

      {/* HEADER */}
      <div style={{ background: T.bgElev, borderBottom: `1px solid ${T.border}`, padding: "18px 20px 14px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 1px 8px rgba(0,0,0,0.4)" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 14 }}>
            <div>
              <div style={{ fontSize: 9, letterSpacing: 3, color: T.accent, textTransform: "uppercase", marginBottom: 3, opacity: 0.8 }}>
                University of Technology, Jamaica · SCIT
              </div>
              <div style={{ fontFamily: "'Syne', sans-serif", fontSize: 20, fontWeight: 800, lineHeight: 1.15, color: T.text }}>
                BSc CIS · <span style={{ color: T.gold }}>{TRACK_DATA[track].label}</span>
              </div>
            </div>

            <div style={{ display: "flex", gap: 20, alignItems: "flex-end" }}>
              {gpa && (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: 26, fontWeight: 300, color: T.accentHi, lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>{gpa}</div>
                  <div style={{ fontSize: 9, color: T.textMute, letterSpacing: 2, marginTop: 2 }}>GPA</div>
                </div>
              )}
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 28, fontWeight: 300, color: T.text, lineHeight: 1, fontFamily: "'Syne',sans-serif" }}>{progress}%</div>
                <div style={{ fontSize: 9, color: T.textMute, letterSpacing: 2, marginTop: 3 }}>{completedCr}/{totalCr} CREDITS</div>
                <div style={{ width: 150, marginTop: 6, height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg,${T.gold},${T.goldHi})`, borderRadius: 2, transition: "width 0.4s" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Student info + track switcher */}
          <div style={{ display: "flex", gap: 8, marginTop: 13, flexWrap: "wrap", alignItems: "center" }}>
            <input placeholder="Student Name" value={studentName || ""}
              onChange={e => updateSlot(() => ({ studentName: e.target.value }))}
              style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: 11, padding: "5px 10px", borderRadius: 4, fontFamily: "'DM Mono',monospace", width: 170 }} />
            <input placeholder="Student ID" value={studentId || ""}
              onChange={e => updateSlot(() => ({ studentId: e.target.value }))}
              style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: 11, padding: "5px 10px", borderRadius: 4, fontFamily: "'DM Mono',monospace", width: 120 }} />
            <input placeholder="Start Year" value={startYear || ""}
              onChange={e => updateSlot(() => ({ startYear: e.target.value }))}
              style={{ background: T.inputBg, border: `1px solid ${T.border}`, color: T.text, fontSize: 11, padding: "5px 10px", borderRadius: 4, fontFamily: "'DM Mono',monospace", width: 90 }} />

            <div style={{ display: "flex", background: T.inputBg, border: `1px solid ${T.border}`, borderRadius: 5, overflow: "hidden", marginLeft: 4 }}>
              {Object.entries(TRACK_DATA).map(([k]) => (
                <button key={k}
                  type="button"
                  onClick={() => { if (track !== k) switchTrackForSlot(k); }}
                  style={{
                    background: track === k ? T.accent : "transparent",
                    border: "none", color: track === k ? "#fff" : T.textDim,
                    fontFamily: "'DM Mono',monospace", fontSize: 10,
                    padding: "5px 12px", cursor: "pointer", transition: "all 0.13s",
                    fontWeight: track === k ? 600 : 400,
                  }}>
                  {k === "da" ? "Data Analytics" : "Tech. Entrep."}
                </button>
              ))}
            </div>
          </div>

          {/* Status legend */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
            {Object.entries(STATUS_META).map(([k, v]) => (
              <div key={k} style={{
                fontSize: 9, padding: "2px 9px", borderRadius: 20,
                background: v.bg, color: v.text, border: `1.5px solid ${v.border}`,
                letterSpacing: 1, textTransform: "uppercase",
              }}>{v.label}</div>
            ))}
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
            <button type="button" className="cis-btn" onClick={() => setShowPlansModal(true)}>⊞ Plans ({slots.length})</button>
            <button type="button" className={`cis-btn${showUnlocked ? " on" : ""}`} onClick={() => setShowUnlocked(v => !v)}>◈ Available ({unlockedList.length})</button>
            <button type="button" className="cis-btn" onClick={exportData}>↑ Export</button>
            <button type="button" className="cis-btn" onClick={importData}>↓ Import</button>
            <button type="button" className="cis-btn" onClick={printPlan}>⎙ Print</button>
            <button type="button" className="cis-btn" style={{ color: T.red, borderColor: "#5a2020" }}
              onClick={() => { if (safeConfirm("Reset all progress in this plan?")) updateSlot(() => ({ ...defaultSlot(slot.name, track), studentName: slot.studentName, studentId: slot.studentId, startYear: slot.startYear })); }}>
              ⟳ Reset
            </button>
          </div>
        </div>
      </div>

      {/* AVAILABLE PANEL */}
      {showUnlocked && (
        <div style={{ background: "#1a1810", borderBottom: `1px solid #4a3a18`, padding: "10px 20px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ fontSize: 9, color: T.gold, letterSpacing: 3, textTransform: "uppercase", marginBottom: 7 }}>
              Modules you can enrol in right now
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {unlockedList.length === 0
                ? <span style={{ fontSize: 11, color: T.textMute }}>None yet — complete prerequisites to unlock more.</span>
                : unlockedList.map(c => (
                  <div key={c.id} style={{
                    background: "#2a2110", border: `1px solid #5a4520`,
                    borderRadius: 5, padding: "4px 11px", fontSize: 11, color: T.goldHi,
                  }}>
                    <span style={{ opacity: 0.6, marginRight: 5 }}>{c.id}</span>{c.name}
                    <span style={{ color: T.textMute, marginLeft: 6 }}>({c.credits}cr)</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* VIEW TABS */}
      <div style={{ background: T.bgElev, borderBottom: `1px solid ${T.border}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto", display: "flex" }}>
          <button type="button" className={`cis-tab${view === "full" ? " on" : ""}`} onClick={() => setView("full")}>Full Plan</button>
          <button type="button" className={`cis-tab${view === "semester" ? " on" : ""}`} onClick={() => setView("semester")}>Semester Focus</button>
        </div>
      </div>

      {/* BODY */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "24px 16px 0" }}>

        {view === "semester" && (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              <button type="button" className="cis-btn" disabled={focusIdx === 0} onClick={() => setFocusIdx(i => Math.max(0, i - 1))} style={{ opacity: focusIdx === 0 ? 0.3 : 1 }}>←</button>
              <div style={{ flex: 1, textAlign: "center", fontSize: 13, color: T.accentHi, fontFamily: "'Syne',sans-serif", fontWeight: 700 }}>{allSems[focusIdx]?.label}</div>
              <button type="button" className="cis-btn" disabled={focusIdx === allSems.length - 1} onClick={() => setFocusIdx(i => Math.min(allSems.length - 1, i + 1))} style={{ opacity: focusIdx === allSems.length - 1 ? 0.3 : 1 }}>→</button>
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 7, marginBottom: 22, flexWrap: "wrap" }}>
              {allSems.map((s, i) => (
                <button key={i} type="button" onClick={() => setFocusIdx(i)} title={s.label}
                  style={{
                    width: 10, height: 10, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0,
                    background: i === focusIdx ? T.gold : s.courses.every(c => states[c.id] === "completed") ? T.green : T.border,
                    transition: "background 0.15s",
                  }} />
              ))}
            </div>
            <div style={{ maxWidth: 480, margin: "0 auto" }}>
              {renderSem(allSems[focusIdx])}
            </div>
          </>
        )}

        {view === "full" && [1, 2, 3, 4].map(lv => {
          const lvSems = allSems.filter(s => s.level === lv);
          const lvDone = lvSems.flatMap(s => s.courses).filter(c => states[c.id] === "completed").reduce((s, c) => s + c.credits, 0);
          const lvTotal = lvSems.flatMap(s => s.courses).reduce((s, c) => s + c.credits, 0);
          const yearLabels = ["", "Foundations", "Core Systems", `${TRACK_DATA[track].label} Major`, `${TRACK_DATA[track].label} Major (Final)`];
          return (
            <div key={lv} style={{ marginBottom: 44 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 10, fontWeight: 800, letterSpacing: 3, color: T.gold, textTransform: "uppercase" }}>
                  Year {lv}
                </div>
                <div style={{ fontSize: 11, color: T.textDim }}>{yearLabels[lv]}</div>
                <div style={{ flex: 1, height: 1, background: T.border }} />
                <div style={{ fontSize: 9, color: T.textMute }}>{lvDone}/{lvTotal}cr</div>
              </div>
              <div className="semgrid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
                {lvSems.map(s => renderSem(s))}
              </div>
            </div>
          );
        })}

        <div style={{ marginTop: 8, padding: "13px 16px", background: T.bgElev, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 10, color: T.textDim, lineHeight: 1.9 }}>
          <strong style={{ color: T.text }}>How to use</strong> — Click any available module to cycle: Available → In Progress → Completed.
          Locked modules show missing prerequisites on hover. Elective slots let you choose from the IS, SCIT, External, or University catalogue.
          Use <strong style={{ color: T.text }}>+ add elective slot</strong> in any semester to track additional electives — then press <em>+ pick elective</em> on the new card to choose one.
          Enter letter grades on completed modules to calculate your cumulative GPA.
          ⚠ warns if in-progress credits exceed 18. Use Plans to maintain alternate degree paths.
        </div>
      </div>

      {/* MODALS */}
      {electiveModal && (
        <ElectivePicker
          slotId={electiveModal.slotId}
          slotLabel={electiveModal.slotLabel}
          poolKey={electiveModal.poolKey}
          onClose={() => setElectiveModal(null)}
          onPick={pickElective}
          pickedElectives={pickedElectives}
          states={states}
        />
      )}

      {showPlansModal && (
        <PlansModal
          slots={slots}
          current={currentSlot}
          onSwitch={i => { setCurrentSlot(i); setShowPlansModal(false); }}
          onNew={() => {
            const name = safePrompt("Name for new plan:", `Plan ${String.fromCharCode(65 + slots.length)}`);
            if (!name) { setShowPlansModal(false); return; }
            const trackChoice = safePrompt("Track? (da = Data Analytics, te = Technology Entrepreneurship)", "da");
            const t = ["da", "te"].includes(trackChoice) ? trackChoice : "da";
            setSlots(p => [...p, defaultSlot(name, t)]);
            setCurrentSlot(slots.length);
            setShowPlansModal(false);
          }}
          onDelete={i => {
            if (!safeConfirm("Delete this plan?")) return;
            setSlots(p => p.filter((_, j) => j !== i));
            setCurrentSlot(c => Math.max(0, Math.min(c, slots.length - 2)));
          }}
          onClose={() => setShowPlansModal(false)}
        />
      )}
    </div>
  );
}
