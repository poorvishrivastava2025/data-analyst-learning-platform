// questions_bank_data.js - Comprehensive Practice & Interview Question Bank
// Real questions across all 12 Data Analyst curriculum domains with hints, solutions, explanations, and rubrics

const questionsData = [
  // 1. Computer & Programming Foundations
  {
    id: "q_found_01",
    course_id: "computer-setup",
    topic: "Environment & Terminal Setup",
    difficulty: "Beginner",
    question_type: "mcq",
    title: "Python Virtual Environment Activation on Windows vs macOS",
    title_hi: "विंडोज और मैकओएस पर वर्चुअल एनवायरनमेंट एक्टिवेट करना",
    prompt_en: "You created a Python virtual environment named '.venv' in your project folder. Which command correctly activates it on Windows PowerShell vs macOS Terminal?",
    prompt_hi: "आपने '.venv' नाम से वर्चुअल एनवायरनमेंट बनाया। विंडोज PowerShell और मैकओएस टर्मिनल पर इसे एक्टिवेट करने का सही कमांड क्या है?",
    code_snippet: "python -m venv .venv",
    options: [
      "Windows: .venv\\Scripts\\Activate.ps1 | macOS: source .venv/bin/activate",
      "Windows: source .venv/bin/activate | macOS: .venv\\Scripts\\Activate.ps1",
      "Windows: activate .venv | macOS: run .venv",
      "Windows: npm start .venv | macOS: brew activate .venv"
    ],
    hint_en: "Windows places executables in 'Scripts' directory while Unix/macOS puts binaries in 'bin' and uses 'source'.",
    hint_hi: "विंडोज में 'Scripts' फोल्डर होता है और मैक पर 'bin' फोल्डर में 'source' कमांड चलता है।",
    solution_en: "Windows: .venv\\Scripts\\Activate.ps1 | macOS: source .venv/bin/activate",
    solution_hi: "Windows: .venv\\Scripts\\Activate.ps1 | macOS: source .venv/bin/activate",
    explanation_en: "On Windows PowerShell, virtual environment activation scripts reside in '.venv\\Scripts\\Activate.ps1'. On macOS/Linux zsh and bash, the shell built-in 'source' executes the environment configuration located at '.venv/bin/activate'.",
    explanation_hi: "विंडोज में पायथन एनवायरनमेंट की फाइल्स Scripts फोल्डर में होती हैं, जबकि मैक/लिनक्स पर bin फोल्डर से source कमांड से एक्टिवेट होती हैं।",
    rubric: [
      { criterion: "Operating System Distinction", points: 50 },
      { criterion: "Path Accuracy", points: 50 }
    ]
  },
  {
    id: "q_found_02",
    course_id: "computer-setup",
    topic: "Environment Troubleshooting",
    difficulty: "Intermediate",
    question_type: "short_answer",
    title: "Troubleshooting 'ModuleNotFoundError: No module named pandas'",
    title_hi: "ModuleNotFoundError की समस्या ठीक करना",
    prompt_en: "A learner installed pandas using 'pip install pandas' in their terminal, but when running their script inside Visual Studio Code, they encounter: 'ModuleNotFoundError: No module named pandas'. What is the root cause, and how do you resolve it?",
    prompt_hi: "टर्मिनल में 'pip install pandas' किया, लेकिन VS Code में कोड रन करने पर 'ModuleNotFoundError' आ रहा है। कारण और समाधान बताएं।",
    code_snippet: "import pandas as pd\n# ModuleNotFoundError: No module named 'pandas'",
    hint_en: "Check which Python interpreter VS Code is pointing to versus where pip installed the library.",
    hint_hi: "देखें कि VS Code कौन सा पायथन इंटरप्रेटर इस्तेमाल कर रहा है।",
    solution_en: "The VS Code Python interpreter is pointing to a global or different Python installation rather than the active virtual environment where pandas was installed. In VS Code, press Ctrl+Shift+P (or Cmd+Shift+P on macOS), type 'Python: Select Interpreter', and select the '.venv' interpreter.",
    solution_hi: "VS Code अलग पायथन वर्जन से चल रहा है जबकि लाइब्रेरी वर्चुअल एनवायरनमेंट में इंस्टॉल हुई है। VS Code में Ctrl+Shift+P दबाकर 'Python: Select Interpreter' चुनें और अपना .venv सेलेक्ट करें।",
    explanation_en: "When multiple Python versions or virtual environments exist on a computer, terminal 'pip' may install packages into environment A while VS Code executes using environment B. Synchronizing the active interpreter resolves 95% of ModuleNotFoundErrors.",
    explanation_hi: "कंप्यूटर पर एक से ज्यादा पायथन होने पर यह मिसमैच होता है। सही इंटरप्रेटर चुनने से यह एरर तुरंत ठीक हो जाता है।",
    rubric: [
      { criterion: "Root Cause Identification (Interpreter Mismatch)", points: 50 },
      { criterion: "Resolution Steps (Select Interpreter in VS Code)", points: 50 }
    ]
  },

  // 2. Python for Data Analysis
  {
    id: "q_py_01",
    course_id: "python",
    topic: "Pandas Data Aggregation",
    difficulty: "Intermediate",
    question_type: "code_task",
    title: "Grouped Summary Statistics with Pandas",
    title_hi: "Pandas में ग्रुप्ड समरी स्टैटिस्टिक्स निकालना",
    prompt_en: "Given a DataFrame 'df' containing columns ['department', 'monthly_salary', 'tenure_months'], write a single chained Pandas statement that calculates the average monthly salary and the median tenure for each department, sorting the result by average salary descending.",
    prompt_hi: "DataFrame 'df' में 'department', 'monthly_salary', 'tenure_months' हैं। हर डिपार्टमेंट का औसत वेतन और मीडियन टेन्योर निकालें और सबसे ज्यादा सैलरी से सॉर्ट करें।",
    code_snippet: "import pandas as pd\n\ndf = pd.DataFrame({\n    'department': ['Sales', 'Engineering', 'Sales', 'Engineering', 'Marketing'],\n    'monthly_salary': [65000, 95000, 72000, 110000, 58000],\n    'tenure_months': [14, 36, 22, 48, 12]\n})",
    hint_en: "Use .groupby('department').agg(...) and .sort_values(...).",
    hint_hi: "groupby और agg फंक्शन में डिक्शनरी का इस्तेमाल करें।",
    solution_en: "df.groupby('department').agg(avg_salary=('monthly_salary', 'mean'), median_tenure=('tenure_months', 'median')).sort_values(by='avg_salary', ascending=False).reset_index()",
    solution_hi: "df.groupby('department').agg(avg_salary=('monthly_salary', 'mean'), median_tenure=('tenure_months', 'median')).sort_values(by='avg_salary', ascending=False).reset_index()",
    explanation_en: "Named aggregations in Pandas (.agg(new_col=('source_col', 'agg_func'))) allow multiple different aggregations on different columns simultaneously with clean output column names.",
    explanation_hi: "Pandas का Named Aggregation एक ही साथ अलग-अलग कॉलम पर mean और median दोनों निकालने का सबसे साफ तरीका है।",
    rubric: [
      { criterion: "Correct groupby syntax", points: 30 },
      { criterion: "Dual aggregation with mean and median", points: 40 },
      { criterion: "Descending sort", points: 30 }
    ]
  },
  {
    id: "q_py_02",
    course_id: "python",
    topic: "Python Defensive Programming & Debugging",
    difficulty: "Beginner",
    question_type: "mcq",
    title: "Handling Missing Dictionary Keys Safely",
    title_hi: "पायथन डिक्शनरी में सेफ वैल्यू निकालना",
    prompt_en: "You are parsing API responses with nested dictionaries. Which approach prevents a KeyError crash when accessing an optional key 'discount_code'?",
    prompt_hi: "API से आए डेटा में अगर 'discount_code' चाबी (Key) मौजूद ना हो तो KeyError से कैसे बचें?",
    code_snippet: "user_order = {'order_id': 1045, 'total': 4500}",
    options: [
      "user_order.get('discount_code', 'NO_DISCOUNT')",
      "user_order['discount_code']",
      "user_order.find('discount_code')",
      "user_order.has_key('discount_code')"
    ],
    hint_en: "The .get() method returns a fallback default value instead of raising an exception.",
    hint_hi: ".get() मेथड में दूसरा पैरामीटर डिफॉल्ट वैल्यू देने के काम आता है।",
    solution_en: "user_order.get('discount_code', 'NO_DISCOUNT')",
    solution_hi: "user_order.get('discount_code', 'NO_DISCOUNT')",
    explanation_en: "Direct square bracket access ('user_order['discount_code']') raises an uncaught KeyError if the key is missing. The '.get(key, default)' method safely returns the default fallback value without terminating execution.",
    explanation_hi: "ब्रैकेट से एक्सेस करने पर प्रोग्राम क्रैश हो सकता है। .get() से अगर की ना मिले तो सुरक्षित डिफॉल्ट वैल्यू मिल जाती है।",
    rubric: [
      { criterion: "Exception avoidance", points: 50 },
      { criterion: "Correct method selection", points: 50 }
    ]
  },

  // 3. Excel: Zero to Advanced
  {
    id: "q_xl_01",
    course_id: "excel",
    topic: "Modern Lookup Functions",
    difficulty: "Intermediate",
    question_type: "short_answer",
    title: "XLOOKUP vs VLOOKUP: Key Architectural Advantages",
    title_hi: "XLOOKUP और VLOOKUP में अंतर",
    prompt_en: "Why is XLOOKUP considered superior to VLOOKUP for mission-critical corporate financial models? State at least three distinct technical advantages.",
    prompt_hi: "कॉरपोरेट रिपोर्ट्स में VLOOKUP की जगह XLOOKUP को बेहतर क्यों माना जाता है? 3 मुख्य फायदे बताएं।",
    hint_en: "Consider column insertion, left lookups, and default exact match behavior.",
    hint_hi: "बाईं तरफ देखना, कॉलम जोड़ने पर फॉर्मूला ना टूटना, और डिफॉल्ट Exact Match होना।",
    solution_en: "1. Left lookups: XLOOKUP can return values to the left of the lookup column without restructuring the table.\n2. Column insertion resilience: XLOOKUP uses direct range references rather than a hardcoded column index number, so inserting columns does not break the formula.\n3. Exact match by default: XLOOKUP defaults to exact match (no need for FALSE/0) and includes built-in 'if_not_found' error handling without requiring nested IFERROR.",
    solution_hi: "1. बाईं तरफ का डेटा खोज सकता है।\n2. नया कॉलम डालने पर फॉर्मूला टूटता नहीं है क्योंकि इसमें हार्डकोडेड नंबर नहीं होता।\n3. यह डिफॉल्ट रूप से Exact Match करता है और 'if_not_found' इनबिल्ट होता है।",
    explanation_en: "VLOOKUP required the lookup column to be the leftmost column and used hardcoded integer index numbers (e.g. 4) which broke upon column insertion. XLOOKUP separates lookup_array and return_array, eliminating both limitations.",
    explanation_hi: "VLOOKUP पुराना तरीका था जिसमें कॉलम संख्या बदल जाने से सब गड़बड़ हो जाता था। XLOOKUP आधुनिक और पूरी तरह सुरक्षित है।",
    rubric: [
      { criterion: "Leftward lookup capability", points: 35 },
      { criterion: "Resilience to column changes", points: 35 },
      { criterion: "Exact match and built-in error handling", points: 30 }
    ]
  },
  {
    id: "q_xl_02",
    course_id: "excel",
    topic: "Conditional Aggregation",
    difficulty: "Beginner",
    question_type: "mcq",
    title: "Multi-Condition Revenue Summation with SUMIFS",
    title_hi: "SUMIFS से मल्टीपल कंडीशन पर जोड़ निकालना",
    prompt_en: "Which Excel formula correctly calculates the sum of 'Revenue' (Column D:D) where 'Region' (Column B:B) is 'North' and 'Status' (Column C:C) is 'Delivered'?",
    prompt_hi: "कॉलम D में रेवेन्यू, B में रीजन, और C में स्टेटस है। North और Delivered का टोटल रेवेन्यू निकालने का सही फॉर्मूला कौन सा है?",
    options: [
      "=SUMIFS(D:D, B:B, \"North\", C:C, \"Delivered\")",
      "=SUMIFS(B:B, \"North\", C:C, \"Delivered\", D:D)",
      "=SUMIF(D:D, B:B=\"North\", C:C=\"Delivered\")",
      "=SUM(D:D WHERE B:B=\"North\" AND C:C=\"Delivered\")"
    ],
    hint_en: "In SUMIFS, the sum_range comes FIRST, unlike single-criteria SUMIF where it comes last.",
    hint_hi: "SUMIFS में जिस कॉलम को जोड़ना है (sum_range) वह सबसे पहले लिखा जाता है।",
    solution_en: "=SUMIFS(D:D, B:B, \"North\", C:C, \"Delivered\")",
    solution_hi: "=SUMIFS(D:D, B:B, \"North\", C:C, \"Delivered\")",
    explanation_en: "Syntax for SUMIFS is: SUMIFS(sum_range, criteria_range1, criteria1, criteria_range2, criteria2, ...). Notice that sum_range is the first argument, which differs from legacy single-condition SUMIF.",
    explanation_hi: "SUMIFS में हमेशा sum_range पहले आता है, फिर पहली शर्त की रेंज और वैल्यू, फिर दूसरी शर्त की रेंज और वैल्यू।",
    rubric: [
      { criterion: "Argument ordering", points: 50 },
      { criterion: "String criteria quoting", points: 50 }
    ]
  },

  // 4. SQL and Relational Databases
  {
    id: "q_sql_01",
    course_id: "sql",
    topic: "SQL Window Functions",
    difficulty: "Advanced",
    question_type: "code_task",
    title: "Rank Top 2 Highest-Spending Customers Per Region",
    title_hi: "हर रीजन में टॉप 2 सबसे ज्यादा खरीदारी करने वाले कस्टमर निकालना",
    prompt_en: "Write a SQL query using a Common Table Expression (CTE) and the DENSE_RANK() window function to find the top 2 highest-spending customers in each 'shipping_region' from the 'orders' and 'customers' tables.",
    prompt_hi: "CTE और DENSE_RANK() का इस्तेमाल करके हर शिपिंग रीजन के टॉप 2 सबसे ज्यादा खर्च करने वाले कस्टमर निकालें।",
    code_snippet: "-- Tables: customers(customer_id, full_name, city)\n--         orders(order_id, customer_id, total_amount, shipping_region)",
    hint_en: "Partition by shipping_region and order by total_amount descending within the CTE.",
    hint_hi: "DENSE_RANK() OVER (PARTITION BY shipping_region ORDER BY SUM(total_amount) DESC)",
    solution_en: "WITH CustomerSpend AS (\n  SELECT c.customer_id, c.full_name, o.shipping_region, SUM(o.total_amount) AS total_spend,\n         DENSE_RANK() OVER (PARTITION BY o.shipping_region ORDER BY SUM(o.total_amount) DESC) AS spend_rank\n  FROM orders o\n  JOIN customers c ON o.customer_id = c.customer_id\n  GROUP BY c.customer_id, c.full_name, o.shipping_region\n)\nSELECT shipping_region, full_name, total_spend, spend_rank\nFROM CustomerSpend\nWHERE spend_rank <= 2\nORDER BY shipping_region, spend_rank;",
    solution_hi: "WITH CustomerSpend AS (\n  SELECT c.customer_id, c.full_name, o.shipping_region, SUM(o.total_amount) AS total_spend,\n         DENSE_RANK() OVER (PARTITION BY o.shipping_region ORDER BY SUM(o.total_amount) DESC) AS spend_rank\n  FROM orders o\n  JOIN customers c ON o.customer_id = c.customer_id\n  GROUP BY c.customer_id, c.full_name, o.shipping_region\n)\nSELECT shipping_region, full_name, total_spend, spend_rank\nFROM CustomerSpend\nWHERE spend_rank <= 2\nORDER BY shipping_region, spend_rank;",
    explanation_en: "Window functions cannot be evaluated directly inside the WHERE clause of the same query block because window calculations occur after WHERE filtering. Wrapping the aggregation and ranking in a CTE allows downstream filtering with 'WHERE spend_rank <= 2'.",
    explanation_hi: "विंडो फंक्शन को सीधे WHERE क्लॉज में नहीं छांटा जा सकता। इसलिए CTE बनाकर उसमें रैंक निकाला जाता है और बाहर 'spend_rank <= 2' फिल्टर किया जाता है।",
    rubric: [
      { criterion: "Correct CTE structure", points: 25 },
      { criterion: "Accurate DENSE_RANK() with PARTITION BY and ORDER BY", points: 40 },
      { criterion: "Proper relational JOIN and GROUP BY", points: 35 }
    ]
  },
  {
    id: "q_sql_02",
    course_id: "sql",
    topic: "SQL Join Edge Cases",
    difficulty: "Intermediate",
    question_type: "mcq",
    title: "Avoiding Unintended Duplicate Row Inflation in Joins",
    title_hi: "JOIN करते समय डुप्लिकेट डेटा बढ़ने की गलती से बचना",
    prompt_en: "You join table 'customers' (100 unique customers) to table 'orders' (500 total orders). Your resulting query outputs 850 rows. What is the most likely cause?",
    prompt_hi: "100 कस्टमर्स और 500 ऑर्डर्स को JOIN करने पर 850 पंक्तियां आ गईं! ऐसा क्यों हुआ?",
    options: [
      "The join condition is on a non-unique column or one customer has duplicate entries in the customer table, creating a many-to-many Cartesian multiplication",
      "SQLite automatically adds synthetic padding rows",
      "LEFT JOIN always triples the row count of the left table",
      "The database buffer cache had stale data"
    ],
    hint_en: "When join keys are not unique on one side, each duplicate multiplies against matching rows on the other side.",
    hint_hi: "अगर किसी एक टेबल में आईडी डुप्लिकेट हो तो पंक्तियां आपस में मल्टीप्लाई हो जाती हैं।",
    solution_en: "The join condition is on a non-unique column or one customer has duplicate entries in the customer table, creating a many-to-many Cartesian multiplication",
    solution_hi: "The join condition is on a non-unique column or one customer has duplicate entries in the customer table, creating a many-to-many Cartesian multiplication",
    explanation_en: "If the joining key (e.g. customer_id) has duplicate entries in what was assumed to be a dimension table, each duplicate multiplies against the fact table rows, creating a Cartesian expansion and corrupting financial totals.",
    explanation_hi: "जब प्राइमरी की यूनिक नहीं होती, तो SQL मैचिंग पंक्तियों को आपस में गुणा (Multiply) कर देता है जिससे सेल्स का आंकड़ा गलत हो जाता है।",
    rubric: [
      { criterion: "Identification of many-to-many row fanout", points: 100 }
    ]
  },

  // 5. Statistics & Probability
  {
    id: "q_stat_01",
    course_id: "statistics",
    topic: "Measures of Central Tendency",
    difficulty: "Beginner",
    question_type: "short_answer",
    title: "Mean vs. Median in Highly Skewed Salary Distributions",
    title_hi: "वेतन वितरण में Mean और Median का सही उपयोग",
    prompt_en: "A tech startup has 19 junior analysts earning ₹6,00,000 annually and 1 CEO earning ₹2,00,00,000. What happens to the Mean and Median, and which metric should HR cite as the 'typical' compensation?",
    prompt_hi: "19 एनालिस्ट को ₹6 लाख और CEO को ₹2 करोड़ मिलते हैं। Mean और Median पर क्या असर पड़ेगा और 'औसत' सैलरी के लिए कौन सा नंबर सही है?",
    hint_en: "Extreme outliers pull the arithmetic mean upward, but have zero effect on the middle value.",
    hint_hi: "अमीर CEO की सैलरी से औसत (Mean) तो बहुत बढ़ जाएगा, लेकिन बीच वाला नंबर (Median) वही रहेगा।",
    solution_en: "The Mean is heavily inflated by the CEO's extreme outlier salary (Mean rises to ~₹15.7 Lakhs), giving a misleading impression. The Median remains exactly ₹6,00,000. HR must report the Median as the typical employee compensation because it is robust against extreme outliers.",
    solution_hi: "CEO के ₹2 करोड़ की वजह से Mean बढ़कर करीब ₹15.7 लाख हो जाएगा जो सच्चाई से दूर है। जबकि Median ₹6 लाख ही रहेगा। आम कर्मचारी की सैलरी बताने के लिए हमेशा Median का इस्तेमाल होना चाहिए।",
    explanation_en: "The arithmetic mean is non-robust and sensitive to extreme values in right-skewed data. The median (50th percentile) represents the true central experience of the majority of employees.",
    explanation_hi: "Mean एक्सट्रीम वैल्यूज (Outliers) से प्रभावित हो जाता है, जबकि Median बीच का सटीक नंबर दिखाता है।",
    rubric: [
      { criterion: "Effect on Mean (inflated by outlier)", points: 40 },
      { criterion: "Effect on Median (remains stable)", points: 40 },
      { criterion: "Correct business recommendation (Median)", points: 20 }
    ]
  },
  {
    id: "q_stat_02",
    course_id: "statistics",
    topic: "Hypothesis Testing & p-Values",
    difficulty: "Intermediate",
    question_type: "mcq",
    title: "Interpreting p-Value in A/B Experimentation",
    title_hi: "A/B टेस्टिंग में p-value का सही मतलब",
    prompt_en: "In an A/B test of a new mobile checkout page, Variant B increased checkout conversion by 1.8% with a p-value of 0.024 at a significance threshold (alpha) of 0.05. What is the correct interpretation?",
    prompt_hi: "एक नए चेकआउट पेज पर 1.8% कन्वर्जन बढ़ा और p-value 0.024 आई (alpha = 0.05)। इसका सही मतलब क्या है?",
    options: [
      "Reject the Null Hypothesis: There is only a 2.4% probability of observing this conversion lift by random chance if there were truly no difference",
      "There is a 97.6% chance that Variant B will generate 1.8% higher revenue forever",
      "Accept the Null Hypothesis because p < 0.05",
      "The experiment failed because p is greater than 0"
    ],
    hint_en: "p < alpha means the observed difference is statistically significant under the null hypothesis assumption.",
    hint_hi: "अगर p-value 0.05 से कम है, तो इसका मतलब यह तुक्के से नहीं हुआ है।",
    solution_en: "Reject the Null Hypothesis: There is only a 2.4% probability of observing this conversion lift by random chance if there were truly no difference",
    solution_hi: "Reject the Null Hypothesis: There is only a 2.4% probability of observing this conversion lift by random chance if there were truly no difference",
    explanation_en: "The p-value is the probability of obtaining test results at least as extreme as the observed results, assuming the null hypothesis (no effect) is true. Since p (0.024) < alpha (0.05), we reject the null hypothesis and conclude the lift is statistically significant.",
    explanation_hi: "चूंकि p-value (0.024) अल्फा (0.05) से कम है, इसलिए हम नल हाइपोथीसिस को रिजेक्ट करते हैं और मानते हैं कि नया डिज़ाइन सच में बेहतर है।",
    rubric: [
      { criterion: "Correct statistical decision (Reject Null)", points: 50 },
      { criterion: "Accurate probabilistic definition", points: 50 }
    ]
  },

  // 6. Data Cleaning & Preparation
  {
    id: "q_clean_01",
    course_id: "data-cleaning",
    topic: "Missing Data Strategy",
    difficulty: "Intermediate",
    question_type: "short_answer",
    title: "Imputation vs Deletion for Missing Values",
    title_hi: "मिसिंग डेटा: हटाना या भरना?",
    prompt_en: "In a customer churn dataset of 50,000 records, the column 'annual_income' is missing in 28% of records, and 'customer_age' is missing in 0.4% of records. What data cleaning strategy should you apply to each column?",
    prompt_hi: "डेटासेट में 'annual_income' 28% गायब है और 'customer_age' सिर्फ 0.4% गायब है। दोनों के लिए क्या कदम उठाएंगे?",
    hint_en: "Dropping 28% of rows introduces severe selection bias and data loss; dropping 0.4% has negligible impact.",
    hint_hi: "28% डेटा डिलीट करने से मॉडल खराब हो जाएगा, जबकि 0.4% को आसानी से हटाया जा सकता है।",
    solution_en: "1. For 'customer_age' (0.4% missing): Listwise row deletion (dropna) is safe because losing 200 out of 50,000 rows does not compromise sample size or introduce statistical bias.\n2. For 'annual_income' (28% missing): Do NOT drop rows! Dropping 28% discards 14,000 customers and biases the sample toward users willing to share income. Instead, apply median imputation grouped by customer segment/occupation, or flag with a binary 'income_missing_indicator' column.",
    solution_hi: "1. 'customer_age' (0.4%): इन कुछ पंक्तियों को सीधे डिलीट किया जा सकता है क्योंकि 50,000 में से 200 रो हटाने से कोई फर्क नहीं पड़ेगा।\n2. 'annual_income' (28%): इसे कभी डिलीट ना करें! इससे 14,000 कस्टमर गायब हो जाएंगे। इसके बदले प्रोफेशन/एज ग्रुप के हिसाब से मीडियन भरें या 'income_missing' का अलग फ्लैग बनाएं।",
    explanation_en: "Deleting large proportions of missing data creates survival bias. When missingness is high, imputation or explicit indicator variables preserve dataset integrity.",
    explanation_hi: "ज्यादा मात्रा में डेटा डिलीट करने से सैंपल खराब हो जाता है, इसलिए समझदारी से इंप्यूटेशन करना पड़ता है।",
    rubric: [
      { criterion: "Safe deletion rationale for low-percentage missingness", points: 50 },
      { criterion: "Imputation/flagging strategy for high-percentage missingness", points: 50 }
    ]
  },

  // 7. Data Visualization & Storytelling
  {
    id: "q_viz_01",
    course_id: "visualization",
    topic: "Chart Selection & Ethics",
    difficulty: "Beginner",
    question_type: "mcq",
    title: "Truncated Y-Axis Misleading Visualizations",
    title_hi: "बार चार्ट में गलत Y-Axis की पहचान",
    prompt_en: "Why is truncating the Y-axis (starting at 90% rather than 0%) considered a misleading and unethical data visualization practice on bar charts?",
    prompt_hi: "बार चार्ट पर Y-एक्सिस को 0 की जगह 90% से शुरू करना गलत क्यों माना जाता है?",
    options: [
      "Bar charts encode values by height/length relative to zero; truncating the baseline exaggerates minor percentage differences visually",
      "Tableau and Power BI will throw an internal rendering exception",
      "Color palettes fail to render on non-zero baselines",
      "It is actually recommended by Harvard Business Review for all charts"
    ],
    hint_en: "In bar charts, the human visual cortex compares the relative length of the bars.",
    hint_hi: "बार चार्ट में आंखें बार की लंबाई की तुलना करती हैं, इसलिए बेसलाइन 0 होना जरूरी है।",
    solution_en: "Bar charts encode values by height/length relative to zero; truncating the baseline exaggerates minor percentage differences visually",
    solution_hi: "Bar charts encode values by height/length relative to zero; truncating the baseline exaggerates minor percentage differences visually",
    explanation_en: "In a bar chart, visual encoding relies on the length of the bar. If a baseline starts at 95%, a bar of 96% and a bar of 98% will appear to have a 300% difference, completely misleading stakeholders.",
    explanation_hi: "अगर बेसलाइन 0 नहीं होगी, तो 1% का अंतर भी स्क्रीन पर बहुत बड़ा और डरावना दिखने लगेगा जो दर्शकों को गुमराह करता है।",
    rubric: [
      { criterion: "Understanding visual length encoding", points: 100 }
    ]
  },

  // 8. Power BI
  {
    id: "q_pbi_01",
    course_id: "bi-tools",
    topic: "DAX Measures vs Calculated Columns",
    difficulty: "Intermediate",
    question_type: "short_answer",
    title: "DAX: When to Use a Measure vs a Calculated Column",
    title_hi: "Power BI: Measure और Calculated Column में अंतर",
    prompt_en: "In Power BI data modeling, when should you create a DAX Measure instead of a Calculated Column? Explain the memory and evaluation context differences.",
    prompt_hi: "Power BI में Calculated Column की जगह DAX Measure कब बनाना चाहिए? मेमोरी और स्पीड के आधार पर समझाएं।",
    hint_en: "Calculated columns consume RAM upon data refresh; Measures compute dynamically in CPU based on slicers.",
    hint_hi: "कॉलम रैम में जगह घेरता है, जबकि Measure यूजर के क्लिक करने पर तुरंत कैलकुलेट होता है।",
    solution_en: "1. Calculated Columns: Evaluated row-by-row during data refresh and stored permanently in RAM. Use them ONLY when the result is needed as a slicer, filter, or row header in a matrix.\n2. DAX Measures: Evaluated dynamically on CPU during query time based on user filter context (slicers). They consume ZERO persistent storage in the data model. Always use Measures for aggregations (totals, ratios, YoY percentages) to optimize file size and performance.",
    solution_hi: "1. Calculated Column: डेटा लोड होते समय हर पंक्ति पर चलता है और रैम में परमानेंट स्टोर होता है। इसका उपयोग सिर्फ तब करें जब उसे स्लाइसर में डालना हो।\n2. DAX Measure: जब यूजर रिपोर्ट पर फिल्टर बदलता है तब तुरंत कैलकुलेट होता है और कोई मेमोरी नहीं लेता। टोटल, एवरेज और ग्रोथ के लिए हमेशा Measure का ही उपयोग करना चाहिए।",
    explanation_en: "Calculated columns bloat model size in the VertiPaq engine and reduce compression. DAX measures leverage dynamic filter context and keep the report snappy.",
    explanation_hi: "कॉलम ज्यादा बनाने से फाइल बहुत भारी और स्लो हो जाती है, जबकि Measure बहुत फास्ट होते हैं।",
    rubric: [
      { criterion: "Storage vs dynamic execution distinction", points: 50 },
      { criterion: "Appropriate use cases for each", points: 50 }
    ]
  },

  // 9. Tableau
  {
    id: "q_tab_01",
    course_id: "bi-tools",
    topic: "Tableau Level of Detail (LOD)",
    difficulty: "Advanced",
    question_type: "mcq",
    title: "Tableau FIXED LOD Calculation Syntax",
    title_hi: "Tableau में FIXED LOD का फॉर्मूला",
    prompt_en: "You need to calculate each customer's first purchase date across the entire historical database, regardless of which date filters a user applies on the dashboard. Which Tableau formula accomplishes this?",
    prompt_hi: "यूजर डैशबोर्ड पर चाहे कोई भी डेट फिल्टर लगाए, कस्टमर की सबसे पहली खरीद तारीख निकालने का सही Tableau फॉर्मूला क्या है?",
    options: [
      "{ FIXED [Customer ID] : MIN([Order Date]) }",
      "{ INCLUDE [Customer ID] : MIN([Order Date]) }",
      "MIN([Order Date]) OVER (PARTITION BY [Customer ID])",
      "CALCULATE(MIN([Order Date]), ALL([Order Date]))"
    ],
    hint_en: "FIXED LODs compute at the specified dimension level independent of dashboard dimension filters.",
    hint_hi: "FIXED LOD डैशबोर्ड के बाकी फिल्टर्स को बायपास करके सटीक कैलकुलेशन करता है।",
    solution_en: "{ FIXED [Customer ID] : MIN([Order Date]) }",
    solution_hi: "{ FIXED [Customer ID] : MIN([Order Date]) }",
    explanation_en: "Tableau's { FIXED [Dimension] : AGG([Measure]) } syntax executes before standard dimension filters in the Tableau Order of Operations, guaranteeing a consistent cohort baseline.",
    explanation_hi: "Tableau के ऑर्डर ऑफ ऑपरेशंस में FIXED LOD साधारण फिल्टर्स से पहले चलता है, जिससे कस्टमर की पहली तारीख कभी नहीं बदलती।",
    rubric: [
      { criterion: "Correct FIXED syntax", points: 100 }
    ]
  },

  // 10. Business Analysis & BPMN
  {
    id: "q_ba_01",
    course_id: "jira-azure-bpmn",
    topic: "BPMN 2.0 Process Mapping",
    difficulty: "Intermediate",
    question_type: "short_answer",
    title: "Exclusive Gateway (XOR) vs Parallel Gateway (AND) in BPMN",
    title_hi: "BPMN में Exclusive (XOR) और Parallel (AND) गेटवे का अंतर",
    prompt_en: "In a BPMN 2.0 process flow diagram for an e-commerce order cancellation workflow, distinguish between when to use an Exclusive Gateway (XOR 'X') versus a Parallel Gateway (AND '+').",
    prompt_hi: "BPMN प्रोसेस मैप में Exclusive (X) और Parallel (+) गेटवे का सही उपयोग कब किया जाता है?",
    hint_en: "Exclusive means only one path is taken based on a condition; Parallel means all outgoing paths execute simultaneously.",
    hint_hi: "Exclusive में या तो ये या वो (एक रास्ता), Parallel में दोनों काम एक साथ चलते हैं।",
    solution_en: "1. Exclusive Gateway (XOR 'X'): Used when a decision chooses exactly ONE outgoing path based on a condition (e.g., 'Has order shipped? If YES -> route to Return Flow; If NO -> route to Immediate Cancellation & Refund').\n2. Parallel Gateway (AND '+'): Used when all outgoing branches must execute concurrently without conditions (e.g., 'Once cancelled, concurrently: 1) Send email to customer AND 2) Notify inventory warehouse').",
    solution_hi: "1. Exclusive Gateway (X): जब शर्त के आधार पर केवल एक ही रास्ता चुना जाता है (जैसे: सामान डिलीवर हुआ या नहीं? हाँ तो रिटर्न, ना तो रिफंड)।\n2. Parallel Gateway (+): जब दोनों काम एक साथ होने जरूरी हों (जैसे: कैंसिल होते ही कस्टमर को ईमेल भेजना और साथ ही वेयरहाउस को बताना)।",
    explanation_en: "BPMN 2.0 enforces standard visual semantics so business analysts and engineers share identical understandings of branching logic.",
    explanation_hi: "BPMN सिंबल से पूरी कंपनी (बिजनेस और टेक टीम) बिना किसी कन्फ्यूजन के प्रोसेस समझ सकती है।",
    rubric: [
      { criterion: "XOR decision branching explanation", points: 50 },
      { criterion: "Parallel concurrency explanation", points: 50 }
    ]
  },

  // 11. Git & Version Control
  {
    id: "q_git_01",
    course_id: "git-github",
    topic: "Secrets Protection with .gitignore",
    difficulty: "Beginner",
    question_type: "mcq",
    title: "Preventing Leaked API Keys on Public GitHub",
    title_hi: "GitHub पर सीक्रेट API की लीक होने से कैसे रोकें?",
    prompt_en: "You created a Python project connecting to an external database and Google Gemini API. How do you prevent your database passwords and API keys from being committed to a public GitHub repository?",
    prompt_hi: "GitHub पर कोड पुश करते समय अपने पासवर्ड और API की को पब्लिक होने से कैसे बचाएंगे?",
    options: [
      "Store secrets in a local '.env' file, load them via environment variables, and add '.env' to the '.gitignore' file before making any commits",
      "Hardcode them as comments at the bottom of the Python file",
      "Encrypt them using ZIP and commit the zip file",
      "GitHub automatically hides any string that looks like a password"
    ],
    hint_en: "The .gitignore file tells Git which files to intentionally untrack.",
    hint_hi: ".gitignore फाइल Git को बताती है कि कौन सी फाइल रिपोजिटरी में नहीं जानी चाहिए।",
    solution_en: "Store secrets in a local '.env' file, load them via environment variables, and add '.env' to the '.gitignore' file before making any commits",
    solution_hi: "Store secrets in a local '.env' file, load them via environment variables, and add '.env' to the '.gitignore' file before making any commits",
    explanation_en: "Hardcoding secrets into Git history is a catastrophic security flaw because commit history is immutable and public scrapers harvest API keys within seconds. Always isolate credentials in '.env' and list '.env' in '.gitignore'.",
    explanation_hi: "कोड में कभी पासवर्ड ना लिखें। हमेशा .env में रखें और .gitignore में '.env' लिखकर उसे Git की नजर से दूर रखें।",
    rubric: [
      { criterion: "Correct usage of .env and .gitignore", points: 100 }
    ]
  },

  // 12. Interview Preparation & STAR Method
  {
    id: "q_int_01",
    course_id: "interview-prep",
    topic: "Behavioral Interview STAR Technique",
    difficulty: "All Levels",
    question_type: "scenario",
    title: "Handling Conflicting Stakeholder Metrics",
    title_hi: "जब दो बॉसेज के अलग-अलग विचार हों तो क्या करें?",
    prompt_en: "Interview Question: 'Tell me about a time when two business stakeholders demanded conflicting metric definitions for the same dashboard (e.g. Finance defined Active User differently from Marketing). How did you resolve the conflict?'\nDraft a STAR-structured response outline.",
    prompt_hi: "इंटरव्यू सवाल: 'अगर मार्केटिंग और फाइनेंस टीम एक्टिव यूजर की अलग-अलग परिभाषा मांगें तो आप कैसे सुलझाएंगे?' STAR मेथड से जवाब बताएं।",
    hint_en: "Structure into Situation, Task, Action, and Result with quantifiable outcomes.",
    hint_hi: "Situation (समस्या), Task (आपकी जिम्मेदारी), Action (आपने क्या किया), Result (नतीजा)।",
    solution_en: "1. Situation: During a quarterly KPI redesign, Marketing wanted 'Active User' defined as any login (inflating numbers), while Finance required a completed monetary checkout.\n2. Task: My role as lead analyst was to reconcile definitions without stalling the board meeting timeline.\n3. Action: I scheduled a 30-minute discovery workshop, mapped how each definition impacted downstream metrics, and proposed a dual-metric hierarchy: 'Engaged User' (Marketing) and 'Monetized User' (Finance), documented with precise SQL logic in the company Data Dictionary.\n4. Result: Both VP stakeholders approved the taxonomy, eliminating reporting discrepancies and saving ~15 hours of recurring monthly reconciliation meetings.",
    solution_hi: "1. Situation: मार्केटिंग लॉगिन को एक्टिव मान रही थी, फाइनेंस खरीदारी को।\n2. Task: मुझे दोनों को एक मंच पर लाकर डेटा साफ करना था।\n3. Action: मैंने दोनों को समझाया और दो अलग मैट्रिक्स बनाए: 'Engaged User' और 'Monetized User'।\n4. Result: दोनों टीमें संतुष्ट हुईं और हर महीने का 15 घंटे का विवाद खत्म हुआ।",
    explanation_en: "Interviewers look for mature stakeholder negotiation, analytical diplomacy, and documenting single sources of truth in data dictionaries.",
    explanation_hi: "कंपनियां ऐसा एनालिस्ट ढूंढती हैं जो सिर्फ कोड ना लिखे, बल्कि लोगों से बात करके झगड़े सुलझा सके और साफ परिभाषा तय कर सके।",
    rubric: [
      { criterion: "Situation & Task clarity", points: 25 },
      { criterion: "Constructive Action with stakeholder alignment", points: 40 },
      { criterion: "Quantifiable business Result", points: 35 }
    ]
  }
];

module.exports = {
  questionsData
};
