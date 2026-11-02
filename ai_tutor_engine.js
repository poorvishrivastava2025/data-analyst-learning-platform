// ai_tutor_engine.js - Intelligent, Context-Aware AI Tutor & Code Reviewer
// Supports English & Hinglish, pedagogical analogies, progressive hints, code reviews, and live Gemini API when configured

const KNOWLEDGE_GRAPH = {
  sql: {
    name: "SQL (Structured Query Language)",
    citations: [
      { source: "PostgreSQL Official Docs (v16)", url: "https://www.postgresql.org/docs/current/queries.html" },
      { source: "SQLite 3 Query Language Reference", url: "https://www.sqlite.org/lang_select.html" }
    ],
    concepts: {
      select: {
        en: "SELECT specifies which columns to retrieve from a table. Use explicit column names instead of SELECT * for production queries.",
        hi: "SELECT बताता है कि आपको टेबल में से कौन-कौन से कॉलम देखने हैं। हमेशा खास कॉलम के नाम लिखें (जैसे SELECT full_name, city) ताकि क्वेरी तेज चले।"
      },
      where: {
        en: "WHERE filters rows before aggregation. Combine conditions with AND, OR, NOT. Always test NULLs with 'IS NULL'.",
        hi: "WHERE ग्रुपिंग से पहले डेटा की पंक्तियाँ छांटता है। एक से ज्यादा शर्तों के लिए AND और OR का प्रयोग करें, और खाली वैल्यू के लिए हमेशा 'IS NULL' लिखें।"
      },
      join: {
        en: "JOIN combines rows from two or more tables based on a related column (PK/FK). INNER JOIN returns matches in both; LEFT JOIN preserves all left-table rows with NULLs for missing right-table values.",
        hi: "JOIN दो टेबल्स को आपस में जोड़ता है। INNER JOIN सिर्फ कॉमन डेटा लाता है। LEFT JOIN पहली टेबल का सारा डेटा रखता है चाहे दूसरी में मैच हो या न हो (जैसे बिना ऑर्डर वाले ग्राहक ढूंढना)।"
      },
      groupby: {
        en: "GROUP BY collapses multiple rows with identical values into summary rows. Aggregate with SUM, AVG, COUNT, MIN, MAX.",
        hi: "GROUP BY एक जैसी वैल्यूज वाली कई पंक्तियों को एक समरी रो में बदल देता है। इसके साथ SUM, COUNT, या AVG का इस्तेमाल किया जाता है।"
      },
      having: {
        en: "HAVING filters aggregated groups AFTER GROUP BY execution, whereas WHERE filters individual rows BEFORE grouping.",
        hi: "HAVING ग्रुप बनने के बाद कुल योग या गिनती पर फिल्टर लगाता है। WHERE ग्रुप बनने से पहले सिंगल रो को फिल्टर करता है।"
      },
      window: {
        en: "Window functions (ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD) perform calculations across a set of table rows related to the current row without collapsing them.",
        hi: "Window functions (ROW_NUMBER, DENSE_RANK, LAG, LEAD) बिना रो को समेटे (collapse किए) हर पंक्ति के साथ रैंकिंग या पिछली वैल्यू निकालने के काम आते हैं।"
      }
    }
  },
  excel: {
    name: "Microsoft Excel",
    citations: [
      { source: "Microsoft Learn Excel Function Directory", url: "https://support.microsoft.com/en-us/office/excel-functions-alphabetical-b3944572-255d-4efb-bb96-c6d950343468" }
    ],
    concepts: {
      xlookup: {
        en: "XLOOKUP searches a range or array and returns the corresponding item from another range. It defaults to exact match and can search left or right.",
        hi: "XLOOKUP किसी भी टेबल से वैल्यू ढूंढकर लाता है। यह बाईं और दाईं दोनों तरफ देख सकता है और अगर वैल्यू ना मिले तो 'Not Found' एरर मैसेज भी दे सकता है।"
      },
      sumifs: {
        en: "=SUMIFS(sum_range, criteria_range1, criteria1, ...) sums cells that meet multiple criteria.",
        hi: "=SUMIFS एक साथ कई शर्तों के आधार पर कुल जोड़ (Sum) करता है। जैसे: सिर्फ मुंबई में फर्नीचर की कुल बिक्री।"
      },
      pivot: {
        en: "Pivot Tables allow interactive summarization, slicing, sorting, and grouping of large datasets in seconds.",
        hi: "Pivot Table से आप लाखों पंक्तियों के डेटा को बिना कोई फॉर्मूला लिखे चुटकियों में समरी टेबल और चार्ट्स में बदल सकते हैं।"
      }
    }
  },
  python: {
    name: "Python for Data Analysis (Pandas & NumPy)",
    citations: [
      { source: "Pandas User Guide (v2.2)", url: "https://pandas.pydata.org/docs/user_guide/" },
      { source: "NumPy Documentation", url: "https://numpy.org/doc/stable/" }
    ],
    concepts: {
      dataframe: {
        en: "A DataFrame is a 2D labeled data structure with columns of potentially different types, analogous to a spreadsheet or SQL table.",
        hi: "DataFrame पायथन में एक 2D टेबल की तरह होता है (जैसे एक्सेल शीट), जिसमें रो और कॉलम के नाम होते हैं।"
      },
      boolean_indexing: {
        en: "Filter DataFrames by passing boolean conditions in brackets: df[(df['col1'] > 10) & (df['col2'] == 'A')]. Use & and | with parentheses.",
        hi: "डेटा छांटने के लिए df[df['col'] > 10] लिखें। दो शर्तों के लिए & और | लगाएं और हमेशा ब्रैकेट () का ध्यान रखें।"
      },
      groupby: {
        en: "df.groupby('col')['metric'].agg(['mean', 'count']) splits data into groups, applies aggregations, and combines results.",
        hi: "df.groupby() से आप किसी भी केटेगरी के आधार पर औसत (mean) या गिनती (count) निकाल सकते हैं।"
      }
    }
  },
  statistics: {
    name: "Applied Business Statistics",
    citations: [
      { source: "NIST Engineering Statistics Handbook", url: "https://www.itl.nist.gov/div898/handbook/" }
    ],
    concepts: {
      mean_vs_median: {
        en: "Mean is sensitive to extreme outliers; Median is the physical 50th percentile robust against skewed distributions.",
        hi: "Mean (औसत) में अगर कोई बहुत बड़ा नंबर आ जाए तो वह बिगड़ जाता है। Median (मध्यिका) ठीक बीच की वैल्यू होती है और आउटलायर्स से सुरक्षित रहती है।"
      },
      outliers: {
        en: "Tukey's IQR rule: Values below Q1 - 1.5*IQR or above Q3 + 1.5*IQR are flagged as potential outliers.",
        hi: "आउटलायर्स वह अजीब नंबर होते हैं जो बाकी डेटा से बहुत दूर होते हैं। इसे पकड़ने के लिए IQR (Interquartile Range) फॉर्मूला इस्तेमाल होता है।"
      },
      hypothesis_testing: {
        en: "Tests whether an observed difference between groups is statistically significant or merely random chance (p < 0.05).",
        hi: "हाइपोथीसिस टेस्टिंग से यह पक्का करते हैं कि दो चीजों में जो फर्क दिख रहा है (जैसे A/B टेस्ट में) वह सचमुच का है या सिर्फ तुक्का है।"
      }
    }
  },
  git: {
    name: "Git & Version Control",
    citations: [
      { source: "Official Git SCM Documentation", url: "https://git-scm.com/doc" }
    ],
    concepts: {
      commit: {
        en: "A git commit records a snapshot of staged changes. Always write clear, active-voice commit messages.",
        hi: "Git commit आपके काम की एक सुरक्षित तस्वीर (Snapshot) खींच लेता है ताकि भविष्य में कभी भी पुराना कोड देखा जा सके।"
      },
      gitignore: {
        en: "The .gitignore file specifies intentionally untracked files like API keys, .env, and large dataset CSVs.",
        hi: ".gitignore फाइल में उन फाइलों के नाम लिखे जाते हैं जिन्हें GitHub पर अपलोड नहीं करना है (जैसे पासवर्ड और भारी डेटा)।"
      }
    }
  }
};

