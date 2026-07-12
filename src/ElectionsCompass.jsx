import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, RotateCcw, Vote, Shield, Scale, Coins,
  BookOpen, Users, Map, BrainCircuit, MessageCircleHeart, Heart,
  Star, Info, Check, Share2, Sparkles
} from 'lucide-react';

/* ==================================================================
   DESIGN SYSTEM — "בוקר של בחירות"
   רקע בהיר ואוורירי עם הילות צבע רכות, כרטיסים לבנים נקיים,
   כפתור פעולה בגרדיאנט כחול→סגול.

   טיפוגרפיה עברית:
   - כותרות: Secular One — פונט תצוגה עברי גיאומטרי, בולט וקריא.
   - טקסט:   Assistant — פונט עברי אוורירי ונעים מאוד לקריאה רציפה.

   סקאלת רדיוסים: כרטיס 3xl · כפתור 2xl · צ'יפ xl.
================================================================== */
const FONT_BODY = "'Assistant', system-ui, sans-serif";
const FONT_DISPLAY = "'Secular One', 'Assistant', sans-serif";

const CARD = 'bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-indigo-200/40';
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
const BTN_PRIMARY = `inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white
  bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-[length:200%_100%] bg-right
  hover:bg-left transition-[background-position,transform,box-shadow] duration-500
  shadow-lg shadow-indigo-300/60 hover:shadow-indigo-400/60 hover:-translate-y-0.5 active:translate-y-0 ${FOCUS}`;
const BTN_SECONDARY = `inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-700
  bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-colors ${FOCUS}`;
const BTN_GHOST = `inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-900 transition-colors ${FOCUS}`;

/* ------------------------------------------------------------------
   PARTIES — position = מיקום על ציר שמאל(0)–ימין(100).
------------------------------------------------------------------- */
const PARTIES = {
  hadashTaal:      { id: 'hadashTaal',      name: 'חד"ש-תע"ל',            hex: '#dc2626', position: 5,  description: 'רשימה משותפת (עודה וטיבי). שוויון זכויות מלא, סיום השליטה בשטחים, ומדינה פלסטינית לצד ישראל.' },
  raam:            { id: 'raam',            name: 'רע"ם',                  hex: '#059669', position: 14, description: 'מפלגה ערבית-אסלאמית פרגמטית בראשות מנסור עבאס. שיפור מעמד החברה הערבית, שמרנות חברתית ושילוב פוליטי.' },
  democrats:       { id: 'democrats',       name: 'הדמוקרטים',             hex: '#db2777', position: 23, description: 'שמאל ציוני בראשות יאיר גולן. סוציאל-דמוקרטיה, הסדר מדיני, שוויון זכויות והפרדת דת ומדינה.' },
  yashar:          { id: 'yashar',          name: 'ישר!',                  hex: '#0d9488', position: 33, description: 'מרכז בראשות גדי איזנקוט. ממלכתיות, יושרה ציבורית, שירות לכל וחתירה להסדרים אזוריים.' },
  kacholLavan:     { id: 'kacholLavan',     name: 'כחול לבן',              hex: '#1d4ed8', position: 43, description: 'מרכז ביטחוניסטי בראשות בני גנץ. קונצנזוס, שמירה על מוסדות המדינה ורפורמות בהסכמה רחבה.' },
  bYachad:         { id: 'bYachad',         name: 'ביחד (בנט־לפיד)',       hex: '#0891b2', position: 54, description: 'מרכז-ימין. ליברליזם כלכלי וחילוני לצד ימין ביטחוני-ממלכתי. ממשלה רחבה ללא קיצוניים.' },
  yisraelBeiteinu: { id: 'yisraelBeiteinu', name: 'ישראל ביתנו',           hex: '#4338ca', position: 65, description: 'ימין חילוני בראשות ליברמן. שוק חופשי, שוויון בנטל, הפרדת דת ומדינה וגישה צבאית נוקשה.' },
  likud:           { id: 'likud',           name: 'הליכוד',                hex: '#2563eb', position: 75, description: 'ימין בראשות נתניהו. כלכלה חופשית, תפיסה לאומית-שמרנית וביקורתיות כלפי מערכת המשפט.' },
  shas:            { id: 'shas',            name: 'ש"ס',                   hex: '#0f172a', position: 84, description: 'חרדית-ספרדית בראשות דרעי. שמרנות דתית, סטטוס קוו דתי ורשתות רווחה חברתית.' },
  utj:             { id: 'utj',             name: 'יהדות התורה',           hex: '#475569', position: 92, description: 'חרדית-אשכנזית. שימור עולם התורה, אוטונומיה בחינוך והתנגדות לגיוס כפוי.' },
  farRight:        { id: 'farRight',        name: 'הציונות הדתית-עוצמה',   hex: '#ea580c', position: 98, description: 'ימין אידיאולוגי (סמוטריץ׳ ובן גביר). סיפוח, פעולה צבאית נחרצת, שמרנות דתית ורפורמה משפטית מלאה.' },
};

const PARTY_IDS = Object.keys(PARTIES);

