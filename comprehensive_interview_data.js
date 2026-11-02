// comprehensive_interview_data.js - Complete Entry-Level to Senior Data Analyst Interview Bank
// Covers Technical (SQL, Python, Excel, Stats, BI), Business Cases, Portfolio Defense, Behavioral STAR, and Reverse Questions.

const comprehensiveInterviewQuestions = [
  // ---------------------------------------------------------------------------
  // 1. SQL & DATABASES
  // ---------------------------------------------------------------------------
  {
    id: "int_sql_01",
    category: "SQL Technical",
    sub_category: "Aggregations & Filtering",
    difficulty: "Intermediate",
    stage: "Technical Screen",
    role_type: "Entry-Level / Junior Data Analyst",
    skill_assessed: "SQL Logical Execution Order & Clause Differences",
    question_en: "What is the exact difference between WHERE and HAVING in SQL, and can you write a query demonstrating both?",
    question_hi: "SQL में WHERE और HAVING में क्या अंतर है? दोनों का उपयोग करते हुए एक क्वेरी लिखकर समझाइए।",
    answer_structure: [
      "1. State the fundamental distinction: WHERE operates on individual rows before grouping; HAVING operates on aggregated groups after GROUP BY.",
      "2. Outline the logical execution order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY.",
      "3. Provide a clear business scenario query using both clauses.",
      "4. Highlight that aggregate functions (SUM, AVG, COUNT) are forbidden in WHERE clauses."
    ],
    model_answer_en: `**1. Fundamental Difference:**
- \`WHERE\` filters raw individual rows *before* any data summarization or aggregation occurs. Because rows have not been collapsed yet, aggregate functions like \`SUM()\` or \`COUNT()\` cannot be used in a WHERE clause.
- \`HAVING\` filters summarized groups *after* the \`GROUP BY\` clause has collapsed rows. It evaluates conditions on aggregate calculations.

**2. Execution Order Context:**
In SQL logical query processing, the engine evaluates:
\`FROM\` -> \`WHERE\` (row filter) -> \`GROUP BY\` (grouping) -> \`HAVING\` (group filter) -> \`SELECT\` -> \`ORDER BY\`.

**3. Concrete Production Example:**
Find product categories with more than $50,000 in revenue, but only including completed orders placed in 2024:

\`\`\`sql
SELECT p.category, 
       COUNT(o.order_id) AS total_orders, 
       SUM(o.total_amount) AS category_revenue
FROM orders o
JOIN products p ON o.product_id = p.product_id
WHERE o.status = 'Completed' AND o.order_date >= '2024-01-01' -- Row-level filter (BEFORE grouping)
GROUP BY p.category
HAVING SUM(o.total_amount) > 50000;                          -- Group-level filter (AFTER aggregation)
\`\`\``,
    model_answer_hi: `**मुख्य अंतर:**
1. \`WHERE\` ग्रुप बनने से *पहले* व्यक्तिगत रिकॉर्ड्स (Rows) को फ़िल्टर करता है। इसमें \`SUM()\` या \`COUNT()\` जैसे एग्रीगेट्स नहीं लगाए जा सकते।
2. \`HAVING\` ग्रुप बनने के *बाद* कुल योग या गिनती पर फ़िल्टर लगाता है।

**एग्जीक्यूशन का क्रम:**
FROM -> WHERE (रो फ़िल्टर) -> GROUP BY -> HAVING (ग्रुप फ़िल्टर) -> SELECT -> ORDER BY.`,
    common_pitfalls: [
      "Saying 'WHERE is for text and HAVING is for numbers' (incorrect; WHERE filters any row condition).",
      "Attempting to put 'WHERE SUM(sales) > 100' which triggers a SQL compilation syntax error.",
      "Forgetting to mention SQL logical query execution order."
    ],
    detailed_explanation: "Interviewers ask this question to test whether you memorize query syntax or understand how relational database engines parse and execute operations in memory."
  },

  {
    id: "int_sql_02",
    category: "SQL Technical",
    sub_category: "Window Functions",
    difficulty: "Advanced",
    stage: "Technical Drill",
    role_type: "Data Analyst / Analytics Engineer",
    skill_assessed: "Ranking Window Functions & Tie Handling",
    question_en: "Explain the difference between ROW_NUMBER(), RANK(), and DENSE_RANK(). When would you choose one over another in a business context?",
    question_hi: "ROW_NUMBER(), RANK() और DENSE_RANK() में क्या अंतर है? बिज़नेस परिदृश्य में आप किसे कब चुनेंगे?",
    answer_structure: [
      "1. Define the purpose of window ranking functions.",
      "2. Explain how each function handles duplicate / tied values.",
      "3. Use a numeric sequence (e.g. salaries of 90K, 80K, 80K, 70K) to illustrate the output ranks.",
      "4. Provide realistic business use cases for each."
    ],
    model_answer_en: `All three are SQL window functions that evaluate partitioned datasets, but they resolve identical values (ties) differently:

1. **ROW_NUMBER()**:
   - Always assigns a strictly unique sequential integer (\`1, 2, 3, 4...\`).
   - If two rows have identical sorting values, it breaks the tie non-deterministically unless additional secondary sort keys are provided.
   - *Use Case:* Deduplication — picking the latest customer record (\`ROW_NUMBER() = 1\`).

2. **RANK()**:
   - Assigns identical ranks to tied rows, but **skips subsequent numbers** by the count of tied rows.
   - *Sequence:* \`1, 2, 2, 4\` (rank 3 is skipped).
   - *Use Case:* Olympic medals or sales competitions where tying for 2nd place means nobody receives 3rd.

3. **DENSE_RANK()**:
   - Assigns identical ranks to tied rows, but **never skips numbers**.
   - *Sequence:* \`1, 2, 2, 3\` (rank 3 immediately follows rank 2).
   - *Use Case:* Executive compensation brackets or Top-N customer tiers (e.g. "Find the top 3 highest revenue tiers").`,
    model_answer_hi: `ये तीनों विंडो फंक्शन्स रैंकिंग देने के काम आते हैं, लेकिन जब टाई (बराबर वैल्यू) हो तो अलग परिणाम देते हैं:
1. **ROW_NUMBER()**: कभी टाई नहीं करता (1, 2, 3, 4)। डुप्लीकेट हटाने में इस्तेमाल होता है।
2. **RANK()**: टाई होने पर नंबर छोड़ देता है (1, 2, 2, 4)।
3. **DENSE_RANK()**: टाई होने पर भी कोई नंबर स्किप नहीं करता (1, 2, 2, 3)।`,
    common_pitfalls: [
      "Stating that DENSE_RANK skips numbers and RANK does not (reversing the definitions).",
      "Failing to provide a numeric example with duplicate values.",
      "Forgetting that to filter on a rank, the query must use a CTE or subquery because window functions evaluate after WHERE."
    ],
    detailed_explanation: "This tests precision in data engineering logic. In production reporting, using RANK instead of DENSE_RANK can lead to missing tiers in executive reports."
  },

  {
    id: "int_sql_03",
    category: "SQL Technical",
    sub_category: "Joins & Data Modeling",
    difficulty: "Intermediate",
    stage: "Technical Screen",
    role_type: "Entry-Level Data Analyst",
    skill_assessed: "Join Cardinality, Fanout & NULL Handling",
    question_en: "What causes a SQL query to accidentally duplicate rows during a JOIN, and how do you detect and fix it?",
    question_hi: "SQL JOIN के दौरान पंक्तियों का अनपेक्षित डुप्लीकेशन (Fanout) क्यों होता है, और इसे कैसे ठीक किया जाता है?",
    answer_structure: [
      "1. Explain many-to-many (M:M) relationships and non-unique join keys.",
      "2. Illustrate with a concrete example (Customer joined to Orders and Subscriptions).",
      "3. Describe detection techniques (comparing row counts before and after join).",
      "4. Explain remediation strategies (pre-aggregating before join, using CTEs, or joining on composite primary keys)."
    ],
    model_answer_en: `**1. The Root Cause (Cartesian Fanout):**
Accidental row duplication happens when joining two tables on a key that is not unique in both tables (a Many-to-Many relationship). For example, joining a \`Customers\` table to both \`Orders\` (1 customer has 5 orders) and \`SupportTickets\` (1 customer has 3 tickets) produces 15 rows for that single customer instead of 5 or 3!

**2. How to Detect Duplication:**
- Compare row counts before and after the JOIN:
  \`\`\`sql
  SELECT COUNT(DISTINCT customer_id), COUNT(*) FROM FinalDataset;
  \`\`\`
  If \`COUNT(*)\` is significantly larger than \`COUNT(DISTINCT customer_id)\` where a 1:1 relationship was expected, fanout occurred.

**3. How to Fix It:**
- **Pre-Aggregate in a CTE:** Never join two independent 1:Many child tables directly. Aggregate each table to the customer level first:
  \`\`\`sql
  WITH CustomerOrders AS (
    SELECT customer_id, SUM(total_amount) AS total_spend, COUNT(*) AS order_count
    FROM orders GROUP BY customer_id
  ),
  CustomerTickets AS (
    SELECT customer_id, COUNT(*) AS ticket_count
    FROM support_tickets GROUP BY customer_id
  )
  SELECT c.customer_id, c.name, co.total_spend, ct.ticket_count
  FROM customers c
  LEFT JOIN CustomerOrders co ON c.customer_id = co.customer_id
  LEFT JOIN CustomerTickets ct ON c.customer_id = ct.customer_id;
  \`\`\``,
    model_answer_hi: `अनपेक्षित डुप्लीकेशन (Fanout) तब होता है जब आप दो ऐसी टेबल्स को जोड़ते हैं जिनमें जॉइन की (Key) यूनिक नहीं होती। 
समाधान: जॉइन करने से पहले दोनों टेबल्स को CTE या सबक्वेरी में GROUP BY करके एग्रीगेट करें, फिर मेन टेबल से जोड़ें।`,
    common_pitfalls: [
      "Suggesting 'Just slap a SELECT DISTINCT at the top' (DISTINCT masks the underlying architectural bug and wastes massive server CPU/RAM).",
      "Not understanding the difference between 1:Many and Many:Many joins."
    ],
    detailed_explanation: "Senior analysts check for this immediately because Cartesian explosions cause inaccurate financial metrics and slow database performance."
  },

  // ---------------------------------------------------------------------------
  // 2. EXCEL & SPREADSHEET MODELING
  // ---------------------------------------------------------------------------
  {
    id: "int_xl_01",
    category: "Excel & Modeling",
    sub_category: "Lookup Functions",
    difficulty: "Beginner to Intermediate",
    stage: "Technical Screen",
    role_type: "Data Analyst / Operations Analyst",
    skill_assessed: "XLOOKUP vs VLOOKUP & Formula Robustness",
    question_en: "Why is XLOOKUP considered superior to VLOOKUP in modern Excel? Describe at least three specific technical advantages.",
    question_hi: "आधुनिक एक्सेल में VLOOKUP की तुलना में XLOOKUP को बेहतर क्यों माना जाता है? कम से कम 3 तकनीकी कारण बताइए।",
    answer_structure: [
      "1. Default exact match behavior.",
      "2. Left-lookup capability (no column order restriction).",
      "3. Immunity to column insertion/deletion.",
      "4. Built-in IFERROR handling via [if_not_found] argument."
    ],
    model_answer_en: `\`XLOOKUP\` replaces both \`VLOOKUP\` and \`HLOOKUP\` with four major technical advantages:

1. **Immunity to Structural Changes (Inserted Columns):**
   - \`VLOOKUP(lookup_value, table_array, col_index_num, FALSE)\` relies on a hardcoded static column index (e.g. \`3\`). If someone inserts a new column in column B, VLOOKUP returns the wrong data silently!
   - \`XLOOKUP(lookup_value, lookup_array, return_array)\` uses direct cell references, automatically adjusting if columns are moved, inserted, or deleted.

2. **Lookups to the Left:**
   - \`VLOOKUP\` can only search the leftmost column and return data to its right.
   - \`XLOOKUP\` can search anywhere and return data to the left or right seamlessly.

3. **Default Exact Match:**
   - \`VLOOKUP\` defaults to approximate match (\`TRUE\`), which causes subtle, dangerous errors if the 4th argument is omitted. \`XLOOKUP\` defaults safely to exact match.

4. **Built-in Error Handling:**
   - \`XLOOKUP\` includes an optional \`[if_not_found]\` argument, eliminating the need to wrap formulas in bloated \`=IFERROR(..., "Not Found")\`.`,
    model_answer_hi: `XLOOKUP के 3 मुख्य फायदे:
1. नया कॉलम जोड़ने पर फॉर्मूला नहीं टूटता।
2. बाईं तरफ (Left Lookup) भी डेटा खोज सकता है।
3. डिफ़ॉल्ट रूप से सटीक मिलान (Exact Match) करता है और इसमें एरर हैंडलिंग पहले से मौजूद है।`,
    common_pitfalls: [
      "Forgetting that older Excel versions (prior to Excel 2021/Microsoft 365) do not support XLOOKUP, where INDEX/MATCH remains the required enterprise standard.",
      "Not knowing the arguments of XLOOKUP."
    ],
    detailed_explanation: "Excel modeling requires defensive architecture. Using robust references prevents spreadsheet errors in recurring corporate reporting."
  },

  // ---------------------------------------------------------------------------
  // 3. PYTHON & DATA WRANGLING
  // ---------------------------------------------------------------------------
  {
    id: "int_py_01",
    category: "Python & Pandas",
    sub_category: "Data Cleaning & Imputation",
    difficulty: "Intermediate",
    stage: "Technical Drill",
    role_type: "Data Analyst / BI Developer",
    skill_assessed: "Handling Missing Data & Preventing Data Leakage",
    question_en: "How do you detect, evaluate, and handle missing values in a Pandas DataFrame? When is imputation dangerous?",
    question_hi: "Pandas DataFrame में मिसिंग वैल्यूज की पहचान और हैंडलिंग कैसे करते हैं? इम्पुटेशन (Imputation) कब खतरनाक हो सकता है?",
    answer_structure: [
      "1. Detection methods (.isna().sum(), percentage of missingness).",
      "2. Categorizing the missingness mechanism (MCAR, MAR, MNAR).",
      "3. Treatment options (dropping vs mean/median vs forward-fill vs domain default).",
      "4. The danger of data leakage and distorting variance."
    ],
    model_answer_en: `**1. Detection & Profiling:**
First, quantify missingness as counts and percentages:
\`\`\`python
missing_summary = pd.DataFrame({
    'missing_count': df.isna().sum(),
    'missing_pct': (df.isna().mean() * 100).round(2)
}).sort_values(by='missing_pct', ascending=False)
\`\`\`

**2. Strategy by Data Type & Business Context:**
- **High missingness (>60%):** Drop the column unless domain experts confirm the absence itself is informative (e.g. \`churn_reason\` is only filled by churned users!).
- **Categorical Variables:** Impute with \`"Unknown"\` or create an explicit missing indicator flag rather than guessing the mode.
- **Numerical Variables:** Impute using **Median** (robust to outliers) rather than Mean if skewed.
- **Time Series:** Use forward-fill (\`ffill\`) with a limit to avoid stale carry-over.

**3. When Imputation is Dangerous:**
- **Distorting Variance:** Imputing a constant mean artificially reduces variance, shrinking standard deviation and inflating false statistical confidence.
- **Data Leakage:** Computing the mean across the entire dataset before train/test splitting leaks future information into evaluation sets.
- **MNAR (Missing Not At Random):** In customer satisfaction surveys, unhappy customers often refuse to answer income questions. Imputing the median distorts the customer demographic reality.`,
    model_answer_hi: `मिसिंग वैल्यूज को df.isna().sum() से पहचानते हैं। 
सावधानी: बिना सोचे-समझे Mean भरने से डेटा का फैलाव (Variance) घट जाता है। अगर डेटा में आउटलायर्स हैं तो हमेशा Median का उपयोग करें या "Unknown" श्रेणी बनाएं।`,
    common_pitfalls: [
      "Saying 'Just drop all rows with missing values' (this can wipe out 40% of the sample size and introduce survivor bias).",
      "Blindly using Mean imputation on skewed financial data (e.g. salary, account balances)."
    ],
    detailed_explanation: "Data analysts must balance statistical rigor with business truth. Demonstrating awareness of bias proves hands-on experience."
  },

  // ---------------------------------------------------------------------------
  // 4. STATISTICS & EXPERIMENTATION
  // ---------------------------------------------------------------------------
  {
    id: "int_stat_01",
    category: "Statistics & A/B Testing",
    sub_category: "Hypothesis Testing",
    difficulty: "Intermediate",
    stage: "Technical Screen",
    role_type: "Product Analyst / Growth Analyst",
    skill_assessed: "Explaining p-values & Statistical Significance in Plain Language",
    question_en: "How would you explain a p-value of 0.03 to a non-technical Marketing Director after an A/B test?",
    question_hi: "A/B टेस्टिंग के बाद किसी नॉन-टेक्निकल मार्केटिंग डायरेक्टर को p-value = 0.03 को सरल भाषा में कैसे समझाएंगे?",
    answer_structure: [
      "1. Avoid technical academic jargon (do not say 'probability of observing extreme test statistics under the null hypothesis').",
      "2. Use an intuitive analogy (e.g. coin flip or random luck).",
      "3. State the business confidence level (97% confidence).",
      "4. Connect directly to action: can we launch the campaign?"
    ],
    model_answer_en: `**How I would explain it directly in a stakeholder meeting:**

"Marketing team, think of our A/B test like flipping a coin. 

If our new green checkout button actually had zero real advantage over the old blue button, there is only a **3% chance** that we would see this revenue increase purely by random coincidence.

Because 3% is lower than our standard company risk threshold of 5% (the p < 0.05 rule), we are **97% confident** that the revenue lift was driven by the new design, not random luck. 

**My recommendation:** The evidence is statistically solid. We should proceed with rolling out the new checkout button to 100% of users."`,
    model_answer_hi: `**सरल शब्दों में समझाने का तरीका:**
"सर, मान लीजिए नए हरे बटन में कोई जादू नहीं है। फिर भी केवल किस्मत या संयोग से इतना फायदा दिखने की संभावना सिर्फ 3% है। 
यानी हम 97% आश्वस्त हैं कि यह बिक्री नए बटन की वजह से ही बढ़ी है। इसलिए हमें इसे सभी ग्राहकों के लिए लॉन्च कर देना चाहिए।"`,
    common_pitfalls: [
      "Saying 'The p-value is the probability that the null hypothesis is true' (statistically incorrect).",
      "Saying 'There is a 97% chance the new button is better by exactly $10' (p-value tests existence of an effect, not effect size).",
      "Using complex formulas that alienate business partners."
    ],
    detailed_explanation: "A data analyst's value comes from translating statistical rigors into confident business decisions. Plain language communication is actively evaluated."
  },

  // ---------------------------------------------------------------------------
  // 5. BUSINESS CASE STUDIES & PRODUCT ANALYSIS
  // ---------------------------------------------------------------------------
  {
    id: "int_case_01",
    category: "Business Case Studies",
    sub_category: "Metric Diagnostics",
    difficulty: "Advanced",
    stage: "Hiring Manager Case Interview",
    role_type: "Data Analyst / Product Analyst",
    skill_assessed: "Root Cause Analysis Framework for Metric Drops",
    question_en: "Our e-commerce website experienced an 18% drop in checkout conversion rate last week, while traffic remained flat. Walk me through your step-by-step diagnostic framework.",
    question_hi: "हमारी ई-कॉमर्स वेबसाइट का चेकआउट कन्वर्ज़न पिछले हफ्ते 18% गिर गया, जबकि ट्रैफ़िक उतना ही था। आपकी जांच की स्टेप-बाय-स्टेप रूपरेखा क्या होगी?",
    answer_structure: [
      "1. Clarify & Validate: Verify data integrity first (did a tracking script break?).",
      "2. Segment the drop: Cut across dimensions (Device/OS, Geography, Payment Gateway, Product Category, User Type).",
      "3. Funnel Analysis: Where in the multi-step checkout funnel did users drop off?",
      "4. External vs Internal Factors: Look at releases, outages, pricing changes, or competitor campaigns.",
      "5. Synthesis & Action: Recommend fix and communicate to engineering/executive teams."
    ],
    model_answer_en: `I would follow a structured 4-phase diagnostic investigation:

**Phase 1: Validate Data Integrity (Never assume the data is correct):**
- Verify if the tracking pixel or analytics logging broke. Did the definition of "Conversion" change?
- Check if total order volume dropped, or if only the recorded metric dropped.

**Phase 2: Dimensional Segmentation (Isolate where the bleeding is happening):**
- **By Device & Browser:** Did iOS drop while Android remained stable? (Points to an iOS app release bug or Safari WebKit update).
- **By Geography:** Is the drop localized to a specific region? (Points to local internet outage, weather, or distribution issue).
- **By Payment Method:** Did UPI or Credit Card failure rates spike? (Points to a payment gateway API outage).
- **By User Type:** New vs Returning visitors.

**Phase 3: Checkout Funnel Drop-off Analysis:**
Inspect the 4-step checkout funnel:
Cart View -> Shipping Details -> Payment Selection -> OTP Confirmation.
If drop-off spiked specifically at Step 3 (Payment), the problem is payment processing rather than product interest.

**Phase 4: Internal Releases vs External Shocks:**
- Check git deployment logs: Was new code shipped to production last Thursday?
- Review pricing & marketing: Did shipping fees increase, or did promotional discount codes expire?

**Synthesis:** Synthesize findings into an immediate stakeholder Slack update with root-cause confirmation and an engineering ticket.`,
    model_answer_hi: `**4-चरणों वाली जांच पद्धति:**
1. **डेटा इंटीग्रिटी:** क्या एनालिटिक्स ट्रैकिंग कोड टूटा है या सच में ऑर्डर घटे हैं?
2. **सेगमेंटेशन:** डिवाइस (iOS/Android), पेमेंट गेटवे, और शहर के आधार पर डेटा को काटें।
3. **फनल एनालिसिस:** ग्राहक किस स्टेप (कार्ट, पता या पेमेंट) पर सबसे ज्यादा ड्रॉप हो रहे हैं?
4. **इंजीनियरिंग रिलीज:** क्या पिछले हफ्ते कोई नया कोड या ऐप अपडेट लॉन्च हुआ था?`,
    common_pitfalls: [
      "Jumping immediately to conclusions ('Let's lower prices!') without investigating the technical funnel.",
      "Forgetting to verify payment gateway partner health.",
      "Failing to articulate a calm, structured mental model."
    ],
    detailed_explanation: "Case study questions evaluate structured thinking under uncertainty. Employers want to see systematic elimination of hypotheses."
  },

  // ---------------------------------------------------------------------------
  // 6. PORTFOLIO & PROJECT DEFENSE
  // ---------------------------------------------------------------------------
  {
    id: "int_proj_01",
    category: "Portfolio Defense",
    sub_category: "Project Storytelling",
    difficulty: "Intermediate",
    stage: "Hiring Manager Round",
    role_type: "Entry-Level Data Analyst",
    skill_assessed: "Explaining Technical Trade-offs & Business Recommendations",
    question_en: "Walk me through the most technically complex data project in your portfolio. What analytical trade-offs did you make, and what were the limitations of your dataset?",
    question_hi: "अपने पोर्टफोलियो के सबसे बेहतरीन प्रोजेक्ट के बारे में बताइए। आपने क्या तकनीकी समझौते किए और आपके डेटासेट की क्या सीमाएं थीं?",
    answer_structure: [
      "1. Business context and core problem statement.",
      "2. Tech stack selection rationale.",
      "3. Explicit trade-off made during data preparation or modeling.",
      "4. Limitations of the data (what you wished you had).",
      "5. Business impact and actionable recommendation."
    ],
    model_answer_en: `**1. Project Objective:**
"In my E-Commerce Sales & Margin Diagnostic Project, I analyzed 500,000 transaction records for an omnichannel electronics retailer experiencing revenue growth but an 8% drop in profit margin.

**2. Architecture & Pipeline:**
I built a clean relational model in SQLite, transformed features in Python with Pandas, and modeled dimensional relationships in Power BI.

**3. The Critical Analytical Trade-off:**
During data cleaning, I discovered that 12% of customer transaction records lacked delivery partner timestamp logs. I faced a trade-off: either drop those records and lose 12% of revenue visibility, or impute delivery lead times using regional median transit times. I chose to create a segmented sub-analysis: I analyzed profitability on the 100% complete dataset, and evaluated delivery SLA bottlenecks strictly on the subset of verified logistic logs.

**4. Dataset Limitations:**
The dataset lacked direct customer return reason codes. We could see *which* products were returned, but not *why* (defect vs wrong size). I explicitly documented this limitation in my README.

**5. Business Impact:**
My analysis uncovered that discounted shipping promotions on sub-$20 items were eroding category margins by 22%. I recommended instituting a $35 minimum threshold for free shipping, projected to restore $140,000 in net quarterly margin."`,
    model_answer_hi: `अपने प्रोजेक्ट को समझाते समय:
1. बिजनेस की समस्या क्या थी?
2. आपने कौन से टूल्स चुने और क्यों?
3. डेटा में क्या कमियां थीं और आपने उन्हें कैसे संभाला?
4. आपके विश्लेषण से कंपनी को क्या ठोस फायदा हुआ?`,
    common_pitfalls: [
      "Claiming the dataset was 'perfect with zero errors' (shows lack of real data experience).",
      "Focusing 100% on code syntax without mentioning the business outcome.",
      "Fabricating fake statistics or claiming they single-handedly made millions of dollars."
    ],
    detailed_explanation: "Hiring managers look for self-awareness, honesty about data messy realities, and clear business alignment."
  },

  // ---------------------------------------------------------------------------
  // 7. BEHAVIORAL & SOFT SKILLS (STAR METHOD)
  // ---------------------------------------------------------------------------
  {
    id: "int_beh_01",
    category: "Behavioral & Soft Skills",
    sub_category: "Conflict Resolution & Stakeholders",
    difficulty: "Intermediate",
    stage: "Cultural & HR Fit",
    role_type: "All Analyst Roles",
    skill_assessed: "Handling Stakeholder Disagreement with Data (STAR Method)",
    question_en: "Tell me about a time when a stakeholder strongly disagreed with your data findings. How did you navigate the conversation without damaging the working relationship?",
    question_hi: "उस समय के बारे में बताइए जब कोई सीनियर आपके डेटा निष्कर्षों से असहमत था। आपने रिश्ते खराब किए बिना स्थिति को कैसे संभाला? (STAR)",
    answer_structure: [
      "1. Situation: Set up the context and the conflicting perspective.",
      "2. Task: Your responsibility as an objective data advocate.",
      "3. Action: Listening first, validating their domain intuition, co-investigating the data together.",
      "4. Result: Mutual agreement, data-backed consensus, and strengthened trust."
    ],
    model_answer_en: `**Situation:**
In my previous role, our Sales Operations Director was convinced that our customer churn was driven entirely by our product pricing, because that's what prospects told sales reps on cancellation calls. My cohort analysis showed that churn was actually highest among customers who experienced two or more software crashes during onboarding, regardless of price tier.

**Task:**
I needed to present this reality without making the Sales Director feel defensive or invalidating his frontline experience.

**Action:**
Instead of broadcasting the findings in a large cross-functional meeting, I scheduled a private working session. I started by validating his perspective: "Sales feedback is our most valuable early warning signal." Then I walked him through the data side-by-side: "Let's filter our churned cohort by crash logs." We discovered that when the software worked smoothly, pricing complaints dropped by 80%. The customer mentioned price only because poor software reliability made them feel the price wasn't justified!

**Result:**
The Director became our biggest champion. He partnered with Engineering to prioritize onboarding stability. Within two quarters, onboarding crash rates dropped by 45% and churn decreased by 9%.`,
    model_answer_hi: `**STAR पद्धति से जवाब:**
- **Situation:** सेल्स डायरेक्टर को लगता था कि ग्राहक अधिक कीमत की वजह से छोड़ रहे हैं, जबकि डेटा दिखा रहा था कि सॉफ्टवेयर क्रैश असली वजह थी।
- **Task:** डायरेक्टर को नीचा दिखाए बिना सच्चाई सामने लाना।
- **Action:** मैंने अलग से बैठकर उनकी बात सुनी और उनके साथ मिलकर डेटा को फिल्टर किया। उन्हें दिखाया कि जब सॉफ्टवेयर सही चलता है तो ग्राहक कीमत की शिकायत नहीं करते।
- **Result:** डायरेक्टर ने हमारी रिपोर्ट को माना, इंजीनियरिंग टीम ने बग्स ठीक किए और ग्राहक छोड़ने की दर 9% घट गई।`,
    common_pitfalls: [
      "Sounding arrogant or dismissive of non-technical stakeholders ('They just didn't understand statistics').",
      "Backing down immediately and altering data findings to please a boss.",
      "Failing to show empathy for qualitative frontline business feedback."
    ],
    detailed_explanation: "Data analysts are change agents. You must balance analytical integrity with diplomatic collaboration."
  },

  // ---------------------------------------------------------------------------
  // 8. QUESTIONS LEARNERS CAN ASK THE INTERVIEWER
  // ---------------------------------------------------------------------------
  {
    id: "int_rev_01",
    category: "Questions to Ask Interviewer",
    sub_category: "Team Culture & Data Stack",
    difficulty: "Beginner",
    stage: "Interview Closing",
    role_type: "All Analyst Candidates",
    skill_assessed: "Strategic Curiosity & Role Evaluation",
    question_en: "What are the most impactful, high-signal questions an entry-level Data Analyst candidate can ask their interviewers?",
    question_hi: "इंटरव्यू के अंत में एक कैंडिडेट को इंटरव्यूअर से कौन से बेहतरीन सवाल पूछने चाहिए?",
    answer_structure: [
      "1. Questions about Data Stack & Maturity.",
      "2. Questions about Business Impact & Decision Operationalization.",
      "3. Questions about Mentorship & Growth.",
      "4. Questions about Team Bottlenecks."
    ],
    model_answer_en: `At the end of an interview, asking thoughtful questions proves strategic maturity. Here are five top-tier questions:

1. **On Decision Making:**
   *"Can you share an example of an analytical insight an analyst on your team generated recently that directly altered an executive or product decision?"*
   *(Reveals whether the team is genuinely data-driven or merely a 'ticket-taking report factory').*

2. **On Data Stack & Infrastructure:**
   *"What does the current data pipeline look like between raw ingestion and the analytical warehouse? How much time does an analyst spend cleaning upstream data vs driving strategic exploration?"*

3. **On Metric Alignment:**
   *"What is the single most critical KPI your team is trying to move this upcoming quarter, and where is the biggest bottleneck to moving it?"*

4. **On Mentorship & Culture:**
   *"How are code reviews, SQL query optimizations, and dashboard design critiques handled within the analytics team?"*

5. **On 90-Day Success:**
   *"If I am hired, what would success look like at the end of my first 90 days?"*`,
    model_answer_hi: `**इंटरव्यूअर से पूछने योग्य शानदार सवाल:**
1. "आपकी टीम द्वारा तैयार की गई हालिया रिपोर्ट से कंपनी का कौन सा बड़ा फैसला बदला?"
2. "एक एनालिस्ट का कितना समय डेटा क्लीनिंग में और कितना समय रणनीतिक इनसाइट्स निकालने में जाता है?"
3. "यदि मैं चुना जाता हूँ, तो पहले 90 दिनों में मेरी सफलता को आप कैसे मापेंगे?"`,
    common_pitfalls: [
      "Saying 'I don't have any questions, you answered everything' (signals lack of interest).",
      "Only asking about vacation days, snacks, or salary during technical rounds.",
      "Asking questions whose answers are clearly displayed on the homepage."
    ],
    detailed_explanation: "Interviews are a two-way evaluation. Asking strategic questions signals that you care about making an impact."
  }
];