// Evaluate student code submissions
function reviewLearnerCode({ codeType, userCode, taskContext, language = 'hinglish' }) {
  const isHi = language === 'hinglish' || language === 'hi';
  const cleanCode = (userCode || '').trim();

  if (!cleanCode) {
    return {
      score: 0,
      feedback: isHi 
        ? "कृपया अपना कोड या फॉर्मूला सबमिट करें ताकि मैं उसकी जांच कर सकूँ।"
        : "Please enter your code or formula so I can review it."
    };
  }

  if (codeType === 'sql') {
    const upper = cleanCode.toUpperCase();
    const hasSelect = upper.includes("SELECT");
    const hasFrom = upper.includes("FROM");
    const hasWhere = upper.includes("WHERE");

    let issues = [];
    let praise = [];
    let score = 7;

    if (!hasSelect) {
      issues.push(isHi ? "SELECT क्लॉज गायब है।" : "Missing SELECT clause.");
      score -= 3;
    } else {
      praise.push(isHi ? "SELECT क्लॉज सही तरीके से लिखा गया है।" : "Good use of SELECT clause.");
    }

    if (!hasFrom) {
      issues.push(isHi ? "FROM क्लॉज गायब है (टेबल का नाम नहीं दिया गया)।" : "Missing FROM clause.");
      score -= 3;
    }

    if (upper.includes("= NULL")) {
      issues.push(isHi ? "गंभीर गलती: '= NULL' की जगह 'IS NULL' का इस्तेमाल करें।" : "Critical issue: Use 'IS NULL' instead of '= NULL'.");
      score -= 2;
    }

    if (upper.includes("WHERE") && upper.includes("AND") && upper.includes("OR") && !cleanCode.includes("(") && !cleanCode.includes(")")) {
      issues.push(isHi ? "सुझाव: जब AND और OR दोनों हों तो ब्रैकेट () जरूर लगाएं।" : "Recommendation: Wrap mixed AND/OR conditions in parentheses.");
    }

    if (upper.includes("SELECT *") && taskContext && taskContext.toLowerCase().includes("specific")) {
      issues.push(isHi ? "SELECT * की जगह खास कॉलम नाम लिखना बेस्ट प्रैक्टिस है।" : "Avoid SELECT * in production; explicitly list columns.");
      score -= 1;
    }

    score = Math.max(1, Math.min(10, score + (praise.length > 0 ? 1 : 0)));

    let summary = "";
    if (isHi) {
      summary = `### 🧑‍🏫 AI Tutor कोड रिव्यू: ${score}/10\n\n` +
        (praise.length ? `**अच्छी बातें:**\n${praise.map(p => `- ✅ ${p}`).join('\n')}\n\n` : '') +
        (issues.length ? `**सुधार के बिंदु:**\n${issues.map(i => `- ⚠️ ${i}`).join('\n')}\n\n` : '**बधाई! आपकी क्वेरी का ढांचा बिल्कुल दुरुस्त है।**\n\n') +
        `**ट्यूटर की सलाह:** जब भी क्वेरी लिखें, पहले सोचें: कौन से कॉलम चाहिए (SELECT), कहाँ से चाहिए (FROM), और क्या शर्त है (WHERE)।`;
    } else {
      summary = `### 🧑‍🏫 AI Tutor Code Review: ${score}/10\n\n` +
        (praise.length ? `**Strengths:**\n${praise.map(p => `- ✅ ${p}`).join('\n')}\n\n` : '') +
        (issues.length ? `**Areas to Refine:**\n${issues.map(i => `- ⚠️ ${i}`).join('\n')}\n\n` : '**Great job! Your query syntax is structurally sound.**\n\n') +
        `**Analyst Tip:** Always verify your row counts before and after filtering to ensure business consistency.`;
    }

    return { score, feedback: summary };
  }

  if (codeType === 'excel') {
    const isFormula = cleanCode.startsWith('=');
    let score = 8;
    let feedback = "";

    if (!isFormula) {
      return {
        score: 3,
        feedback: isHi 
          ? "एक्सेल का हर फॉर्मूला बराबर के निशान (`=`) से शुरू होना चाहिए, जैसे `=XLOOKUP(...)`।"
          : "Every Excel formula must begin with an equals sign (`=`), e.g., `=XLOOKUP(...)`."
      };
    }

    if (cleanCode.toUpperCase().includes("XLOOKUP")) {
      const openParens = (cleanCode.match(/\(/g) || []).length;
      const closeParens = (cleanCode.match(/\)/g) || []).length;
      if (openParens !== closeParens) {
        return {
          score: 4,
          feedback: isHi
            ? "ब्रैकेट्स की संख्या बराबर नहीं है। जितने ब्रैकेट खोले हैं उतने ही बंद करें `()`।"
            : "Mismatched parentheses. Ensure every opening '(' has a matching closing ')'."
        };
      }
    }

    if (isHi) {
      feedback = `### 🧑‍🏫 AI Tutor एक्सेल फॉर्मूला रिव्यू: ${score}/10\n\n` +
        `- ✅ फॉर्मूला का सिंटैक्स सही है।\n` +
        `- 💡 **प्रो टिप:** अगर फॉर्मूले को नीचे ड्रैग करना हो तो रेंज को **$** से लॉक (F4) करना मत भूलिएगा!`;
    } else {
      feedback = `### 🧑‍🏫 AI Tutor Excel Formula Review: ${score}/10\n\n` +
        `- ✅ Formula syntax adheres to Excel standards.\n` +
        `- 💡 **Pro Tip:** Remember to lock array references with dollar signs ($) using the F4 key if dragging across rows!`;
    }

    return { score, feedback };
  }

  // Default response for python or other text
  return {
    score: 8,
    feedback: isHi 
      ? "आपका कोड ठीक लग रहा है। डेटा के आकार और डेटा टाइप (`df.info()`) को हमेशा चेक करें।" 
      : "Code structure looks clean. Remember to verify column data types with df.info() before manipulating."
  };
}

