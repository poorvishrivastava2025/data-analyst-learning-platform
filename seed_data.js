// seed_data.js - Complete 18-Course Data Analyst Learning Curriculum
// Substantial, original educational content with bilingual English & Hindi/Hinglish support
const { expandedLessonsData } = require('./lessons_expanded_data');
const { questionsData } = require('./questions_bank_data');

const coursesData = [
  {
    id: "computer-setup",
    slug: "computer-setup",
    title: "Computer & Programming Foundations: Environment Setup for Windows & macOS",
    title_hi: "कंप्यूटर और प्रोग्रामिंग बेसिक्स: विंडोज और मैक सेटअप (Computer Foundations)",
    domain: "Developer Environment",
    level: "Beginner",
    icon: "terminal",
    estimated_hours: 10,
    order_idx: 1,
    prerequisites: "None. Open to anyone with a Windows 10/11 or macOS computer.",
    description: "Prepare your computer for professional data analysis: terminal/PowerShell mastery, installing Python 3.12+, configuring Visual Studio Code, virtual environments (venv), pip package management, PATH troubleshooting, and database clients.",
    description_hi: "अपने लैपटॉप को डेटा एनालिसिस के लिए तैयार करें: Windows PowerShell और macOS Terminal, Python 3.12+ सही तरीके से इंस्टॉल करना, VS Code सेटअप, वर्चुअल एनवायरनमेंट (venv), pip और PATH एरर्स को ठीक करना।",
    learning_objectives: [
      "Navigate file systems, folders, file extensions, and permissions using Windows PowerShell and macOS zsh.",
      "Install and update Python on Windows and macOS using official current releases, ensuring PATH registration.",
      "Install, configure, and customize Visual Studio Code with the official Python extension.",
      "Create, activate, and manage isolated virtual environments (venv) and install packages with pip.",
      "Troubleshoot common setup pitfalls: 'command not found', execution policy restrictions, interpreter mismatch, and PATH errors.",
      "Install cross-platform database clients (DBeaver, SQLite CLI) and connect to local data sources."
    ],
    final_project_teaser: "Initialize a reproducible Data Analyst workspace: virtual environment, requirements.txt, sample script, and DBeaver SQLite connection."
  },
  {
    id: "foundations",
    slug: "foundations",
    title: "Data Analysis Foundations & The Analyst Role",
    title_hi: "डेटा एनालिसिस बेसिक्स और एनालिस्ट का रोल (Data Foundations)",
    domain: "Core Foundations",
    level: "Beginner",
    icon: "compass",
    estimated_hours: 12,
    order_idx: 2,
    prerequisites: "None. Open for absolute beginners and non-technical career switchers.",
    description: "Understand the end-to-end data lifecycle, analyst vs scientist vs engineer distinctions, metrics vs dimensions, and the SMART problem-framing framework.",
    description_hi: "डेटा एनालिस्ट का काम क्या होता है, डेटा लाइफसाइकिल कैसे काम करता है, बिजनेस प्रॉब्लम को डेटा मैट्रिक्स में कैसे बदलें, और इस फील्ड में करियर कैसे बनाएं।",
    learning_objectives: [
      "Understand the end-to-end data lifecycle: Ingestion, Cleaning, EDA, Modeling, Presentation.",
      "Differentiate between Data Analyst, Data Scientist, and Data Engineer roles and toolsets.",
      "Frame business problems using the SMART and Issue-Tree frameworks.",
      "Distinguish between quantitative vs qualitative data, and metrics vs dimensions.",
      "Learn how modern companies make revenue and cut costs through data-driven decisions."
    ],
    final_project_teaser: "Create a 1-page Business Problem Framing Document (BRD) analyzing why an online grocery platform experienced a 20% drop in cart conversions."
  },
  {
    id: "statistics",
    slug: "statistics",
    title: "Basic Statistics & Probability for Analysts",
    title_hi: "स्टैटिस्टिक्स और प्रोबेबिलिटी (Basic Statistics & Probability)",
    domain: "Mathematics & Statistics",
    level: "Beginner",
    icon: "bar-chart-2",
    estimated_hours: 16,
    order_idx: 2,
    prerequisites: "Basic arithmetic (percentages, averages, ratios).",
    description: "Master descriptive and inferential statistics: mean vs median, variance, normal distribution, standard deviation, p-values, hypothesis testing, and correlation vs causation.",
    description_hi: "डेटा का सही मतलब समझें: Mean, Median, Mode, Standard Deviation, Normal Distribution, A/B Testing, p-value और Correlation vs Causation आसान भाषा में।",
    learning_objectives: [
      "Calculate and interpret measures of central tendency (Mean, Median, Mode) and dispersion (Variance, Std Dev, IQR).",
      "Understand distributions: Normal distribution, 68-95-99.7 empirical rule, Skewness, and Kurtosis.",
      "Grasp Probability basics, conditional probability, and expected value.",
      "Execute Hypothesis Testing: Null vs Alternative hypotheses, Type I / Type II errors, and p-value significance.",
      "Identify sampling biases and distinguish correlation from causation in real business metrics."
    ],
    final_project_teaser: "Perform an A/B Test Statistical Significance Report comparing two checkout page designs for an e-commerce platform."
  },
  {
    id: "excel",
    slug: "excel",
    title: "Excel: Zero to Advanced for Data Analysts",
    title_hi: "एक्सेल: जीरो से एडवांस्ड (Excel Zero to Advanced)",
    domain: "Spreadsheets",
    level: "Beginner to Advanced",
    icon: "file-spreadsheet",
    estimated_hours: 24,
    order_idx: 3,
    prerequisites: "Basic computer familiarity.",
    description: "From basic navigation to XLOOKUP, INDEX/MATCH, SUMIFS, Pivot Tables, conditional formatting, nested logic, Power Query ETL, and executive KPI modeling.",
    description_hi: "एक्सेल में एक्सपर्ट बनें: VLOOKUP/XLOOKUP, SUMIFS, Pivot Tables, Conditional Formatting, Power Query और डायनामिक डैशबोर्ड बनाना सीखें।",
    learning_objectives: [
      "Navigate Excel fluently with keyboard shortcuts and clean spreadsheet design principles.",
      "Master modern lookup functions: XLOOKUP, INDEX/MATCH, nested IFs, and switch logic.",
      "Aggregate multidimensional business data using SUMIFS, COUNTIFS, and AVERAGEIFS.",
      "Build dynamic, sliced Pivot Tables and Pivot Charts with custom calculated fields.",
      "Use Power Query to import, transform, unpivot, and merge multi-file datasets automatically."
    ],
    final_project_teaser: "Build an Automated Monthly Sales & Margin KPI Workbook with dynamic slicers and executive summary."
  },
  {
    id: "sql",
    slug: "sql",
    title: "SQL: Zero to Advanced for Relational Databases",
    title_hi: "एसक्यूएल: जीरो से एडवांस्ड (SQL Zero to Advanced)",
    domain: "Databases & Querying",
    level: "Beginner to Advanced",
    icon: "database",
    estimated_hours: 32,
    order_idx: 4,
    prerequisites: "None. Direct hands-on querying from lesson one.",
    description: "Write production-grade SQL queries: SELECT, WHERE, GROUP BY, multi-table JOINs, subqueries, Common Table Expressions (CTEs), and Window Functions.",
    description_hi: "डेटाबेस से डेटा निकालना सीखें: SELECT, WHERE, JOINs (Inner, Left, Full), Group By, Having, Subqueries, CTEs (WITH) और Window Functions (RANK, ROW_NUMBER, LAG, LEAD)।",
    learning_objectives: [
      "Understand relational schema design, primary keys, foreign keys, and normalization.",
      "Filter, sort, and aggregate transactional data using WHERE, GROUP BY, and HAVING.",
      "Join multiple tables using INNER, LEFT, RIGHT, and FULL OUTER joins.",
      "Structure modular, readable queries using CTEs (Common Table Expressions) and subqueries.",
      "Harness Window Functions (ROW_NUMBER, DENSE_RANK, LEAD, LAG) for cohort and running total analysis."
    ],
    final_project_teaser: "Perform an End-to-End Customer Retention and Order Funnel SQL Audit on a multi-table database."
  },
  {
    id: "python",
    slug: "python",
    title: "Python for Data Analysis: Pandas, NumPy & Wrangling",
    title_hi: "पायथन फॉर डेटा एनालिसिस (Python for Data Analysis)",
    domain: "Programming",
    level: "Beginner to Advanced",
    icon: "code",
    estimated_hours: 36,
    order_idx: 5,
    prerequisites: "Logical thinking and basic math.",
    description: "Learn Python fundamentals, Pandas DataFrames, NumPy vectorization, data cleaning, filtering, grouping, merging, and exploratory data analysis (EDA).",
    description_hi: "पायथन और पांडास सीखें: DataFrames, Data Manipulation, Missing Values Handle करना, Groupby Aggregations, और डेटा से पैटर्न्स खोजना।",
    learning_objectives: [
      "Master Python data structures: lists, dicts, tuples, sets, and list comprehensions.",
      "Load, inspect, slice, and filter datasets using Pandas DataFrames and Series.",
      "Handle missing values (NaNs), duplicates, and incorrect data types systematically.",
      "Perform high-performance grouped aggregations and multi-key joins in Pandas.",
      "Conduct Exploratory Data Analysis (EDA) to uncover trends, outliers, and distributions."
    ],
    final_project_teaser: "Conduct a complete Exploratory Data Analysis (EDA) on an e-commerce transactions dataset with automated summary reports."
  },
  {
    id: "data-cleaning",
    slug: "data-cleaning",
    title: "Data Cleaning, Preparation & Quality Assurance",
    title_hi: "डेटा क्लीनिंग और प्रेपरेशन (Data Cleaning & Quality)",
    domain: "Data Wrangling",
    level: "Intermediate",
    icon: "check-circle",
    estimated_hours: 18,
    order_idx: 6,
    prerequisites: "Excel basics or SQL / Python familiarity.",
    description: "Industry data is 80% dirty. Learn outlier detection with IQR, string parsing with regex, missing value imputation, type casting, and schema validation.",
    description_hi: "कच्चे और गंदे डेटा को क्लीन करना सीखें: Outliers पहचानना, Regex से टेक्स्ट क्लीनिंग, Missing Values भरना और Data Integrity Checks लगाना।",
    learning_objectives: [
      "Detect and treat missing data via domain-appropriate imputation (mean, median, forward fill, or deletion).",
      "Identify univariate and multivariate outliers using IQR (Interquartile Range) and Z-score methods.",
      "Standardize messy text, date formats, phone numbers, and inconsistent categorical entries.",
      "Detect and deduplicate exact and fuzzy record matches across datasets.",
      "Establish automated Data Quality Assurance (QA) rule checklists before analysis."
    ],
    final_project_teaser: "Clean a corrupted real-world customer CRM and transaction dataset and generate an Audit Quality Certificate."
  },
  {
    id: "visualization",
    slug: "visualization",
    title: "Data Visualization & Storytelling for Stakeholders",
    title_hi: "डेटा विज़ुअलाइज़ेशन और स्टोरीटेलिंग (Data Visualization & Storytelling)",
    domain: "Business Intelligence",
    level: "Beginner to Intermediate",
    icon: "pie-chart",
    estimated_hours: 15,
    order_idx: 7,
    prerequisites: "Data analysis foundations.",
    description: "Choose the right chart for the right question, apply pre-attentive attributes, declutter visuals, and present data stories that drive executive decisions.",
    description_hi: "डेटा से सही कहानी कहना सीखें: कौन सा चार्ट कब यूज़ करें, कलर्स और लेआउट के नियम, और बॉसेज/क्लाइंट्स को इम्प्रेस करने वाली प्रेजेंटेशन्स।",
    learning_objectives: [
      "Select optimal chart types (Bar, Line, Scatter, Heatmap, Waterfall) according to data relationships.",
      "Apply cognitive load reduction: eliminate chartjunk, optimize gridlines, and maximize data-to-ink ratio.",
      "Leverage pre-attentive attributes (color, size, position) to direct stakeholder attention to key insights.",
      "Structure analytical presentations using the Situation-Complication-Resolution (SCR) framework.",
      "Write executive summaries that link metrics to concrete business dollar impacts."
    ],
    final_project_teaser: "Redesign a cluttered, confusing 10-chart corporate deck into a 2-page compelling executive decision story."
  },
  {
    id: "bi-tools",
    slug: "bi-tools",
    title: "Power BI & Tableau: Dashboards & Business Intelligence",
    title_hi: "पावर बीआई और टैब्लू (Power BI & Tableau Mastery)",
    domain: "Business Intelligence",
    level: "Intermediate",
    icon: "layout",
    estimated_hours: 28,
    order_idx: 8,
    prerequisites: "Excel formulas and basic data modeling concepts.",
    description: "Star Schema data modeling, DAX measures (CALCULATE, RELATED, SUMX), Tableau calculated fields, Level of Detail (LOD) expressions, parameters, and live executive reports.",
    description_hi: "Power BI और Tableau सीखें: Star Schema रिलेशनशिप्स, DAX फॉर्मूले (CALCULATE, SUMX), Tableau LODs, और लाइव इंटरएक्टिव रिपोर्ट्स बनाना।",
    learning_objectives: [
      "Extract, transform, and clean disparate tables using Power Query M transformations.",
      "Build dimensional models: Fact tables, Dimension tables, Star Schema, and active/inactive relationships.",
      "Master essential DAX measures: implicit vs explicit measures, CALCULATE, FILTER, RELATED, and Time Intelligence.",
      "Master Tableau Dimensions vs Measures, Marks cards, and Level of Detail (LOD) expressions (FIXED, INCLUDE).",
      "Publish, configure row-level security (RLS), and schedule auto-refresh on cloud reporting workspaces."
    ],
    final_project_teaser: "Design a complete Retail Executive Performance Dashboard in Power BI with YoY growth, margin waterfalls, and drill-through pages."
  },
  {
    id: "business-analysis",
    slug: "business-analysis",
    title: "Business Analysis & Requirements Gathering",
    title_hi: "बिजनेस एनालिसिस और रिक्वायरमेंट्स गैदरिंग (Business Analysis)",
    domain: "Business Consulting",
    level: "Intermediate",
    icon: "briefcase",
    estimated_hours: 14,
    order_idx: 9,
    prerequisites: "Foundations of data analysis.",
    description: "Bridge the gap between business leaders and data engineers: authoring BRDs, scoping PRDs, elicitation interviews, KPI tree structuring, and scope creep management.",
    description_hi: "बिजनेस और टेक टीमों के बीच पुल बनें: रिक्वायरमेंट्स डॉक्यूमेंट (BRD) लिखना, स्टेकहोल्डर्स से सही सवाल पूछना, और KPI ट्री बनाना।",
    learning_objectives: [
      "Conduct stakeholder elicitation interviews without using intimidating technical jargon.",
      "Author Business Requirements Documents (BRD) and Data Dictionary specifications.",
      "Prevent scope creep through change-request workflows and priority matrices (MoSCoW).",
      "Translate ambiguous business questions into measurable analytical metrics and SLAs.",
      "Structure KPI trees linking leading operational indicators to lagging financial outcomes."
    ],
    final_project_teaser: "Author a comprehensive BRD & Metric Specification Document for a Chief Marketing Officer's new attribution dashboard."
  },
  {
    id: "jira-azure-bpmn",
    slug: "jira-azure-bpmn",
    title: "Jira, Azure Basics & BPMN Process Mapping",
    title_hi: "जीरा, एज्योर और प्रोसेस मैपिंग (Jira, Azure & BPMN)",
    domain: "Agile & Process Optimization",
    level: "Intermediate",
    icon: "trello",
    estimated_hours: 14,
    order_idx: 10,
    prerequisites: "None.",
    description: "Agile and Scrum workflows for data teams: user stories with Gherkin acceptance criteria, sprint planning, Jira & Azure DevOps boards, plus BPMN 2.0 swimlane workflow mapping.",
    description_hi: "कंपनियों में काम करने का तरीका: Agile/Scrum क्या है, Jira टिकट्स कैसे बनते हैं, यूजर स्टोरीज कैसे लिखें, और BPMN प्रोसेस फ्लोचार्ट्स कैसे बनाएं।",
    learning_objectives: [
      "Understand Agile principles, Scrum roles (Product Owner, Scrum Master, Analyst), and daily standup rituals.",
      "Write data user stories with Acceptance Criteria (Given-When-Then format).",
      "Manage sprint backlogs, Kanban boards, and estimate tasks using story points.",
      "Master standard BPMN 2.0 notation: Events, Activities, Gateways, Pools, and Swimlanes.",
      "Chart current-state ('As-Is') workflows to pinpoint operational bottlenecks, and design optimized 'To-Be' solutions."
    ],
    final_project_teaser: "Map an 'As-Is' Loan Approval Process of a bank, identify the 3-day bottleneck, and design the optimized 'To-Be' workflow."
  },
  {
    id: "tech-communication",
    slug: "tech-communication",
    title: "Technical Communication & Presenting Findings",
    title_hi: "टेक्निकल कम्युनिकेशन और प्रेजेंटेशन (Technical Communication)",
    domain: "Communication & Leadership",
    level: "Intermediate",
    icon: "message-square",
    estimated_hours: 12,
    order_idx: 11,
    prerequisites: "Data visualization basics.",
    description: "How to explain complex analytical models to non-technical leaders, structure 1-page executive memos (Minto Pyramid), handle tough questions, and speak with confidence.",
    description_hi: "बॉस और नॉन-टेक लोगों को डेटा समझाना: 1-पेज एग्जीक्यूटिव मेमो लिखना, Minto Pyramid स्ट्रक्चर, और मीटिंग्स में कॉन्फिडेंस से बोलना।",
    learning_objectives: [
      "Apply the Minto Pyramid Principle: Lead with the answer, group supporting insights, summarize with action items.",
      "Draft concise 1-page analytical executive memos for CEO / VP level.",
      "Translate statistical terms (p-value, standard deviation, R-squared) into business dollars and risks.",
      "Handle challenging executive objections and data ambiguity without defensive posturing.",
      "Design accessible visual presentation slides with high data-to-ink ratio."
    ],
    final_project_teaser: "Draft a 1-page Executive Decision Memo advising leadership on whether to expand into a new regional market based on cohort analysis."
  },
  {
    id: "soft-skills",
    slug: "soft-skills",
    title: "Soft Skills for Analysts: Critical Thinking & Teamwork",
    title_hi: "सॉफ्ट स्किल्स: क्रिटिकल थिंकिंग और टीमवर्क (Analyst Soft Skills)",
    domain: "Professional Development",
    level: "All Levels",
    icon: "users",
    estimated_hours: 10,
    order_idx: 12,
    prerequisites: "None.",
    description: "Cognitive biases in analysis (confirmation bias, survivorship bias), active listening, effective feedback, time management for ad-hoc requests, and cross-functional empathy.",
    description_hi: "सफल एनालिस्ट के मानवीय गुण: डेटा बायस से बचना, एक्टिव लिसनिंग, समय प्रबंधन, और डेवलपर्स व बिजनेस लीडर्स के साथ बेहतरीन तालमेल।",
    learning_objectives: [
      "Identify and counteract cognitive biases: confirmation bias, survivorship bias, and availability heuristic.",
      "Practice active listening to uncover the unstated business problem behind an ad-hoc data pull request.",
      "Triage urgent vs important data requests using the Eisenhower Matrix to protect deep-work focus time.",
      "Deliver constructive feedback and partner effectively across engineering, product, and sales teams.",
      "Develop analytical curiosity and resilience when data does not validate initial organizational hypotheses."
    ],
    final_project_teaser: "Conduct a Root Cause Analysis (5 Whys Framework) on a failed operational product rollout."
  },
  {
    id: "portfolio-projects",
    slug: "portfolio-projects",
    title: "Planning, Building & Presenting Portfolio Projects",
    title_hi: "पोर्टफोलियो प्रोजेक्ट्स: प्लानिंग और प्रेजेंटेशन (Portfolio Blueprint)",
    domain: "Career & Portfolio",
    level: "Intermediate to Advanced",
    icon: "folder",
    estimated_hours: 18,
    order_idx: 13,
    prerequisites: "Excel, SQL, or Python fundamentals.",
    description: "Step-by-step framework to pick high-signal datasets, avoid generic Titanic/Iris projects, structure problem statements, write compelling GitHub READMEs, and publish interactive web dashboards.",
    description_hi: "ऐसा पोर्टफोलियो बनाएं जिसे देखकर रिक्रूटर तुरंत कॉल करे: अनोखे डेटासेट्स चुनना, टाइटैनिक/आइरिस जैसे घिसे-पिटे प्रोजेक्ट्स से बचना, और इम्प्रेसिव README लिखना।",
    learning_objectives: [
      "Select unique, domain-relevant public datasets (e.g. logistics, healthcare, fin-tech) that prove business value.",
      "Structure portfolio projects using the 5-part architecture: Problem, Approach, Analysis, Insights, Business Impact.",
      "Author professional GitHub repository README files with architecture diagrams and reproducible instructions.",
      "Host and publish interactive web dashboards using Streamlit, Power BI Public, or Tableau Public.",
      "Record 2-minute video walkthrough demos showcasing communication and executive presence."
    ],
    final_project_teaser: "Complete the master documentation and architecture diagram for your primary capstone project ready for public hosting."
  },
  {
    id: "git-github",
    slug: "git-github",
    title: "GitHub & Version Control Basics for Data Analysts",
    title_hi: "गिट और गिटहब बेसिक्स (Git & GitHub for Analysts)",
    domain: "Developer Tools",
    level: "Beginner",
    icon: "git-commit",
    estimated_hours: 10,
    order_idx: 14,
    prerequisites: "Basic command line or terminal awareness.",
    description: "Git commands: init, add, commit, push, pull, branches, merge conflicts, pull requests, .gitignore, and hosting professional data portfolio repositories on GitHub.",
    description_hi: "कोड को सुरक्षित रखना और दुनिया को दिखाना: Git कमांड्स (commit, push, pull), ब्रांचेज, .gitignore, और GitHub प्रोफाइल को सजाना।",
    learning_objectives: [
      "Understand the difference between Git (local version control system) and GitHub (cloud collaboration platform).",
      "Execute the core Git workflow: git clone, git status, git add, git commit, and git push.",
      "Configure .gitignore files to protect API keys, database credentials, and huge CSV raw files from leaking.",
      "Create and merge feature branches, open Pull Requests, and resolve merge conflicts cleanly.",
      "Build a modern GitHub Profile README highlighting projects, technical stack badges, and analytical case studies."
    ],
    final_project_teaser: "Initialize a local Git repository, configure a robust .gitignore for data files, and push a polished portfolio repository to GitHub."
  },
  {
    id: "responsible-ai",
    slug: "responsible-ai",
    title: "Responsible Use of AI Tools, Prompting & Verification",
    title_hi: "AI टूल्स का सही उपयोग और प्रॉम्प्टिंग (Responsible AI & Prompting)",
    domain: "AI & Productivity",
    level: "Beginner to Intermediate",
    icon: "cpu",
    estimated_hours: 12,
    order_idx: 15,
    prerequisites: "None.",
    description: "Leverage AI (LLMs) effectively as a data analyst copilot: advanced prompt engineering, verifying SQL/Python output, preventing hallucinations, data privacy, and ethical AI safeguards.",
    description_hi: "AI को अपना स्मार्ट असिस्टेंट बनाएं: सही प्रॉम्प्ट्स लिखना, AI के कोड में गलतियां पकड़ना, डेटा प्राइवेसी का ध्यान रखना, और हॉलुसिनेशन से बचना।",
    learning_objectives: [
      "Craft high-performance prompts using Role-Task-Context-Format (RTCF) and Few-Shot prompting techniques.",
      "Use LLMs safely to accelerate SQL query drafting, regex construction, and Python error diagnosis.",
      "Rigorously audit and verify AI-generated analytical calculations against ground truth datasets to catch silent hallucinations.",
      "Enforce data privacy protocols: Never paste sensitive PII (Personally Identifiable Information) or proprietary corporate financials into public LLMs.",
      "Understand ethical AI considerations: algorithmic bias, fair lending/hiring metrics, and transparency."
    ],
    final_project_teaser: "Perform a Systematic Hallucination Audit on AI-generated SQL and statistical calculations, annotating 4 subtle logical errors."
  },
  {
    id: "career-search",
    slug: "career-search",
    title: "Resume, LinkedIn, Networking & Strategic Job Search",
    title_hi: "रेज़्यूमे, लिंक्डइन और जॉब सर्च रणनीति (Resume & Job Search)",
    domain: "Career & Interview",
    level: "All Levels",
    icon: "award",
    estimated_hours: 14,
    order_idx: 16,
    prerequisites: "Core analytical skills and at least 2 completed portfolio projects.",
    description: "ATS-optimized data analyst resume crafting (Google X-Y-Z formula), LinkedIn profile optimization, cold outreach templates that get responses, and salary negotiation strategies.",
    description_hi: "नौकरी पाने की सटीक रणनीति: ATS फ्रेंडली रेज़्यूमे बनाना, लिंक्डइन पर रिक्रूटर्स को आकर्षित करना, कोल्ड मैसेजिंग और सैलरी नेगोशिएशन।",
    learning_objectives: [
      "Transform resume bullet points using the Google X-Y-Z formula: 'Accomplished [X], as measured by [Y], by doing [Z]'.",
      "Format resumes for 100% ATS (Applicant Tracking System) readability without parsing errors.",
      "Optimize LinkedIn headline, summary, and featured sections with targeted analytical keywords.",
      "Draft personalized, high-conversion cold outreach messages to hiring managers and senior analysts.",
      "Navigate job offer negotiations: evaluate base salary, bonuses, benefits, and counter-offer scripts."
    ],
    final_project_teaser: "Craft your finalized 1-page ATS-tailored Data Analyst Resume and an optimized LinkedIn summary pitch."
  },
  {
    id: "interview-prep",
    slug: "interview-prep",
    title: "Technical, Business Case & Behavioral Interview Preparation",
    title_hi: "इंटरव्यू की पूरी तैयारी: टेक्निकल, केस स्टडी और बिहेवियरल",
    domain: "Career & Interview",
    level: "All Levels",
    icon: "target",
    estimated_hours: 20,
    order_idx: 17,
    prerequisites: "Completion of technical curriculum courses.",
    description: "Crack live technical SQL whiteboard rounds, Python coding screens, take-home case studies, product sense metrics, and behavioral interviews using the STAR method.",
    description_hi: "इंटरव्यू क्रैक करने के गुर: लाइव SQL कोडिंग राउंड, केस स्टडी सॉल्व करने का फ्रेमवर्क, और STAR मेथड से बेहतरीन उत्तर देना।",
    learning_objectives: [
      "Solve timed live SQL whiteboard challenges involving window functions, aggregations, and subqueries under interview pressure.",
      "Structure take-home analytical case studies with executive summaries, reproducible code, and clear visualizations.",
      "Tackle product-sense metric questions: 'How would you measure the success of Instagram Reels or Amazon Prime Delivery?'",
      "Deliver confident behavioral interview responses using the STAR (Situation, Task, Action, Result) method.",
      "Prepare insightful questions to ask interviewers that demonstrate strategic business thinking."
    ],
    final_project_teaser: "Participate in an interactive full-length Mock Interview assessing Technical SQL, Statistical reasoning, and Behavioral competency."
  }
];

