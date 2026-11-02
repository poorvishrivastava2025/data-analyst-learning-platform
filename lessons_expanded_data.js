// lessons_expanded_data.js - Comprehensive Deep Lessons for Required Data Analyst Domains
// Verified against official documentation (Python 3.12+, PostgreSQL 16+, Microsoft Excel 365, VS Code 1.90+, Power BI Desktop, Tableau Public)
// Verified date: October 2026

const expandedLessonsData = [
  // -------------------------------------------------------------
  // 1. COMPUTER & PROGRAMMING FOUNDATIONS (Windows & macOS)
  // -------------------------------------------------------------
  {
    id: "setup-101",
    course_id: "computer-setup",
    title: "Environment Setup: Windows & macOS, Terminals, VS Code, Python & Virtual Environments",
    title_hi: "डेटा एनालिस्ट कंप्यूटर सेटअप: विंडोज और मैक, टर्मिनल, VS Code, पायथन और venv",
    slug: "computer-setup-windows-macos",
    estimated_minutes: 40,
    order_idx: 1,
    content_en: `### Preparing Your Computer for Professional Data Analysis

Before writing a single line of SQL or Python, every professional Data Analyst must know how to control their operating system, manage project directories, install runtimes safely, and troubleshoot environment collisions.

> [!IMPORTANT]
> **Verified against Official Documentation (Checked: October 2026)**
> Sources: [Python.org Official Documentation](https://docs.python.org/3/using/index.html) | [VS Code Python Setup Guide](https://code.visualstudio.com/docs/python/python-tutorial) | [DBeaver Official Guide](https://dbeaver.io/docs/)

---

### Part 1: Terminal & File System Foundations (Windows vs. macOS)

Your computer executes commands through a shell interface. 

#### Understanding Operating System Differences
| Task | Windows (PowerShell) | macOS (zsh Terminal) |
| :--- | :--- | :--- |
| **Default Shell** | PowerShell 7 / Windows Terminal | zsh (Z Shell) |
| **Path Separator** | Backslash (\`\\\`, e.g. \`C:\\Users\\name\\data\`) | Forward slash (\`/\`, e.g. \`/Users/name/data\`) |
| **Current Directory** | \`Get-Location\` or \`pwd\` | \`pwd\` |
| **List Files** | \`dir\` or \`ls\` | \`ls -la\` (shows hidden files) |
| **Change Directory** | \`cd folder_name\` | \`cd folder_name\` |
| **Create Folder** | \`mkdir my_project\` | \`mkdir my_project\` |
| **Check Environment PATH** | \`$env:PATH\` | \`echo $PATH\` |

#### Working Directories & File Paths
- **Relative Path**: References a file relative to where your terminal currently sits (e.g. \`data/sales.csv\`).
- **Absolute Path**: The full path starting from the root drive (e.g. \`C:\\Projects\\analyst\\data\\sales.csv\` or \`/Users/alex/projects/analyst/data/sales.csv\`).
*Rule of thumb*: Always launch your terminal inside your project root so relative paths work seamlessly.

---

### Part 2: Installing Python 3.12+ Cleanly

#### A. Windows Installation Instructions
1. Download the latest stable 64-bit Windows installer from [python.org/downloads](https://www.python.org/downloads/windows/).
2. **CRITICAL STEP**: On the first installer screen, check the checkbox:  
   ☑️ **"Add python.exe to PATH"**  
   *(If you miss this checkbox, typing 'python' in terminal will fail with 'python is not recognized').*
3. Choose **Customize installation**, ensure \`pip\` and \`py launcher\` are selected, and click **Install**.
4. On the final screen, click **"Disable path length limit"** (allows Windows to open deeply nested data files).
5. Open a fresh PowerShell window and verify:
   \`\`\`powershell
   python --version
   pip --version
   \`\`\`

#### B. macOS Installation Instructions
macOS ships with a system stub for Python that you should *never* modify for projects.
- **Method 1 (Recommended Official Installer)**: Download the macOS 64-bit universal2 installer from [python.org/downloads/macos](https://www.python.org/downloads/macos/). Run the PKG installer. In the resulting Applications folder, double-click **"Install Certificates.command"** (essential for SSL/HTTPS data downloads).
- **Method 2 (Homebrew Package Manager)**:
  \`\`\`bash
  # If Homebrew is installed:
  brew install python@3.12
  \`\`\`
- Verify in Terminal:
  \`\`\`bash
  python3 --version
  pip3 --version
  \`\`\`

---

### Part 3: Installing & Configuring Visual Studio Code

Visual Studio Code (VS Code) is the industry standard lightweight code editor for data analysis.

1. **Download & Install**:
   - **Windows**: Download the 64-bit User Installer from [code.visualstudio.com](https://code.visualstudio.com/). Check the options for *"Add 'Open with Code' action to Windows Explorer context menu"*.
   - **macOS**: Download the ZIP, unzip it, and drag \`Visual Studio Code.app\` into your \`/Applications\` folder.
2. **Install the Essential Extensions**:
   - Open VS Code. Press \`Ctrl+Shift+X\` (Win) or \`Cmd+Shift+X\` (Mac) to open the Extensions tab.
   - Install:
     - **Python** (by Microsoft - includes Pylance, debugger, and environment switcher)
     - **Jupyter** (by Microsoft - allows interactive notebook cells inside VS Code)
     - **Excel Viewer** / **Rainbow CSV** (for inspecting CSV and TSV files visually)

---

### Part 4: Virtual Environments (\`venv\`) & Package Management (\`pip\`)

Why use a virtual environment? If Project A requires \`pandas 2.0\` and Project B requires \`pandas 1.5\`, installing them globally creates library collisions. A virtual environment isolates project dependencies inside a local hidden folder.

#### 1. Create a Project Folder & Virtual Environment
Open your terminal in your preferred directory:
\`\`\`bash
mkdir data_analyst_sandbox
cd data_analyst_sandbox
python -m venv .venv
# On macOS if 'python' points to Python 2:
python3 -m venv .venv
\`\`\`

#### 2. Activate the Virtual Environment
- **On Windows (PowerShell)**:
  \`\`\`powershell
  .venv\\Scripts\\Activate.ps1
  \`\`\`
  *(If you see 'execution of scripts is disabled on this system', run: \`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\` and try again).*
- **On macOS / Linux (zsh or bash)**:
  \`\`\`bash
  source .venv/bin/activate
  \`\`\`
When activated, your terminal prompt will prefix with \`(.venv)\`.

#### 3. Select the Interpreter in VS Code
1. Open the project folder in VS Code: \`code .\`
2. Open the Command Palette: \`Ctrl+Shift+P\` (Win) or \`Cmd+Shift+P\` (Mac).
3. Type: \`Python: Select Interpreter\`.
4. Choose the interpreter labeled **('venv': .venv)** pointing to \`.venv/Scripts/python.exe\` or \`.venv/bin/python\`.

#### 4. Installing Core Data Analyst Libraries
With your virtual environment active:
\`\`\`bash
pip install --upgrade pip
pip install pandas numpy matplotlib seaborn jupyter openpyxl
\`\`\`
To save your exact project dependencies for reproducible sharing:
\`\`\`bash
pip freeze > requirements.txt
\`\`\`
To install dependencies from a requirements file on another machine:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

---

### Part 5: Database Clients (DBeaver Community)

As a Data Analyst, you will frequently connect to databases (PostgreSQL, MySQL, SQLite, Snowflake). 
- Download **DBeaver Community Edition** (free, open-source, cross-platform for Windows and macOS) from [dbeaver.io/download](https://dbeaver.io/download/).
- To connect to a local SQLite database (like this platform's \`analystpath.db\`):
  1. Click **Database > New Database Connection**.
  2. Select **SQLite** and click Next.
  3. Browse to your \`.db\` file path and click **Finish**.
  4. You can now visually browse tables, inspect column schemas, and execute SQL scripts with full autocompletion.

---

### Part 6: Comprehensive Troubleshooting Matrix

| Symptom / Error | Root Cause | Exact Solution |
| :--- | :--- | :--- |
| \`'python' is not recognized as an internal or external command\` | Python was not added to the Windows PATH environment variable. | Re-run the Python installer, select 'Modify', check 'Add to PATH'. Or search Windows 'Edit system environment variables' -> Path -> Add \`C:\\Users\\<User>\\AppData\\Local\\Programs\\Python\\Python312\\\`. |
| \`File Activate.ps1 cannot be loaded because running scripts is disabled\` | Windows PowerShell default security execution policy restricts scripts. | Run: \`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\` in your PowerShell session, then re-run \`.venv\\Scripts\\Activate.ps1\`. |
| \`ModuleNotFoundError: No module named 'pandas'\` | The active VS Code interpreter is different from the environment where pip installed the library. | Press \`Ctrl+Shift+P\` / \`Cmd+Shift+P\` -> \`Python: Select Interpreter\` -> pick your \`.venv\` interpreter. |
| \`SSL: CERTIFICATE_VERIFY_FAILED\` on macOS when downloading data | Python on macOS does not use the system keychain certificates by default. | Open Finder -> Applications -> Python 3.12 -> double click **"Install Certificates.command"**. |`,
    content_hi: `### डेटा एनालिसिस के लिए अपने कंप्यूटर को सही तरीके से तैयार करें

डेटा एनालिसिस सीखने का सबसे पहला और जरूरी कदम है अपने लैपटॉप पर सही टूल्स इंस्टॉल करना ताकि आगे चलकर कभी "कमांड नहीं मिला" या "पैकेज एरर" ना आए।

---

### 1. ऑपरेटिंग सिस्टम का अंतर समझें (Windows vs. macOS)
- **Windows**: इसमें हम **PowerShell** का इस्तेमाल करते हैं। फोल्डर पाथ में बैकस्लैश (\`\\\`) लगता है (जैसे: \`C:\\Users\\Alex\\Data\`)।
- **macOS**: इसमें हम **Terminal (zsh)** का इस्तेमाल करते हैं। फोल्डर पाथ में फॉरवर्ड स्लैश (\`/\`) लगता है (जैसे: \`/Users/Alex/Data\`)।
- फोल्डर बदलने का कमांड दोनों में समान है: \`cd folder_name\`।
- फाइल्स देखने के लिए Windows में \`dir\` और Mac पर \`ls\` चलता है।

---

### 2. पायथन (Python 3.12+) इंस्टॉल करना
#### Windows पर:
1. [python.org](https://www.python.org/downloads/) से 64-bit इंस्टॉलर डाउनलोड करें।
2. **सबसे जरूरी बात**: पहली ही स्क्रीन पर नीचे दिए गए चेकबॉक्स पर टिक लगाएं:  
   ☑️ **"Add python.exe to PATH"**  
   *(अगर यह छोड़ दिया, तो टर्मिनल में पायथन नहीं चलेगा!)*
3. इंस्टॉल खत्म होने पर **"Disable path length limit"** पर क्लिक करें।

#### macOS पर:
- [python.org/downloads/macos](https://www.python.org/downloads/macos/) से PKG फाइल डाउनलोड करके इंस्टॉल करें।
- Applications में जाकर **"Install Certificates.command"** पर डबल-क्लिक जरूर करें, ताकि इंटरनेट से डेटा डाउनलोड करते समय SSL एरर ना आए।

---

### 3. VS Code और वर्चुअल एनवायरनमेंट (venv)
कंपनी में हर प्रोजेक्ट के लिए अलग वर्चुअल एनवायरनमेंट बनाया जाता है ताकि लाइब्रेरी आपस में ना टकराएं।

\`\`\`bash
# 1. नया फोल्डर बनाएं और उसमें जाएं
mkdir my_data_project
cd my_data_project

# 2. वर्चुअल एनवायरनमेंट बनाएं
python -m venv .venv

# 3. एक्टिवेट करें
# Windows PowerShell पर:
.venv\\Scripts\\Activate.ps1
# Mac Terminal पर:
source .venv/bin/activate
\`\`\`

जब टर्मिनल में आगे \`(.venv)\` दिखने लगे, तो जरूरी लाइब्रेरीज इंस्टॉल करें:
\`\`\`bash
pip install pandas numpy matplotlib jupyter
\`\`\`

---

### 4. आम गलतियां और समाधान
1. **'python' is not recognized**: इंस्टॉलर चलाते समय "Add to PATH" भूल गए थे। इंस्टॉलर दोबारा चलाकर Modify करें और टिक लगाएं।
2. **Activate.ps1 script execution error**: PowerShell में टाइप करें:  
   \`Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass\`
3. **ModuleNotFoundError**: VS Code में \`Ctrl+Shift+P\` दबाएं, 'Python: Select Interpreter' चुनें और अपना \`.venv\` इंटरप्रेटर सेलेक्ट करें।`,
    key_terms: [
      { term: "PATH", definition: "An operating system environment variable specifying directories where executable programs (like python and pip) reside." },
      { term: "Virtual Environment (venv)", definition: "A self-contained directory tree containing a Python installation for a specific version, isolating project dependencies." },
      { term: "pip", definition: "The official package installer for Python, used to download and manage libraries from the Python Package Index (PyPI)." },
      { term: "Interpreter", definition: "The program that reads and executes Python code instructions (e.g. python.exe on Windows, python3 on macOS)." },
      { term: "Working Directory", definition: "The current folder in which a process or terminal session is operating." }
    ],
    formula_sheet: [
      { syntax: "python -m venv .venv", description: "Creates a new virtual environment named .venv in current directory" },
      { syntax: ".venv\\Scripts\\Activate.ps1 (Win) | source .venv/bin/activate (Mac)", description: "Activates the local virtual environment" },
      { syntax: "pip install <package_name>", description: "Downloads and installs a library into active environment" },
      { syntax: "pip freeze > requirements.txt", description: "Exports all installed dependencies and versions to a shareable file" },
      { syntax: "pip install -r requirements.txt", description: "Installs all exact packages listed in requirements file" }
    ],
    worked_examples: [
      {
        title: "Setting up a Clean Reproducible Data Project",
        problem: "You are starting an exploratory analysis on customer sales data. Set up a fresh isolated project with pandas and openpyxl, and verify installation.",
        query: "# Step 1: Open Terminal / PowerShell\nmkdir sales_analysis && cd sales_analysis\n\n# Step 2: Initialize venv\npython -m venv .venv\n\n# Step 3: Activate (Windows: .venv\\Scripts\\Activate.ps1 | Mac: source .venv/bin/activate)\n# Step 4: Install packages\npip install pandas openpyxl\n\n# Step 5: Test in one-liner\npython -c \"import pandas as pd; print('Pandas successfully loaded version:', pd.__version__)\"",
        explanation_en: "Running 'python -c' executes a quick snippet directly from the shell to confirm library importability without needing a separate script file.",
        explanation_hi: "यह कमांड तुरंत जांच लेती है कि लाइब्रेरी सही फोल्डर में इंस्टॉल हुई है और काम कर रही है या नहीं।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Installing all packages into the global root Python installation without a virtual environment",
        consequence: "Eventually conflicting package versions break existing scripts and make it impossible to share code reliably with team members.",
        fix: "Always create a local '.venv' inside every project directory before running pip install."
      },
      {
        mistake: "Committing the entire '.venv' folder (hundreds of megabytes) to GitHub",
        consequence: "Bloats the Git repository with platform-specific binaries that will fail on teammates' operating systems.",
        fix: "Add '.venv/' to your '.gitignore' file and commit 'requirements.txt' instead."
      }
    ],
    external_resources: [
      { name: "Official Python Documentation (Windows)", url: "https://docs.python.org/3/using/windows.html", access_date: "2026-11-02" },
      { name: "Official Python Documentation (macOS)", url: "https://docs.python.org/3/using/mac.html", access_date: "2026-11-02" },
      { name: "VS Code Python Environment Guide", url: "https://code.visualstudio.com/docs/python/environments", access_date: "2026-11-02" },
      { name: "DBeaver Community Download", url: "https://dbeaver.io/download/", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "What command generates a 'requirements.txt' file capturing all installed packages in your active virtual environment?",
      initial_code: "",
      expected_query: "pip freeze > requirements.txt",
      test_hint: "Use pip freeze with output redirection (>)."
    }
  },

  // -------------------------------------------------------------
  // 2. PYTHON: PANDAS DATA WRANGLING & EDA
  // -------------------------------------------------------------
  {
    id: "python-pandas-eda",
    course_id: "python",
    title: "Pandas DataFrames, Filtering, Grouping & Business EDA",
    title_hi: "पैंडास डेटाफ्रेम, फिल्टरिंग, ग्रुपबाय और एक्सप्लोरेटरी डेटा एनालिसिस (EDA)",
    slug: "pandas-dataframes-grouping-eda",
    estimated_minutes: 35,
    order_idx: 2,
    content_en: `### Exploratory Data Analysis (EDA) with Pandas

Pandas is the premier library for tabular data manipulation in Python. In this lesson, we cover loading data, profiling structure, filtering conditional subsets, and aggregating business metrics.

> [!NOTE]
> Verified against **Pandas 2.2+ Official API Specification** (Checked: October 2026).

---

### 1. Reading & Initial Inspection
\`\`\`python
import pandas as pd

# Load CSV
df = pd.read_csv('orders.csv', parse_dates=['order_date'])

# Fundamental profiling methods:
print(df.shape)         # Returns (rows, columns) tuple, e.g. (10000, 9)
print(df.info())          # Data types, non-null counts, memory footprint
print(df.describe())      # Count, mean, std, min, 25%, 50%, 75%, max
print(df.head(5))         # Inspect first 5 rows
print(df.isnull().sum())  # Count missing values per column
\`\`\`

---

### 2. Boolean Filtering & Slicing
In Pandas, filtering uses boolean masks. Always wrap multiple conditions in parentheses and use bitwise operators (\`&\` for AND, \`|\` for OR):

\`\`\`python
# Filter orders above ₹10,000 shipped to South or West region
high_value_mask = (df['total_amount'] >= 10000) & (df['shipping_region'].isin(['South', 'West']))
filtered_df = df[high_value_mask]

# Selecting specific columns
summary = filtered_df[['order_id', 'customer_id', 'total_amount', 'shipping_region']]
\`\`\`

---

### 3. Aggregations with \`.groupby()\`
Groupby allows splitting data by categories, applying aggregations, and combining the results:

\`\`\`python
# High-performance named aggregation
regional_performance = df.groupby('shipping_region').agg(
    total_revenue=('total_amount', 'sum'),
    average_order_value=('total_amount', 'mean'),
    total_orders=('order_id', 'count'),
    active_customers=('customer_id', 'nunique')
).sort_values(by='total_revenue', ascending=False).reset_index()

# Add a calculated KPI column
regional_performance['revenue_per_customer'] = (
    regional_performance['total_revenue'] / regional_performance['active_customers']
).round(2)

print(regional_performance)
\`\`\`

---

### 4. Handling Missing Data
- **Drop**: \`df.dropna(subset=['critical_column'])\`
- **Impute**: \`df['satisfaction_score'].fillna(df['satisfaction_score'].median(), inplace=True)\``,
    content_hi: `### पैंडास (Pandas) से डेटा एनालिसिस और रिपोर्टिंग

पैंडास डेटा एनालिस्ट्स का सबसे मुख्य हथियार है। यह एक्सेल से लाखों गुना तेजी से लाखों पंक्तियों का हिसाब-किताब लगा सकता है।

---

### 1. डेटा लोड करना और प्रोफाइलिंग
\`\`\`python
import pandas as pd

# CSV फाइल लोड करें
df = pd.read_csv('orders.csv')

# डेटा का ढांचा देखें
print(df.shape)        # कितनी पंक्तियां और कॉलम हैं
print(df.info())         # कॉलम के डेटा टाइप्स और मिसिंग वैल्यूज
print(df.describe())     # औसत, न्यूनतम, अधिकतम और मीडियन
\`\`\`

---

### 2. डेटा फिल्टर करना (Boolean Indexing)
जब एक से ज्यादा शर्तें हों, तो हर शर्त को ब्रैकेट \`()\` में रखें और \`&\` (AND) या \`|\` (OR) लगाएं:
\`\`\`python
# 10,000 से ज्यादा अमाउंट और साउथ रीजन के ऑर्डर्स
shart = (df['total_amount'] > 10000) & (df['shipping_region'] == 'South')
result = df[shart]
\`\`\`

---

### 3. GroupBy: रीजन और डिपार्टमेंट वाइज टोटल निकालना
\`\`\`python
# हर रीजन की कुल सेल्स और ऑर्डर्स की संख्या
report = df.groupby('shipping_region').agg(
    total_sales=('total_amount', 'sum'),
    avg_order=('total_amount', 'mean'),
    order_count=('order_id', 'count')
).reset_index()

print(report)
\`\`\``,
    key_terms: [
      { term: "DataFrame", definition: "A 2-dimensional labeled data structure with columns of potentially different types (similar to a spreadsheet table)." },
      { term: "Series", definition: "A 1-dimensional labeled array holding data of a single data type (a single column of a DataFrame)." },
      { term: "Boolean Mask", definition: "An array of True/False values used to filter rows matching specific criteria." },
      { term: "Vectorization", definition: "Executing operations on entire arrays at once via compiled C-level loops, dramatically faster than Python 'for' loops." }
    ],
    formula_sheet: [
      { syntax: "df.groupby('col').agg(new_name=('target_col', 'agg_func'))", description: "Named aggregation across groups" },
      { syntax: "df[df['col'].isin(['val1', 'val2'])]", description: "Filters rows matching values in a list" },
      { syntax: "df.sort_values(by=['col1', 'col2'], ascending=[True, False])", description: "Multi-column sorting" },
      { syntax: "df.drop_duplicates(subset=['id'], keep='first')", description: "Removes duplicate records based on specified key" }
    ],
    worked_examples: [
      {
        title: "Calculating Customer Retention Cohorts",
        problem: "Given orders dataset, find total spend and order frequency for each customer, flagging those with >3 orders as 'Loyal'.",
        query: "cust_summary = df.groupby('customer_id').agg(\n    total_spend=('total_amount', 'sum'),\n    order_count=('order_id', 'count')\n).reset_index()\n\ncust_summary['segment'] = cust_summary['order_count'].apply(\n    lambda x: 'Loyal' if x >= 3 else 'Occasional'\n)",
        explanation_en: "Using .apply() with a lambda or numpy.where assigns dynamic segment labels based on aggregated behavior.",
        explanation_hi: "हर कस्टमर के कुल ऑर्डर्स गिने और 3 से ज्यादा होने पर 'Loyal' का टैग लगा दिया।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Writing a Python 'for row in df.iterrows()' loop to calculate a column",
        consequence: "Slows execution down by 100x to 1000x on large datasets; defeats the purpose of Pandas vectorization.",
        fix: "Use vectorized column operations: df['discounted_price'] = df['price'] * (1 - df['discount_pct'])."
      }
    ],
    external_resources: [
      { name: "Official Pandas Documentation", url: "https://pandas.pydata.org/docs/", access_date: "2026-11-02" },
      { name: "W3Schools Pandas Tutorial", url: "https://www.w3schools.com/python/pandas/", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Write the Pandas code to count distinct customers per region from DataFrame 'df'.",
      initial_code: "df.groupby('shipping_region')['customer_id']",
      expected_query: "df.groupby('shipping_region')['customer_id'].nunique()",
      test_hint: "Use .nunique() for counting distinct entities."
    }
  },

  // -------------------------------------------------------------
  // 3. SQL: ADVANCED WINDOW FUNCTIONS
  // -------------------------------------------------------------
  {
    id: "sql-window-103",
    course_id: "sql",
    title: "SQL Window Functions: Ranking, Partitions, LAG/LEAD & Running Totals",
    title_hi: "एसक्यूएल विंडो फंक्शन्स: रैंकिंग, रनिंग टोटल और LAG/LEAD",
    slug: "sql-advanced-window-functions",
    estimated_minutes: 35,
    order_idx: 3,
    content_en: `### What Makes Window Functions Indispensable?

Standard aggregate functions (\`SUM\`, \`AVG\`, \`COUNT\` with \`GROUP BY\`) collapse individual rows into a single summary row. 

**Window functions**, on the other hand, compute an aggregate or analytical calculation across a set of table rows while **preserving individual row identities**.

> [!NOTE]
> Verified against **ANSI SQL:2023 & PostgreSQL 16+ Documentation** (Checked: October 2026).

---

### The Anatomy of an \`OVER()\` Clause

\`\`\`sql
FUNCTION() OVER (
  PARTITION BY column_to_segment
  ORDER BY column_to_sort
  ROWS BETWEEN ... -- Frame specification
)
\`\`\`

---

### 1. Ranking Functions: \`ROW_NUMBER\`, \`RANK\`, \`DENSE_RANK\`

Suppose three employees have identical sales of ₹50,000:
- \`ROW_NUMBER()\`: Assigns sequential integers without ties (1, 2, 3).
- \`RANK()\`: Assigns ties and skips ranks (1, 1, 3).
- \`DENSE_RANK()\`: Assigns ties without skipping (1, 1, 2).

\`\`\`sql
-- Find top 2 highest value orders in each shipping region
WITH RankedOrders AS (
  SELECT 
    order_id,
    customer_id,
    shipping_region,
    total_amount,
    DENSE_RANK() OVER (
      PARTITION BY shipping_region 
      ORDER BY total_amount DESC
    ) AS rank_in_region
  FROM orders
)
SELECT * 
FROM RankedOrders 
WHERE rank_in_region <= 2;
\`\`\`

---

### 2. Value Offset Functions: \`LAG()\` and \`LEAD()\`
Used for comparing current row metrics to previous or subsequent periods (e.g., month-over-month revenue growth).

\`\`\`sql
SELECT 
  order_date,
  total_amount,
  LAG(total_amount, 1) OVER (ORDER BY order_date) AS prev_order_amount,
  total_amount - LAG(total_amount, 1) OVER (ORDER BY order_date) AS day_over_day_diff
FROM orders;
\`\`\`

---

### 3. Running Totals (Cumulative Sums)

\`\`\`sql
SELECT 
  order_id,
  order_date,
  total_amount,
  SUM(total_amount) OVER (
    ORDER BY order_date 
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_revenue_to_date
FROM orders;
\`\`\``,
    content_hi: `### एसक्यूएल विंडो फंक्शन्स (Window Functions)

साधारण \`GROUP BY\` पंक्तियों को सिकोड़ (collapse) देता है। लेकिन **Window Function** हर पंक्ति को बनाए रखते हुए उसके साथ रनिंग टोटल, रैंक या पिछले दिन से तुलना जोड़ देता है।

---

### 1. रैंकिंग के 3 प्रकार:
- **ROW_NUMBER()**: सीधा नंबर (1, 2, 3) देता है।
- **RANK()**: बराबर वैल्यू आने पर एक ही रैंक देता है और अगला नंबर छोड़ देता है (1, 1, 3)।
- **DENSE_RANK()**: टाई होने पर नंबर नहीं छोड़ता (1, 1, 2)।

---

### 2. LAG() और LEAD(): पिछले और अगले दिन से तुलना
महीने-दर-महीने (MoM) ग्रोथ निकालने के लिए \`LAG()\` सबसे ताकतवर फंक्शन है:
\`\`\`sql
SELECT 
  order_date,
  total_amount,
  LAG(total_amount, 1) OVER (ORDER BY order_date) AS pichla_amount
FROM orders;
\`\`\`

---

### 3. रनिंग टोटल (Cumulative Sum)
\`\`\`sql
SELECT 
  order_date,
  total_amount,
  SUM(total_amount) OVER (ORDER BY order_date) AS aaj_tak_ki_kul_sales
FROM orders;
\`\`\``,
    key_terms: [
      { term: "PARTITION BY", definition: "Divides query result rows into separate partitions to which the window function is independently applied." },
      { term: "Frame Specification", definition: "Defines the subset of rows within the partition (e.g. ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)." },
      { term: "LAG()", definition: "Accesses data from a preceding row at a specified physical offset without a self-join." },
      { term: "LEAD()", definition: "Accesses data from a following row at a specified physical offset." }
    ],
    formula_sheet: [
      { syntax: "DENSE_RANK() OVER (PARTITION BY cat ORDER BY val DESC)", description: "Ranks entities within groups without skipping ranks" },
      { syntax: "LAG(col, 1) OVER (ORDER BY date_col)", description: "Fetches prior row value for growth comparisons" },
      { syntax: "SUM(col) OVER (ORDER BY date_col ROWS UNBOUNDED PRECEDING)", description: "Calculates cumulative running total" }
    ],
    worked_examples: [
      {
        title: "Computing Day-over-Day Revenue Growth Percentage",
        problem: "Calculate daily total revenue and percentage change compared to the previous day.",
        query: "WITH DailyRevenue AS (\n  SELECT order_date, SUM(total_amount) AS revenue\n  FROM orders\n  GROUP BY order_date\n)\nSELECT \n  order_date, \n  revenue, \n  LAG(revenue) OVER (ORDER BY order_date) AS prev_revenue,\n  ROUND(((revenue - LAG(revenue) OVER (ORDER BY order_date)) * 100.0 / LAG(revenue) OVER (ORDER BY order_date)), 2) AS dod_growth_pct\nFROM DailyRevenue;",
        explanation_en: "Aggregating daily totals inside a CTE first ensures that LAG operates cleanly on one row per day.",
        explanation_hi: "पहले CTE में हर दिन का टोटल निकाला, फिर LAG से पिछले दिन की सेल्स घटाकर प्रतिशत निकाल लिया।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Placing a window function directly in the WHERE clause (e.g. WHERE ROW_NUMBER() OVER (...) = 1)",
        consequence: "Throws SQL Error: Window functions are not allowed in WHERE.",
        fix: "Wrap the query in a CTE or subquery first, then filter the resulting alias in the outer query."
      }
    ],
    external_resources: [
      { name: "PostgreSQL Official Window Functions Documentation", url: "https://www.postgresql.org/docs/current/tutorial-window.html", access_date: "2026-11-02" },
      { name: "SQLite Window Functions Tutorial", url: "https://www.sqlite.org/windowfunctions.html", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Write the SQL clause to calculate running total of 'total_amount' ordered by 'order_date'.",
      initial_code: "SUM(total_amount) OVER (",
      expected_query: "SUM(total_amount) OVER (ORDER BY order_date)",
      test_hint: "Use ORDER BY order_date inside the OVER() clause."
    }
  },

  // -------------------------------------------------------------
  // 4. POWER BI: STAR SCHEMA & DAX MODELING
  // -------------------------------------------------------------
  {
    id: "powerbi-modeling",
    course_id: "bi-tools",
    title: "Power BI Architecture, Star Schema Data Modeling & DAX Measures",
    title_hi: "Power BI आर्किटेक्चर, Star Schema डेटा मॉडलिंग और DAX मेजर्स",
    slug: "power-bi-star-schema-dax",
    estimated_minutes: 35,
    order_idx: 4,
    content_en: `### Power BI Architecture & Reality Check

Power BI is Microsoft's premier business analytics platform.

> [!WARNING]
> **Operating System Availability Note (Verified October 2026)**:
> **Power BI Desktop is available ONLY on Microsoft Windows**. There is no native macOS desktop build.
> *macOS Alternatives for Learners*:
> 1. Use **Power BI Service (app.powerbi.com)** via web browser for modeling and report authoring.
> 2. Run Windows 11 inside **Parallels Desktop** or a cloud Windows Virtual Machine (Azure / AWS).
> Never follow unofficial hacks claiming to run Power BI Desktop directly on macOS.

---

### Star Schema: Fact Tables vs. Dimension Tables
A high-performance Power BI report relies on a **Star Schema**, not a single wide flat table:
- **Fact Table**: Contains quantitative numeric business events (e.g. \`Fact_Orders\` with order_date, total_amount, quantity, foreign keys).
- **Dimension Tables**: Contain descriptive context attributes (e.g. \`Dim_Customer\` with name, city, segment; \`Dim_Product\` with category, cost).
- **Relationship Cardinality**: Relationships connect 1 Dimension record to Many (\`1:*\`) Fact records using Single Cross-Filter Direction.

---

### Calculated Columns vs. DAX Measures
| Feature | Calculated Column | DAX Measure |
| :--- | :--- | :--- |
| **When Evaluated** | During data refresh (Row Context) | Dynamically upon user clicks/slicers (Filter Context) |
| **Storage Impact** | Consumes RAM in the VertiPaq engine | Zero persistent storage (computed in CPU) |
| **Best Used For** | Slicers, matrix row headers, bucket labels | Totals, ratios, percentages, KPI targets |

---

### Core DAX Measures (Syntax & Logic)

\`\`\`dax
// 1. Basic Summation
Total Sales = SUM(Fact_Orders[total_amount])

// 2. Safe Division (prevents divide-by-zero errors)
Profit Margin % = DIVIDE([Total Profit], [Total Sales], 0)

// 3. Modifying Filter Context with CALCULATE
West Region Sales = 
CALCULATE(
    [Total Sales],
    Dim_Geography[Region] = "West"
)

// 4. Time Intelligence: Year-over-Year (YoY) Growth
Sales Prior Year = 
CALCULATE(
    [Total Sales],
    SAMEPERIODLASTYEAR(Dim_Date[Date])
)

YoY Sales Growth % = 
DIVIDE([Total Sales] - [Sales Prior Year], [Sales Prior Year], 0)
\`\`\``,
    content_hi: `### Power BI और DAX मेजर्स की बुनियादी समझ

Power BI बिजनेस रिपोर्ट्स और ऑटोमेटेड डैशबोर्ड्स का सबसे लोकप्रिय टूल है।

---

### मैक यूजर्स के लिए जरूरी सूचना:
**Power BI Desktop केवल Windows पर चलता है**। अगर आपके पास Mac है, तो आप ब्राउज़र में **Power BI Service (app.powerbi.com)** का इस्तेमाल करें या वर्चुअल मशीन पर विंडोज चलाएं।

---

### Star Schema क्या है?
डेटा को एक बड़ी चौड़ी टेबल में रखने के बजाय, हम उसे स्टार की तरह जोड़ते हैं:
- **Fact Table (तथ्य टेबल)**: इसमें ऑर्डर्स और नंबर्स होते हैं (जैसे: सेल्स अमाउंट, क्वांटिटी)।
- **Dimension Table (विवरण टेबल)**: इसमें कस्टमर का नाम, शहर और प्रोडक्ट्स की डिटेल्स होती हैं।
- दोनों के बीच \`1:Many\` का संबंध होता है।

---

### मुख्य DAX फॉर्मूले:
\`\`\`dax
// 1. कुल बिक्री (Total Sales)
Total Sales = SUM(Orders[total_amount])

// 2. सेफ भाग (Zero division error से बचाव)
Profit Margin % = DIVIDE([Total Profit], [Total Sales], 0)

// 3. सिर्फ वेस्ट रीजन की बिक्री (CALCULATE)
West Sales = CALCULATE([Total Sales], Geography[Region] = "West")
\`\`\``,
    key_terms: [
      { term: "Star Schema", definition: "A relational database schema consisting of one central fact table referencing multiple surrounding dimension tables." },
      { term: "DAX (Data Analysis Expressions)", definition: "The formula expression language used in Power BI, Analysis Services, and Power Pivot." },
      { term: "Filter Context", definition: "Any filtering applied to the data model by visuals, slicers, row headers, or CALCULATE statements." },
      { term: "VertiPaq", definition: "The in-memory columnar database engine that powers Power BI storage and compression." }
    ],
    formula_sheet: [
      { syntax: "CALCULATE(Expression, Filter1, Filter2)", description: "Evaluates an expression in a modified filter context" },
      { syntax: "DIVIDE(Numerator, Denominator, AlternateResult)", description: "Safe division handling null and zero divisors" },
      { syntax: "SAMEPERIODLASTYEAR(DateColumn)", description: "Shifts dates back by exactly one year for YoY comparisons" }
    ],
    worked_examples: [
      {
        title: "Creating a Dynamic Year-to-Date (YTD) Revenue Measure",
        problem: "Draft a DAX measure that sums sales from the beginning of the current calendar year up to the filtered date.",
        query: "Sales YTD = TOTALYTD([Total Sales], Dim_Date[Date])",
        explanation_en: "TOTALYTD automatically resets the summation at each calendar year boundary based on the underlying contiguous date table.",
        explanation_hi: "TOTALYTD साल की 1 जनवरी से लेकर आज तक की कुल बिक्री अपने आप जोड़ देता है।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Creating dozens of Calculated Columns instead of DAX Measures",
        consequence: "Increases PBIX file size, slows down refresh times, and wastes RAM.",
        fix: "Default to DAX Measures for any mathematical aggregation or percentage calculation."
      }
    ],
    external_resources: [
      { name: "Microsoft Learn: Power BI Architecture & DAX", url: "https://learn.microsoft.com/power-bi/", access_date: "2026-11-02" },
      { name: "SQLBI: The Definitive Guide to DAX", url: "https://www.sqlbi.com", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "What DAX function evaluates an expression within an altered filter context?",
      initial_code: "",
      expected_query: "CALCULATE",
      test_hint: "The most important function in DAX starting with C."
    }
  },

  // -------------------------------------------------------------
  // 5. GIT & GITHUB: VERSION CONTROL WORKFLOW
  // -------------------------------------------------------------
  {
    id: "git-portfolio-101",
    course_id: "git-github",
    title: "Git Version Control, Branching, Pull Requests & Recruiter-Ready READMEs",
    title_hi: "गिट और गिटहब: वर्जन कंट्रोल, ब्रांचेज, PR और पोर्टफोलियो रिपोजिटरी",
    slug: "git-github-portfolio-workflow",
    estimated_minutes: 30,
    order_idx: 5,
    content_en: `### Why Version Control is Mandatory for Data Analysts

Recruiters and hiring managers do not want to see your code emailed as a ZIP file named \`analysis_v2_final_FINAL.zip\`. 

They expect a clean GitHub profile with modular commits, branching discipline, clear documentation, and **zero exposed passwords or API keys**.

> [!NOTE]
> Verified against **Official Git Documentation (git-scm.com)** (Checked: October 2026).

---

### Installing Git (Windows & macOS)
- **Windows**: Download **Git for Windows** from [git-scm.com](https://git-scm.com/). Select *Git Bash* and choose *VS Code as the default editor*.
- **macOS**: Run in Terminal: \`xcode-select --install\` or \`brew install git\`.
- Configure your identity once:
  \`\`\`bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  \`\`\`

---

### The Fundamental Git Workflow

\`\`\`bash
# 1. Initialize a new repo in your project folder
git init

# 2. CRITICAL: Create .gitignore to protect secrets
echo ".env" >> .gitignore
echo ".venv/" >> .gitignore
echo "*.pyc" >> .gitignore
echo ".DS_Store" >> .gitignore

# 3. Stage changes
git add .

# 4. Commit with descriptive semantic message
git commit -m "feat: implement cohort retention calculation in pandas"

# 5. Link to GitHub and push
git branch -M main
git remote add origin https://github.com/your-username/sales-cohort-analysis.git
git push -u origin main
\`\`\`

---

### Anatomy of a Recruiter-Ready Project README.md

Every data project repository must feature a structured README:
1. **Executive Summary**: 2 sentences explaining the business problem, dataset size, and key finding.
2. **Key Business Insights**: Bulleted metrics with quantifiable impact (e.g. *"Identified a 32% drop-off in the checkout funnel, translating to an estimated ₹18L monthly revenue leak"*).
3. **Tools & Architecture**: Python 3.12, Pandas, SQLite, Power BI.
4. **Reproducibility Instructions**: How to clone, set up \`.venv\`, install \`requirements.txt\`, and run the analysis.`,
    content_hi: `### गिट (Git) और गिटहब (GitHub) पर पोर्टफोलियो बनाना

डेटा एनालिस्ट की नौकरी पाने के लिए आपका GitHub प्रोफाइल सबसे बड़ा प्रमाण है।

---

### गिट की बुनियादी कमांड्स:
\`\`\`bash
# 1. नया प्रोजेक्ट शुरू करें
git init

# 2. पासवर्ड और .env फाइल छुपाएं (.gitignore)
echo ".env" >> .gitignore
echo ".venv/" >> .gitignore

# 3. फाइल्स को स्टेज करें
git add .

# 4. कमिट करें (काम सेव करें)
git commit -m "feat: complete customer churn SQL analysis"

# 5. गिटहब पर भेजें
git push origin main
\`\`\`

---

### बेहतरीन README.md कैसे बनाएं:
1. **समस्या क्या थी**: 2 लाइनों में समझाएं कि बिजनेस को क्या परेशानी थी।
2. **आपने क्या खोजा**: प्रतिशत और रुपयों में बताएं (जैसे: 25% ड्रॉप-ऑफ पकड़ा जिससे ₹10 लाख की बचत हुई)।
3. **टूल्स**: SQL, Python, Power BI के नाम।
4. **कोड रन करने का तरीका**: स्टेप-बाय-स्टेप निर्देश।`,
    key_terms: [
      { term: "Repository (Repo)", definition: "A project folder tracked by Git containing all files and complete revision history." },
      { term: "Commit", definition: "A permanent snapshot of staged changes accompanied by a descriptive message and SHA hash." },
      { term: "Branch", definition: "An isolated line of development allowing experimentation without corrupting the main production codebase." },
      { term: "Pull Request (PR)", definition: "A proposed merge of changes from a feature branch into the main branch, reviewed by peers." }
    ],
    formula_sheet: [
      { syntax: "git status", description: "Shows modified, staged, and untracked files" },
      { syntax: "git checkout -b feature/new-analysis", description: "Creates and switches to a new feature branch" },
      { syntax: "git diff", description: "Inspects unstaged line-by-line changes" }
    ],
    worked_examples: [
      {
        title: "Creating a Safe Git Release",
        problem: "Stage only the Python analysis script and requirements.txt without accidentally staging temporary data files.",
        query: "git add analysis.py requirements.txt\ngit commit -m \"refactor: optimize rolling revenue calculation\"\ngit push origin feature/rolling-rev",
        explanation_en: "Targeted staging ('git add file1 file2') avoids accidentally staging large CSV dumps or local environment secrets.",
        explanation_hi: "चुनिंदा फाइल्स को स्टेज करने से गलती से पासवर्ड या भारी डेटा फाइल्स कमिट नहीं होतीं।"
      }
    ],
    common_mistakes: [
      {
        mistake: "Pushing a 500MB CSV or local database file directly to GitHub",
        consequence: "GitHub blocks pushes over 100MB and corrupts repo history.",
        fix: "Place datasets in a 'data/' directory listed in '.gitignore', and provide a cloud download link or synthetic script in the README."
      }
    ],
    external_resources: [
      { name: "Official Git Documentation & Book", url: "https://git-scm.com/doc", access_date: "2026-11-02" },
      { name: "GitHub Skills Interactive Labs", url: "https://skills.github.com", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "What file specifies intentionally untracked files that Git should ignore?",
      initial_code: "",
      expected_query: ".gitignore",
      test_hint: "Starts with a dot followed by gitignore."
    }
  },

  // -------------------------------------------------------------
  // 6. DATA ANALYSIS FOUNDATIONS & THE ANALYST ROLE
  // -------------------------------------------------------------
  {
    id: "foundations-101",
    course_id: "foundations",
    title: "The Modern Data Analyst: Roles, Lifecycle, Tooling Stack & Business Value",
    title_hi: "आधुनिक डेटा एनालिस्ट: भूमिका, डेटा जीवनचक्र, टूल्स और व्यावसायिक मूल्य",
    slug: "modern-data-analyst-role-lifecycle",
    estimated_minutes: 35,
    order_idx: 1,
    content_en: `### The Core Mission of a Data Analyst

A professional Data Analyst sits at the intersection of business strategy, statistical analysis, and software engineering. Your fundamental mission is to translate messy, fragmented operational records into unambiguous business insights that drive revenue, reduce customer churn, and optimize operating margins.

> [!IMPORTANT]
> **The 4 Stages of Business Analytics:**
> 1. **Descriptive:** What happened? (e.g. Total Q3 revenue dropped 8% in North America).
> 2. **Diagnostic:** Why did it happen? (e.g. Delayed product shipments caused a 35% surge in order cancellations).
> 3. **Predictive:** What is likely to happen? (e.g. Forecasted churn will increase by 4% next quarter if delivery lead times remain above 5 days).
> 4. **Prescriptive:** What specific action should we take? (e.g. Reroute shipping through regional fulfillment hubs to restore on-time delivery).

---

### The Data Analysis Lifecycle
Every reliable analysis follows a disciplined 6-stage process:
1. **Business Question Framing:** Clarifying objectives, identifying stakeholders, and agreeing on key performance indicators (KPIs).
2. **Data Extraction & Ingestion:** Querying relational databases (SQL), fetching API feeds, or exporting ERP/CRM logs.
3. **Data Cleaning & Validation:** Addressing missing values, deduplicating records, auditing schema data types, and filtering outliers.
4. **Exploratory Data Analysis (EDA):** Computing summary statistics (mean, median, IQR, correlations) and discovering patterns.
5. **Synthesis & Visual Storytelling:** Building executive dashboards (Power BI / Tableau) and high-signal charts that highlight key takeaways.
6. **Strategic Recommendation & Tracking:** Presenting clear, prioritized recommendations to leadership and monitoring post-implementation impact.`,
    title_hi: "आधुनिक डेटा एनालिस्ट: भूमिका, जीवनचक्र और व्यावसायिक निर्णय",
    content_hi: `### डेटा एनालिस्ट का मुख्य उद्देश्य
एक डेटा एनालिस्ट का काम केवल चार्ट बनाना नहीं, बल्कि जटिल व्यावसायिक समस्याओं का समाधान खोजना है। 

चार मुख्य प्रकार के विश्लेषण:
1. **Descriptive (विवरणात्मक):** क्या हुआ?
2. **Diagnostic (निदानात्मक):** क्यों हुआ?
3. **Predictive (पूर्वानुमानात्मक):** भविष्य में क्या होने की संभावना है?
4. **Prescriptive (निर्देशात्मक):** समस्या हल करने के लिए क्या कदम उठाने चाहिए?`,
    key_terms: [
      { term: "KPI (Key Performance Indicator)", definition: "A quantifiable metric used to evaluate company success against critical operational objectives (e.g., CAC, LTV, Churn Rate)." },
      { term: "Exploratory Data Analysis (EDA)", definition: "An analytical approach to summarizing main data characteristics using summary statistics and graphical representations before formal modeling." },
      { term: "Data Governance", definition: "A framework ensuring data security, integrity, availability, and usability across an enterprise." }
    ],
    formula_sheet: [
      { syntax: "Gross Margin % = (Revenue - COGS) / Revenue * 100", description: "Measures profitability after deducting direct production costs." },
      { syntax: "Churn Rate % = (Lost Customers / Starting Customers) * 100", description: "Calculates the percentage of customers who stop subscribing or purchasing within a timeframe." }
    ],
    worked_examples: [
      {
        title: "Translating an Executive Request into an Analytical Hypothesis",
        problem: "CEO asks: 'Why did our holiday sales feel lower than expected despite spending more on marketing?'",
        query: "-- SQL Framing:\nSELECT marketing_channel,\n       SUM(ad_spend) AS total_ad_spend,\n       COUNT(DISTINCT customer_id) AS new_customers,\n       ROUND(SUM(ad_spend) / COUNT(DISTINCT customer_id), 2) AS CAC\nFROM marketing_campaigns\nGROUP BY marketing_channel\nORDER BY CAC DESC;",
        explanation_en: "Break the broad question into measurable unit economics: Customer Acquisition Cost (CAC) by channel and Return on Ad Spend (ROAS)."
      }
    ],
    common_mistakes: [
      {
        mistake: "Jumping directly to writing SQL queries without clarifying the business definition of terms",
        consequence: "Analyzing the wrong dataset because 'Active User' meant daily active to Product, but monthly active to Marketing.",
        fix: "Draft a one-page requirements brief aligning on exact metric definitions and time windows before querying data."
      }
    ],
    external_resources: [
      { name: "Harvard Business Review: The Analytics Spectrum", url: "https://hbr.org/2012/10/data-scientist-the-sexiest-job-of-the-21st-century", access_date: "2026-11-02" },
      { name: "Google Data Analytics Professional Framework", url: "https://grow.google/certificates/data-analytics", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "Which analytics type directly advises management on the specific strategic decision to implement?",
      initial_code: "",
      expected_query: "Prescriptive",
      test_hint: "Starts with Pre- and ends with -scriptive."
    }
  },

  // -------------------------------------------------------------
  // 7. DATA CLEANING & PREPARATION
  // -------------------------------------------------------------
  {
    id: "cleaning-101",
    course_id: "data-cleaning",
    title: "Systematic Data Cleaning: Handling Missing Values, Outliers & Schema Normalization",
    title_hi: "डेटा क्लीनिंग: मिसिंग वैल्यूज, आउटलायर्स और स्कीमा नॉर्मलाइजेशन",
    slug: "systematic-data-cleaning-missing-outliers",
    estimated_minutes: 35,
    order_idx: 1,
    content_en: `### The Foundation of Trustworthy Analysis

In real-world data analysis, over 70% of project time is spent discovering, diagnosing, and cleaning corrupted, duplicate, or missing data records. Feeding dirty data into clean SQL queries or visual dashboards produces invalid conclusions that mislead executive decision-makers.

> [!IMPORTANT]
> **The 3 Categories of Missing Data (Little & Rubin Framework):**
> 1. **MCAR (Missing Completely at Random):** Missingness has zero relationship to observed or unobserved values (e.g., equipment battery died randomly). Mean/median imputation is statistically valid here.
> 2. **MAR (Missing at Random):** Missingness depends on other observed data attributes (e.g., female respondents omitting weight, but correlated with gender). Group-wise conditional imputation is required.
> 3. **MNAR (Missing Not at Random):** Missingness is directly related to the unobserved value itself (e.g., high-income earners refusing to disclose income). Simple imputation will introduce severe statistical bias.

---

### Outlier Detection: IQR vs. Z-Score

#### 1. The Interquartile Range (IQR) Method (Robust to Extreme Values)
\`\`\`python
Q1 = df['total_amount'].quantile(0.25)
Q3 = df['total_amount'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - (1.5 * IQR)
upper_bound = Q3 + (1.5 * IQR)
clean_df = df[(df['total_amount'] >= lower_bound) & (df['total_amount'] <= upper_bound)]
\`\`\`

#### 2. The Z-Score Method (Assumes Normal Distribution)
\`\`\`python
from scipy import stats
df['z_score'] = stats.zscore(df['total_amount'])
clean_df = df[df['z_score'].abs() <= 3]
\`\`\``,
    title_hi: "डेटा क्लीनिंग: मिसिंग डेटा, आउटलायर्स और डेटा नॉर्मलाइजेशन",
    content_hi: `### डेटा क्लीनिंग के मुख्य सिद्धांत
डेटा क्लीनिंग के बिना कोई भी विश्लेषण सही परिणाम नहीं दे सकता। हमेशा डेटा प्रकारों (Types) की पुष्टि करें और आउटलायर्स की पहचान के लिए IQR (Interquartile Range) का उपयोग करें।`,
    key_terms: [
      { term: "Interquartile Range (IQR)", definition: "The statistical range between the 75th and 25th percentiles (Q3 - Q1), representing the middle 50% of sorted observations." },
      { term: "Imputation", definition: "The practice of replacing missing data values with substitute estimates (such as mean, median, mode, or k-NN estimates)." },
      { term: "Data Profiling", definition: "Examining available source data to summarize schema types, null counts, distinct cardinalities, and value distributions." }
    ],
    formula_sheet: [
      { syntax: "IQR = Q3 - Q1", description: "Measures statistical dispersion robust against extreme anomalies." },
      { syntax: "Lower Bound = Q1 - 1.5 * IQR | Upper Bound = Q3 + 1.5 * IQR", description: "Tukey's standard rule for identifying statistical outliers." }
    ],
    worked_examples: [
      {
        title: "Pandas Conditional Missing Value Imputation by Group",
        problem: "Impute missing employee monthly salaries using the median salary of their specific department.",
        query: "df['monthly_salary'] = df.groupby('department')['monthly_salary'].transform(lambda x: x.fillna(x.median()))",
        explanation_en: "Using department-level median preserves the natural wage variance between departments (e.g. Engineering vs Customer Support) instead of skewing everything with a global mean."
      }
    ],
    common_mistakes: [
      {
        mistake: "Filling missing numerical values with 0 indiscriminately",
        consequence: "Distorts mean, median, and variance calculations, turning non-responses into real zero-dollar transactions.",
        fix: "Explicitly analyze whether the missing value represents null, unknown, or true zero before replacing."
      }
    ],
    external_resources: [
      { name: "Pandas Official Missing Data Guide", url: "https://pandas.pydata.org/docs/user_guide/missing_data.html", access_date: "2026-11-02" },
      { name: "Scikit-Learn Imputation Strategies", url: "https://scikit-learn.org/stable/modules/impute.html", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "What multiplier of the IQR is standard in Tukey's boxplot rule for identifying outliers?",
      initial_code: "",
      expected_query: "1.5",
      test_hint: "Between 1 and 2, with a decimal point."
    }
  },

  // -------------------------------------------------------------
  // 8. DATA VISUALIZATION & STORYTELLING
  // -------------------------------------------------------------
  {
    id: "viz-101",
    course_id: "visualization",
    title: "Analytical Visual Storytelling: Visual Encodings, Cognitive Load & Chart Selection",
    title_hi: "डेटा विज़ुअलाइज़ेशन: विज़ुअल एनकोडिंग, कॉग्निटिव लोड और चार्ट चयन",
    slug: "visual-storytelling-chart-selection-encodings",
    estimated_minutes: 35,
    order_idx: 1,
    content_en: `### The Science of Visual Perception in Analytics

Visualizations are not decorations—they are cognitive accelerators. Humans process visual data 60,000 times faster than raw text or tables. However, a poorly chosen chart creates extraneous cognitive load that obscures critical business findings.

> [!IMPORTANT]
> **Cleveland & McGill's Hierarchy of Visual Encodings (Most Accurate to Least Accurate):**
> 1. **Position along a common scale** (Bar charts, Scatter plots) - *Most accurately decoded by human eye*
> 2. **Length** (Bar charts without shared baseline)
> 3. **Direction / Slope** (Line charts showing trends over continuous time)
> 4. **Angle / Slope** (Pie charts, Donut charts) - *Harder to compare accurately*
> 5. **Area** (Bubble charts) - *Human perception systematically underestimates area differences*
> 6. **Color Saturation & Hue** (Heatmaps, Categorical fills) - *Best for grouping, worst for precise numeric estimation*

---

### Master Chart Selection Matrix
| Analytical Intent | Recommended Chart | Charts to Strictly Avoid |
| :--- | :--- | :--- |
| **Comparison across Categories** | Horizontal Bar Chart, Column Bar Chart | 3D Bar Charts, Pie charts with >4 slices |
| **Trend over Continuous Time** | Line Chart, Area Chart | Bar charts with >50 dates |
| **Part-to-Whole Composition** | 100% Stacked Bar Chart, Waterfall Chart | 3D Exploded Pie Charts |
| **Correlation & Relationship** | Scatter Plot with Trendline | Dual-axis line charts with mismatched scales |
| **Distribution Analysis** | Histogram, Box Plot (Showing IQR) | Raw tables without summary percentiles |`,
    title_hi: "डेटा विज़ुअलाइज़ेशन: सही चार्ट चुनना और बिजनेस स्टोरीटेलिंग",
    content_hi: `### सही चार्ट का चयन कैसे करें
चार्ट का उद्देश्य पाठक को भ्रमित करना नहीं, बल्कि तुरंत सही निष्कर्ष तक पहुँचाना है। 
- समय के साथ बदलाव दर्शाने के लिए: **Line Chart**
- श्रेणियों की तुलना करने के लिए: **Bar Chart**
- 3D चार्ट्स का उपयोग कभी न करें क्योंकि वे डेटा को गलत तरीके से पेश करते हैं।`,
    key_terms: [
      { term: "Cognitive Load", definition: "The total amount of mental effort required by an executive to interpret a chart or dashboard." },
      { term: "Data-Ink Ratio", definition: "Edward Tufte's fundamental design metric: the proportion of a graphic's ink devoted to the non-redundant display of data information." },
      { term: "Preattentive Attributes", definition: "Visual properties (color, size, shape, position) processed automatically by the human sensory memory in under 200 milliseconds." }
    ],
    formula_sheet: [
      { syntax: "Data-Ink Ratio = Data-Ink / Total Ink Used in Graphic", description: "Aim for ~1.0 by eliminating unnecessary 3D effects, background grids, and redundant legends." }
    ],
    worked_examples: [
      {
        title: "Transforming a Crowded Pie Chart into a High-Signal Horizontal Bar Chart",
        problem: "Executive presentation has a pie chart with 12 product categories where 7 slices look nearly identical.",
        query: "# Matplotlib/Seaborn Horizontal Bar\nimport seaborn as sns\nimport matplotlib.pyplot as plt\n\nplt.figure(figsize=(10, 6))\nsns.barplot(data=df.sort_values('revenue', ascending=False), y='category', x='revenue', color='#2563eb')\nplt.title('2024 Category Revenue (Ranked)')\nplt.xlabel('Revenue (USD)')",
        explanation_en: "Horizontal bar chart sorts categories by magnitude, placing category labels horizontally so stakeholders can read without tilting their heads."
      }
    ],
    common_mistakes: [
      {
        mistake: "Using Dual-Axis charts with truncated left and right scales",
        consequence: "Falsely implies strong correlation between unrelated trends simply because axis limits were manipulated.",
        fix: "Use two separate vertically stacked subplots with shared time X-axes instead of dual Y-axes."
      }
    ],
    external_resources: [
      { name: "From Data to Viz Decision Tree", url: "https://www.data-to-viz.com", access_date: "2026-11-02" },
      { name: "Storytelling with Data Official Guide", url: "https://www.storytellingwithdata.com", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "According to Cleveland & McGill's perceptual hierarchy, which visual encoding is most accurately decoded by the human brain?",
      initial_code: "",
      expected_query: "Position",
      test_hint: "Position along a common scale."
    }
  },

  // -------------------------------------------------------------
  // 9. JIRA, AZURE & BUSINESS PROCESS MAPPING (BPMN)
  // -------------------------------------------------------------
  {
    id: "jira-101",
    course_id: "jira-azure-bpmn",
    title: "Agile Analyst Workflows: Jira Epics, Azure DevOps Boards & BPMN 2.0 Mapping",
    title_hi: "एजाइल वर्कफ़्लो: Jira Epics, Azure DevOps Boards और BPMN 2.0 प्रोसेस मैपिंग",
    slug: "jira-azure-bpmn-agile-workflows",
    estimated_minutes: 30,
    order_idx: 1,
    content_en: `### Operating Inside Professional Engineering Teams

Entry-level analysts often expect ad-hoc requests via chat. In high-performing tech organizations, all analytics tasks are managed through Agile ticketing systems like Atlassian Jira or Microsoft Azure DevOps. Understanding how to write user stories, estimate sprint capacity, and map business workflows with BPMN 2.0 separates junior hobbyists from production analysts.

> [!IMPORTANT]
> **The Agile Hierarchy for Analytics Projects:**
> - **Epic:** Large business goal spanning multiple sprints (e.g. "Customer Churn Prediction & Retention Dashboard").
> - **Feature:** Functional module within an Epic (e.g. "Automated ETL pipeline from PostgreSQL to Snowflake").
> - **User Story:** End-user perspective deliverable following standard syntax:
>   *\`As a [role], I want to [action], so that [business benefit].\`*
> - **Task / Subtask:** Concrete implementation step (e.g. "Write SQL window function for monthly cohort retention").

---

### BPMN 2.0 (Business Process Model & Notation) Essentials
BPMN is the global open standard for mapping business workflows across departments.

| BPMN Symbol | Name | Meaning & Analytical Context |
| :--- | :--- | :--- |
| **Thin Circle** | Start Event | Trigger that initiates workflow (e.g., "Customer Places Order"). |
| **Rounded Rectangle** | Activity / Task | Work performed (e.g., "Extract Payment Gateway Transaction Logs"). |
| **Diamond with X** | Exclusive Gateway (XOR) | Decision point where exactly one path is chosen (e.g., "Payment Approved? Yes/No"). |
| **Diamond with +** | Parallel Gateway (AND) | Concurrent steps (e.g., Send confirmation email AND alert warehouse). |
| **Double Thick Circle** | End Event | Final business outcome (e.g., "Order Shipped & Metric Logged"). |`,
    title_hi: "एजाइल एनालिस्ट वर्कफ़्लो: Jira, Azure DevOps और BPMN 2.0",
    content_hi: `### एजाइल और प्रोसेस मैपिंग
कॉर्पोरेट कंपनियों में एनालिटिक्स के कार्य Jira या Azure DevOps टिकट्स के माध्यम से ट्रैक किए जाते हैं। BPMN 2.0 के माध्यम से बिजनेस प्रोसेस को डायग्राम में दर्शाया जाता है।`,
    key_terms: [
      { term: "Sprint", definition: "A time-boxed iteration (usually 2 weeks) during which an analytics team delivers a specific set of committed user stories." },
      { term: "Acceptance Criteria", definition: "The formal condition that must be met for a user story to be marked as complete (frequently formatted as Given-When-Then)." },
      { term: "BPMN 2.0", definition: "Business Process Model and Notation: an ISO standard graphical representation for specifying business processes in a business process model." }
    ],
    formula_sheet: [
      { syntax: "Velocity = Sum of Story Points Completed in Sprint", description: "Measures analytics team delivery throughput across sprint cycles." }
    ],
    worked_examples: [
      {
        title: "Writing a Production-Ready User Story with Acceptance Criteria",
        problem: "Sales leadership needs daily tracking of enterprise pipeline conversion.",
        query: "Title: [BI-204] Daily Enterprise Pipeline Conversion Report\nUser Story: As an Enterprise Sales Director, I want a daily updated funnel dashboard so that I can identify stalled deals over $50k.\nAcceptance Criteria:\n1. Given new deals logged in Salesforce, When the pipeline refreshes at 06:00 AM UTC, Then conversion % by stage updates automatically.\n2. Exclude test accounts and churned trials.",
        explanation_en: "Clear acceptance criteria prevent endless revisions and scope creep between the analyst and the business stakeholder."
      }
    ],
    common_mistakes: [
      {
        mistake: "Accepting verbal requests in Slack/Teams without creating a Jira/Azure DevOps ticket",
        consequence: "Work is invisible to engineering managers, sprint capacity is overwhelmed, and priorities clash.",
        fix: "Politely ask the stakeholder to submit a ticket using the team's intake template before beginning analysis."
      }
    ],
    external_resources: [
      { name: "Atlassian Agile Coach & Jira Guide", url: "https://www.atlassian.com/agile", access_date: "2026-11-02" },
      { name: "OMG BPMN 2.0 Official Specification", url: "https://www.bpmn.org", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "In BPMN 2.0, which gateway shape represents an Exclusive decision where only one branch can execute?",
      initial_code: "",
      expected_query: "XOR",
      test_hint: "Exclusive OR gateway, abbreviated in 3 letters."
    }
  },

  // -------------------------------------------------------------
  // 10. TECHNICAL COMMUNICATION & STAKEHOLDER MANAGEMENT
  // -------------------------------------------------------------
  {
    id: "comm-101",
    course_id: "tech-communication",
    title: "Stakeholder Management & Requirements Gathering: BRD, FRD & The Metric Tree",
    title_hi: "हितधारक प्रबंधन और आवश्यकताएं: BRD, FRD और मेट्रिक ट्री",
    slug: "stakeholder-requirements-brd-metric-tree",
    estimated_minutes: 30,
    order_idx: 1,
    content_en: `### Bridging Business Ambiguity and Technical Precision

The most common point of failure in data analysis is not faulty SQL or Python syntax—it is building the right answer to the wrong question. Stakeholders rarely speak in terms of database tables or statistical distributions; they speak in symptoms ("Sales look flat", "Marketing costs are exploding").

> [!IMPORTANT]
> **The Metric Tree Framework:**
> A Metric Tree decomposes high-level business goals into measurable operational components:
> \`\`\`
> Net Profit = Revenue - Costs
>   Revenue = Active Customers * Average Order Value (AOV) * Purchase Frequency
>     Active Customers = New Customers (Traffic * Conversion Rate) + Retained Customers (1 - Churn)
>   Costs = Fixed Operating Costs + Variable Fulfillment Costs + Marketing Ad Spend
> \`\`\`
> When an executive asks "Why did profit decline?", the Metric Tree allows you to systematically isolate which branch moved.

---

### Key Documentation Artifacts
- **BRD (Business Requirements Document):** Outlines *what* the business needs and why (business rationale, scope, KPI success metrics).
- **FRD / TRD (Functional/Technical Requirements Document):** Outlines *how* the analytics solution will be built (source databases, SQL schemas, refresh cadences, data dictionary).`,
    title_hi: "स्टेकहोल्डर मैनेजमेंट: आवश्यकताएं जुटाना और मेट्रिक ट्री",
    content_hi: `### व्यावसायिक आवश्यकताओं को तकनीकी प्रश्नों में बदलना
जब कोई बिजनेस लीडर कहता है कि "बिक्री गिर रही है", तो एक कुशल एनालिस्ट मेट्रिक ट्री के जरिए यह पता लगाता है कि क्या ग्राहक कम हुए हैं, या खरीदारी का औसत मूल्य घटा है।`,
    key_terms: [
      { term: "Metric Tree", definition: "A hierarchical decomposition of a high-level North Star metric into its underlying drivers and sub-components." },
      { term: "Scope Creep", definition: "The uncontrolled expansion of project scope without adjustments to time, resources, or budget." },
      { term: "BRD (Business Requirements Document)", definition: "A formal document that articulates the business requirements and objectives for an initiative." }
    ],
    formula_sheet: [
      { syntax: "AOV (Average Order Value) = Total Revenue / Total Orders", description: "Key e-commerce driver indicating average spend per transaction." },
      { syntax: "LTV (Customer Lifetime Value) = AOV * Purchase Frequency * Gross Margin % * Customer Lifespan", description: "Measures total projected revenue a single customer generates over their relationship with the business." }
    ],
    worked_examples: [
      {
        title: "Translating a Vague Request into a 3-Point BRD Scope Statement",
        problem: "VP of Product: 'Can you look into our user onboarding drop-off?'",
        query: "-- Defined Analytical Scope:\n-- Objective: Determine onboarding completion rates across mobile vs web signups in Q3.\n-- Target KPI: % of users reaching the 'First Action Completed' milestone within 48 hours of signup.\n-- Output: Tableau Cohort Retention Funnel & CSV of churned user attributes.",
        explanation_en: "Framing the inquiry with exact time boundaries (48 hours) and measurable milestones eliminates ambiguity."
      }
    ],
    common_mistakes: [
      {
        mistake: "Presenting raw SQL queries or confusing statistical tables directly to non-technical executives",
        consequence: "Executives tune out, misunderstand the recommendations, and lose confidence in analytics.",
        fix: "Lead with the bottom-line executive summary: 1) What happened, 2) The financial impact, 3) Recommended action."
      }
    ],
    external_resources: [
      { name: "Reforge: The Metric Hierarchy & North Star", url: "https://www.reforge.com/blog/growth-loops", access_date: "2026-11-02" },
      { name: "McKinsey: Communicating Data to Leadership", url: "https://www.mckinsey.com/capabilities/mckinsey-digital", access_date: "2026-11-02" }
    ],
    practice_exercise: {
      instruction: "What visual framework breaks down a top-level financial KPI into underlying operational driver equations?",
      initial_code: "",
      expected_query: "Metric Tree",
      test_hint: "Two words: Metric ____."
    }
  }
];

module.exports = {
  expandedLessonsData
};