// Mock Interview Rounds Structure
const mockInterviewRounds = [
  {
    id: "mock-beginner",
    title: "Round 1: Screening & Core Fundamentals",
    title_hi: "राउंड 1: स्क्रीनिंग और बेसिक्स टेस्ट",
    difficulty: "Beginner",
    duration_minutes: 30,
    description: "Evaluates SQL syntax, Excel lookups, basic business terminology, and candidate motivation.",
    question_ids: ["int_xl_01", "int_sql_01", "int_rev_01"]
  },
  {
    id: "mock-intermediate",
    title: "Round 2: Deep Technical & Wrangling Drill",
    title_hi: "राउंड 2: डीप टेक्निकल और डेटा ड्रिल",
    difficulty: "Intermediate",
    duration_minutes: 45,
    description: "Evaluates SQL window ranking, Pandas missing data imputation, and A/B test p-value explanations.",
    question_ids: ["int_sql_02", "int_py_01", "int_stat_01"]
  },
  {
    id: "mock-advanced",
    title: "Round 3: Business Case & Executive Defense",
    title_hi: "राउंड 3: बिजनेस केस और स्टेकहोल्डर डिफेंस",
    difficulty: "Advanced",
    duration_minutes: 60,
    description: "Evaluates metric drop root-cause investigation, portfolio project defense, and STAR conflict resolution.",
    question_ids: ["int_case_01", "int_proj_01", "int_beh_01"]
  }
];

module.exports = {
  comprehensiveInterviewQuestions,
  mockInterviewRounds
};