/* ------------------------------------------------------------------
   QUESTIONS
------------------------------------------------------------------- */
const QUESTIONS = [
  {
    id: 'judiciary',
    category: 'מערכת המשפט',
    icon: Scale,
    accent: '#6366f1',
    variants: {
      simple: {
        text: 'מה צריך לעשות עם בית המשפט העליון (בג"ץ) והרפורמה המשפטית?',
        options: [
          'רפורמה מלאה עכשיו: הממשלה תבחר את השופטים, ותחוקק פסקת התגברות כדי שבג"ץ לא יוכל לפסול חוקים.',
          'תיקונים בבג"ץ, אבל רק בהסכמה רחבה. בלי לתת לממשלה כוח בלתי מוגבל למנות שופטים בעצמה.',
          'לשמור על המצב הקיים: בג"ץ שומר עלינו מהפוליטיקאים. לא לגעת בוועדה לבחירת שופטים.',
          'לחזק את בג"ץ ולחוקק חוקה: סמכות מפורשת לפסול חוקים שפוגעים בזכויות אדם בסיסיות.',
        ],
      },
      advanced: {
        text: 'מהי עמדתך ביחס למבנה המשטרי, הרפורמה המשפטית ומעמד הרשות השופטת?',
        options: [
          'העברת מרכז הכובד לרשות המבצעת: פסקת התגברות ברוב של 61, ביטול עילת הסבירות ושינוי הרכב הוועדה לבחירת שופטים.',
          'רפורמה אבולוציונית: ריכוך עילת הסבירות וחוק היועמ"שים, תוך שמירה על זכות הוטו ההדדית בוועדה לבחירת שופטים.',
          'הקפאת המצב הקיים: דחיית שינויים בחוקי היסוד והגנה על עצמאות הרשות השופטת כבלם האפקטיבי היחיד.',
          'כינון חוקה: עיגון חוק יסוד החקיקה, ביצור מגילת זכויות האדם (כולל חוק יסוד השוויון) ושריון מעמד בג"ץ.',
        ],
      },
    },
    stances: { likud: 0, farRight: 0, shas: 0.2, utj: 0.2, bYachad: 1, kacholLavan: 1.3, yashar: 1.6, yisraelBeiteinu: 2, raam: 2.4, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'security',
    category: 'הסכסוך והשטחים',
    icon: Shield,
    accent: '#ef4444',
    variants: {
      simple: {
        text: 'מה הפתרון המעשי למצב ביהודה ושומרון (הגדה המערבית)?',
        options: [
          'לספח את יהודה ושומרון (או את שטחי C), לפרק את הרשות הפלסטינית ולהרחיב משמעותית את ההתנחלויות.',
          'ניהול הסכסוך: לשמר את המצב הקיים. צה"ל פועל בכל מקום, שומרים על ההתנחלויות, בלי סיפוח ובלי מדינה פלסטינית.',
          'היפרדות: לקבוע גבולות, לספח רק את גושי ההתנחלויות, ולהשאיר לפלסטינים אוטונומיה (לא מדינה).',
          'הסכם שלום ושתי מדינות: לפנות התנחלויות מבודדות ולהקים מדינה פלסטינית מפורזת כחלק מהסדר אזורי.',
        ],
      },
      advanced: {
        text: 'איזו אסטרטגיה מדינית-ביטחונית יש ליישם בזירה הפלסטינית (איו"ש)?',
        options: [
          'החלת ריבונות דה-יורה על שטחי C, מניעת ישות מדינית פלסטינית בכל תרחיש, ופירוק מוסדות הרשות.',
          'שמירה על הסטטוס קוו: אוטונומיה אזרחית מוגבלת, חופש פעולה מבצעי מלא לצה"ל, והימנעות מנסיגות.',
          'צמצום הסכסוך: היפרדות אזרחית תוך סיפוח הגושים, חיזוק כלכלי של הרשות ושליטה ביטחונית ישראלית עליונה.',
          'פתרון שתי מדינות: נסיגה לקווי 67׳ עם חילופי שטחים, מדינה פלסטינית ריבונית ופינוי עומק ההתיישבות.',
        ],
      },
    },
    stances: { farRight: 0, likud: 0.9, yisraelBeiteinu: 1, shas: 1.2, utj: 1.2, kacholLavan: 2, yashar: 2, bYachad: 2, democrats: 3, hadashTaal: 3, raam: 3 },
  },
  {
    id: 'gaza',
    category: 'עזה והיום שאחרי',
    icon: Map,
    accent: '#ea580c',
    variants: {
      simple: {
        text: 'מה צריך לעשות ברצועת עזה כדי להבטיח ביטחון לטווח ארוך?',
        options: [
          'לכבוש את הרצועה, להקים ממשל צבאי קבוע, לעודד הגירה מרצון ולהקים מחדש את יישובי גוש קטיף.',
          'צה"ל ישלוט ביטחונית לאורך זמן, והניהול האזרחי יימסר למקומיים שאינם קשורים לחמאס או לרשות.',
          'צה"ל יאבטח מבחוץ, וקואליציה של מדינות ערב מתונות תנהל ותשקם את עזה מבפנים.',
          'להעביר שליטה מלאה לרשות פלסטינית מחוזקת, בסיוע בינלאומי, כחלק מפתרון מדיני רחב.',
        ],
      },
      advanced: {
        text: 'מהו המתווה האסטרטגי המועדף לעיצוב המציאות ברצועת עזה?',
        options: [
          'שליטה צבאית דה-פקטו וממשל צבאי גלוי, לצד חידוש ההתיישבות היהודית בצפון ובמרכז הרצועה.',
          'שליטה ביטחונית רציפה בפרוזדורים, דחיקת חמאס והעברת הניהול האזרחי לטכנוקרטים או ראשי חמולות נטולי זיקה לרש"פ.',
          'ברית אזורית בחסות אמריקאית: כוח ערבי-סוני רב-לאומי לניהול השיקום, מול מעטפת ביטחונית ישראלית.',
          'אינטגרציה של מנגנוני הרשות הפלסטינית "המחודשת" כגורם הריבוני ברצועה, כצעד מקדים להסדר קבע.',
        ],
      },
    },
    stances: { farRight: 0, likud: 1, yisraelBeiteinu: 1.2, shas: 1.2, utj: 1.2, kacholLavan: 2, yashar: 2, bYachad: 2, raam: 2.5, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'economy',
    category: 'כלכלה ויוקר המחיה',
    icon: Coins,
    accent: '#16a34a',
    variants: {
      simple: {
        text: 'איך הממשלה צריכה להוריד את יוקר המחיה?',
        options: [
          'שוק חופשי: לפרק מונופולים ואת ההסתדרות, להפריט, לפתוח לייבוא ולחתוך מיסים.',
          'שוק חופשי אחראי: לעודד תעסוקה ולשחרר רגולציה, בלי לחלק מיליארדים לפרויקטים סקטוריאליים.',
          'רווחה מסורתית: פיקוח על מחירי המזון, סיוע לעניים והגדלה משמעותית של קצבאות.',
          'סוציאל-דמוקרטיה: להעלות מיסים על ההון, חינוך חינם מגיל אפס, רפואה ציבורית ופיקוח על שכר הדירה.',
        ],
      },
      advanced: {
        text: 'איזו אסכולה מקרו-כלכלית על ישראל לאמץ מול הגירעון, האינפלציה והריכוזיות?',
        options: [
          'נאו-ליברליזם: דה-רגולציה עמוקה, החלשת העבודה המאורגנת, ביטול מכסים, צמצום המגזר הציבורי והורדת מס חברות.',
          'כלכלת שוק עם משמעת פיסקלית: הסרת חסמי יבוא, בלימת תקציבים לא-יצרניים וקיצוץ בכספים קואליציוניים.',
          'רשת ביטחון והרחבת סובסידיות: פיקוח מחירים, קצבאות עמוקות למשפחות ברוכות ילדים והגנה על תוצרת מקומית.',
          'מודל סוציאל-דמוקרטי: מס עושר, מיסוי רווחי יתר של הבנקים ומימון שירותים ציבוריים אוניברסליים על חשבון ההון.',
        ],
      },
    },
    stances: { yisraelBeiteinu: 0, bYachad: 0.6, kacholLavan: 1, yashar: 1, likud: 1.6, shas: 2, utj: 2, raam: 2.2, farRight: 2, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'religion',
    category: 'דת ומדינה',
    icon: BookOpen,
    accent: '#ca8a04',
    variants: {
      simple: {
        text: 'איך צריכים להיראות החיים הציבוריים מבחינת דת (שבת, נישואים)?',
        options: [
          'ישראל היא קודם כל מדינה יהודית: לאסור מרכולים בשבת, לאסור חמץ בבתי חולים, ונישואים רק דרך הרבנות.',
          'לשמור על הסטטוס קוו: בלי פשרות דתיות אבל גם בלי לחוקק עכשיו תחבורה ציבורית בשבת, כדי למנוע קרע.',
          'פתרון מקומי: ראשי ערים יחליטו על תחבורה ומסחר בשבת בעירם, ומסלול נישואים אזרחי למנועי חיתון.',
          'הפרדה מוחלטת: תחבורה ציבורית בשבת בכל הארץ, נישואים אזרחיים לכולם וביטול תקציבים למוסדות ללא ליבה.',
        ],
      },
      advanced: {
        text: 'כיצד יש להכריע במאבק על עיצוב המרחב הציבורי ביחסי דת ומדינה?',
        options: [
          'הגברת הכפיפות להלכה במרחב הציבורי: שימור מונופול הרבנות בדיני אישות ואכיפת חוקי המרכולים ואיסור חמץ.',
          'דבקות בסטטוס קוו ההיסטורי: הימנעות משינויים משפטיים רדיקליים או חקיקה חילונית, מתוך תפיסת ממלכתיות.',
          'ביזור סמכויות: העברת סמכויות תחבורה ומסחר בשבת לשלטון המקומי, וממסד אזרחי חלופי לנישואין למנועי חיתון.',
          'הפרדת דת ומדינה: נישואין וגירושין אזרחיים מלאים, שלילת סמכויות בתי הדין הרבניים ותחבורה ציבורית ארצית בשבת.',
        ],
      },
    },
    stances: { shas: 0, utj: 0, farRight: 0, raam: 0.3, likud: 1, kacholLavan: 1.6, yashar: 2, bYachad: 2, yisraelBeiteinu: 3, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'draft',
    category: 'גיוס ושוויון בנטל',
    icon: Users,
    accent: '#0891b2',
    variants: {
      simple: {
        text: 'מה הדרך הנכונה לפתור את סוגיית גיוס החרדים?',
        options: [
          'פטור חוקי מלא מגיל מוקדם. לימוד התורה חשוב למדינה, ומי שפטור יוכל לצאת לעבוד בלי כפייה.',
          'גיוס בהסכמה עם תמריצים: יעדי גיוס לישיבות וקיצוץ תקציבי אם לא יעמדו בהם, בלי לגייס בכוח.',
          'חובה אזרחית לכולם: מי שלא מתגייס לצה"ל יחויב בשירות לאומי-אזרחי מלא. מי שיסרב, מוסדותיו לא יתוקצבו.',
          'גיוס שווה כולל סנקציות: חוק גיוס אחד, וסנקציות אישיות על משתמטים (שלילת הנחות ורישיונות).',
        ],
      },
      advanced: {
        text: 'מהו המתווה האידיאלי לחוק הגיוס והסדרת פטור "תורתו אומנותו"?',
        options: [
          'עיגון לימוד התורה כערך עליון, הורדת גיל הפטור ל-21 לשילוב בתעסוקה, והתנגדות לכל סנקציה.',
          'מתווה יעדים מתון והדרגתי: סנקציות כלכליות על תקציב הישיבות בלבד (לא על התלמיד), ללא הליכים פליליים.',
          'שירות חובה אוניברסלי (צבאי או אזרחי): שלילת תמיכות ממוסדות מעודדי השתמטות ותגמול דיפרנציאלי למשרתים.',
          'ביטול דחיית השירות: החלת חוק שירות ביטחון על כל האזרחים, כולל הליכים פליליים ושלילת הטבות ממשתמטים.',
        ],
      },
    },
    stances: { shas: 0, utj: 0, hadashTaal: 0.3, raam: 0.3, likud: 1, farRight: 1.4, kacholLavan: 2, yashar: 2, bYachad: 2.3, democrats: 2.7, yisraelBeiteinu: 3 },
  },
  {
    id: 'lgbtq',
    category: 'זכויות פרט וקהילת הלהט"ב',
    icon: Heart,
    accent: '#a855f7',
    variants: {
      simple: {
        text: 'מה צריכה להיות מדיניות המדינה כלפי הקהילה הגאה?',
        options: [
          'המדינה תכיר רק במשפחה של אבא ואמא. נגד תקצוב מצעדי גאווה ונגד אימוץ על ידי זוגות חד-מיניים.',
          'לחיות ולתת לחיות, בלי שינוי חוקים: אין בעיה במישור הפרטי, אבל לא להפוך את זה למאבק חקיקה.',
          'חינוך לסובלנות וחוקים נגד אפליה: איסור אפליה בתעסוקה והשוואת זכויות במסגרת פשרות אזרחיות.',
          'שוויון מלא בחוק: נישואים גאים, פונדקאות לזוגות גברים ואימוץ שוויוני ללא הבדל נטייה.',
        ],
      },
      advanced: {
        text: 'מה עמדתך ביחס לחקיקה פרואקטיבית בנושאי קהילת הלהט"ב וזכויות פרט?',
        options: [
          'שמרנות אקטיבית: התנגדות להכרה במודלים אלטרנטיביים למשפחה ההטרונורמטיבית ומניעת מימון ציבורי לארגוני גאווה.',
          'היצמדות לסטטוס קוו: הימנעות משינוי חוקי הפונדקאות והאימוץ, לצד חופש פרט מלא במישור האישי.',
          'חקיקה מגינה: איסור אפליה בתעסוקה ובשירותים, השוואת תנאים בביטוח הלאומי וקידום סובלנות בחינוך הממלכתי.',
          'רפורמה אזרחית: פונדקאות לזוגות חד-מיניים, הכרה סטטוטורית בנישואין גאים וחוק עבירות שנאה מחמיר.',
        ],
      },
    },
    stances: { farRight: 0, shas: 0, utj: 0, raam: 0.2, likud: 1, kacholLavan: 2, yashar: 2, bYachad: 2.2, hadashTaal: 2.8, democrats: 3, yisraelBeiteinu: 3 },
  },
  {
    id: 'governance',
    category: 'משילות ושומרי סף',
    icon: BrainCircuit,
    accent: '#0d9488',
    variants: {
      simple: {
        text: 'מה צריך להיות תפקידה של היועצת המשפטית לממשלה?',
        options: [
          'השרים נבחרו על ידי העם והיא רק "יועצת". שר שהיא תוקעת לו את המדיניות צריך לוכל לפטר אותה.',
          'הממשלה צריכה למשול, אבל להקשיב ליועצים. במחלוקת קשה, השר רשאי להביא עורך דין פרטי שייצג אותו.',
          'היא שומרת סף נגד שחיתות. חוות דעתה מחייבת את השר, ואסור לשרים להתעלם מהנחיותיה.',
          'שומרי הסף הם חומת המגן של הדמוקרטיה. יש לאסור על פוליטיקאים להתערב במינויים שלהם.',
        ],
      },
      advanced: {
        text: 'כיצד יש להגדיר את יחסי הכוחות בין הדרג הנבחר לייעוץ המשפטי הממשלתי?',
        options: [
          'חוות הדעת היא עצה בלבד. חוק שיאפשר לשרים למנות יועמ"שים במשרות אמון ולפטרם על בסיס חוסר התאמה למדיניות.',
          'משקל רב לייעוץ המשפטי, אך ללא זכות וטו: במחלוקת קשה תתאפשר לממשלה הסתייעות בייצוג משפטי פרטי.',
          'חוות הדעת מחייבת את הרשות המבצעת כדי להבטיח מנהל תקין, אלא אם פסק בית המשפט אחרת.',
          'הגנה חוקתית על עצמאות שומרי הסף: עיגון סמכותם בחוק יסוד וניתוק מינוים והדחתם מהדרג הפוליטי.',
        ],
      },
    },
    stances: { farRight: 0, likud: 0, shas: 0.4, utj: 0.4, bYachad: 1, kacholLavan: 1.5, yashar: 2, yisraelBeiteinu: 2, raam: 2.6, democrats: 3, hadashTaal: 3 },
  },
];

const MAX_IDX = 3;

/* ------------------------------------------------------------------
   SCORING LOGIC (ללא שינוי)
------------------------------------------------------------------- */
const similarity = (choice, stance) =>
  Math.max(0, 1 - Math.abs(choice - stance) / MAX_IDX);

function computeResults(answers) {
  const answered = QUESTIONS.map((q, i) => ({ q, a: answers[i] }))
    .filter(({ a }) => a && a.choice !== null);

  const totalWeight = answered.reduce((s, { a }) => s + a.weight, 0);

  const scored = PARTY_IDS.map((pid) => {
    const perQuestion = answered.map(({ q, a }) => ({
      questionId: q.id,
      category: q.category,
      sim: similarity(a.choice, q.stances[pid]),
      weight: a.weight,
    }));
    const earned = perQuestion.reduce((s, r) => s + r.sim * r.weight, 0);
    const match = totalWeight > 0 ? (earned / totalWeight) * 100 : 0;
    return { ...PARTIES[pid], match: Math.round(match), perQuestion };
  });

  scored.sort((a, b) => b.match - a.match || a.position - b.position);
  return { scored, answeredCount: answered.length, totalWeight };
}

/* ------------------------------------------------------------------
   GLOBAL STYLES — אנימציות
------------------------------------------------------------------- */
const GLOBAL_CSS = `
  @keyframes auroraFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(4vw, -3vh) scale(1.12); }
    66%      { transform: translate(-3vw, 4vh) scale(0.93); }
  }
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes popIn {
    0%   { opacity: 0; transform: scale(0.9); }
    70%  { transform: scale(1.03); }
    100% { opacity: 1; transform: scale(1); }
  }
  @keyframes barGrow { from { width: 0; } }
  .anim-enter  { animation: fadeSlideIn .45s cubic-bezier(.22,1,.36,1) both; }
  .anim-pop    { animation: popIn .5s cubic-bezier(.22,1,.36,1) both; }
  .anim-bar    { animation: barGrow 1s cubic-bezier(.22,1,.36,1) both; }
  .aurora-blob { animation: auroraFloat 24s ease-in-out infinite; will-change: transform; }
  .aurora-blob.delay { animation-delay: -12s; }
  @media (prefers-reduced-motion: reduce) {
    .anim-enter, .anim-pop, .anim-bar, .aurora-blob { animation: none !important; }
  }
`;

/* ------------------------------------------------------------------
   BACKGROUND + SHELL — בהיר, אוורירי, עם צבע חי ברקע
------------------------------------------------------------------- */
function Background() {
  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50 via-white to-sky-50" />
      {/* הילות צבע רכות ונעות */}
      <div className="aurora-blob absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-blue-300/40 blur-[110px]" />
      <div className="aurora-blob delay absolute -bottom-44 -left-32 w-[36rem] h-[36rem] rounded-full bg-violet-300/35 blur-[120px]" />
      <div className="aurora-blob absolute top-1/3 left-1/2 w-[22rem] h-[22rem] rounded-full bg-cyan-300/30 blur-[100px]" />
      {/* נקודות עדינות לעומק */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: 'radial-gradient(rgba(99,102,241,0.16) 1.5px, transparent 1.5px)',
          backgroundSize: '28px 28px',
          maskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 25%, transparent 75%)',
        }}
      />
    </div>
  );
}

function AppShell({ children, center = true }) {
  return (
    <div
      dir="rtl"
      className={`relative min-h-screen text-slate-800 ${center ? 'flex items-start md:items-center justify-center' : ''} px-4 py-6 md:p-8`}
      style={{ fontFamily: FONT_BODY }}
    >
      <style>{GLOBAL_CSS}</style>
      <Background />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}

const Display = ({ children, className = '', style = {} }) => (
  <span className={className} style={{ fontFamily: FONT_DISPLAY, fontWeight: 400, ...style }}>
    {children}
  </span>
);

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------- */
export default function ElectionsCompass() {
  const [screen, setScreen] = useState('welcome');
  const [difficulty, setDifficulty] = useState('simple');
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState(() =>
    QUESTIONS.map(() => ({ choice: null, weight: 1 }))
  );
  const [copied, setCopied] = useState(false);
  const [locked, setLocked] = useState(false);

  useEffect(() => {
    if (!document.getElementById('app-font')) {
      const link = document.createElement('link');
      link.id = 'app-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Secular+One&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  const displayOrder = useMemo(
    () =>
      QUESTIONS.map(() => {
        const o = [0, 1, 2, 3];
        for (let i = o.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [o[i], o[j]] = [o[j], o[i]];
        }
        return o;
      }),
    []
  );

  const results = useMemo(() => computeResults(answers), [answers]);

  const reset = () => {
    setAnswers(QUESTIONS.map(() => ({ choice: null, weight: 1 })));
    setIdx(0);
    setScreen('welcome');
  };

  const setAnswer = (patch) =>
    setAnswers((prev) => prev.map((a, i) => (i === idx ? { ...a, ...patch } : a)));

  const goNext = () => {
    if (idx >= QUESTIONS.length - 1) {
      setScreen('results');
    } else {
      setIdx(idx + 1);
    }
  };

  /* בחירת תשובה → פידבק ויזואלי קצר → מעבר אוטומטי */
  const answerAndAdvance = (choice) => {
    if (locked) return;
    setLocked(true);
    setAnswer({ choice });
    setTimeout(() => {
      setLocked(false);
      goNext();
    }, 320);
  };

  const share = async () => {
    const top = results.scored[0];
    const text = `מצפן הבחירות 2026 — ההתאמה הגבוהה שלי: ${top.name} (${top.match}%)`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  /* ---------------- WELCOME ---------------- */
  if (screen === 'welcome') {
    return (
      <AppShell>
        <div className={`max-w-2xl w-full ${CARD} overflow-hidden anim-pop`}>
          <div className="relative p-8 md:p-14 text-center">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full bg-blue-400/15 blur-3xl pointer-events-none" />
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-indigo-300/60 mb-6">
              <Vote className="w-10 h-10 text-white" />
            </div>
            <h1 className="relative text-4xl md:text-6xl mb-4 tracking-tight bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent" style={{ fontFamily: FONT_DISPLAY }}>
              מצפן הבחירות 2026
            </h1>
            <p className="relative text-slate-600 text-lg md:text-xl font-semibold mb-6">
              איפה העמדות שלך פוגשות את המציאות?
            </p>
            <p className="relative text-[17px] md:text-base text-slate-500 leading-relaxed max-w-lg mx-auto mb-8">
              שמונה שאלות על נושאי הליבה. לכל מפלגה יש עמדה מוצהרת, ואנחנו מודדים עד כמה התשובות שלך קרובות אליה — תוך התחשבות בנושאים שבאמת חשובים לך.
            </p>
            <div className="relative bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl text-[15px] md:text-sm text-slate-600 mb-8 flex items-start gap-3 text-right">
              <Info className="w-5 h-5 flex-shrink-0 text-indigo-500 mt-0.5" />
              <p className="leading-relaxed">השאלון אובייקטיבי ומחלק בדיוק את אותו משקל לכל המפלגות. האחוזים בסוף הם התאמה אמיתית — לא סקר פופולריות.</p>
            </div>
            <button onClick={() => setScreen('difficulty')} className={`${BTN_PRIMARY} w-full sm:w-auto text-lg`}>
              בואו נתחיל <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ---------------- DIFFICULTY ---------------- */
  if (screen === 'difficulty') {
    return (
      <AppShell>
        <div className={`max-w-3xl w-full ${CARD} p-6 md:p-12 text-center anim-enter`}>
          <h2 className="text-3xl md:text-4xl mb-3 tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>
            באיזו שפה נדבר?
          </h2>
          <p className="text-slate-500 mb-8 md:mb-10 text-lg">אותן שאלות, אותו ניקוד — רק הניסוח משתנה.</p>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                key: 'simple',
                icon: MessageCircleHeart,
                title: 'בגובה העיניים',
                desc: "שפה יומיומית וברורה, נטולת ז'רגון ומושגים מסובכים. מתאים לכולם.",
                grad: 'from-cyan-500 to-blue-600',
                hover: 'hover:border-blue-300 hover:shadow-blue-200/60',
              },
              {
                key: 'advanced',
                icon: BrainCircuit,
                title: 'מעמיק ומקצועי',
                desc: 'מונחים משפטיים, מדיניים וכלכליים מדויקים. לאנשים שחיים ונושמים חדשות.',
                grad: 'from-violet-500 to-indigo-600',
                hover: 'hover:border-violet-300 hover:shadow-violet-200/60',
              },
            ].map(({ key, icon: Icon, title, desc, grad, hover }) => (
              <button
                key={key}
                onClick={() => { setDifficulty(key); setScreen('quiz'); }}
                className={`group relative p-6 md:p-8 rounded-3xl border-2 border-slate-200 bg-white text-right overflow-hidden
                  transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${hover} ${FOCUS}`}
              >
                <div className={`absolute -top-14 -left-14 w-36 h-36 rounded-full bg-gradient-to-br ${grad} opacity-0 group-hover:opacity-15 blur-2xl transition-opacity duration-500 pointer-events-none`} />
                <div className={`relative p-3.5 w-fit rounded-2xl bg-gradient-to-br ${grad} shadow-md mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="relative text-xl mb-2 text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                <p className="relative text-slate-500 text-[15px] md:text-sm leading-relaxed font-medium">{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </AppShell>
    );
  }

  /* ---------------- QUIZ ---------------- */
  if (screen === 'quiz') {
    const q = QUESTIONS[idx];
    const v = q.variants[difficulty];
    const current = answers[idx];
    const Icon = q.icon;
    const progress = ((idx + 1) / QUESTIONS.length) * 100;

    return (
      <AppShell>
        <div className="max-w-3xl w-full">

          {/* Progress — מחוץ לכרטיס, כמו במשחק */}
          <div className="flex items-center gap-4 mb-4 px-1">
            <div className="flex-1 h-2.5 rounded-full bg-white/80 border border-slate-200 overflow-hidden shadow-inner">
              <div
                className="h-full rounded-full bg-gradient-to-l from-cyan-500 to-violet-500 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-base md:text-sm font-extrabold text-slate-600 tabular-nums whitespace-nowrap">
              {idx + 1} / {QUESTIONS.length}
            </span>
          </div>

          {/* הכרטיס מתחלף עם אנימציה בכל שאלה */}
          <div key={idx} className={`${CARD} overflow-hidden anim-enter`}>
            <div className="p-5 md:p-10">

              {/* שורת קטגוריה + משקל: נשברת יפה במובייל */}
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl" style={{ backgroundColor: `${q.accent}15` }}>
                    <Icon className="w-5 h-5" style={{ color: q.accent }} />
                  </div>
                  <span className="text-base md:text-sm font-extrabold uppercase tracking-wider" style={{ color: q.accent }}>
                    {q.category}
                  </span>
                </div>

                {/* משקל — אופציונלי, ברירת מחדל "רגיל". שורה מלאה במובייל */}
                <div
                  className="w-full sm:w-auto sm:mr-auto flex items-center gap-1 bg-slate-100 border border-slate-200 rounded-xl p-1"
                  role="group"
                  aria-label="עד כמה הנושא חשוב לך? (אופציונלי)"
                >
                  {[
                    { w: 0.5, label: 'שולי' },
                    { w: 1, label: 'רגיל' },
                    { w: 2, label: 'קריטי' },
                  ].map(({ w, label }) => (
                    <button
                      key={w}
                      onClick={() => setAnswer({ weight: w })}
                      aria-pressed={current.weight === w}
                      title="עד כמה הנושא חשוב לך? (אופציונלי)"
                      className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg text-sm md:text-xs font-bold transition-colors ${FOCUS} ${
                        current.weight === w
                          ? 'bg-white text-indigo-700 shadow-sm border border-indigo-200'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {w === 2 && <Star className={`w-3 h-3 inline ml-1 -mt-0.5 ${current.weight === w ? 'fill-amber-500 text-amber-500' : ''}`} />}
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl mb-6 md:mb-8 leading-snug tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>
                {v.text}
              </h2>

              {/* Options — לחיצה מעבירה לשאלה הבאה */}
              <div className="space-y-3" role="radiogroup" aria-label={v.text}>
                {displayOrder[idx].map((optIdx) => {
                  const selected = current.choice === optIdx;
                  return (
                    <button
                      key={optIdx}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => answerAndAdvance(optIdx)}
                      disabled={locked && !selected}
                      className={`group w-full text-right p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-start gap-3 md:gap-4 ${FOCUS} ${
                        selected
                          ? 'border-blue-500 bg-blue-50 text-slate-900 shadow-lg shadow-blue-200/60 scale-[1.01]'
                          : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50/40 hover:shadow-md hover:shadow-slate-200/60'
                      }`}
                    >
                      <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selected ? 'border-blue-600 bg-blue-600' : 'border-slate-300 group-hover:border-blue-400'
                      }`}>
                        {selected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-[17px] md:text-base leading-relaxed ${selected ? 'font-bold' : 'font-medium'}`}>
                        {v.options[optIdx]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation */}
              <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-5">
                <button
                  onClick={() => (idx === 0 ? setScreen('difficulty') : setIdx(idx - 1))}
                  className={BTN_GHOST}
                >
                  <ChevronRight className="w-5 h-5" /> קודמת
                </button>
                <button
                  onClick={() => { setAnswer({ choice: null }); goNext(); }}
                  className={BTN_GHOST}
                >
                  לדלג <ChevronLeft className="w-4 h-4" />
                </button>
              </div>

            </div>
          </div>
        </div>
      </AppShell>
    );
  }

  /* ---------------- RESULTS ---------------- */
  const { scored, answeredCount } = results;
  const top = scored[0];

  if (answeredCount === 0) {
    return (
      <AppShell>
        <div className={`max-w-md w-full ${CARD} p-8 md:p-10 text-center anim-pop`}>
          <h2 className="text-2xl mb-3 text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>אין מידע לחשב</h2>
          <p className="text-slate-500 mb-8">דילגת על כל השאלות. ענו על אחת לפחות כדי לראות התאמה.</p>
          <button onClick={reset} className={BTN_PRIMARY}>להתחיל מחדש</button>
        </div>
      </AppShell>
    );
  }

  const timelineParties = [...scored].sort((a, b) => a.position - b.position);

  return (
    <AppShell center={false}>
      <div className="max-w-5xl w-full mx-auto space-y-5 md:space-y-6 pb-16">

        {/* Winner Hero */}
        <div className={`${CARD} p-6 md:p-12 text-center relative overflow-hidden anim-pop`}>
          <div
            aria-hidden="true"
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[28rem] h-[28rem] rounded-full blur-[100px] pointer-events-none opacity-15"
            style={{ backgroundColor: top.hex }}
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" /> המפלגה הקרובה אליך ביותר
            </div>
            <h1
              className="text-4xl md:text-7xl mb-5 tracking-tight break-words"
              style={{ fontFamily: FONT_DISPLAY, color: top.hex }}
            >
              {top.name}
            </h1>
            <div className="inline-flex items-baseline gap-2 mb-6">
              <span className="text-5xl md:text-6xl text-slate-900 tabular-nums" style={{ fontFamily: FONT_DISPLAY }}>{top.match}%</span>
              <span className="text-slate-500 font-bold text-lg">התאמה לעמדותיך</span>
            </div>
            <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed font-medium">
              {top.description}
            </p>
          </div>
        </div>

        {/* Ranked leaderboard — בכל גודל מסך */}
        <div className={`${CARD} p-5 md:p-10 anim-enter`}>
          <h3 className="text-2xl mb-6 tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>לוח ההתאמות</h3>
          <div className="space-y-2.5 md:space-y-3">
            {scored.map((p, i) => (
              <div
                key={p.id}
                className={`flex items-center gap-3 md:gap-4 p-3 md:p-4 rounded-2xl border transition-colors ${
                  i === 0 ? 'border-slate-300 bg-white shadow-md' : 'border-slate-100 bg-slate-50/60'
                }`}
                style={i === 0 ? { boxShadow: `0 4px 20px ${p.hex}25` } : undefined}
              >
                <span className={`w-7 h-7 flex items-center justify-center rounded-lg text-sm font-extrabold flex-shrink-0 ${
                  i === 0 ? 'bg-gradient-to-br from-amber-300 to-amber-500 text-white shadow-sm' : 'bg-white border border-slate-200 text-slate-400'
                }`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className={`truncate text-[17px] md:text-base ${i === 0 ? 'font-extrabold text-slate-900' : 'font-bold text-slate-600'}`}>
                      {p.name}
                    </span>
                    <span className={`text-base md:text-sm font-extrabold tabular-nums flex-shrink-0 ${i === 0 ? 'text-slate-900' : 'text-slate-500'}`}>
                      {p.match}%
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-200/70 overflow-hidden">
                    <div
                      className="anim-bar h-full rounded-full"
                      style={{
                        width: `${p.match}%`,
                        background: `linear-gradient(to left, ${p.hex}, ${p.hex}b0)`,
                        animationDelay: `${i * 90}ms`,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ===== המפה הפוליטית — גרסת מובייל: ציר אנכי ===== */}
        <div className={`${CARD} p-5 lg:hidden anim-enter`}>
          <h3 className="text-2xl mb-1 text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>
            המפה הפוליטית
          </h3>
          <p className="text-slate-500 text-center mb-6 font-medium text-[15px]">
            מיקום המפלגות על הציר, והיכן ההתאמה שלך
          </p>

          {/* תווית גוש עליונה */}
          <div className="flex items-center justify-center gap-2 mb-3 text-sm font-extrabold text-red-600">
            <div className="w-3 h-3 rounded-full bg-red-500" /> גוש השמאל
          </div>

          <div className="relative py-2" style={{ height: `${timelineParties.length * 58}px` }}>
            {/* הציר האנכי: אדום למעלה (שמאל) → סגול → כחול למטה (ימין) */}
            <div
              className="absolute right-[18px] top-0 bottom-0 w-2.5 rounded-full"
              style={{ background: 'linear-gradient(to bottom, #ef4444, #a855f7, #3b82f6)' }}
            />

            {timelineParties.map((p, index) => {
              const isWinner = p.id === top.id;
              /* פריסה שווה במרווחים כדי שמפלגות צמודות לא ידרסו זו את זו,
                 בעוד הסדר נשמר לפי המיקום האמיתי על הציר */
              const topPct = (index / (timelineParties.length - 1)) * 100;

              return (
                <div
                  key={p.id}
                  className="absolute right-0 left-0 flex items-center gap-3"
                  style={{ top: `${topPct}%`, transform: 'translateY(-50%)' }}
                >
                  {/* נקודה על הציר */}
                  <div
                    className={`relative z-10 rounded-full border-[3px] border-white flex-shrink-0 transition-transform ${isWinner ? 'scale-125' : ''}`}
                    style={{
                      width: '22px',
                      height: '22px',
                      marginRight: '8px',
                      backgroundColor: p.hex,
                      opacity: p.match > 0 ? 1 : 0.4,
                      boxShadow: isWinner ? `0 0 0 4px ${p.hex}25, 0 2px 8px ${p.hex}60` : '0 1px 3px rgba(0,0,0,.15)',
                    }}
                  />
                  {/* שם + אחוז */}
                  <div
                    className={`flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${
                      isWinner ? 'bg-white shadow-md' : 'bg-slate-50/70 border-slate-100'
                    }`}
                    style={isWinner ? { borderColor: `${p.hex}50` } : undefined}
                  >
                    <span className={`text-[15px] truncate ${isWinner ? 'font-extrabold text-slate-900' : 'font-bold text-slate-600'}`}>
                      {p.name}
                    </span>
                    <span
                      className={`text-sm font-extrabold tabular-nums flex-shrink-0 ${isWinner ? '' : 'text-slate-500'}`}
                      style={isWinner ? { color: p.hex } : undefined}
                    >
                      {p.match}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* תווית גוש תחתונה */}
          <div className="flex items-center justify-center gap-2 mt-3 text-sm font-extrabold text-blue-600">
            <div className="w-3 h-3 rounded-full bg-blue-500" /> גוש הימין
          </div>
        </div>

        {/* ===== המפה הפוליטית — גרסת דסקטופ: ציר אופקי ===== */}
        <div className={`${CARD} p-10 pt-12 hidden lg:block overflow-hidden anim-enter`}>
          <h3 className="text-2xl mb-1 text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>המפה הפוליטית</h3>
          <p className="text-slate-500 text-center mb-2 font-medium">מיקום המפלגות על ציר שמאל–ימין, והיכן ההתאמה הגבוהה שלך</p>

          <div className="w-full relative mt-20 mb-8">
            <div className="relative w-full h-[240px] flex items-center">

              {/* הציר עצמו: שמאל פוליטי בצד שמאל פיזית, ימין בימין */}
              <div
                dir="ltr"
                className="absolute left-6 right-6 h-3 rounded-full z-10 shadow-inner"
                style={{ background: 'linear-gradient(to right, #ef4444, #a855f7, #3b82f6)' }}
              />

              {timelineParties.map((p, index) => {
                const isWinner = p.id === top.id;
                const isTopRow = index % 2 === 0;

                return (
                  <div
                    key={p.id}
                    className="absolute z-20 flex flex-col items-center"
                    style={{
                      left: `calc(1.5rem + calc(100% - 3rem) * ${p.position / 100})`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div
                      className={`rounded-full relative z-10 border-[3px] border-white transition-transform duration-500 ${isWinner ? 'scale-150 shadow-lg' : 'shadow-sm'}`}
                      style={{
                        backgroundColor: p.hex,
                        width: '22px',
                        height: '22px',
                        opacity: p.match > 0 ? 1 : 0.35,
                        boxShadow: isWinner ? `0 0 16px ${p.hex}80` : undefined,
                      }}
                    />

                    {isTopRow ? (
                      <div className="absolute bottom-full mb-3 flex flex-col items-center pointer-events-none">
                        <span className={`text-sm whitespace-nowrap mb-1 ${isWinner ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}>
                          {p.name}
                        </span>
                        <span className={`text-xs font-bold mb-4 tabular-nums ${isWinner ? 'text-slate-900' : 'text-slate-500'}`}>{p.match}%</span>
                        <div className={`w-px h-12 ${isWinner ? 'bg-slate-400' : 'bg-slate-200'}`} />
                      </div>
                    ) : (
                      <div className="absolute top-full mt-3 flex flex-col items-center pointer-events-none">
                        <div className={`w-px h-12 ${isWinner ? 'bg-slate-400' : 'bg-slate-200'}`} />
                        <span className={`text-xs font-bold mt-4 tabular-nums ${isWinner ? 'text-slate-900' : 'text-slate-500'}`}>{p.match}%</span>
                        <span className={`text-sm whitespace-nowrap mt-1 ${isWinner ? 'font-extrabold text-slate-900' : 'font-bold text-slate-700'}`}>
                          {p.name}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* מקרא: dir=ltr כדי שגוש השמאל יופיע פיזית משמאל והימין מימין, בהתאם לציר */}
          <div dir="ltr" className="flex justify-between items-center text-sm font-bold bg-slate-50 border border-slate-200 px-8 py-4 rounded-2xl">
            <div className="flex items-center gap-2 text-red-600"><div className="w-3.5 h-3.5 rounded-full bg-red-500" /> גוש השמאל</div>
            <div className="flex items-center gap-2 text-purple-600"><div className="w-3.5 h-3.5 rounded-full bg-purple-500" /> גוש המרכז</div>
            <div className="flex items-center gap-2 text-blue-600"><div className="w-3.5 h-3.5 rounded-full bg-blue-500" /> גוש הימין</div>
          </div>
        </div>

        {/* Detailed Breakdown */}
        <div className={`${CARD} p-5 md:p-10 anim-enter`}>
          <h3 className="text-2xl md:text-3xl mb-6 md:mb-8 text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>
            איפה הסכמתם עם מי?
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {QUESTIONS.map((q, i) => {
              const a = answers[i];
              const Icon = q.icon;

              if (a.choice === null) {
                return (
                  <div key={q.id} className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 opacity-50 text-slate-600">
                      <Icon className="w-5 h-5" />
                      <span className="font-bold">{q.category}</span>
                    </div>
                    <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200">דילגתם</span>
                  </div>
                );
              }

              const agree = PARTY_IDS
                .map((pid) => ({ ...PARTIES[pid], sim: similarity(a.choice, q.stances[pid]) }))
                .filter((p) => p.sim >= 0.8)
                .sort((x, y) => y.sim - x.sim);

              return (
                <div key={q.id} className="bg-white p-5 md:p-6 rounded-2xl border border-slate-200 flex flex-col shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl" style={{ backgroundColor: `${q.accent}15` }}>
                      <Icon className="w-5 h-5" style={{ color: q.accent }} />
                    </div>
                    <span className="text-lg text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>{q.category}</span>
                    {a.weight === 2 && (
                      <span className="mr-auto inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> קריטי
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 font-medium mb-5 text-[16px] md:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {q.variants[difficulty].options[a.choice]}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {agree.length > 0 ? (
                      agree.map((p) => (
                        <span
                          key={p.id}
                          className="text-sm font-bold px-3 py-1.5 rounded-lg border"
                          style={{ color: p.hex, backgroundColor: `${p.hex}0d`, borderColor: `${p.hex}35` }}
                        >
                          {p.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        אף מפלגה לא מציגה עמדה קרובה.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center items-stretch sm:items-center gap-3 pt-2">
          <button onClick={share} className={`${BTN_PRIMARY} text-lg`}>
            {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
            {copied ? 'התוצאה הועתקה!' : 'שיתוף תוצאה'}
          </button>
          <button onClick={() => { setIdx(0); setScreen('quiz'); }} className={`${BTN_SECONDARY} text-lg`}>
            <RotateCcw className="w-5 h-5" /> לערוך תשובות
          </button>
          <button onClick={reset} className={`${BTN_GHOST} justify-center`}>
            התחלה מחדש
          </button>
        </div>

      </div>
    </AppShell>
  );
}