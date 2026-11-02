// lesson_videos_and_tests_data.js - Complete Video Mode Scripts, Transcripts & End-of-Lesson Tests
// Provides rich multimedia learning data for every course and lesson

const lessonVideosAndTests = {
  "setup-101": {
    video_duration: "18:30",
    video_url: null, // Original script & storyboard
    video_summary: "Complete walkthrough of setting up Windows (PowerShell) and macOS (zsh) for professional data analysis. Covers Python 3.12+ installation, PATH configuration, VS Code setup, virtual environments with venv, pip management, and DBeaver database client installation.",
    video_script: `### SCENE 1: Introduction & Environment Overview (00:00 - 02:45)
**Visual:** Host on camera with title card: "Setting Up Your Data Analysis Workstation (Windows 11 & macOS Sonoma)". Background displays dual-screen terminal setup.
**On-Screen Text:** Windows PowerShell 7 vs macOS zsh • Python 3.12+ • VS Code • DBeaver
**Presenter (Audio):** "Welcome to AnalystPath AI. Before analyzing datasets with millions of rows, you need a stable, correctly configured machine. Many beginners give up not because math is hard, but because their terminal throws 'command not found'. Today, we set up both Windows and macOS properly from official sources."

### SCENE 2: Python 3.12+ Installation & The PATH Checkbox (02:45 - 07:15)
**Visual:** Screen recording of python.org downloads page.
- Windows: Cursor zooms in on the crucial checkbox: ☑ 'Add python.exe to PATH'.
- macOS: Cursor demonstrates Homebrew command (\`brew install python@3.12\`) and universal PKG installer.
**Presenter (Audio):** "On Windows, missing the PATH checkbox is the #1 mistake. If missed, Windows PowerShell cannot find python. On macOS, macOS comes with a system Python stub that you must NOT modify; always use a dedicated Homebrew or python.org installation."

### SCENE 3: Visual Studio Code Configuration (07:15 - 11:30)
**Visual:** VS Code interface. Installing the official Microsoft Python extension and Pylance. Demonstrating Command Palette (\`Ctrl+Shift+P\` / \`Cmd+Shift+P\`) and 'Python: Select Interpreter'.
**Presenter (Audio):** "VS Code is our analytical IDE. Notice how we select the interpreter in the bottom-right status bar. When working in different projects, this tells VS Code exactly which Python packages to read."

### SCENE 4: Virtual Environments (venv) & Package Management (11:30 - 15:45)
**Visual:** Split screen terminal. Running \`python -m venv .venv\`.
- Windows: \`.\\.venv\\Scripts\\Activate.ps1\` (addressing ExecutionPolicy via \`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\`).
- macOS: \`source .venv/bin/activate\`.
- Terminal prompt updates to show \`(.venv)\`. Installing pandas and numpy with \`pip install pandas numpy\`.
**Presenter (Audio):** "Never install packages globally into your operating system Python! Virtual environments isolate dependencies per project so library updates never break previous work."

### SCENE 5: DBeaver SQL Client & Verification Matrix (15:45 - 18:30)
**Visual:** Launching DBeaver Community. Creating a SQLite sample connection to \`analystpath.db\`. Running \`SELECT sqlite_version();\`.
**Presenter (Audio):** "DBeaver will be our universal GUI database manager. Now check your understanding in the end-of-lesson test below!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "Workstation Overview", text: "Welcome! Setting up a clean, reliable terminal and editor environment is step zero for any data analyst." },
      { time: "02:45", seconds: 165, title: "Windows vs macOS Installation", text: "On Windows, make sure you check 'Add python.exe to PATH'. On macOS, use Homebrew or official PKG installer." },
      { time: "07:15", seconds: 435, title: "Configuring VS Code", text: "Install the official Microsoft Python and SQL extensions. Use the Command Palette to select your Python interpreter." },
      { time: "11:30", seconds: 690, title: "Virtual Environments with venv", text: "Run 'python -m venv .venv'. Activate it using PowerShell on Windows or source on macOS to isolate project dependencies." },
      { time: "15:45", seconds: 945, title: "DBeaver & Verification", text: "Install DBeaver Community Edition for cross-platform SQL queries. Verify connections with SELECT sqlite_version();." }
    ],
    lesson_test: [
      {
        id: "lt_setup_01",
        question: "When installing Python on Windows, what happens if you forget to check 'Add python.exe to PATH'?",
        question_hi: "Windows पर Python इंस्टॉल करते समय यदि 'Add python.exe to PATH' चेकबॉक्स भूल जाएं तो क्या होगा?",
        type: "multiple_choice",
        options: [
          "Python will run 50% slower",
          "PowerShell will throw 'command not found' when typing 'python'",
          "Windows will automatically fix it on reboot",
          "VS Code will refuse to open text files"
        ],
        correct_index: 1,
        topic: "Environment Variables & PATH",
        explanation: "Adding Python to PATH registers the python binary directory in the OS system environment variables, allowing your terminal to execute 'python' from any folder."
      },
      {
        id: "lt_setup_02",
        question: "What is the command to create a virtual environment named '.venv' across both Windows and macOS?",
        question_hi: "Windows और macOS दोनों पर '.venv' नाम का वर्चुअल एनवायरनमेंट बनाने की सही कमांड क्या है?",
        type: "code_snippet",
        options: [
          "pip create .venv",
          "python -m venv .venv",
          "npm init venv",
          "conda activate .venv"
        ],
        correct_index: 1,
        topic: "Python Virtual Environments",
        explanation: "'python -m venv <directory>' invokes the standard library venv module to create an isolated Python sandbox."
      },
      {
        id: "lt_setup_03",
        question: "On macOS, which terminal command activates the virtual environment created in '.venv'?",
        question_hi: "macOS में '.venv' वर्चुअल एनवायरनमेंट को एक्टिवेट करने के लिए कौन सी कमांड चलाते हैं?",
        type: "multiple_choice",
        options: [
          ".\\.venv\\Scripts\\Activate.ps1",
          "source .venv/bin/activate",
          "python activate .venv",
          "sudo run .venv"
        ],
        correct_index: 1,
        topic: "Terminal & Shell Commands",
        explanation: "macOS uses zsh/bash, where 'source .venv/bin/activate' executes the activation script into the current shell session. '.\\.venv\\Scripts\\Activate.ps1' is specific to Windows PowerShell."
      }
    ]
  },

  "python-pandas-eda": {
    video_duration: "21:15",
    video_url: null,
    video_summary: "Comprehensive guide to Exploratory Data Analysis (EDA) using Python and Pandas. Learn DataFrame inspection with .info() and .describe(), handling null values (.isna(), .fillna()), vectorization, and groupby aggregates on e-commerce datasets.",
    video_script: `### SCENE 1: What is Exploratory Data Analysis? (00:00 - 03:20)
**Visual:** Flowchart showing raw messy CSV -> Data Profiling -> Cleaning -> Statistical EDA -> Visual Storytelling.
**Presenter (Audio):** "EDA is how data analysts become detectives. Before building machine learning models or dashboards, you must understand the distribution, cardinality, and quality of your variables."

### SCENE 2: The First 60 Seconds with a DataFrame (03:20 - 08:10)
**Visual:** Jupyter notebook running \`df.head()\`, \`df.shape\`, and \`df.info(memory_usage='deep')\`. Highlighting column data types (int64, float64, object, datetime64).
**Presenter (Audio):** "Always run .info() first. It reveals missing values and confirms whether dates were parsed as actual datetimes or messy string objects."

### SCENE 3: Vectorized Cleaning vs Python For-Loops (08:10 - 13:40)
**Visual:** Performance benchmark graphic comparing a Python \`for row in df.iterrows()\` (slow, 4.2 seconds) vs vectorized \`df['margin'] = df['revenue'] - df['cost']\` (fast, 0.003 seconds).
**Presenter (Audio):** "Never loop over DataFrame rows! Pandas is built on C-optimized NumPy arrays. Vectorized column operations execute hundreds of times faster."

### SCENE 4: GroupBy Aggregations & Pivot Tables (13:40 - 18:30)
**Visual:** Code demonstration: \`df.groupby('category').agg(total_sales=('amount', 'sum'), avg_order=('amount', 'mean')).reset_index()\`.
**Presenter (Audio):** "Named aggregations in .agg() give you clean, production-ready column names immediately without multi-index confusion."

### SCENE 5: Summary & Challenge (18:30 - 21:15)
**Visual:** Code challenge prompt displayed on screen.
**Presenter (Audio):** "Now try calculating the regional churn rate using .groupby() in the sandbox and complete the lesson test!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "The Role of EDA", text: "Exploratory Data Analysis is where you uncover data distributions, missing values, and anomalies before modeling." },
      { time: "03:20", seconds: 200, title: "Initial DataFrame Profiling", text: "Use df.info() and df.describe() to quickly check non-null counts, memory footprint, and numerical summary stats." },
      { time: "08:10", seconds: 490, title: "Vectorized Operations vs Loops", text: "Avoid Python for-loops. Vectorized operations run directly in optimized C memory, making operations instantaneous." },
      { time: "13:40", seconds: 820, title: "Mastering .groupby() and .agg()", text: "Use .groupby() with named aggregations like total_sales=('amount', 'sum') for clean, readable output." },
      { time: "18:30", seconds: 1110, title: "Wrap-up & Practice Task", text: "Great work! Review the key terms and take the lesson test below to test your mastery." }
    ],
    lesson_test: [
      {
        id: "lt_py_01",
        question: "Which Pandas method reveals the non-null count and memory data types of every column in a DataFrame?",
        question_hi: "DataFrame में प्रत्येक कॉलम के नॉन-नल काउंट और डेटा टाइप देखने के लिए कौन सा मेथड उपयोग होता है?",
        type: "multiple_choice",
        options: ["df.describe()", "df.info()", "df.show()", "df.schema()"],
        correct_index: 1,
        topic: "Pandas DataFrame Inspection",
        explanation: "df.info() prints column names, non-null counts, dtypes, and memory usage. df.describe() only provides summary statistics (mean, std, min, max)."
      },
      {
        id: "lt_py_02",
        question: "Why should you use vectorized operations (df['A'] + df['B']) instead of iterating through rows with for loops?",
        question_hi: "for लूप की तुलना में वेक्टरराइज्ड ऑपरेशन्स (df['A'] + df['B']) का उपयोग क्यों करना चाहिए?",
        type: "multiple_choice",
        options: [
          "It uses less hard drive space",
          "It executes in optimized C/NumPy arrays without Python interpreter loop overhead",
          "It allows you to skip writing unit tests",
          "It automatically saves the file to disk"
        ],
        correct_index: 1,
        topic: "Vectorization & Performance",
        explanation: "Vectorized operations leverage SIMD instructions and contiguous memory in C/NumPy, executing orders of magnitude faster than row-by-row Python loops."
      },
      {
        id: "lt_py_03",
        question: "What is the expected output of df['order_date'].dt.year if 'order_date' is of datetime64 dtype?",
        question_hi: "यदि 'order_date' datetime64 टाइप का है, तो df['order_date'].dt.year का क्या आउटपुट होगा?",
        type: "interpretation",
        options: [
          "A Series containing the four-digit year (e.g. 2024) for each row",
          "A string 'year'",
          "The number of years the business has operated",
          "A SyntaxError"
        ],
        correct_index: 0,
        topic: "Pandas Datetime Properties",
        explanation: "The .dt accessor exposes datetime-specific properties such as .year, .month, and .day_name() on datetime64 Series."
      }
    ]
  },

  "sql-window-103": {
    video_duration: "19:40",
    video_url: null,
    video_summary: "Deep dive into SQL Window Functions: OVER(), PARTITION BY, ORDER BY, running totals, and the critical distinction between ROW_NUMBER(), RANK(), and DENSE_RANK().",
    video_script: `### SCENE 1: Aggregates vs Window Functions (00:00 - 03:30)
**Visual:** Diagram contrasting GROUP BY (which collapses 100 rows into 5 rows) vs Window Functions (which keep all 100 individual rows intact while computing a rolling or partitioned calculation alongside).
**Presenter (Audio):** "In classic SQL, GROUP BY destroys row details. Window functions give you the best of both worlds: individual transaction granularity plus aggregate context."

### SCENE 2: The Anatomy of OVER() (03:30 - 08:00)
**Visual:** SQL query highlighted: \`SUM(total_amount) OVER(PARTITION BY customer_id ORDER BY order_date ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)\`.
**Presenter (Audio):** "The OVER clause defines the 'window' of rows. PARTITION BY groups without collapsing, and ORDER BY establishes the sequential frame for running totals."

### SCENE 3: The Ranking Showdown: ROW_NUMBER vs RANK vs DENSE_RANK (08:00 - 14:15)
**Visual:** An interactive table with four employees with salaries [90K, 80K, 80K, 70K].
- \`ROW_NUMBER()\`: 1, 2, 3, 4 (strictly unique, breaks ties arbitrarily).
- \`RANK()\`: 1, 2, 2, 4 (tied rows get rank 2, rank 3 is skipped!).
- \`DENSE_RANK()\`: 1, 2, 2, 3 (tied rows get rank 2, rank 3 follows immediately without gaps).
**Presenter (Audio):** "This is one of the top 5 technical interview questions for Data Analysts. Notice that RANK() skips ranks after ties, while DENSE_RANK() never skips numbers."

### SCENE 4: Finding Top-N per Group with CTEs (14:15 - 17:30)
**Visual:** Code editor showing:
\`WITH RankedOrders AS (SELECT *, DENSE_RANK() OVER(PARTITION BY category ORDER BY total_amount DESC) as rnk FROM orders) SELECT * FROM RankedOrders WHERE rnk <= 2;\`
**Presenter (Audio):** "Window functions cannot be evaluated directly in the WHERE clause due to SQL's order of execution. Wrapping the query in a Common Table Expression (CTE) allows you to filter on 'rnk'."

### SCENE 5: Conclusion & Assessment (17:30 - 19:40)
**Visual:** Summary slides showing execution order: FROM -> WHERE -> GROUP BY -> HAVING -> WINDOW -> SELECT -> ORDER BY.
**Presenter (Audio):** "Now run the practical query in the sandbox and take the end-of-lesson test!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "Aggregates vs Window Functions", text: "Unlike GROUP BY which collapses rows, window functions calculate aggregates while preserving individual row identity." },
      { time: "03:30", seconds: 210, title: "Understanding the OVER() Clause", text: "The OVER clause tells the SQL engine which subset of rows to calculate over, using PARTITION BY and ORDER BY." },
      { time: "08:00", seconds: 480, title: "ROW_NUMBER vs RANK vs DENSE_RANK", text: "ROW_NUMBER produces unique sequential integers. RANK skips numbers after ties. DENSE_RANK never skips numbers." },
      { time: "14:15", seconds: 855, title: "Top-N per Category Pattern", text: "Because window functions compute during SELECT, use a CTE or subquery to filter Top-N rows in the WHERE clause." },
      { time: "17:30", seconds: 1050, title: "SQL Execution Order & Summary", text: "Remember SQL execution order: Window calculations evaluate right before SELECT formatting. Now complete the test!" }
    ],
    lesson_test: [
      {
        id: "lt_sql_01",
        question: "Suppose three sales reps tied for 2nd place with sales of $50,000. What rank will the next sales rep receive using the RANK() function?",
        question_hi: "यदि 3 सेल्स प्रतिनिधि $50,000 की बिक्री के साथ दूसरे स्थान पर टाई हैं, तो RANK() फंक्शन के अनुसार अगले प्रतिनिधि को क्या रैंक मिलेगी?",
        type: "multiple_choice",
        options: ["3", "4", "5", "2"],
        correct_index: 2,
        topic: "SQL Ranking Functions",
        explanation: "The ranks are 1 (first place), then 2, 2, 2 (the three tied reps). Since three reps occupied ranks 2, 3, and 4, RANK() skips to 5."
      },
      {
        id: "lt_sql_02",
        question: "Why does the query 'SELECT customer_id FROM orders WHERE ROW_NUMBER() OVER(ORDER BY order_date) = 1' throw an error?",
        question_hi: "WHERE क्लॉज में सीधे ROW_NUMBER() लगाने पर SQL एरर क्यों देता है?",
        type: "multiple_choice",
        options: [
          "ROW_NUMBER is only supported in Python",
          "WHERE executes before Window functions in the SQL logical query processing order",
          "You must use single quotes around ROW_NUMBER",
          "The orders table does not support dates"
        ],
        correct_index: 1,
        topic: "SQL Order of Execution",
        explanation: "SQL filters rows (WHERE) before calculating window functions (OVER). To filter by a window function, wrap it in a CTE (WITH ...) or subquery."
      },
      {
        id: "lt_sql_03",
        question: "Which window frame specification computes a cumulative running total from the first row of the partition to the current row?",
        question_hi: "पार्टीशन की शुरुआत से वर्तमान रो तक कम्युलेटिव रनिंग टोटल निकालने के लिए कौन सा विंडो फ्रेम सही है?",
        type: "code_snippet",
        options: [
          "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW",
          "ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING",
          "ROWS 5 PRECEDING",
          "PARTITION ALL ROWS"
        ],
        correct_index: 0,
        topic: "SQL Window Frames",
        explanation: "ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW defines a dynamic frame starting at the very first partition row and expanding to the active row."
      }
    ]
  },

  "powerbi-modeling": {
    video_duration: "16:45",
    video_url: null,
    video_summary: "Learn robust dimensional data modeling in Power BI: Star Schema architecture, Fact vs Dimension tables, relationship cardinalities (1:*, *:*), filter propagation direction, and writing clean DAX measures.",
    video_script: `### SCENE 1: Why Star Schema Matters (00:00 - 03:15)
**Visual:** Diagram comparing a flat single mega-table (slow, redundant) vs Star Schema (FactSales surrounded by DimCustomer, DimProduct, DimDate).
**Presenter (Audio):** "In Power BI, performance and DAX simplicity live or die by your data model. Flat tables slow down VertiPaq compression. A clean star schema is the foundation of high-performance analytics."

### SCENE 2: Facts vs Dimensions (03:15 - 07:00)
**Visual:** Split screen showing Fact table (numerical metrics, foreign keys, additive measurements) vs Dimension tables (descriptive attributes, textual labels, primary keys).
**Presenter (Audio):** "Fact tables answer 'how much' or 'how many' (revenue, quantity). Dimension tables answer 'who, where, what, and when' (customer segment, product category, calendar date)."

### SCENE 3: Relationships & Filter Direction (07:00 - 11:30)
**Visual:** Power BI Model View. Dragging \`customer_id\` from DimCustomer to FactSales. Pointing out the 1-to-many (\`1:*\`) relationship and single-direction filter arrow.
**Presenter (Audio):** "Always prefer single direction filter propagation. Bi-directional cross-filtering creates ambiguous paths and unpredictable DAX calculation results."

### SCENE 4: Calculated Columns vs DAX Measures (11:30 - 14:50)
**Visual:** Comparison chart:
- Calculated Column: Computed at data refresh, stored in RAM, row context.
- Measure: Computed on-the-fly at query time based on active visual filter context.
- Writing: \`Total Revenue = SUMX(FactSales, FactSales[Quantity] * FactSales[UnitPrice])\`.
**Presenter (Audio):** "Rule of thumb: If you need to filter or slice in a slicer, use a column in a dimension. If you are aggregating a numerical KPI, always write a DAX measure."

### SCENE 5: Conclusion & Test (14:50 - 16:45)
**Visual:** Best practice checklist on screen.
**Presenter (Audio):** "You are now ready to design scalable business intelligence reports. Test your understanding below!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "Star Schema Architecture", text: "Star schemas optimize the Power BI VertiPaq engine with a central Fact table surrounded by Dimension tables." },
      { time: "03:15", seconds: 195, title: "Facts vs Dimensions", text: "Facts contain quantitative metrics (sales, units). Dimensions contain descriptive contextual attributes (names, categories)." },
      { time: "07:00", seconds: 420, title: "Relationship Cardinality", text: "Configure 1-to-many relationships from Dimension (1) to Fact (*). Keep filter direction single to avoid ambiguity." },
      { time: "11:30", seconds: 690, title: "Calculated Columns vs Measures", text: "Calculated columns consume RAM. DAX measures calculate dynamically based on active filter context in your report." },
      { time: "14:50", seconds: 890, title: "Model View Best Practices", text: "Organize dimensions on top and facts on bottom for clear visual hierarchy. Now take the lesson assessment!" }
    ],
    lesson_test: [
      {
        id: "lt_bi_01",
        question: "In a Power BI Star Schema, what type of table contains quantitative business events and foreign keys?",
        question_hi: "Power BI स्टार स्कीमा में बिजनेस इवेंट्स और फॉरेन कीज किस प्रकार की टेबल में होती हैं?",
        type: "multiple_choice",
        options: ["Dimension Table", "Fact Table", "Bridge Table", "Hierarchy Table"],
        correct_index: 1,
        topic: "Dimensional Data Modeling",
        explanation: "Fact tables record observable events or measurements (orders, transactions, clicks) and link to dimensions via foreign keys."
      },
      {
        id: "lt_bi_02",
        question: "Why are DAX Measures preferred over Calculated Columns for KPI aggregations?",
        question_hi: "KPI एग्रीगेशंस के लिए Calculated Columns की तुलना में DAX Measures को प्राथमिकता क्यों दी जाती है?",
        type: "multiple_choice",
        options: [
          "Measures evaluate dynamically on query time based on user filter context without bloating RAM storage",
          "Calculated columns cannot use math functions",
          "Measures only work in Excel",
          "Calculated columns cannot be exported"
        ],
        correct_index: 0,
        topic: "DAX Measures vs Columns",
        explanation: "Calculated columns are pre-computed during data refresh and consume permanent RAM in the data model. Measures calculate on demand respecting the active visual slicers."
      },
      {
        id: "lt_bi_03",
        question: "What is the recommended filter direction for a relationship between a Dimension table and a Fact table in Power BI?",
        question_hi: "Power BI में डायमेंशन टेबल और फैक्ट टेबल के बीच रिलेशनशिप की अनुशंसित फ़िल्टर दिशा क्या है?",
        type: "multiple_choice",
        options: [
          "Both (Bi-directional)",
          "Single (Dimension filters Fact)",
          "None",
          "Reverse (Fact filters Dimension)"
        ],
        correct_index: 1,
        topic: "Power BI Relationships",
        explanation: "Single-direction filtering (1:*) allows dimension selections to filter fact transactions without causing circular or ambiguous relationship paths."
      }
    ]
  },

  "git-portfolio-101": {
    video_duration: "15:10",
    video_url: null,
    video_summary: "Master Git and GitHub for data analytics portfolios: repository initialization, committing analytical workflows, writing professional READMEs with executive summaries and business impact, configuring .gitignore, and avoiding secret leaks.",
    video_script: `### SCENE 1: Why Git for Data Analysts? (00:00 - 02:40)
**Visual:** Portfolio review screen. Recruiter scanning a candidate's GitHub repo.
**Presenter (Audio):** "Many junior analysts believe Git is only for software engineers. In reality, modern data teams require version-controlled SQL models, reproducible Python scripts, and clear documentation."

### SCENE 2: The Core Git Cycle (02:40 - 06:50)
**Visual:** Command line animation of working directory -> staging area (\`git add\`) -> repository commit history (\`git commit -m\`).
**Presenter (Audio):** "A good commit is like a reliable checkpoint. Write imperative commit messages: 'Clean customer birthdate column' rather than 'Fixed stuff'."

### SCENE 3: The Essential .gitignore for Data Projects (06:50 - 10:20)
**Visual:** Displaying \`.gitignore\` containing \`.venv/\`, \`__pycache__/\`, \`.env\`, and large raw CSV files (\`*.csv\`).
**Presenter (Audio):** "Never commit API keys, database passwords, or multi-gigabyte raw files to GitHub. The .gitignore file tells Git to disregard sensitive or bloated files."

### SCENE 4: Structuring a Recruiter-Ready Project README (10:20 - 13:40)
**Visual:** Scrolling through a high-impact README:
1. Executive Summary & Business Objective
2. Dataset Source & Data Dictionary
3. Analytical Methodology & Tools Used
4. Key Findings & Metric Visualizations
5. Business Recommendations & Next Steps
**Presenter (Audio):** "Hiring managers spend less than 90 seconds scanning your repo. Your README must lead with business insights and measurable results, not just code snippets."

### SCENE 5: Summary & Test (13:40 - 15:10)
**Visual:** Checklist of portfolio repositories.
**Presenter (Audio):** "Now configure your portfolio workflow and complete the end-of-lesson test!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "Git for Data Analysts", text: "Version control allows you to document analytical thinking, collaborate safely, and showcase job-ready portfolio projects." },
      { time: "02:40", seconds: 160, title: "The Staging & Commit Flow", text: "Use git add to stage changes and git commit with clear descriptive messages to record atomic milestones." },
      { time: "06:50", seconds: 410, title: "Protecting Secrets with .gitignore", text: "Always add .env, passwords, and massive data dumps to .gitignore before your first commit." },
      { time: "10:20", seconds: 620, title: "Writing a Recruiter-Ready README", text: "Lead with business impact, key metrics, and actionable recommendations before detailing code syntax." },
      { time: "13:40", seconds: 820, title: "Pushing to GitHub & Assessment", text: "Link your local repository to GitHub and take the lesson test below to verify your version control skills." }
    ],
    lesson_test: [
      {
        id: "lt_git_01",
        question: "What is the primary purpose of a .gitignore file in a data analysis project repository?",
        question_hi: "डेटा एनालिसिस प्रोजेक्ट में .gitignore फ़ाइल का मुख्य उद्देश्य क्या है?",
        type: "multiple_choice",
        options: [
          "To speed up Python script execution",
          "To prevent sensitive secrets (.env) and massive raw data files from being tracked or pushed to GitHub",
          "To automatically format markdown tables",
          "To delete previous git commits"
        ],
        correct_index: 1,
        topic: "Git & Secret Protection",
        explanation: ".gitignore specifies intentionally untracked files that Git should ignore, preventing accidental leakage of API credentials and massive datasets."
      },
      {
        id: "lt_git_02",
        question: "Which git command records staged snapshot changes into the local repository history?",
        question_hi: "स्टेज किए गए बदलावों को लोकल रिपॉजिटरी हिस्ट्री में रिकॉर्ड करने के लिए कौन सी कमांड है?",
        type: "code_snippet",
        options: ["git push", "git commit -m 'message'", "git checkout", "git init"],
        correct_index: 1,
        topic: "Git Commits & Workflow",
        explanation: "'git commit -m <message>' saves a permanent snapshot of all staged files in the local repository."
      },
      {
        id: "lt_git_03",
        question: "What should an entry-level Data Analyst emphasize at the top of their project README to impress hiring managers?",
        question_hi: "हायरिंग मैनेजर्स को आकर्षित करने के लिए प्रोजेक्ट README के शीर्ष पर क्या दर्शाना चाहिए?",
        type: "multiple_choice",
        options: [
          "The complete 500-line Python code file",
          "Executive summary, business objective, and key data-driven recommendations",
          "A list of computer hardware specifications",
          "Their high school grades"
        ],
        correct_index: 1,
        topic: "Portfolio Architecture & Communication",
        explanation: "Recruiters and hiring managers evaluate whether you understand business context. Leading with objectives, insights, and recommendations demonstrates analytical maturity."
      }
    ]
  },

  // -------------------------------------------------------------
  // 6. DATA ANALYSIS FOUNDATIONS (foundations-101)
  // -------------------------------------------------------------
  "foundations-101": {
    video_duration: "16:45",
    video_url: null,
    video_summary: "Complete breakdown of the Modern Data Analyst's role across business strategy and engineering. Explores the 4 analytics tiers (descriptive, diagnostic, predictive, prescriptive), the 6-stage lifecycle, and framing executive hypotheses.",
    video_script: `### SCENE 1: What Does a Real Data Analyst Actually Do? (00:00 - 04:30)
**Visual:** Host on camera with dynamic title: "The Modern Data Analyst: Strategy, Statistics & Business Value". Graphic overlay displaying the cross-functional Venn diagram between Engineering, Product, and Business Strategy.
**Presenter (Audio):** "Welcome! Many beginners assume an analyst just writes SQL queries all day. In reality, your core value is translating ambiguous business problems into crisp, data-backed decisions that drive company revenue and prevent customer churn."

### SCENE 2: The 4 Tiers of Analytics (04:30 - 09:15)
**Visual:** Animated ladder diagram illustrating Descriptive -> Diagnostic -> Predictive -> Prescriptive analytics with real-world e-commerce revenue examples.
**Presenter (Audio):** "Notice the progression. Descriptive tells us sales dropped 8%. Diagnostic reveals delayed shipping drove customer cancellations. Predictive forecasts churn if delivery times don't improve. And Prescriptive tells executives exactly which logistics fulfillment hubs to re-route."

### SCENE 3: The 6-Stage Lifecycle & Avoiding Common Pitfalls (09:15 - 16:45)
**Visual:** Split-screen workflow: Framing Questions -> Extraction -> Cleaning -> EDA -> Synthesis -> Recommendation.
**Presenter (Audio):** "The number one beginner mistake is jumping straight into querying before defining what a term like 'Active User' means. Now, test your understanding in the checkpoint test below!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "The Analyst Mission", text: "Understanding the role of a data analyst at the intersection of business, statistics, and software." },
      { time: "04:30", seconds: 270, title: "4 Analytics Tiers", text: "Walking through Descriptive, Diagnostic, Predictive, and Prescriptive analytics with real examples." },
      { time: "09:15", seconds: 555, title: "The 6-Stage Lifecycle", text: "Deconstructing the end-to-end data lifecycle from business framing to strategic recommendation." },
      { time: "13:30", seconds: 810, title: "Executive Alignment", text: "How to clarify ambiguous requests before querying and avoid metric mismatch errors." }
    ],
    lesson_test: [
      {
        id: "lt_found_01",
        question: "Which type of analytics directly prescribes the exact strategic action an executive should execute?",
        question_hi: "किस प्रकार का एनालिटिक्स सीधे यह सुझाव देता है कि कंपनी को कौन सा कदम उठाना चाहिए?",
        type: "multiple_choice",
        options: [
          "Descriptive Analytics",
          "Diagnostic Analytics",
          "Predictive Analytics",
          "Prescriptive Analytics"
        ],
        correct_index: 3,
        topic: "Analytics Spectrum",
        explanation: "Prescriptive analytics goes beyond forecasting future outcomes to directly recommend the optimal business action to capture opportunities or mitigate risks."
      },
      {
        id: "lt_found_02",
        question: "What is the critical first stage of the Data Analysis Lifecycle before extracting any data?",
        question_hi: "डेटा निकालने से पहले डेटा विश्लेषण चक्र का सबसे पहला और महत्वपूर्ण चरण क्या है?",
        type: "multiple_choice",
        options: [
          "Building 3D visual charts",
          "Business question framing and metric definition alignment",
          "Purchasing more cloud storage servers",
          "Sending cold LinkedIn messages"
        ],
        correct_index: 1,
        topic: "Analysis Lifecycle",
        explanation: "Framing the question and agreeing on precise metric definitions ensures you solve the correct problem for stakeholders."
      },
      {
        id: "lt_found_03",
        question: "If 'Active Users' means Daily Active Users to the Product team but Monthly Active Users to Marketing, what happens if an analyst doesn't clarify?",
        question_hi: "यदि विभिन्न टीमें किसी मीट्रिक की अलग परिभाषा समझती हैं और एनालिस्ट स्पष्ट न करे तो क्या होगा?",
        type: "multiple_choice",
        options: [
          "The database will crash immediately",
          "The analysis will produce misleading conclusions and cause conflicting business decisions",
          "Nothing, all definitions produce the same numerical result",
          "The query will automatically fail to compile"
        ],
        correct_index: 1,
        topic: "Metric Alignment",
        explanation: "Failing to clarify metric definitions causes teams to act on incompatible assumptions, producing conflicting strategic roadmaps."
      }
    ]
  },

  // -------------------------------------------------------------
  // 7. DATA CLEANING & PREPARATION (cleaning-101)
  // -------------------------------------------------------------
  "cleaning-101": {
    video_duration: "19:20",
    video_url: null,
    video_summary: "In-depth visual masterclass on diagnosing and resolving dirty data. Covers Little & Rubin's missing data taxonomy (MCAR, MAR, MNAR), Tukey's Interquartile Range (IQR) outlier detection, deduplication, and schema audits.",
    video_script: `### SCENE 1: Why Real-World Data Is Always Messy (00:00 - 04:00)
**Visual:** Instructor showing raw corporate CSV dump with corrupt timestamp formats, negative order totals, duplicate customer IDs, and NaN values.
**Presenter (Audio):** "In the real world, clean data does not exist. More than 70% of your time as an analyst will be spent cleaning and verifying data. Today, we master systematic methods to clean data without introducing statistical bias."

### SCENE 2: The 3 Types of Missing Data (04:00 - 10:30)
**Visual:** Diagram explaining MCAR (Missing Completely at Random), MAR (Missing at Random), and MNAR (Missing Not at Random). Demonstration of group-wise median imputation in Pandas.
**Presenter (Audio):** "Never blindly fill nulls with zero! If a high-earner refuses to state their salary, that is MNAR. Replacing it with zero distorts your company average and damages your downstream reporting."

### SCENE 3: Outlier Detection: IQR vs Z-Score (10:30 - 19:20)
**Visual:** Boxplot visualization displaying Q1, Median (Q2), Q3, and the 1.5 * IQR whiskers. Screen recording of Python IQR filtering script in VS Code.
**Presenter (Audio):** "The Interquartile Range is robust because extreme anomalies cannot pull Q1 and Q3 the way they pull the mean. Now practice identifying outliers in the test below!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "The Reality of Dirty Data", text: "Examining why 70% of analytical work is data cleaning and preparation." },
      { time: "04:00", seconds: 240, title: "Missing Data Taxonomy", text: "Understanding MCAR, MAR, and MNAR to avoid dangerous imputation bias." },
      { time: "10:30", seconds: 630, title: "IQR Outlier Detection", text: "Applying Tukey's 1.5x IQR rule to isolate real anomalies from normal variance." },
      { time: "15:45", seconds: 945, title: "Validation Checks", text: "Auditing schema data types and verifying deduplication rules in production." }
    ],
    lesson_test: [
      {
        id: "lt_clean_01",
        question: "Under the Little & Rubin framework, what does MCAR (Missing Completely at Random) mean?",
        question_hi: "Little & Rubin फ्रेमवर्क के अनुसार MCAR (Missing Completely at Random) का क्या अर्थ है?",
        type: "multiple_choice",
        options: [
          "The missingness depends directly on the unobserved variable itself",
          "The probability of data being missing has no relationship with any observed or unobserved variable",
          "All rows in the dataset were accidentally deleted",
          "Missing values are always exactly equal to zero"
        ],
        correct_index: 1,
        topic: "Missing Data Taxonomy",
        explanation: "MCAR means the missingness occurs purely at random without correlation to any other observed or unobserved data attributes."
      },
      {
        id: "lt_clean_02",
        question: "Why is the Interquartile Range (IQR) method preferred over standard Z-score for skewed business distributions?",
        question_hi: "असममित (Skewed) डेटा में Z-Score की तुलना में IQR विधि को प्राथमिकता क्यों दी जाती है?",
        type: "multiple_choice",
        options: [
          "IQR runs 100 times faster in Python",
          "IQR uses percentiles (Q1 and Q3) which are not distorted by extreme outliers, whereas Z-score relies on the vulnerable mean and standard deviation",
          "Z-scores are only usable on text columns",
          "IQR eliminates the need for data cleaning entirely"
        ],
        correct_index: 1,
        topic: "Outlier Detection",
        explanation: "The mean and standard deviation are sensitive to extreme anomalies. Percentiles used by IQR remain stable even in heavily skewed distributions."
      },
      {
        id: "lt_clean_03",
        question: "When imputing missing employee salaries across a company, which strategy preserves natural inter-departmental salary differences?",
        question_hi: "कंपनी में कर्मचारियों के वेतन में मिसिंग वैल्यूज भरते समय विभागों के अंतर को बनाए रखने का सबसे सही तरीका क्या है?",
        type: "multiple_choice",
        options: [
          "Fill all missing values with 0",
          "Impute using the global company-wide mean",
          "Impute conditionally using the median salary of each specific department",
          "Delete every employee record that has any null attribute"
        ],
        correct_index: 2,
        topic: "Conditional Imputation",
        explanation: "Grouping by department and imputing the departmental median preserves the natural wage variance between technical, sales, and support roles."
      }
    ]
  },

  // -------------------------------------------------------------
  // 8. DATA VISUALIZATION & STORYTELLING (viz-101)
  // -------------------------------------------------------------
  "viz-101": {
    video_duration: "18:10",
    video_url: null,
    video_summary: "Master the science of visual analytics. Covers Cleveland & McGill's perceptual ranking, reducing cognitive load, chart selection matrices, and Edward Tufte's Data-Ink ratio principles.",
    video_script: `### SCENE 1: Visual Perception & Cognitive Load (00:00 - 04:45)
**Visual:** Split screen showing a crowded 3D pie chart vs an uncluttered horizontal bar chart. Timer showing executive gaze patterns.
**Presenter (Audio):** "A chart is an analytical tool to reduce executive cognitive load. When you use 3D effects, bright rainbow colors, and tilted labels, you force stakeholders to work hard just to read basic numbers."

### SCENE 2: The Perceptual Hierarchy of Encodings (04:45 - 11:00)
**Visual:** Animated infographic showing Cleveland & McGill's ranking: Position along a common scale -> Length -> Angle -> Area -> Color Saturation.
**Presenter (Audio):** "Humans decode position along a common scale with the highest accuracy. That is why simple bar charts consistently outperform pie and bubble charts in executive briefings."

### SCENE 3: The Chart Selection Decision Matrix (11:00 - 18:10)
**Visual:** Interactive flowchart: Trends over time -> Line chart. Categorical comparisons -> Bar chart. Correlation -> Scatter plot. Composition -> Stacked bar or Waterfall.
**Presenter (Audio):** "Always match your visual encoding to your analytical intent. Review the key terms and take the lesson test below!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "Cognitive Load in Dashboards", text: "Why data visualization is a tool for rapid decision-making, not graphic decoration." },
      { time: "04:45", seconds: 285, title: "Perceptual Hierarchy", text: "How the human brain perceives position, length, angle, and area differences." },
      { time: "11:00", seconds: 660, title: "Chart Selection Matrix", text: "Choosing the exact chart based on analytical intent: comparison, trend, distribution, or correlation." },
      { time: "15:30", seconds: 930, title: "Data-Ink Ratio", text: "Applying Edward Tufte's principles to eliminate chartjunk and emphasize signal." }
    ],
    lesson_test: [
      {
        id: "lt_viz_01",
        question: "According to Cleveland & McGill's experimental hierarchy, which visual encoding is perceived with the greatest quantitative accuracy by humans?",
        question_hi: "मानव मस्तिष्क किस विज़ुअल एनकोडिंग को सबसे सटीक तरीके से समझता है?",
        type: "multiple_choice",
        options: [
          "Angle of a circle slice",
          "Area of a circle bubble",
          "Position along a common scale",
          "Color saturation gradient"
        ],
        correct_index: 2,
        topic: "Perceptual Hierarchy",
        explanation: "Position along a common scale (as found in standard bar charts and scatter plots) allows humans to make the most precise quantitative comparisons."
      },
      {
        id: "lt_viz_02",
        question: "What is Edward Tufte's 'Data-Ink Ratio'?",
        question_hi: "एडवर्ड टफ्ट का 'Data-Ink Ratio' सिद्धांत क्या है?",
        type: "multiple_choice",
        options: [
          "The ratio of print ink cost to software license fees",
          "The proportion of a graphic's ink devoted to the non-redundant display of data information",
          "The number of charts per dashboard page",
          "The ratio of dark mode pixels to light mode pixels"
        ],
        correct_index: 1,
        topic: "Data-Ink Ratio",
        explanation: "Tufte defined the Data-Ink Ratio as the proportion of ink used to communicate real data. Maximizing it removes distracting decorative chartjunk."
      },
      {
        id: "lt_viz_03",
        question: "Why should an analyst strictly avoid dual-axis line charts with mismatched left and right Y-axes?",
        question_hi: "दो अलग-अलग Y-Axes वाले Dual-Axis चार्ट से क्यों बचना चाहिए?",
        type: "multiple_choice",
        options: [
          "They cannot be opened in modern web browsers",
          "They can easily create the false visual illusion of correlation by arbitrarily scaling the axes",
          "SQL database engines reject dual axes queries",
          "They consume 10 times more memory in Tableau"
        ],
        correct_index: 1,
        topic: "Visual Integrity",
        explanation: "Dual-axis charts can be visually manipulated to make unrelated trends appear correlated simply by expanding or contracting the independent axis scales."
      }
    ]
  },

  // -------------------------------------------------------------
  // 9. JIRA, AZURE & BPMN (jira-101)
  // -------------------------------------------------------------
  "jira-101": {
    video_duration: "17:30",
    video_url: null,
    video_summary: "Learn how data analysts operate inside modern Agile sprints using Atlassian Jira and Microsoft Azure DevOps. Covers user stories, Given-When-Then acceptance criteria, sprint capacity, and BPMN 2.0 workflow mapping.",
    video_script: `### SCENE 1: Agile Operations for Data Teams (00:00 - 04:30)
**Visual:** Jira Kanban and Scrum sprint boards displayed on monitor. Moving a ticket from 'Backlog' to 'In Progress' to 'QA' to 'Done'.
**Presenter (Audio):** "In top tech companies, analytics requests don't happen in random DMs. They live in sprint backlogs in Jira or Azure DevOps. Today, we learn how analysts write tickets, estimate points, and protect their focus."

### SCENE 2: The Anatomy of a High-Quality User Story (04:30 - 10:00)
**Visual:** Displaying the standard syntax: 'As a [role], I want [action], so that [business value]'. Writing Given-When-Then acceptance criteria.
**Presenter (Audio):** "Acceptance criteria define what 'Done' looks like. Without them, you enter endless revision cycles where stakeholders ask for one more column every day."

### SCENE 3: BPMN 2.0 Business Process Mapping (10:00 - 17:30)
**Visual:** Diagramming an e-commerce refund workflow using BPMN 2.0 standard symbols: Start events, tasks, XOR gateways, and parallel AND gateways.
**Presenter (Audio):** "BPMN gives analysts an unambiguous visual language to map complex cross-department operations. Test your skills in the lesson test below!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "Agile Analytics in Practice", text: "How sprint planning, standups, and Jira boards organize analytics engineering work." },
      { time: "04:30", seconds: 270, title: "User Stories & Criteria", text: "Writing clear user stories and Given-When-Then acceptance criteria to prevent scope creep." },
      { time: "10:00", seconds: 600, title: "BPMN 2.0 Mapping", text: "Mapping cross-functional business processes using standard gateways, events, and tasks." },
      { time: "14:45", seconds: 885, title: "Stakeholder Boundaries", text: "Managing ad-hoc intake requests and protecting sprint velocity." }
    ],
    lesson_test: [
      {
        id: "lt_jira_01",
        question: "What is the standard format for writing an Agile User Story in Jira or Azure DevOps?",
        question_hi: "Jira या Azure DevOps में Agile User Story लिखने का मानक प्रारूप क्या है?",
        type: "multiple_choice",
        options: [
          "Please fix this data bug as soon as possible",
          "As a [role], I want [capability/action], so that [benefit/business value]",
          "SELECT * FROM users WHERE active = 1",
          "Here is an Excel sheet with 500 rows"
        ],
        correct_index: 1,
        topic: "User Stories",
        explanation: "The standard 'As a... I want... So that...' structure ensures that technical tasks are clearly anchored to a specific user and business benefit."
      },
      {
        id: "lt_jira_02",
        question: "In BPMN 2.0, what does an Exclusive Gateway (XOR) represented by a diamond with an 'X' mean?",
        question_hi: "BPMN 2.0 में डायमंड में 'X' वाला Exclusive Gateway क्या दर्शाता है?",
        type: "multiple_choice",
        options: [
          "All outgoing paths execute simultaneously in parallel",
          "The workflow terminates permanently",
          "A decision point where the workflow must take exactly one mutually exclusive branch",
          "An infinite loop"
        ],
        correct_index: 2,
        topic: "BPMN 2.0 Gateways",
        explanation: "An Exclusive Gateway (XOR) evaluates conditions and routes execution down exactly one path based on the evaluated business rule."
      },
      {
        id: "lt_jira_03",
        question: "Why are clear 'Acceptance Criteria' essential before an analyst begins developing a dashboard or query?",
        question_hi: "एनालिस्ट द्वारा काम शुरू करने से पहले स्पष्ट 'Acceptance Criteria' क्यों आवश्यक हैं?",
        type: "multiple_choice",
        options: [
          "To provide exact, testable criteria for when the ticket is considered complete and prevent scope creep",
          "To allow developers to skip writing code tests",
          "To bypass privacy compliance audits",
          "To make the Jira ticket look longer"
        ],
        correct_index: 0,
        topic: "Acceptance Criteria",
        explanation: "Acceptance criteria provide an objective, testable checklist that aligns the stakeholder and analyst on exactly what constitutes project completion."
      }
    ]
  },

  // -------------------------------------------------------------
  // 10. TECHNICAL COMMUNICATION & REQUIREMENTS (comm-101)
  // -------------------------------------------------------------
  "comm-101": {
    video_duration: "15:50",
    video_url: null,
    video_summary: "Transform ambiguous executive requests into high-impact analytical solutions. Covers the Metric Tree framework, drafting Business Requirements Documents (BRD), and executive stakeholder presentations.",
    video_script: `### SCENE 1: The Curse of Ambiguous Requests (00:00 - 04:15)
**Visual:** Executive asking: "Why are our Q3 margins shrinking?" on video call. Split screen showing an inexperienced analyst looking confused vs a senior analyst framing the inquiry.
**Presenter (Audio):** "Stakeholders will rarely hand you clean SQL problem statements. They come to you with high-level anxiety. Your superpower is structuring ambiguity into solvable equations."

### SCENE 2: The Metric Tree Framework (04:15 - 10:15)
**Visual:** Interactive tree diagram expanding Profit -> Revenue & Costs -> Customer Acquisition, AOV, Churn, and Fixed/Variable expenses.
**Presenter (Audio):** "Observe how the Metric Tree breaks a giant metric like Net Profit into operational levers. By isolating which branch moved, you turn a wild-goose chase into targeted data analysis."

### SCENE 3: Writing the One-Page BRD & Executive Summaries (10:15 - 15:50)
**Visual:** Clean template of a Business Requirements Document: Problem Statement, Success Metric, In-Scope, Out-of-Scope, and Deliverables.
**Presenter (Audio):** "Always lead executive presentations with the business takeaway first, then the data evidence. Now verify your communication mastery in the test below!"`,
    video_transcript: [
      { time: "00:00", seconds: 0, title: "Handling Ambiguity", text: "Why translating executive questions into structured hypotheses is the hallmark of senior analysts." },
      { time: "04:15", seconds: 255, title: "The Metric Tree", text: "Deconstructing high-level revenue and profit into operational equations." },
      { time: "10:15", seconds: 615, title: "One-Page BRD Architecture", text: "Defining project scope, target KPIs, and boundary conditions." },
      { time: "13:30", seconds: 810, title: "Executive Storytelling", text: "Leading with strategic recommendations before displaying supporting charts." }
    ],
    lesson_test: [
      {
        id: "lt_comm_01",
        question: "What is the primary function of a 'Metric Tree' in data analysis?",
        question_hi: "डेटा एनालिटिक्स में 'Metric Tree' का मुख्य उद्देश्य क्या है?",
        type: "multiple_choice",
        options: [
          "To display directory tree folders on Windows PowerShell",
          "To hierarchically decompose a high-level strategic KPI into its underlying operational mathematical drivers",
          "To estimate the carbon footprint of data servers",
          "To measure the height of corporate office buildings"
        ],
        correct_index: 1,
        topic: "Metric Trees",
        explanation: "A Metric Tree breaks down high-level business goals (e.g. Profit) into operational equations (AOV, Churn, Conversion), allowing analysts to isolate root causes."
      },
      {
        id: "lt_comm_02",
        question: "When presenting analytical findings to executive leadership (C-Suite / VPs), what communication structure is recommended?",
        question_hi: "सीनियर लीडरशिप (C-Suite) को डेटा प्रस्तुत करते समय कौन सी प्रस्तुति संरचना सर्वश्रेष्ठ मानी जाती है?",
        type: "multiple_choice",
        options: [
          "Start with 50 lines of complex SQL code and statistical formulas",
          "Lead with the executive summary (business impact & prioritized recommendations) first, followed by supporting visual evidence",
          "Hide all numbers and present only subjective opinions",
          "Refuse to answer questions until the end of the month"
        ],
        correct_index: 1,
        topic: "Executive Communication",
        explanation: "Executives have limited time; leading with recommendations and measurable financial impact immediately gives them the high-level takeaway they need to make decisions."
      },
      {
        id: "lt_comm_03",
        question: "Why should an analyst explicitly define what is 'Out-of-Scope' in a Business Requirements Document (BRD)?",
        question_hi: "BRD में क्या काम 'Out-of-Scope' (परियोजना से बाहर) है, यह लिखना क्यों महत्वपूर्ण है?",
        type: "multiple_choice",
        options: [
          "To prevent uncontrolled scope creep and set clear boundary expectations with stakeholders",
          "To reduce the number of fonts in the document",
          "To avoid writing code altogether",
          "To confuse the engineering team"
        ],
        correct_index: 0,
        topic: "Scope Management",
        explanation: "Documenting what will NOT be delivered protects the project timeline and sets mutual expectations before development begins."
      }
    ]
  }
};

module.exports = {
  lessonVideosAndTests
};