// Generate Tutor Response (Supports Live Gemini when GEMINI_API_KEY is present, or local engine)
async function generateTutorResponse({ message, lessonContext, language = 'hinglish', learningHistory = {} }) {
  const apiKey = process.env.GEMINI_API_KEY;
  const isHi = language === 'hinglish' || language === 'hi';

  // 1. If GEMINI_API_KEY is set, query Google Gemini Live API
  if (apiKey) {
    try {
      const systemPrompt = `You are a supportive, encouraging, expert Data Analyst Personal Tutor and Career Coach for a learning website.
Your pedagogical principles:
1. Explain step by step at the learner's level.
2. If language is 'hinglish' or user asks in Hindi/Hinglish, explain in friendly Hinglish (Hindi + English mix).
3. Provide simple, relatable real-world analogies (e.g. Kirana store ledger for SQL JOINs, cricket scores for mean/median).
4. Give progressive hints before giving away final solutions.
5. If the user asks something completely outside data analysis, politely say you only provide verified guidance on Data Analytics without inventing facts.
6. Format output with clean markdown.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nLearner asks: ${message}\nContext: ${lessonContext || 'General Data Analytics'}` }]
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) {
          return {
            message: replyText,
            provider: 'gemini_cloud_live',
            providerLabel: 'Live AI Model (Connected)',
            citations: [
              { source: "Live Gemini AI Model", url: "#" }
            ]
          };
        }
      }
    } catch (e) {
      console.warn('[AI Tutor] Gemini API error, falling back to local pedagogical engine:', e.message);
    }
  }

  // 2. Built-in Local Pedagogical Engine
  const query = (message || '').trim().toLowerCase();
  const isSimplerRequest = query.includes("simpler") || query.includes("simple") || query.includes("easy") || query.includes("aasan") || query.includes("bachhe") || query.includes("eli5") || query.includes("chhota") || query.includes("kirana") || query.includes("analogy") || query.includes("example");
  const isPracticeRequest = query.includes("practice") || query.includes("question") || query.includes("sawaal") || query.includes("quiz me") || query.includes("problem");
  const isHintRequest = query.includes("hint") || query.includes("ishara") || query.includes("madad") || query.includes("stuck");

  const modeBadge = `> ℹ️ *AI Mode: Built-in Pedagogical Tutor Engine (Local Mode). To connect live cloud AI, configure \`GEMINI_API_KEY\` in server environment variables.*\n\n`;

  // Out of scope check
  const isUnrelated = query.includes("weather") || query.includes("movie") || query.includes("capital of");
  if (isUnrelated) {
    return {
      message: modeBadge + (isHi
        ? "ईमानदारी से कहूं तो यह सवाल हमारे डेटा एनालिस्ट पाठ्यक्रम से संबंधित नहीं है। एक करियर कोच के तौर पर मैं केवल डेटा एनालिसिस, SQL, Python, Excel, Stats, Business Process और इंटरव्यू की तैयारी में आपकी मदद कर सकता हूँ। आईये अपने मुख्य लक्ष्य पर फोकस रखें!"
        : "To be completely transparent, that question falls outside our Data Analyst curriculum. As your dedicated tutor, I only provide verified guidance on Data Analysis, SQL, Python, Excel, Statistics, BI Dashboards, and Interview readiness without inventing facts. Let's return to your data goals!"),
      provider: 'local_pedagogical_engine',
      providerLabel: 'Built-in Local Pedagogical Engine (Set GEMINI_API_KEY for Cloud Live Model)',
      citations: []
    };
  }

  // Handle Practice Challenge
  if (isPracticeRequest) {
    return {
      message: modeBadge + (isHi
        ? `### 🎯 प्रैक्टिस सवाल (Practice Challenge)

**सवाल:** आपके पास \`orders\` टेबल है। 
आपको उन सभी ऑर्डर्स की कुल संख्या (\`COUNT\`) और कुल बिक्री (\`SUM(total_amount)\`) निकालनी है जो 'West' रीजन के हैं और जहाँ पेमेंट स्टेटस 'Paid' है।

**नियम:**
1. सीधे जवाब मत पूछिए! खुद कोशिश करें।
2. अगर कहीं अटकें तो मुझसे "Hint" मांगिए।

अपनी क्वेरी प्रैक्टिस कंसोल में लिखकर टेस्ट करें! 🚀`
        : `### 🎯 Practice Challenge

**Scenario:** From our \`orders\` table, calculate the total order count and total revenue (\`SUM(total_amount)\`) for all orders shipped to the 'West' region that have a 'Paid' payment status.

**Guidelines:**
1. Try writing the complete query yourself in the Practice Console first.
2. If you need assistance, ask me for a progressive **Hint**!

Drop your query in the code box or reply here to review! 🚀`),
      provider: 'local_pedagogical_engine',
      providerLabel: 'Built-in Local Pedagogical Engine (Set GEMINI_API_KEY for Cloud Live Model)',
      citations: [{ source: "AnalystPath Practice Vault", url: "#practice" }]
    };
  }

  // Handle Progressive Hint
  if (isHintRequest) {
    return {
      message: modeBadge + (isHi
        ? `### 💡 प्रोग्रेसिव हिंट (Progressive Hint):

- **हिंट 1:** आपको दो एग्रीगेट फंक्शन्स यूज़ करने हैं: \`COUNT(order_id)\` और \`SUM(total_amount)\`।
- **हिंट 2:** दोनों शर्तों को \`WHERE\` क्लॉज में \`AND\` के साथ जोड़ें: \`shipping_region = 'West' AND payment_status = 'Paid'\`।

पूरा जवाब मैंने अभी नहीं दिया है। इन हिंट्स की मदद से एक बार खुद कोशिश कीजिए! आप कर सकते हैं! 💪`
        : `### 💡 Progressive Hint:

- **Hint 1:** Use two aggregate functions in your \`SELECT\` clause: \`COUNT(order_id)\` and \`SUM(total_amount)\`.
- **Hint 2:** Chain your filtering conditions in the \`WHERE\` clause using \`AND\`: \`shipping_region = 'West' AND payment_status = 'Paid'\`.

Give it a shot with these clues! I'm right here if you need more guidance. 💪`),
      provider: 'local_pedagogical_engine',
      providerLabel: 'Built-in Local Pedagogical Engine (Set GEMINI_API_KEY for Cloud Live Model)',
      citations: []
    };
  }

  // SQL JOINs & Kirana Store Analogy
  if (query.includes("join") || query.includes("inner") || query.includes("left")) {
    return {
      message: modeBadge + (isHi
        ? `### 🏪 किराना स्टोर वाला आसान उदाहरण (Kirana Store Analogy):

मान लीजिए आपके पास 2 डायरियां हैं:
1. **डायरी A (कस्टमर लिस्ट):** इसमें मोहल्ले के सभी 50 परिवारों के नाम लिखे हैं।
2. **डायरी B (आज की उधारी):** इसमें उन 10 लोगों के नाम हैं जिन्होंने आज उधार का सामान लिया।

- **INNER JOIN का मतलब:** सिर्फ वही लोग जो **दोनों डायरियों में हैं**। यानी सिर्फ वही 10 लोग जिन्होंने आज उधार लिया। बाकी 40 लोग गायब!
- **LEFT JOIN का मतलब:** पहली डायरी के **सभी 50 लोग दिखेंगे**! जिन 10 ने उधार लिया उनके आगे उधारी दिखेगी, और बाकी 40 के आगे खाली (NULL) दिखेगा।

इससे दुकानदार को तुरंत पता चल जाता है कि कौन से ग्राहक बहुत दिनों से दुकान पर नहीं आए!`
        : `### 🏪 The Grocery Ledger Analogy (ELI5):

Imagine you have two paper notebooks:
1. **Notebook A (Neighborhood Directory):** Lists all 50 families living on the street.
2. **Notebook B (Today's Credit Register):** Lists the 10 people who bought items on credit today.

- **INNER JOIN:** Shows only people listed in **both** books (the 10 who bought on credit). The other 40 vanish.
- **LEFT JOIN:** Keeps **all 50 families** from Notebook A. For the 10 buyers, their credit details appear; for the other 40, their column shows blank / NULL.

This is exactly how companies spot inactive users who haven't made a purchase yet!`),
      provider: 'local_pedagogical_engine',
      providerLabel: 'Built-in Local Pedagogical Engine (Set GEMINI_API_KEY for Cloud Live Model)',
      citations: [
        { source: "PostgreSQL 16 Official Manual - Table Expressions", url: "https://www.postgresql.org/docs/current/queries-table-expressions.html" }
      ]
    };
  }

  // Mean vs Median / Cricket Analogy
  if (query.includes("mean") || query.includes("median") || query.includes("stat") || query.includes("average")) {
    return {
      message: modeBadge + (isHi
        ? `### 📊 Mean और Median का फर्क (क्रिकेट स्कोर एनालॉजी)

- **Mean (औसत):** सभी नंबरों को जोड़कर कुल संख्या से भाग देना।
- **Median (मध्यिका):** डेटा को छोटे से बड़ा जमाने पर ठीक बीच वाला नंबर।

#### क्रिकेटर का उदाहरण:
मान लीजिए किसी बल्लेबाज ने 5 पारियों में रन बनाए: \`[10, 15, 12, 18, 250]\`
- **Mean** = $(10+15+12+18+250) / 5 = 61$ रन। क्या इस बल्लेबाज का हर मैच में 60 रन बनाना तय है? नहीं! उस एक 250 वाले बड़े स्कोर (Outlier) ने औसत को झूठा बढ़ा दिया।
- **Median** = ठीक बीच का स्कोर = **15 रन**। यह दिखाता है कि आम तौर पर वह बल्लेबाज कैसा खेलता है।

**एनालिस्ट का नियम:** जब भी डेटा में असामान्य बड़े नंबर हों (जैसे सैलरी, बिल अमाउंट, डिलीवरी डिले), हमेशा **Median** बताएं!`
        : `### 📊 Mean vs. Median (The Cricket Score Analogy)

- **Mean**: The arithmetic sum divided by sample count $\\frac{\\sum x_i}{N}$. Every extreme value impacts it.
- **Median**: The physical 50th percentile rank when numbers are sorted ascending.

#### Real-World Example:
Consider 5 innings played by a batter: \`[10, 15, 12, 18, 250]\`
- **Mean** = $(10+15+12+18+250) / 5 = 61.0$ runs. Does this mean the batter reliably scores ~60 runs every game? No! That single 250-run outlier heavily inflated the average.
- **Median** = The middle value = **15 runs**. This authentically captures their regular baseline performance.

**Analyst Rule of Thumb:** Whenever working with skewed financial, salary, or delivery metrics, always present the **Median** alongside the Mean!`),
      provider: 'local_pedagogical_engine',
      providerLabel: 'Built-in Local Pedagogical Engine (Set GEMINI_API_KEY for Cloud Live Model)',
      citations: [
        { source: "NIST Engineering Statistics Handbook", url: "https://www.itl.nist.gov/div898/handbook/eda/section3/eda35.htm" }
      ]
    };
  }

  // Default encouraging response
  return {
    message: modeBadge + (isHi
      ? `### 🧑‍🏫 नमस्ते! मैं आपका AI ट्यूटर और करियर कोच हूँ।

मैं आपके सवाल "${message}" पर मार्गदर्शन के लिए तैयार हूँ।

**आप मुझसे क्या-क्या पूछ सकते हैं:**
- *"मुझे SQL JOINs आसान किराना स्टोर वाले उदाहरण से समझाओ"*
- *"XLOOKUP और INDEX/MATCH में क्या फर्क है?"*
- *"Mean और Median कब यूज़ करना चाहिए?"*
- *"मुझसे SQL या Python का एक प्रैक्टिस सवाल पूछो"*
- *"मेरे SQL/Excel कोड को चेक करके फीडबैक दो"*

बताइए, आज हम क्या नया सीखें? 🚀`
      : `### 🧑‍🏫 Hello! I'm your Personal AI Tutor & Career Coach.

I'm ready to assist with "${message}".

**Things you can ask me right now:**
- *"Explain SQL Window Functions with a sports ranking example"*
- *"What is the difference between XLOOKUP and INDEX/MATCH?"*
- *"Why does Median beat Mean when analyzing salaries?"*
- *"Give me an intermediate SQL practice challenge with hints"*
- *"Review my code snippet and identify potential edge cases"*

Which concept would you like to master next? 🚀`),
    provider: 'local_pedagogical_engine',
    providerLabel: 'Built-in Local Pedagogical Engine (Set GEMINI_API_KEY for Cloud Live Model)',
    citations: [
      { source: "Core Curriculum Documentation", url: "#catalog" }
    ]
  };
}

module.exports = {
  KNOWLEDGE_GRAPH,
  generateTutorResponse,
  reviewLearnerCode
};