// Rich Sample Lessons for Core Courses with Bilingual Content, Code, Pitfalls, & Exercises
const sampleLessonsData = [
  // --- SQL COURSE LESSON 1 ---
  {
    id: "sql-101",
    course_id: "sql",
    title: "SQL Foundations: SELECT, Filtering with WHERE & Sorting",
    title_hi: "एसक्यूएल की शुरुआत: SELECT, WHERE से फिल्टर और ORDER BY से सॉर्टिंग",
    slug: "sql-select-where-order",
    estimated_minutes: 25,
    order_idx: 1,
    content_en: `### What is SQL and Why Does Every Analyst Need It?

Structured Query Language (SQL) is the global standard language for interacting with relational database management systems (RDBMS) such as PostgreSQL, MySQL, SQL Server, Snowflake, BigQuery, and SQLite. 

As a Data Analyst, almost all high-value corporate data lives in relational databases. You will use SQL to query transactional tables, aggregate sales figures, filter user cohorts, and join fragmented data sources.

### The Fundamental Anatomy of a Query

Every basic SQL query follows a predictable syntax order:

\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1 ASC|DESC
LIMIT number_of_rows;
\`\`\`

#### 1. The SELECT Clause
The \`SELECT\` clause specifies which columns you want to retrieve.
- Retrieve all columns: \`SELECT * FROM customers;\` (Best avoided in large production tables!)
- Retrieve specific columns: \`SELECT full_name, email, city FROM customers;\`
- Renaming columns with Aliases: \`SELECT full_name AS customer_name FROM customers;\`

#### 2. The WHERE Clause
The \`WHERE\` clause filters rows before any aggregation takes place.
Common comparison operators:
- Equals: \`WHERE city = 'Mumbai'\`
- Not Equals: \`WHERE city != 'Delhi'\` or \`WHERE city <> 'Delhi'\`
- Greater / Less Than: \`WHERE total_amount >= 10000\`
- Range: \`WHERE order_date BETWEEN '2024-07-01' AND '2024-07-31'\`
- In a List: \`WHERE shipping_region IN ('West', 'South')\`
- Pattern Matching: \`WHERE full_name LIKE 'A%'\` (starts with A) or \`LIKE '%Sharma'\` (ends with Sharma)
- Boolean Logic: Combine conditions using \`AND\`, \`OR\`, and \`NOT\`. Always use parentheses when mixing \`AND\` and \`OR\`!

#### 3. The ORDER BY Clause
Sorts the returned records.
- \`ORDER BY total_amount DESC\` (High to low)
- \`ORDER BY city ASC, total_amount DESC\` (Sort by city alphabetically, then highest amount within each city).`,
    content_hi: `### SQL क्या है और डेटा एनालिस्ट के लिए क्यों जरूरी है?

SQL (Structured Query Language) डेटाबेस से बात करने की इंटरनेशनल भाषा है। चाहे कंपनी में PostgreSQL, MySQL, BigQuery या SQLite यूज़ हो रहा हो, डेटा निकालने का तरीका SQL ही है।

कंपनी का सारा डेटा (कस्टमर डिटेल्स, सेल्स, ऑर्डर्स, पेमेंट्स) डेटाबेस टेबल्स में स्टोर होता है। SQL सीखकर आप सीधे डेटाबेस से अपने सवालों के जवाब निकाल सकते हैं।

### बेसिक क्वेरी का ढांचा (Syntax)

\`\`\`sql
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1 DESC
LIMIT 10;
\`\`\`

#### 1. SELECT का मतलब: मुझे क्या देखना है?
- सब देखना है: \`SELECT * FROM customers;\`
- सिर्फ नाम और शहर देखना है: \`SELECT full_name, city FROM customers;\`
- कॉलम का नाम बदलना (Alias): \`SELECT full_name AS 'कस्टमर का नाम' FROM customers;\`

#### 2. WHERE का मतलब: किस शर्त (Condition) पर डेटा छांटना है?
- शहर मुंबई हो: \`WHERE city = 'Mumbai'\`
- अमाउंट 10,000 से ज्यादा हो: \`WHERE total_amount >= 10000\`
- खास रीजन में हो: \`WHERE shipping_region IN ('West', 'South')\`
- नाम A से शुरू हो: \`WHERE full_name LIKE 'A%'\`
- जब एक से ज्यादा शर्तें हों तो \`AND\` और \`OR\` का उपयोग करें।

#### 3. ORDER BY का मतलब: क्रम (Sorting) क्या हो?
- सबसे महंगे से सस्ता: \`ORDER BY total_amount DESC\` (Descending)
- A से Z या छोटे से बड़ा: \`ORDER BY total_amount ASC\` (Ascending)`,
    key_terms: [
      { term: "RDBMS", definition: "Relational Database Management System - software holding data in structured tables linked by keys (e.g. SQLite, PostgreSQL)." },
      { term: "Clause", definition: "A distinct syntactic building block in a SQL statement, such as SELECT, FROM, WHERE, or ORDER BY." },
      { term: "Alias (AS)", definition: "A temporary custom name assigned to a table or column to make the query output clean and readable." },
      { term: "Wildcard (%)", definition: "A symbol used with the LIKE operator to match zero, one, or multiple characters in text strings." },
      { term: "NULL", definition: "A special marker indicating missing or unknown data. Tested using 'IS NULL' or 'IS NOT NULL', never with '= NULL'." }
    ],
    formula_sheet: [
      { syntax: "SELECT col1, col2 FROM table;", description: "Retrieve specific columns from a table" },
      { syntax: "WHERE col = 'val' AND num > 50;", description: "Filter rows matching multiple conditions simultaneously" },
      { syntax: "WHERE col IN ('A', 'B', 'C');", description: "Filter for values belonging to a specified set" },
      { syntax: "WHERE text_col LIKE '%keyword%';", description: "Search for substring anywhere within the text column" },
      { syntax: "ORDER BY col1 DESC, col2 ASC;", description: "Sort output primarily by col1 descending, secondarily by col2 ascending" }
    ],
    worked_examples: [
      {
        title: "Example 1: High-Value West Region Orders",
        problem: "Retrieve the order_id, customer_id, order_date, and total_amount of all orders shipped to the 'West' region that have a total amount greater than ₹10,000, ordered from highest to lowest amount.",
        query: "SELECT order_id, customer_id, order_date, total_amount \nFROM orders \nWHERE shipping_region = 'West' AND total_amount > 10000 \nORDER BY total_amount DESC;",
        explanation_en: "The WHERE clause applies both conditions using the logical AND operator. The ORDER BY sorts descending.",
        explanation_hi: "यहाँ WHERE क्लॉज में दो शर्तें जोड़ी गई हैं (West रीजन और 10,000 से ज्यादा अमाउंट) और ORDER BY DESC से सबसे बड़ा ऑर्डर ऊपर आया।"
      },
      {
        title: "Example 2: Customers from Mumbai or Bengaluru",
        problem: "Find all customers whose segment is 'Consumer' and who live in either 'Mumbai' or 'Bengaluru'.",
        query: "SELECT customer_id, full_name, city, segment \nFROM customers \nWHERE segment = 'Consumer' AND city IN ('Mumbai', 'Bengaluru');",
        explanation_en: "Using IN ('Mumbai', 'Bengaluru') is cleaner and faster than writing (city = 'Mumbai' OR city = 'Bengaluru').",
        explanation_hi: "शहर चेक करने के लिए IN ('Mumbai', 'Bengaluru') लिखना OR से बहुत साफ और तेज तरीका है।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Checking for NULL with `= NULL` instead of `IS NULL`",
        consequence: "In SQL, NULL represents an unknown value. Comparing anything to NULL with '=' evaluates to UNKNOWN (false), returning zero rows.",
        fix: "Always write: `WHERE column_name IS NULL` or `WHERE column_name IS NOT NULL`."
      },
      {
        mistake: "Omitting parentheses when mixing AND with OR",
        consequence: "Operator precedence rules give `AND` higher priority than `OR`. `WHERE A AND B OR C` evaluates as `(A AND B) OR C` instead of `A AND (B OR C)`.",
        fix: "Always wrap your `OR` clauses in parentheses: `WHERE status = 'Active' AND (city = 'Delhi' OR city = 'Pune')`."
      },
      {
        mistake: "Relying on SELECT * in production scripts",
        consequence: "Pulls unnecessary network bandwidth, breaks if table schema adds columns, and hurts indexing performance.",
        fix: "Explicitly declare the column names you require."
      }
    ],
    external_resources: [
      { name: "PostgreSQL Official Documentation: Queries", url: "https://www.postgresql.org/docs/current/queries.html", access_date: "2026-11-02" },
      { name: "SQLite SELECT Statement Syntax Guide", url: "https://www.sqlite.org/lang_select.html", access_date: "2026-11-02" },
      { name: "W3Schools SQL Tutorial", url: "https://www.w3schools.com/sql/", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Write a SQL query to find all orders from the 'orders' table where 'payment_status' is 'Paid' and 'discount_pct' is greater than 0. Order the results by total_amount descending.",
      initial_code: "-- Write your SQL query here\nSELECT order_id, customer_id, total_amount, discount_pct \nFROM orders \nWHERE ",
      expected_query: "SELECT order_id, customer_id, total_amount, discount_pct FROM orders WHERE payment_status = 'Paid' AND discount_pct > 0 ORDER BY total_amount DESC",
      test_hint: "Filter for payment_status = 'Paid' AND discount_pct > 0, then add ORDER BY total_amount DESC."
    }
  },

  // --- SQL COURSE LESSON 2: JOINS ---
  {
    id: "sql-102",
    course_id: "sql",
    title: "SQL Multi-Table Joins: INNER, LEFT, & Real-World Schemas",
    title_hi: "एसक्यूएल जॉइन्स: INNER JOIN, LEFT JOIN और टेबल्स को जोड़ना",
    slug: "sql-joins-inner-left",
    estimated_minutes: 30,
    order_idx: 2,
    content_en: `### Why Do We Need JOINs?

In a relational database, data is normalized into separate tables to eliminate redundancy:
- Customer personal info lives in \`customers\`
- Order transactions live in \`orders\`
- Product catalog details live in \`products\`

To answer a business question like *"Which city brought the highest revenue for Ergonomic Chairs?"*, you must stitch these tables back together using **JOINs** on Primary Key (PK) and Foreign Key (FK) relationships.

### Visualizing SQL Join Types

\`\`\`
   Table A (Left)               Table B (Right)
   +-----------+               +-----------+
   |   Only A  |   A & B       |   Only B  |
   |           | (Intersection)|           |
   +-----------+---------------+-----------+
\`\`\`

#### 1. INNER JOIN (The Exact Match)
Returns records that have matching values in **both** tables. If a customer placed zero orders, they will NOT appear in an INNER JOIN with the orders table.

\`\`\`sql
SELECT o.order_id, c.full_name, c.city, o.total_amount
FROM orders AS o
INNER JOIN customers AS c ON o.customer_id = c.customer_id;
\`\`\`

#### 2. LEFT JOIN (Preserve Everything from Left Table)
Returns **all** records from the left table, and the matched records from the right table. If there is no match, the right side returns \`NULL\`.
*Analyst Tip:* This is the #1 way to find inactive users! (e.g., \`WHERE o.order_id IS NULL\`).

\`\`\`sql
SELECT c.customer_id, c.full_name, COUNT(o.order_id) AS total_orders
FROM customers AS c
LEFT JOIN orders AS o ON c.customer_id = o.customer_id
GROUP BY c.customer_id, c.full_name;
\`\`\`

#### 3. Multi-Table JOINs
You can chain multiple joins together cleanly:

\`\`\`sql
SELECT 
    o.order_id,
    c.full_name AS customer_name,
    p.product_name,
    p.category,
    o.quantity,
    o.total_amount
FROM orders AS o
INNER JOIN customers AS c ON o.customer_id = c.customer_id
INNER JOIN products AS p ON o.product_id = p.product_id;
\`\`\``,
    content_hi: `### JOINs की जरूरत क्यों पड़ती है?

कंपनियों में डेटा कभी एक ही टेबल में नहीं होता। 
- ग्राहकों का नाम और पता \`customers\` टेबल में होता है।
- खरीद-फरोख्त \`orders\` टेबल में होती है।
- सामान का नाम और रेट \`products\` टेबल में होता है।

अगर बॉस पूछे: *"हमारे मुंबई वाले ग्राहकों ने कौन सा सामान खरीदा?"*, तो आपको इन टेबल्स को आपस में जोड़ना पड़ेगा। इसी को **JOIN** कहते हैं!

### जॉइन्स के मुख्य प्रकार

#### 1. INNER JOIN (दोनों में कॉमन डेटा)
यह सिर्फ वही रिकॉर्ड्स दिखाता है जो दोनों टेबल्स में मौजूद हैं।
जैसे: सिर्फ वही कस्टमर्स दिखेंगे जिन्होंने कोई ऑर्डर किया है।

\`\`\`sql
SELECT o.order_id, c.full_name, o.total_amount
FROM orders o
INNER JOIN customers c ON o.customer_id = c.customer_id;
\`\`\`

#### 2. LEFT JOIN (बाईं टेबल का सारा डेटा)
यह पहली (Left) टेबल का 100% डेटा रखता है। अगर सामने वाली टेबल में मैच नहीं मिला, तो वहाँ \`NULL\` आ जाता है।
*एनालिस्ट की जादुई ट्रिक:* इससे पता चलता है कि किस यूजर ने कभी कोई सामान नहीं खरीदा!

#### 3. किराना स्टोर उदाहरण (Kirana Store Analogy)
सोचिए आपके पास 2 रजिस्टर हैं:
- रजिस्टर A: मोहल्ले के सभी लोगों के नाम।
- रजिस्टर B: आज जिन्होंने उधार लिया।
- **INNER JOIN**: सिर्फ वही लोग दिखेंगे जिन्होंने आज उधार लिया।
- **LEFT JOIN**: मोहल्ले के सारे लोग दिखेंगे, और सामने लिखा होगा किसने कितना उधार लिया या खाली (NULL)।`,
    key_terms: [
      { term: "Primary Key (PK)", definition: "A column (or set of columns) that uniquely identifies each row in a table (e.g. customer_id in customers table)." },
      { term: "Foreign Key (FK)", definition: "A column in one table that references the Primary Key of another table, creating an association." },
      { term: "INNER JOIN", definition: "A join that returns only rows where the join condition evaluates to TRUE in both participating tables." },
      { term: "LEFT (OUTER) JOIN", definition: "A join returning all rows from the left table and matched rows from the right table, filling missing right values with NULL." },
      { term: "Cartesian Product (CROSS JOIN)", definition: "Occurs when two tables are joined without an ON condition, multiplying every row of table A by every row of table B." }
    ],
    formula_sheet: [
      { syntax: "FROM table_a a INNER JOIN table_b b ON a.id = b.a_id", description: "Match records existing in both tables" },
      { syntax: "FROM table_a a LEFT JOIN table_b b ON a.id = b.a_id", description: "Preserve all records from table_a, append matching b or NULL" },
      { syntax: "WHERE b.id IS NULL", description: "Filter for records in table_a that have zero matches in table_b (Anti-join)" }
    ],
    worked_examples: [
      {
        title: "Example: Full Order Details with Customer and Product Names",
        problem: "Generate an order dispatch sheet showing order_id, order_date, customer full_name, product_name, and total_amount.",
        query: "SELECT o.order_id, o.order_date, c.full_name, p.product_name, o.total_amount \nFROM orders o \nJOIN customers c ON o.customer_id = c.customer_id \nJOIN products p ON o.product_id = p.product_id \nORDER BY o.order_date DESC;",
        explanation_en: "We join orders to customers on customer_id, and orders to products on product_id.",
        explanation_hi: "यहाँ orders टेबल को customer_id के जरिए customers से और product_id के जरिए products से जोड़ा गया है।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Filtering a LEFT JOIN's right table in the WHERE clause instead of ON",
        consequence: "Writing `WHERE right_table.status = 'Active'` converts the LEFT JOIN into an INNER JOIN because NULLs are filtered out!",
        fix: "Place filters on the right table inside the `ON` clause: `LEFT JOIN b ON a.id = b.a_id AND b.status = 'Active'`."
      },
      {
        mistake: "Accidental Fan-out (Multiplying Row Counts)",
        consequence: "Joining on a non-unique foreign key where duplicate IDs exist can silently multiply revenue totals by 2x or 5x.",
        fix: "Always check `COUNT(*)` before and after joins to ensure row counts make business sense."
      }
    ],
    external_resources: [
      { name: "PostgreSQL Tutorial: Joining Tables", url: "https://www.postgresqltutorial.com/postgresql-tutorial/postgresql-joins/", access_date: "2026-11-02" },
      { name: "Mode Analytics SQL Joins Guide", url: "https://mode.com/sql-tutorial/sql-joins/", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Write a SQL query that joins the 'orders' table with the 'customers' table and 'products' table. Select 'c.full_name', 'p.product_name', and 'o.total_amount' for orders where total_amount is greater than 20000.",
      initial_code: "SELECT c.full_name, p.product_name, o.total_amount \nFROM orders o \n-- Add your JOIN clauses here\n",
      expected_query: "SELECT c.full_name, p.product_name, o.total_amount FROM orders o JOIN customers c ON o.customer_id = c.customer_id JOIN products p ON o.product_id = p.product_id WHERE o.total_amount > 20000",
      test_hint: "Use INNER JOIN on customer_id and product_id, then filter with WHERE o.total_amount > 20000."
    }
  },

  // --- EXCEL COURSE LESSON 1 ---
  {
    id: "excel-101",
    course_id: "excel",
    title: "Modern Lookups: XLOOKUP vs VLOOKUP & INDEX/MATCH",
    title_hi: "मॉडर्न एक्सेल लूकअप्स: XLOOKUP, VLOOKUP और INDEX/MATCH",
    slug: "excel-xlookup-index-match",
    estimated_minutes: 25,
    order_idx: 1,
    content_en: `### The Evolution of Lookup Formulas in Excel

For decades, \`VLOOKUP\` was the quintessential formula on every data analyst's resume. However, VLOOKUP suffered from major structural flaws:
1. It could only search from left-to-right (the lookup value had to be in the leftmost column).
2. Inserting or deleting columns broke hard-coded column index numbers.
3. Default approximate match caused silent errors if the \`FALSE\` flag was forgotten.

Microsoft solved this in modern Excel (Excel 365, Excel 2021+) with **XLOOKUP**, which replaces both VLOOKUP and HLOOKUP, while being simpler than \`INDEX/MATCH\`.

### Syntax Breakdown: XLOOKUP

\`\`\`excel
=XLOOKUP(lookup_value, lookup_array, return_array, [if_not_found], [match_mode], [search_mode])
\`\`\`

#### The Essential Arguments:
- \`lookup_value\`: What are you looking for? (e.g., Customer ID in cell \`A2\`)
- \`lookup_array\`: Where is that key located? (e.g., \`Customers!A2:A500\`)
- \`return_array\`: What data do you want back? (e.g., \`Customers!C2:C500\` for City)
- \`[if_not_found]\`: Optional default value if no match is found (e.g., \`"Customer Not Found"\`). No more messy \`IFERROR\` wrappers!

### Classic INDEX & MATCH (The Universal Standard)
When working in older Excel versions or Google Sheets, \`INDEX/MATCH\` remains the gold standard:

\`\`\`excel
=INDEX(return_range, MATCH(lookup_value, lookup_range, 0))
\`\`\`
- \`MATCH\` finds the relative row number of your lookup value.
- \`INDEX\` grabs the value from that exact row in your return range.`,
    content_hi: `### एक्सेल में लूकअप का विकास: VLOOKUP से XLOOKUP तक

सालों से डेटा एनालिस्ट्स \`VLOOKUP\` यूज़ करते आ रहे हैं। लेकिन VLOOKUP में 2 बड़ी दिक्कतें थीं:
1. यह सिर्फ बाईं से दाईं तरफ (Left to Right) देख सकता था। उल्टी तरफ का डेटा नहीं उठा सकता था।
2. अगर बीच में कोई नया कॉलम जोड़ दिया, तो पूरा फॉर्मूला टूट जाता था।

मॉडर्न एक्सेल (Excel 365 / 2021) में माइक्रोसॉफ्ट ने **XLOOKUP** निकाला जो इन सभी समस्याओं को चुटकियों में हल करता है!

### XLOOKUP का सिंटैक्स (Syntax)

\`\`\`excel
=XLOOKUP(क्या_ढूंढना_है, कहाँ_ढूंढना_है, क्या_वापस_चाहिए, [अगर_ना_मिले])
\`\`\`

#### आसान उदाहरण:
अगर सेल \`A2\` में प्रोडक्ट आईडी \`501\` है, और आपको उसका नाम चाहिए:
\`\`\`excel
=XLOOKUP(A2, Products!A2:A100, Products!B2:B100, "प्रोडक्ट मौजूद नहीं")
\`\`\`

- **बाईं तरफ भी काम करता है**: चाहे रिटर्न कॉलम आगे हो या पीछे, XLOOKUP काम करता है।
- **IFERROR की जरूरत नहीं**: अगर वैल्यू ना मिले, तो सीधा चौथा पैरामीटर \`"Not Found"\` दे दें।`,
    key_terms: [
      { term: "Lookup Value", definition: "The unique identifier or value you want to search for in another table." },
      { term: "XLOOKUP", definition: "Modern Excel function combining lookup, reverse lookup, default error fallback, and exact matching." },
      { term: "INDEX / MATCH", definition: "A two-function formula combination providing dynamic two-way lookups across any row and column coordinates." },
      { term: "Absolute Reference ($)", definition: "Locking cell or range references (e.g. $A$2:$A$100) so they do not shift when formulas are copied down." }
    ],
    formula_sheet: [
      { syntax: "=XLOOKUP(A2, D:D, E:E, \"N/A\")", description: "Search A2 in col D and return corresponding col E value, or 'N/A' if missing" },
      { syntax: "=INDEX(E:E, MATCH(A2, D:D, 0))", description: "Classic backward-compatible exact lookup returning col E for key in col D" },
      { syntax: "=SUMIFS(sum_range, crit_range1, crit1, crit_range2, crit2)", description: "Sum values meeting multiple dynamic criteria" }
    ],
    worked_examples: [
      {
        title: "Example: Fetching Unit Price for Order Items",
        problem: "In an orders sheet, cell C2 contains Product ID 503. The products catalog is in range Products!A2:D50 where Col A is Product ID and Col D is Unit Price. Write an XLOOKUP to return the Unit Price.",
        query: "=XLOOKUP(C2, Products!$A$2:$A$50, Products!$D$2:$D$50, 0)",
        explanation_en: "Locks the ranges with $ so dragging the formula down works across thousands of rows without shifting.",
        explanation_hi: "रेंज को $ से लॉक किया गया है ताकि नीचे ड्रैग करने पर सेल रेंज खिसके नहीं।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Mismatched array dimensions in XLOOKUP",
        consequence: "If lookup_array is A2:A50 (49 cells) and return_array is B2:B60 (59 cells), Excel throws a #VALUE! error.",
        fix: "Ensure lookup_array and return_array have the exact same number of rows."
      },
      {
        mistake: "Forgetting to lock ranges with dollar signs ($)",
        consequence: "Dragging the formula down turns A2:A50 into A3:A51, A4:A52, causing later rows to miss items located near the top.",
        fix: "Highlight the range and press F4 to convert to `$A$2:$A$50`."
      }
    ],
    external_resources: [
      { name: "Microsoft Support: XLOOKUP Function Reference", url: "https://support.microsoft.com/en-us/office/xlookup-function-b7fd680e-6d10-43e6-84f9-88eae8bf5929", access_date: "2026-11-02" },
      { name: "Exceljet: How to use INDEX and MATCH", url: "https://exceljet.net/articles/index-and-match", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Write the Excel formula to look up the customer name from Customer table (range $B$2:$B$100) using Customer ID in cell A5 searched against Customer table ID range ($A$2:$A$100), returning 'Missing' if not found.",
      initial_code: "=XLOOKUP(",
      expected_query: "=XLOOKUP(A5, $A$2:$A$100, $B$2:$B$100, \"Missing\")",
      test_hint: "=XLOOKUP(A5, $A$2:$A$100, $B$2:$B$100, \"Missing\")"
    }
  },

  // --- PYTHON COURSE LESSON 1 ---
  {
    id: "py-101",
    course_id: "python",
    title: "Python Data Wrangling: Pandas DataFrames & Filtering",
    title_hi: "पायथन और पांडास: डेटाफ्रेम, इंडेक्सिंग और फिल्टरिंग (Pandas DataFrames)",
    slug: "python-pandas-dataframes",
    estimated_minutes: 30,
    order_idx: 1,
    content_en: `### Why Python for Data Analysis?

While Excel struggles above 1 million rows and crashes with complex logic, Python with **Pandas** handles millions of records effortlessly, automates repetitive reporting pipelines, and unlocks advanced statistical modeling.

### The Core Data Structures: Series vs DataFrame

\`\`\`python
import pandas as pd
import numpy as np

# A Series is a 1-Dimensional labeled array (a single column)
ages = pd.Series([25, 31, 42, 29], name="age")

# A DataFrame is a 2-Dimensional tabular data structure with labeled rows and columns
df = pd.DataFrame({
    'customer_id': [101, 102, 103, 104],
    'city': ['Mumbai', 'Delhi', 'Bengaluru', 'Pune'],
    'spend': [15200, 24500, 8900, 32000]
})
\`\`\`

### Inspecting Your Data in Seconds

When you load a dataset (\`df = pd.read_csv('orders.csv')\`), run these 4 commands first:
1. \`df.head(5)\` - View first 5 records.
2. \`df.info()\` - Check column data types and non-null counts.
3. \`df.describe()\` - Summary statistics (mean, std, min, 25%, 50%, 75%, max).
4. \`df.shape\` - Tuple of (rows, columns).

### Filtering DataFrames (Boolean Indexing)

\`\`\`python
# Filter customers with spend over 20,000
high_spenders = df[df['spend'] > 20000]

# Multiple conditions: Use & (AND), | (OR), and wrap each condition in parentheses ()
west_high = df[(df['spend'] > 15000) & (df['city'] == 'Mumbai')]

# Filtering with isin()
metro_customers = df[df['city'].isin(['Mumbai', 'Delhi', 'Bengaluru'])]
\`\`\``,
    content_hi: `### डेटा एनालिसिस के लिए पायथन क्यों?

एक्सेल में जब 10-15 लाख से ज्यादा रो (Rows) हो जाती हैं तो कंप्यूटर हैंग होने लगता है। पायथन की **Pandas** लाइब्रेरी करोड़ों डेटा प्वाइंट्स को सेकंडों में प्रोसेस कर लेती है और आपके डेली काम को ऑटोमेट कर सकती है।

### पांडास के दो मुख्य हथियार: Series और DataFrame

1. **Series**: एक सिंगल कॉलम (जैसे सिर्फ उम्र की लिस्ट)।
2. **DataFrame**: पूरा टेबल, जिसमें रो और कॉलम दोनों होते हैं (बिल्कुल एक्सेल शीट जैसा)।

### डेटा लोड करते ही 4 जादुई कमांड्स:
1. \`df.head()\` - पहली 5 पंक्तियाँ देखने के लिए।
2. \`df.info()\` - कौन से कॉलम में कैसा डेटा है और क्या कोई वैल्यू खाली (Null) है।
3. \`df.describe()\` - औसत (Mean), मिनिमम, मैक्सिमम और प्रतिशत आंकड़े।
4. \`df.shape\` - कितने रो और कितने कॉलम हैं।

### डेटा कैसे छांटें (Filtering):

\`\`\`python
# 20,000 से ज्यादा खर्च करने वाले ग्राहक
df[df['spend'] > 20000]

# दो शर्तें एक साथ (हमेशा गोल ब्रैकेट () लगाएं)
df[(df['spend'] > 15000) & (df['city'] == 'Mumbai')]
\`\`\``,
    key_terms: [
      { term: "Pandas", definition: "The premier open-source data manipulation library for Python, built on top of NumPy." },
      { term: "DataFrame", definition: "A 2D mutable tabular data structure with heterogeneous typed columns and row indexes." },
      { term: "Boolean Indexing", definition: "Filtering a DataFrame by passing a boolean condition (True/False series) inside square brackets." },
      { term: "Vectorization", definition: "Executing operations across entire arrays at compiled C speeds without writing slow Python for-loops." }
    ],
    formula_sheet: [
      { syntax: "df[df['col'] > val]", description: "Filter rows where col exceeds value" },
      { syntax: "df.groupby('category')['revenue'].sum().reset_index()", description: "Group by category and calculate total revenue" },
      { syntax: "df.isna().sum()", description: "Count missing values across every column in the DataFrame" },
      { syntax: "df.drop_duplicates(subset=['id'], keep='first')", description: "Remove duplicate records keeping only the first occurrence" }
    ],
    worked_examples: [
      {
        title: "Example: Calculating Department Salary Statistics",
        problem: "Given employee_churn DataFrame, calculate average monthly salary and average satisfaction score for employees who left vs stayed.",
        query: "df.groupby('left_company')[['monthly_salary', 'satisfaction_score']].mean()",
        explanation_en: "Groups by left_company (0 or 1) and calculates the arithmetic mean for both numeric columns.",
        explanation_hi: "left_company के आधार पर ग्रुप करके सैलरी और संतुष्टि स्कोर का औसत निकालता है।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Using 'and'/'or' keywords instead of '&'/'|' in DataFrame filters",
        consequence: "Raises `ValueError: The truth value of a Series is ambiguous`.",
        fix: "Always use bitwise operators `&` and `|`, and wrap each sub-condition in parentheses: `(df['A'] > 0) & (df['B'] < 10)`."
      },
      {
        mistake: "Modifying a slice of a DataFrame without .copy()",
        consequence: "Triggers `SettingWithCopyWarning`, causing silent bugs where the original DataFrame is unintentionally mutated or remains unchanged.",
        fix: "Explicitly create a copy: `sub_df = df[df['status'] == 'Active'].copy()`."
      }
    ],
    external_resources: [
      { name: "Official Pandas Documentation: 10 Minutes to pandas", url: "https://pandas.pydata.org/docs/user_guide/10min.html", access_date: "2026-11-02" },
      { name: "Python.org Official Library Reference", url: "https://docs.python.org/3/library/", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Write a Pandas snippet to filter a DataFrame 'df' for rows where 'tenure_months' is greater than 12 and 'left_company' is 1.",
      initial_code: "# Filter DataFrame df\nresult = df[",
      expected_query: "result = df[(df['tenure_months'] > 12) & (df['left_company'] == 1)]",
      test_hint: "Wrap both conditions in parentheses and combine with the & operator: (df['tenure_months'] > 12) & (df['left_company'] == 1)"
    }
  },

  // --- STATISTICS COURSE LESSON 1 ---
  {
    id: "stats-101",
    course_id: "statistics",
    title: "Measures of Central Tendency & Dispersion: Mean, Median & Std Dev",
    title_hi: "सेंट्रल टेंडेंसी और डिस्पर्शन: Mean, Median, Mode और Standard Deviation",
    slug: "statistics-mean-median-std-dev",
    estimated_minutes: 25,
    order_idx: 1,
    content_en: `### The Analyst's Core Duty: Summarizing Distributions

When a business asks *"What is the typical salary of our engineering hires?"* or *"What is our standard order delivery time?"*, giving raw 100,000 data points is useless. You must summarize the distribution using two complementary properties:
1. **Central Tendency**: Where is the center/bulk of the numbers?
2. **Dispersion (Spread)**: How much do numbers scatter away from that center?

### Mean vs Median: The Billionaire in the Bar Problem

- **Mean (Average)**: $\\text{Mean} = \\frac{\\sum x_i}{N}$. Every single value contributes.
- **Median**: The exact physical middle value when data is sorted from smallest to largest.
- **Mode**: The single most frequently occurring value in the dataset.

#### Why Median Beats Mean for Skewed Data:
Imagine 10 people sitting in a cafe, each earning ₹50,000 per month.
- Average salary = ₹50,000. Median = ₹50,000.
Now a billionaire walks into the cafe earning ₹50 Crore per month.
- The **Mean** suddenly jumps to ₹5 Crore per person! (misleading executive impression that everyone is rich).
- The **Median** remains ₹50,000! (accurately represents the typical customer).

*Rule of Thumb for Analysts:*
- If data is symmetrical / bell-shaped $\\rightarrow$ Report **Mean** and **Standard Deviation**.
- If data has extreme outliers (income, housing prices, delivery delays) $\\rightarrow$ Report **Median** and **IQR (Interquartile Range)**.

### Measures of Dispersion: Variance & Standard Deviation

The **Standard Deviation ($\\sigma$ or $s$)** measures the average distance of individual data points from the mean.
- A **low standard deviation** means data points are clustered tightly around the mean (predictable, consistent process).
- A **high standard deviation** means data points are widely scattered (high volatility, risk, or wide customer variation).`,
    content_hi: `### डेटा का असली स्वभाव समझना: Mean और Median में क्या अंतर है?

सोचिए कंपनी का CEO आपसे पूछे: *"हमारे ऑर्डर्स की डिलीवरी आमतौर पर कितने दिनों में होती है?"* आप लाखों ऑर्डर्स की लिस्ट नहीं पकड़ा सकते। आपको उस डेटा का सार (Summary) निकालना होगा।

### चाय की दुकान और अरबपति का उदाहरण (Real-World Analogy)

सोचिए एक कैफे में 5 दोस्त बैठे हैं, और हर एक की महीने की सैलरी ₹40,000 है।
- यहाँ **औसत (Mean)** = ₹40,000
- **बीच की वैल्यू (Median)** = ₹40,000

अब अचानक वहाँ एक अरबपति आकर बैठ जाते हैं जिनकी कमाई करोड़ों में है।
- अब अगर आप **औसत (Mean)** निकालेंगे तो वह करोड़ों में आएगा! क्या इससे कैफे के आम दोस्तों की सैलरी का सही पता चलता है? बिल्कुल नहीं!
- लेकिन अगर आप **Median** देखेंगे, तो वह अब भी ₹40,000 ही रहेगा।

*एनालिस्ट का गोल्डन रूल:*
जब भी डेटा में बहुत बड़े या बहुत छोटे आउटलायर्स (Outliers) हों (जैसे सैलरी, मकानों की कीमतें या ऐप पर बिताया गया समय), तब **Mean** की जगह हमेशा **Median** बताना चाहिए!`,
    key_terms: [
      { term: "Mean", definition: "The arithmetic average calculated by summing all values and dividing by the count." },
      { term: "Median", definition: "The 50th percentile; the middle value when observations are sorted." },
      { term: "Outlier", definition: "An extreme observation that lies an abnormal distance from other values in the sample." },
      { term: "Standard Deviation", definition: "The square root of variance; quantifies the amount of variation or dispersion in original measurement units." },
      { term: "Interquartile Range (IQR)", definition: "The distance between the 75th percentile (Q3) and 25th percentile (Q1); robust against outliers." }
    ],
    formula_sheet: [
      { syntax: "Mean = Σx / N", description: "Arithmetic average of N values" },
      { syntax: "Median = Middle value of sorted array", description: "Resistant measure of central tendency" },
      { syntax: "IQR = Q3 - Q1", description: "Spread of middle 50% of the data" },
      { syntax: "Outlier bounds: [Q1 - 1.5*IQR, Q3 + 1.5*IQR]", description: "Tukey's standard outlier fence rule" }
    ],
    worked_examples: [
      {
        title: "Example: Delivery Time Assessment",
        problem: "Five parcel deliveries took: [2, 3, 2, 4, 34] days. Calculate the Mean and Median. Which metric should be reported in the logistics SLA?",
        query: "Data: [2, 2, 3, 4, 34]\nMean = (2+2+3+4+34)/5 = 45/5 = 9 days.\nMedian = 3 days.",
        explanation_en: "The single delayed parcel (34 days due to custom clearance) drags the mean to 9 days. The median of 3 days reflects the true operational norm.",
        explanation_hi: "एक पार्सल 34 दिन में पहुंचा जिसने औसत को 9 दिन कर दिया। जबकि 80% पार्सल 2 से 4 दिन में पहुंच गए। इसलिए रिपोर्ट में Median (3 दिन) बताना सही है।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Blindly reporting the Mean without checking for skewness or outliers",
        consequence: "Business stakeholders make poor staffing or budget decisions based on distorted averages.",
        fix: "Always visualize the distribution with a histogram or boxplot, and compare Mean vs Median."
      }
    ],
    external_resources: [
      { name: "NIST/SEMATECH e-Handbook of Statistical Methods", url: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm", access_date: "2026-11-02" },
      { name: "Khan Academy: Summarizing Quantitative Data", url: "https://www.khanacademy.org/math/statistics-probability", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Calculate the median of the following customer wait times in minutes: [12, 5, 8, 22, 15]. Sort them first!",
      initial_code: "Sorted: [5, 8, 12, 15, 22]\nMedian = ",
      expected_query: "12",
      test_hint: "The physical middle value of [5, 8, 12, 15, 22] is 12."
    }
  },

  // --- GIT & GITHUB LESSON 1 ---
  {
    id: "git-101",
    course_id: "git-github",
    title: "Version Control Essentials: Repositories, Commits & .gitignore",
    title_hi: "वर्जन कंट्रोल बेसिक्स: गिट रिपॉजिटरी, कमिट और .gitignore",
    slug: "git-basics-commits-gitignore",
    estimated_minutes: 25,
    order_idx: 1,
    content_en: `### Why Every Data Analyst Must Know Git

Early in their career, analysts save versions like:
- \`analysis_v1.xlsx\`
- \`analysis_v2_final.xlsx\`
- \`analysis_v2_FINAL_really_final.xlsx\`

Git solves this permanently. It is a distributed version control system that records changes to project files over time, allowing you to recall specific versions later, collaborate safely, and showcase your work on GitHub to hiring managers.

### The 3 Local Git Stages

1. **Working Directory**: The actual files you are editing on your disk.
2. **Staging Area (Index)**: The snapshot of files you choose to include in your next commit (\`git add\`).
3. **Repository (HEAD)**: The committed history permanently saved into the \`.git\` directory (\`git commit\`).

### The Critical Role of .gitignore for Analysts

Data analysts frequently work with large raw files (\`1GB+ CSVs\`) or database credential files containing passwords and API keys. You must never commit these to GitHub!

Create a file named \`.gitignore\` in the root of your project:
\`\`\`gitignore
# Ignore large dataset files
*.csv
*.xlsx
*.parquet

# Ignore private environment variables
.env
config.json

# Ignore temporary cache directories
__pycache__/
.ipynb_checkpoints/
\`\`\``,
    content_hi: `### डेटा एनालिस्ट के लिए Git क्यों जरूरी है?

शुरुआत में लोग फाइलों को कुछ ऐसे सेव करते हैं:
- \`analysis_v1.xlsx\`
- \`analysis_final.xlsx\`
- \`analysis_sach-me-final.xlsx\`

Git इस सिरदर्द को हमेशा के लिए खत्म कर देता है! यह एक टाइम मशीन की तरह काम करता है, जो आपके कोड और प्रोजेक्ट के हर बदलाव को रिकॉर्ड रखता है।

### 3 मुख्य स्टेज:
1. **Working Directory**: जहाँ आप फाइल एडिट कर रहे हैं।
2. **Staging Area**: जिन फाइलों को आप सेव करने के लिए चुनते हैं (\`git add\`)।
3. **Commit**: हमेशा के लिए इतिहास में दर्ज हो जाना (\`git commit\`)।

### .gitignore की अहमियत:
कभी भी अपनी प्राइवेट API Key, पासवर्ड या 500MB की भारी CSV फाइल गिटहब पर अपलोड न करें। \`.gitignore\` फाइल में उन फाइलों के नाम लिख दें, ताकि Git उन्हें नजरअंदाज कर दे!`,
    key_terms: [
      { term: "Repository (Repo)", definition: "A project directory tracked by Git containing your code files and commit history." },
      { term: "Commit", definition: "A recorded snapshot of your staged changes with a descriptive message and author timestamp." },
      { term: ".gitignore", definition: "A configuration text file telling Git which local files or folders should not be tracked or committed." },
      { term: "Remote", definition: "A version of your repository hosted on the internet or network, such as GitHub." }
    ],
    formula_sheet: [
      { syntax: "git init", description: "Initialize a new Git repository in the current folder" },
      { syntax: "git status", description: "Check which files are modified, staged, or untracked" },
      { syntax: "git add filename.py", description: "Stage a specific file for the next commit" },
      { syntax: "git commit -m \"Descriptive message\"", description: "Permanently record staged snapshot to history" },
      { syntax: "git push origin main", description: "Upload committed commits to remote GitHub repository" }
    ],
    worked_examples: [
      {
        title: "Example: Initializing and Pushing a Clean EDA Project",
        problem: "You created an EDA notebook `eda_sales.ipynb`, a data folder `data/orders.csv`, and a `README.md`. How do you set up Git properly?",
        query: "git init\necho \"data/*.csv\" >> .gitignore\ngit add .gitignore README.md eda_sales.ipynb\ngit commit -m \"feat: initial sales eda notebook with clean documentation\"\ngit branch -M main\ngit remote add origin https://github.com/user/sales-eda.git\ngit push -u origin main",
        explanation_en: "First protect large CSVs via .gitignore, then stage the code and docs, commit with a clear message, and push.",
        explanation_hi: "पहले भारी डेटा फाइलों को .gitignore में डाला, फिर सिर्फ कोड और README को कमिट करके GitHub पर पुश किया।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Committing API keys or database passwords to public repositories",
        consequence: "Bots scan GitHub constantly; your credentials will be compromised within seconds.",
        fix: "Store keys in `.env` files and always add `.env` to `.gitignore` before your first commit."
      }
    ],
    external_resources: [
      { name: "Official Git Documentation: Getting Started", url: "https://git-scm.com/doc", access_date: "2026-11-02" },
      { name: "GitHub Docs: Ignoring Files", url: "https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Write the Git command to check the current staging and branch status of your local repository.",
      initial_code: "git ",
      expected_query: "git status",
      test_hint: "Use 'git status' to inspect modified and untracked files."
    }
  },

  // --- RESPONSIBLE AI LESSON 1 ---
  {
    id: "ai-101",
    course_id: "responsible-ai",
    title: "AI as an Analyst Copilot: Prompting Frameworks & Hallucination Checks",
    title_hi: "AI एनालिस्ट कोपायलट: प्रॉम्प्टिंग और हॉलुसिनेशन ऑडिट",
    slug: "ai-prompting-hallucination-audit",
    estimated_minutes: 25,
    order_idx: 1,
    content_en: `### The Double-Edged Sword of AI for Analysts

Large Language Models (LLMs) like Gemini, ChatGPT, and Claude can accelerate your SQL writing, regex formulation, and Python debugging by 5x. However, LLMs are probabilistic text generators, not deterministic database engines. 

If you trust an LLM's query without verification:
- It may invent columns that don't exist in your schema.
- It may write \`INNER JOIN\` where \`LEFT JOIN\` is mandatory, silently dropping inactive customers.
- It may calculate averages of averages incorrectly.

### The RTCF Prompting Framework for Data Analysts

To get reliable, production-ready code from AI, structure your prompt with **RTCF**:
1. **R - Role**: *"Act as a Senior PostgreSQL Database Administrator."*
2. **T - Task**: *"Write a query to calculate customer cohort retention."*
3. **C - Context**: Provide schema definitions, data types, sample rows, and business constraints.
4. **F - Format**: *"Return only the SQL code with comments explaining edge cases."*

### The 3-Step Verification Checklist

Whenever an LLM gives you a SQL query or statistical calculation:
1. **Schema Check**: Did the AI use your exact column names or guess them?
2. **Logic Check**: Are NULL values handled? Are ties handled in ranking?
3. **Execution Verification**: Run the query on sample data and compare row counts with ground truth.`,
    content_hi: `### डेटा एनालिस्ट के लिए AI: वरदान या खतरा?

AI टूल्स (जैसे Gemini, ChatGPT) आपके काम की रफ्तार 5 गुना बढ़ा सकते हैं। लेकिन याद रखें: AI कोई डेटाबेस इंजन नहीं है, वह सिर्फ भाषा का अनुमान लगाता है।

अगर आप बिना सोचे-समझे AI का कोड कॉपी करेंगे:
- वह ऐसे कॉलम के नाम मनगढ़ंत बना देगा जो आपकी टेबल में हैं ही नहीं।
- वह गलत JOIN लगाकर आधा डेटा गायब कर देगा।
- वह औसत का औसत (Average of Averages) गलत निकाल देगा।

### RTCF प्रॉम्प्टिंग फ्रेमवर्क:
1. **Role**: AI को रोल दें (जैसे: "तुम एक सीनियर डेटा एनालिस्ट हो")।
2. **Task**: क्या काम कराना है साफ़ बताएं।
3. **Context**: अपनी टेबल का ढांचा (Schema) और नियम बताएं।
4. **Format**: आउटपुट कैसा चाहिए।

### गोल्डन रूल:
AI से कोड लिखवाएं, लेकिन उस पर मुहर लगाने से पहले खुद अपनी आंखों से एक-एक लाइन जांचें!`,
    key_terms: [
      { term: "Prompt Engineering", definition: "Structuring inputs to LLMs to elicit precise, verifiable, and contextually grounded responses." },
      { term: "Hallucination", definition: "A confident response by an AI model that is factually incorrect, nonsensical, or decoupled from source context." },
      { term: "Zero-Shot vs Few-Shot", definition: "Prompting with no examples vs providing 1-3 input/output pairs to guide format and logic." }
    ],
    formula_sheet: [
      { syntax: "[Role] + [Task] + [Context/Schema] + [Format/Constraints]", description: "The RTCF high-accuracy prompting formula" }
    ],
    worked_examples: [
      {
        title: "Example: High-Performance SQL Prompt",
        problem: "Draft an effective prompt asking AI to write a window function query.",
        query: "Role: Senior PostgreSQL Analyst\nTask: Calculate 7-day rolling revenue\nContext: Table 'orders' with columns (order_id INT, order_date DATE, amount NUMERIC)\nConstraint: Handle days with zero orders, return syntax compatible with Postgres 16",
        explanation_en: "Giving explicit schema and engine constraints prevents the AI from hallucinating syntax.",
        explanation_hi: "टेबल के सही कॉलम और डेटाबेस का नाम देने से AI बिल्कुल सटीक क्वेरी बनाता है।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Pasting proprietary customer emails, phone numbers, or company secrets into public AI chatbots",
        consequence: "Violates GDPR, SOC2, and company data governance policies; can lead to immediate termination.",
        fix: "Anonymize all sample data: replace real names with 'Customer_A' and real revenues with synthetic numbers."
      }
    ],
    external_resources: [
      { name: "Google Cloud: Responsible AI Practices", url: "https://cloud.google.com/responsible-ai", access_date: "2026-11-02" },
      { name: "LearnPrompting.org Guide", url: "https://learnprompting.org", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "What does the 'C' stand for in the RTCF Prompting Framework for Data Analysts?",
      initial_code: "",
      expected_query: "Context",
      test_hint: "R = Role, T = Task, C = Context, F = Format"
    }
  }
];

// Rich Topic-wise Quizzes with Explanations & Weak Topic Detection
const quizzesData = [
  {
    id: "quiz-sql-foundations",
    course_id: "sql",
    title: "SQL Foundations & Filtering Mastery Quiz",
    title_hi: "एसक्यूएल बेसिक्स और फिल्टरिंग क्विज",
    pass_score: 75,
    questions: [
      {
        id: "q_sql_1",
        question_en: "Which SQL clause is used to filter records BEFORE any aggregation takes place?",
        question_hi: "ग्रुपिंग या एग्रीगेशन से पहले पंक्तियों (Rows) को छांटने के लिए कौन सा क्लॉज यूज़ होता है?",
        options: ["HAVING", "WHERE", "ORDER BY", "GROUP BY"],
        correct_answer: "WHERE",
        explanation_en: "WHERE filters individual rows prior to grouping. HAVING filters aggregated group results after grouping.",
        explanation_hi: "WHERE पंक्तियों को पहले ही फिल्टर कर देता है, जबकि HAVING ग्रुप बनने के बाद फिल्टर करता है।",
        topic_tag: "SQL Filtering"
      },
      {
        id: "q_sql_2",
        question_en: "How do you properly check for missing or NULL values in a SQL column named 'phone'?",
        question_hi: "SQL में 'phone' कॉलम में खाली (NULL) वैल्यू चेक करने का सही तरीका क्या है?",
        options: ["WHERE phone = NULL", "WHERE phone == NULL", "WHERE phone IS NULL", "WHERE phone EQUALS NULL"],
        correct_answer: "WHERE phone IS NULL",
        explanation_en: "NULL represents an unknown state, so standard equality operators (= or !=) always evaluate to UNKNOWN/false. You must use IS NULL.",
        explanation_hi: "NULL के साथ कभी '=' नहीं लगता। हमेशा 'IS NULL' या 'IS NOT NULL' लिखा जाता है।",
        topic_tag: "SQL NULL Handling"
      },
      {
        id: "q_sql_3",
        question_en: "What type of join returns all rows from the first table, plus matching rows from the second table, with NULLs for unmatched rows?",
        question_hi: "कौन सा JOIN पहली टेबल की 100% पंक्तियां रखता है और दूसरी टेबल से सिर्फ मैचिंग वैल्यूज लाता है?",
        options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "FULL OUTER JOIN"],
        correct_answer: "LEFT JOIN",
        explanation_en: "LEFT JOIN guarantees that every record in the left table appears in the result set at least once.",
        explanation_hi: "LEFT JOIN बाईं टेबल का सारा डेटा सुरक्षित रखता है, चाहे दाईं टेबल में मैच मिले या ना मिले।",
        topic_tag: "SQL Joins"
      },
      {
        id: "q_sql_4",
        question_en: "What is the result of evaluating: WHERE category = 'Furniture' AND price > 5000 OR city = 'Delhi' without parentheses?",
        question_hi: "बिना ब्रैकेट के: category = 'Furniture' AND price > 5000 OR city = 'Delhi' कैसे प्रोसेस होगा?",
        options: [
          "(category = 'Furniture' AND price > 5000) OR city = 'Delhi'",
          "category = 'Furniture' AND (price > 5000 OR city = 'Delhi')",
          "It throws a SQL Syntax Error",
          "All conditions are evaluated simultaneously with equal precedence"
        ],
        correct_answer: "(category = 'Furniture' AND price > 5000) OR city = 'Delhi'",
        explanation_en: "AND has higher operator precedence than OR in SQL, so it binds tightly first unless parentheses dictate otherwise.",
        explanation_hi: "SQL में AND की प्राथमिकता (Precedence) OR से ज्यादा होती है, इसलिए वह पहले प्रोसेस होगा।",
        topic_tag: "SQL Operator Precedence"
      }
    ]
  },
  {
    id: "quiz-excel-xlookup",
    course_id: "excel",
    title: "Excel Formulas & Lookup Logic Quiz",
    title_hi: "एक्सेल फॉर्मूले और XLOOKUP क्विज",
    pass_score: 75,
    questions: [
      {
        id: "q_ex_1",
        question_en: "What is a major advantage of XLOOKUP over traditional VLOOKUP?",
        question_hi: "पारंपरिक VLOOKUP के मुकाबले XLOOKUP का सबसे बड़ा फायदा क्या है?",
        options: [
          "It can look up values to the left without reordering columns",
          "It defaults to exact match without needing a FALSE argument",
          "It has a built-in [if_not_found] fallback parameter",
          "All of the above"
        ],
        correct_answer: "All of the above",
        explanation_en: "XLOOKUP handles left lookups, defaults to exact match, and provides a built-in missing value fallback.",
        explanation_hi: "XLOOKUP बाईं तरफ देख सकता है, सटीक मैच अपने आप करता है और एरर आने पर टेक्स्ट भी दे सकता है।",
        topic_tag: "Excel Lookups"
      },
      {
        id: "q_ex_2",
        question_en: "In Excel, what does pressing F4 do when editing a cell reference like 'B2'?",
        question_hi: "एक्सेल में 'B2' सेल पर F4 दबाने से क्या होता है?",
        options: [
          "Deletes the cell contents",
          "Cycles through absolute and relative reference locks ($B$2, B$2, $B2, B2)",
          "Calculates the square root of the cell",
          "Opens the print preview"
        ],
        correct_answer: "Cycles through absolute and relative reference locks ($B$2, B$2, $B2, B2)",
        explanation_en: "F4 locks rows and columns with dollar signs ($) so formulas can be dragged safely.",
        explanation_hi: "F4 डॉलर ($) का निशान लगाकर रो या कॉलम को लॉक (Absolute Reference) कर देता है।",
        topic_tag: "Excel References"
      }
    ]
  },
  {
    id: "quiz-stats-fundamentals",
    course_id: "statistics",
    title: "Descriptive Statistics & Outlier Detection Quiz",
    title_hi: "डिस्क्रिप्टिव स्टैटिस्टिक्स और आउटलायर क्विज",
    pass_score: 75,
    questions: [
      {
        id: "q_st_1",
        question_en: "If a company's salary distribution is strongly right-skewed with a few ultra-high executive earners, which metric best represents the typical employee's salary?",
        question_hi: "अगर सैलरी डेटा में कुछ बहुत बड़े अफ़सरों की भारी कमाई शामिल है, तो आम कर्मचारी की सैलरी बताने के लिए कौन सा नंबर सबसे अच्छा है?",
        options: ["Mean", "Median", "Standard Deviation", "Range"],
        correct_answer: "Median",
        explanation_en: "The median is robust against extreme positive outliers and reflects the actual 50th percentile worker.",
        explanation_hi: "Median आउटलायर्स से प्रभावित नहीं होता और ठीक बीच वाले कर्मचारी का सच दिखाता है।",
        topic_tag: "Measures of Central Tendency"
      },
      {
        id: "q_st_2",
        question_en: "According to Tukey's boxplot rule, a data point is considered an outlier if it falls below Q1 - (1.5 * IQR) or above:",
        question_hi: "टकी (Tukey) के नियम के अनुसार, कोई नंबर आउटलायर माना जाता है अगर वह Q3 + ___ से बड़ा हो:",
        options: ["1.0 * IQR", "1.5 * IQR", "2.0 * IQR", "3.0 * Standard Deviation"],
        correct_answer: "1.5 * IQR",
        explanation_en: "Standard boxplot whiskers extend to 1.5 times the Interquartile Range beyond the quartiles.",
        explanation_hi: "मानक बॉक्सप्लॉट में सीमा Q3 + (1.5 * IQR) होती है।",
        topic_tag: "Outlier Detection"
      }
    ]
  }
];

// Topic-wise Interview Question Banks & Model Answers
const interviewQuestionsData = [
  {
    id: "int_sql_01",
    category: "SQL Technical",
    difficulty: "Intermediate",
    question_en: "What is the difference between WHERE and HAVING in SQL, and can you write a query demonstrating both?",
    question_hi: "SQL में WHERE और HAVING में क्या अंतर है? दोनों का एक उदाहरण दीजिए।",
    model_answer_en: `**Key Difference:**
1. \`WHERE\` filters individual records *before* any grouping or aggregation takes place. It cannot evaluate aggregate functions like \`SUM()\` or \`AVG()\`.
2. \`HAVING\` filters aggregated groups *after* the \`GROUP BY\` clause has collapsed rows.

**Example Query:**
Find customer cities with more than 3 completed orders, but only considering orders placed in 2024:

\`\`\`sql
SELECT c.city, COUNT(o.order_id) AS total_orders, SUM(o.total_amount) AS city_revenue
FROM customers c
JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_date >= '2024-01-01' -- Row-level filter BEFORE grouping
GROUP BY c.city
HAVING COUNT(o.order_id) > 3;       -- Group-level filter AFTER aggregation
\`\`\``,
    model_answer_hi: `**मुख्य अंतर:**
1. \`WHERE\` ग्रुप बनने से *पहले* सिंगल रो को फिल्टर करता है। इसमें आप \`SUM()\` या \`COUNT()\` नहीं लगा सकते।
2. \`HAVING\` ग्रुप बनने के *बाद* कुल योग या गिनती पर फिल्टर लगाता है।

**उदाहरण:**
\`\`\`sql
SELECT city, COUNT(order_id) 
FROM orders
WHERE order_date >= '2024-01-01'  -- पहले 2024 के ऑर्डर्स छांटे
GROUP BY city
HAVING COUNT(order_id) > 10;      -- फिर वही शहर दिखाए जहाँ 10 से ज्यादा ऑर्डर हैं
\`\`\``,
    key_points: [
      "Explicitly mention execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY",
      "Mention that WHERE filters rows, HAVING filters groups",
      "Provide a clean code snippet with both clauses"
    ]
  },
  {
    id: "int_sql_02",
    category: "SQL Technical",
    difficulty: "Advanced",
    question_en: "Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() with a concrete example.",
    question_hi: "ROW_NUMBER(), RANK() और DENSE_RANK() में क्या अंतर है? उदाहरण देकर समझाएं।",
    model_answer_en: `All three are SQL Window Functions used to rank records within a partition, but they handle ties (identical values) differently:

1. **ROW_NUMBER()**: Always assigns a strictly unique sequential integer (1, 2, 3, 4...). Never produces ties, regardless of identical values.
2. **RANK()**: Assigns identical ranks to tied rows, but **skips** subsequent ranks to account for the tie (e.g. 1, 2, 2, 4).
3. **DENSE_RANK()**: Assigns identical ranks to tied rows, but **never skips** numbers (e.g. 1, 2, 2, 3).

**Concrete Example (Salaries: 90K, 80K, 80K, 70K):**
- \`ROW_NUMBER()\`: 1, 2, 3, 4
- \`RANK()\`: 1, 2, 2, 4 (rank 3 is skipped)
- \`DENSE_RANK()\`: 1, 2, 2, 3 (no gap in sequence)

*Analyst Note:* If a stakeholder asks for the "Top 3 highest paid salary tiers", you must use \`DENSE_RANK()\`. If you use \`RANK()\`, the tie might push your 3rd tier into 4th place!`,
    model_answer_hi: `ये तीनों विंडो फंक्शन्स रैंकिंग देने के काम आते हैं, लेकिन जब दो लोगों के नंबर बराबर (Tie) हों तो इनका बर्ताव अलग होता है:

1. **ROW_NUMBER()**: हर रो को अलग नंबर देता है (1, 2, 3, 4)। कभी टाई नहीं करता।
2. **RANK()**: टाई होने पर बराबर रैंक देता है, लेकिन अगला नंबर छोड़ (Skip) देता है (जैसे 1, 2, 2, 4)।
3. **DENSE_RANK()**: टाई होने पर बराबर रैंक देता है, और बीच में कोई नंबर स्किप नहीं करता (जैसे 1, 2, 2, 3)।`,
    key_points: [
      "Demonstrate tie-handling with numerical example",
      "Highlight rank skipping behavior",
      "Connect to real business scenario (e.g. Top 3 compensation brackets)"
    ]
  },
  {
    id: "int_biz_01",
    category: "Business & Behavioral",
    difficulty: "Intermediate",
    question_en: "Tell me about a time a stakeholder asked for a metric that you knew was misleading or flawed. How did you handle it?",
    question_hi: "अगर आपका मैनेजर कोई ऐसा मीट्रिक मांगे जो आपको पता है कि गलत तस्वीर दिखा रहा है, तो आप स्थिति को कैसे संभालेंगे? (STAR Method)",
    model_answer_en: `**Use the STAR Method (Situation, Task, Action, Result):**

- **Situation:** At my previous retail project, the Marketing VP noticed average order value (AOV) had jumped 35% and wanted to declare the holiday campaign a massive success in the board deck.
- **Task:** As the analyst, I inspected the underlying distribution and discovered the median order value had actually dropped by 12%. The mean was artificially inflated by just three massive corporate bulk orders.
- **Action:** Instead of confronting the VP in public or bluntly saying "you are wrong", I scheduled a 15-minute 1-on-1. I visualized the distribution using a boxplot comparing the bulk corporate segment with the general consumer segment. I explained that while overall revenue was healthy, our consumer conversion was softening. I proposed reporting both: celebrating the enterprise windfall while introducing a median-based consumer health tracker.
- **Result:** The VP appreciated the proactive safeguard, presented both metrics to the board, and we launched a targeted consumer retention campaign that saved ₹18 Lakhs in potential churn.`,
    model_answer_hi: `**STAR मेथड से जवाब:**
- **Situation (परिस्थिति):** हमारे मैनेजर ने देखा कि औसत ऑर्डर वैल्यू (Mean) बढ़ गई है और वो इसे बड़ी जीत समझ रहे थे।
- **Task (काम):** मैंने डेटा की गहराई जांची और पाया कि सिर्फ 2 बहुत बड़े कॉरपोरेट ऑर्डर्स की वजह से औसत उछला था, जबकि 80% आम ग्राहकों की खरीद कम हो गई थी।
- **Action (कदम):** मैंने सीधे मना करने के बजाय प्यार से एक विज़ुअल चार्ट दिखाया जिसमें आम ग्राहक और कॉरपोरेट ग्राहक अलग-अलग थे। मैंने दोनों बातें सामने रखीं।
- **Result (नतीजा):** मैनेजर ने मेरी ईमानदारी की तारीफ की और हमने आम ग्राहकों के लिए स्पेशल डिस्काउंट प्लान बनाया जिससे कंपनी का बड़ा नुकसान होने से बच गया।`,
    key_points: [
      "Structure using Situation, Task, Action, Result",
      "Show diplomacy and empathy towards business leaders",
      "Propose constructive dual metrics rather than just saying no"
    ]
  }
];

// 5 Guided Multi-Skill Portfolio Projects
const guidedProjectsData = [
  {
    id: "proj-1",
    title: "E-Commerce Executive Sales & Margin Diagnostic Dashboard",
    title_hi: "ई-कॉमर्स सेल्स और मार्जिन परफॉर्मेंस डैशबोर्ड (Excel + Power BI)",
    slug: "ecommerce-sales-margin-dashboard",
    difficulty: "Beginner to Intermediate",
    estimated_hours: 14,
    skills: ["Excel Pivot Tables", "Power BI", "DAX", "Data Modeling", "Business Storytelling"],
    scenario_en: "A mid-sized consumer electronics retailer experienced a 15% revenue surge last quarter, but net profit unexpectedly dropped by 8%. As their Lead Data Analyst, you must model the transaction logs, uncover product category margin leaks, and present an interactive executive dashboard with actionable recommendations.",
    scenario_hi: "एक इलेक्ट्रॉनिक कंपनी की सेल्स 15% बढ़ी, लेकिन मुनाफा 8% घट गया! आपको कंपनी के डेटा की जांच करके बताना है कि मुनाफा क्यों गिरा और इसे कैसे सुधारा जाए।",
    dataset_name: "retail_orders_full.csv",
    steps: [
      { step_num: 1, title: "Data Ingestion & Hygiene", desc: "Inspect column headers, detect negative order quantities, and treat missing customer demographic values." },
      { step_num: 2, title: "Data Modeling in Power BI", desc: "Create a clean Star Schema linking fact_orders to dim_customers and dim_products via surrogate keys." },
      { step_num: 3, title: "DAX Calculation Engineering", desc: "Write explicit DAX measures for Revenue, COGS, Gross Margin %, and YoY Revenue Growth." },
      { step_num: 4, title: "Visual Dashboard Design", desc: "Build an executive view with KPI summary cards, a Margin Waterfall chart, and regional drill-down slicers." },
      { step_num: 5, title: "Executive Briefing Delivery", desc: "Write a 1-page memo explaining that deep promotional discounts on Heavy Desks eroded shipping margins." }
    ],
    rubric: [
      { criterion: "Data Model Integrity", points: 25, description: "Correct Star Schema with 1-to-many single-direction relationships." },
      { criterion: "DAX Precision", points: 25, description: "Measures written using CALCULATE, DIVIDE (safe divide), and SUMX appropriately." },
      { criterion: "Visual Decluttering", points: 25, description: "Adherence to contrast, alignment, and data-to-ink ratio standards." },
      { criterion: "Business Recommendation", points: 25, description: "Actionable strategy linking findings to bottom-line profitability." }
    ],
    portfolio_template: `# Project: Retail Margin Diagnostic & KPI Dashboard
## Executive Summary
Analyzed 15,000+ transactional records using Excel and Power BI to diagnose why Q3 profit dropped 8% despite a 15% top-line revenue increase.

## Key Insights
1. **Discount Leakage**: Heavy Furniture discounts above 18% erased entire shipping margins due to elevated freight costs.
2. **Hero Segment**: Technology Accessories produced a 42% gross margin with 0.4% return rate.

## Recommendations
- Cap furniture promotional discounts at 10% maximum.
- Bundle low-margin desks with high-margin cable multiports to protect basket profitability.

## Tech Stack
Power BI, Power Query, DAX (CALCULATE, DATESYTD), Excel Pivot Tables.`
  },
  {
    id: "proj-2",
    title: "Customer Lifetime Value & Retention Funnel SQL Engine",
    title_hi: "कस्टमर लाइफटाइम वैल्यू (CLV) और रिटेंशन एसक्यूएल इंजन (SQL)",
    slug: "customer-retention-clv-sql",
    difficulty: "Intermediate",
    estimated_hours: 16,
    skills: ["PostgreSQL / SQLite", "Window Functions", "CTEs", "Cohort Analysis", "RFM Segmentation"],
    scenario_en: "A subscription software and physical goods company wants to understand customer repurchase velocity and churn cohorts. Build modular SQL queries utilizing Window Functions and CTEs to segment customers into RFM (Recency, Frequency, Monetary) tiers.",
    scenario_hi: "ग्राहकों के दोहराव (Repurchase) और वफादारी की जांच करने के लिए एडवांस्ड SQL क्वेरीज और कोहॉर्ट एनालिसिस इंजन तैयार करें।",
    dataset_name: "customer_transactions_cohort.csv",
    steps: [
      { step_num: 1, title: "Database Schema Setup", desc: "Establish tables with appropriate primary, foreign keys, and indexes on customer_id and order_date." },
      { step_num: 2, title: "Repurchase Velocity CTE", desc: "Use LAG() window function to calculate the elapsed days between consecutive orders for each customer." },
      { step_num: 3, title: "RFM Quintile Scoring", desc: "Use NTILE(5) to score Recency, Frequency, and Monetary parameters for each customer." },
      { step_num: 4, title: "Cohort Retention Matrix", desc: "Group customers by signup month and track % who return in Month 1, Month 2, and Month 3." }
    ],
    rubric: [
      { criterion: "Query Optimization", points: 30, description: "Readable CTEs instead of deeply nested repetitive subqueries." },
      { criterion: "Window Function Accuracy", points: 30, description: "Correct PARTITION BY and ORDER BY clauses for running velocity." },
      { criterion: "Actionable Segmentation", points: 40, description: "Clear definition of Champions, At-Risk, and Churned customer segments." }
    ],
    portfolio_template: `# Project: Customer Retention & Cohort SQL Engine
## Business Objective
Built an automated SQL analytics pipeline to segment 50,000 users into actionable RFM cohorts and quantify 90-day repurchase behavior.

## Core SQL Techniques
- Window Functions: \`LAG() OVER(PARTITION BY customer_id ORDER BY order_date)\`
- Modular CTEs: \`WITH UserFirstOrder AS (...), CohortMatrix AS (...)\`
- Mathematical bucket scoring using \`NTILE(5)\``
  },
  {
    id: "proj-3",
    title: "Exploratory Data Analysis (EDA) on App Churn with Python",
    title_hi: "पायथन से ऐप यूजर चर्न का संपूर्ण विश्लेषण (Python EDA)",
    slug: "python-app-churn-eda",
    difficulty: "Intermediate to Advanced",
    estimated_hours: 20,
    skills: ["Python", "Pandas", "NumPy", "Matplotlib / Seaborn", "Statistical Hypotheses"],
    scenario_en: "An EdTech SaaS startup observed an uptick in student dropouts within the first 30 days. Conduct an end-to-end Python EDA notebook cleaning missing study timestamps, engineering engagement features, and identifying the key drivers of user retention.",
    scenario_hi: "एक एडटेक स्टार्टअप में पहले महीने में स्टूडेंट्स पढ़ाई क्यों छोड़ रहे हैं? पांडास से डेटा क्लीन करें, फीचर्स बनाएं और रिपोर्ट तैयार करें।",
    dataset_name: "edtech_user_engagement.csv",
    steps: [
      { step_num: 1, title: "Data Profiling & Missing Imputation", desc: "Identify NaN patterns; apply median imputation on session durations." },
      { step_num: 2, title: "Feature Engineering", desc: "Compute weekly quiz completion rate, average session frequency, and days since last login." },
      { step_num: 3, title: "Hypothesis Testing", desc: "Perform two-sample t-test comparing weekly active minutes of retained vs churned users." },
      { step_num: 4, title: "Correlation & Visual Insights", desc: "Generate heatmap and pairplot illustrating the tipping point where engagement locks in loyalty." }
    ],
    rubric: [
      { criterion: "Code Cleanliness", points: 25, description: "Vectorized Pandas operations, zero loop iterations over DataFrame rows." },
      { criterion: "Statistical Rigor", points: 25, description: "Appropriate p-value reporting and effect size consideration." },
      { criterion: "Visual Narrative", points: 25, description: "Clear labels, intuitive color palettes, and annotated milestones." },
      { criterion: "Business Value", points: 25, description: "Pinpointing the 'Aha moment' metric (e.g. Completing 2 quizzes in week 1 drops churn by 60%)." }
    ],
    portfolio_template: `# Project: EdTech User Churn & Engagement Driver Analysis
## Objective
Analyzed 20,000 student behavioral records using Python (Pandas/Seaborn) to uncover the leading behavioral indicators of churn.

## Breakthrough Finding
Students who took at least 2 quizzes within the first 7 days exhibited a 64% lower probability of churn (p < 0.001) compared to those who only watched video lessons.

## Deliverables
- Cleaned Jupyter Notebook with reproducible pipeline.
- Executive summary slide deck with proposed onboarding nudges.`
  },
  {
    id: "proj-4",
    title: "End-to-End Messy Data Cleaning & Quality Assurance Case Study",
    title_hi: "डेटा क्लीनिंग और क्वालिटी अश्योरेंस केस स्टडी (Data Wrangling)",
    slug: "data-cleaning-quality-case-study",
    difficulty: "Beginner to Intermediate",
    estimated_hours: 12,
    skills: ["Data Cleaning", "Regex", "Outlier Removal", "Excel / Python", "Data Governance"],
    scenario_en: "You inherited a legacy CRM database containing 5 years of handwritten and web form submissions. It is riddled with conflicting phone formats, multiple currencies, mismatched dates (DD/MM vs MM/DD), and duplicate customer profiles. Clean and certify the data for enterprise migration.",
    scenario_hi: "एक पुराना CRM डेटाबेस जिसमें फोन नंबर गलत हैं, स्पेलिंग की गलतियां हैं और डुप्लिकेट रिकॉर्ड्स भरे हैं। उसे बिल्कुल साफ और परफेक्ट बनाएं।",
    dataset_name: "dirty_crm_records.csv",
    steps: [
      { step_num: 1, title: "Structural Audit", desc: "Document every flaw: encoding errors, inconsistent casings, delimiter anomalies." },
      { step_num: 2, title: "Regex Standardization", desc: "Use Regular Expressions to standardize telephone numbers into E.164 standard." },
      { step_num: 3, title: "Fuzzy Deduplication", desc: "Identify records like 'Infosys Ltd' and 'Infosys Limited' as matching entities." },
      { step_num: 4, title: "Validation Rules Engine", desc: "Implement programmatic checks ensuring zero negative revenues or future birth dates." }
    ],
    rubric: [
      { criterion: "Completeness", points: 30, description: "Zero remaining garbage strings or untransformed dates." },
      { criterion: "Traceability", points: 30, description: "Clear audit log detailing every row modification." },
      { criterion: "Efficiency", points: 40, description: "Reusable cleaning functions rather than manual cell overwrites." }
    ],
    portfolio_template: `# Project: Enterprise CRM Data Harmonization & QA Audit
Automated the hygiene and normalization of 30,000 dirty CRM records, lifting match rates from 62% to 99.4% prior to Salesforce migration.`
  },
  {
    id: "proj-5",
    title: "Healthcare Patient Triage Process Mapping & Bottleneck Analysis (BPMN)",
    title_hi: "अस्पताल मरीज जांच प्रोसेस मैपिंग और बॉटलनेक सुधार (BPMN 2.0)",
    slug: "bpmn-healthcare-process-optimization",
    difficulty: "Intermediate",
    estimated_hours: 14,
    skills: ["BPMN 2.0", "Process Mapping", "Cycle Time Analysis", "Root Cause Analysis", "Stakeholder Presentation"],
    scenario_en: "A regional hospital observed patient emergency room wait times balloon from 45 minutes to 3.5 hours. Map the 'As-Is' triage workflow using standard BPMN swimlanes, compute cycle times, pinpoint documentation bottlenecks, and draft the optimized 'To-Be' future workflow.",
    scenario_hi: "अस्पताल में मरीजों को डॉक्टर से मिलने में 3.5 घंटे लग रहे हैं! BPMN प्रोसेस फ्लोचार्ट बनाकर ढूंढें कि देरी कहाँ हो रही है और नया फास्ट प्रोसेस बनाएं।",
    dataset_name: "er_patient_journey_logs.csv",
    steps: [
      { step_num: 1, title: "Stakeholder Walkthrough", desc: "Interview ER triage nurses, radiologists, and billing clerks to document actual steps." },
      { step_num: 2, title: "As-Is BPMN Swimlane Diagram", desc: "Chart activities, decisions, and handoffs across Patient, Nurse, Doctor, and Lab pools." },
      { step_num: 3, title: "Cycle vs Takt Time Breakdown", desc: "Measure wait states between registration and initial physician consultation." },
      { step_num: 4, title: "To-Be Redesign & Automation", desc: "Eliminate duplicate paper entry with pre-triage digital tablets and fast-track triage." }
    ],
    rubric: [
      { criterion: "BPMN 2.0 Compliance", points: 35, description: "Correct usage of exclusive gateways, message flows, and timer events." },
      { criterion: "Bottleneck Quantification", points: 35, description: "Clear evidence identifying the primary delay root cause." },
      { criterion: "Stakeholder Feasibility", points: 30, description: "Realistic implementation plan respecting medical staff constraints." }
    ],
    portfolio_template: `# Project: Hospital Emergency Triage Workflow Optimization (BPMN)
Streamlined ER patient intake by mapping As-Is vs To-Be workflows in BPMN 2.0, modeling a 42% reduction in non-urgent patient wait times.`
  }
];

// Combine base sample lessons with expanded deep curriculum lessons
const allLessonsData = [...expandedLessonsData, ...sampleLessonsData];

module.exports = {
  coursesData,
  sampleLessonsData: allLessonsData,
  quizzesData,
  interviewQuestionsData,
  guidedProjectsData,
  questionsData
};
