import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  ChevronLeft, ChevronRight, RotateCcw, Vote, Shield, Scale, Coins,
  BookOpen, Users, Map, BrainCircuit, MessageCircleHeart, Heart,
  Star, Info, Check, Share2, Sparkles, Coffee, Loader2, PartyPopper, GraduationCap, Landmark, Globe,
  Download, Lightbulb, Fingerprint, Swords, UserPlus
} from 'lucide-react';

/* ==================================================================
   DESIGN SYSTEM
================================================================== */
const FONT_BODY = "'Assistant', system-ui, sans-serif";
const FONT_DISPLAY = "'Secular One', 'Assistant', sans-serif";
/* מסך הפתיחה משתמש בפונט הממשק במשקל הכבד ביותר, לא ב-Secular One.
   Secular One קיים במשקל אחד בלבד, ולכן חייבים לציין fontWeight מפורשות כאן. */
const FONT_HERO = "'Assistant', system-ui, sans-serif";
const HERO_HEAVY = { fontFamily: FONT_HERO, fontWeight: 800 };

const CARD = 'glass-card bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-indigo-200/40';
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
const BTN_PRIMARY = `btn-3d inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white
  bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-[length:200%_100%] bg-right
  hover:bg-left shadow-lg shadow-indigo-300/60 hover:shadow-indigo-400/60 ${FOCUS}`;
const BTN_SECONDARY = `btn-3d inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-700
  bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm ${FOCUS}`;
const BTN_GHOST = `inline-flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-slate-500 hover:text-slate-900 transition-colors ${FOCUS}`;

/* ------------------------------------------------------------------
   PARTIES
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
   QUESTIONS - 11 Questions total (Unified)
------------------------------------------------------------------- */
const QUESTIONS = [
  {
    id: 'judiciary', axis: 'security', category: 'מערכת המשפט', icon: Scale, accent: '#6366f1',
    variants: {
      everyday: { text: 'מי צריך להיות בעל המילה האחרונה במדינה?', options: [ 'הפוליטיקאים שבחרנו צריכים להחליט הכול. שופטים לא צריכים לעצור אותם או לפסול חוקים.', 'צריך לתקן דברים, אבל לא לתת לממשלה כוח לעשות מה שהיא רוצה בלי שום הגבלה.', 'עדיף לא לגעת. שופטים שומרים עלינו האזרחים כדי שהממשלה לא תעשה דברים על חשבוננו.', 'צריך לחזק את השופטים, ולכתוב חוקה שתגן על הזכויות הבסיסיות של כולנו מפני פוליטיקאים.' ] },
      simple: { text: 'מה צריך לעשות עם בית המשפט העליון (בג"ץ) והרפורמה המשפטית?', options: [ 'רפורמה מלאה עכשיו: הממשלה תבחר את השופטים, ותחוקק פסקת התגברות כדי שבג"ץ לא יוכל לפסול חוקים.', 'תיקונים בבג"ץ, אבל רק בהסכמה רחבה. בלי לתת לממשלה כוח בלתי מוגבל למנות שופטים בעצמה.', 'לשמור על המצב הקיים: בג"ץ שומר עלינו מהפוליטיקאים. לא לגעת בוועדה לבחירת שופטים.', 'לחזק את בג"ץ ולחוקק חוקה: סמכות מפורשת לפסול חוקים שפוגעים בזכויות אדם בסיסיות.' ] },
      advanced: { text: 'מהי עמדתך ביחס למבנה המשטרי, הרפורמה המשפטית ומעמד הרשות השופטת?', options: [ 'העברת מרכז הכובד לרשות המבצעת: פסקת התגברות ברוב של 61, ביטול עילת הסבירות ושינוי הרכב הוועדה לבחירת שופטים.', 'רפורמה אבולוציונית: ריכוך עילת הסבירות וחוק היועמ"שים, תוך שמירה על זכות הוטו ההדדית בוועדה לבחירת שופטים.', 'הקפאת המצב הקיים: דחיית שינויים בחוקי היסוד והגנה על עצמאות הרשות השופטת כבלם האפקטיבי היחיד.', 'כינון חוקה: עיגון חוק יסוד החקיקה, ביצור מגילת זכויות האדם (כולל חוק יסוד השוויון) ושריון מעמד בג"ץ.' ] },
    },
    stances: { likud: 0, farRight: 0, shas: 0.2, utj: 0.2, bYachad: 1, kacholLavan: 1.3, yashar: 1.6, yisraelBeiteinu: 2, raam: 2.4, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'security', axis: 'security', category: 'הסכסוך והשטחים', icon: Shield, accent: '#ef4444',
    variants: {
      everyday: { text: 'מה עושים עם האזורים שבהם גרים פלסטינים ביו"ש?', options: [ 'צריך להפוך את השטחים האלה לשלנו רשמית, ולבנות שם עוד הרבה יישובים שלנו.', 'להשאיר את המצב כמו שהוא עכשיו. הצבא שומר עלינו, ולא צריך לתת להם מדינה.', 'לעשות גבול ברור, אבל לשמור אצלנו את גושי היישובים הגדולים שלנו בטוח.', 'צריך לעשות שלום, גם אם זה אומר שנצטרך לפנות מתנחלים ולתת להם להקים מדינה משלהם.' ] },
      simple: { text: 'מה הפתרון המעשי למצב ביהודה ושומרון (הגדה המערבית)?', options: [ 'לספח את יהודה ושומרון (או את שטחי C), לפרק את הרשות הפלסטינית ולהרחיב משמעותית את ההתנחלויות.', 'ניהול הסכסוך: לשמר את המצב הקיים. צה"ל פועל בכל מקום, שומרים על ההתנחלויות, בלי סיפוח ובלי מדינה פלסטינית.', 'היפרדות: לקבוע גבולות, לספח רק את גושי ההתנחלויות, ולהשאיר לפלסטינים אוטונומיה (לא מדינה).', 'הסכם שלום ושתי מדינות: לפנות התנחלויות מבודדות ולהקים מדינה פלסטינית מפורזת כחלק מהסדר אזורי.' ] },
      advanced: { text: 'איזו אסטרטגיה מדינית-ביטחונית יש ליישם בזירה הפלסטינית (איו"ש)?', options: [ 'החלת ריבונות דה-יורה על שטחי C, מניעת ישות מדינית פלסטינית בכל תרחיש, ופירוק מוסדות הרשות.', 'שמירה על הסטטוס קוו: אוטונומיה אזרחית מוגבלת, חופש פעולה מבצעי מלא לצה"ל, והימנעות מנסיגות.', 'צמצום הסכסוך: היפרדות אזרחית תוך סיפוח הגושים, חיזוק כלכלי של הרשות ושליטה ביטחונית ישראלית עליונה.', 'פתרון שתי מדינות: נסיגה לקווי 67׳ עם חילופי שטחים, מדינה פלסטינית ריבונית ופינוי עומק ההתיישבות.' ] },
    },
    stances: { farRight: 0, likud: 0.9, yisraelBeiteinu: 1, shas: 1.2, utj: 1.2, kacholLavan: 2, yashar: 2, bYachad: 2, democrats: 3, hadashTaal: 3, raam: 3 },
  },
  {
    id: 'gaza', axis: 'security', category: 'עזה והיום שאחרי', icon: Map, accent: '#ea580c',
    variants: {
      everyday: { text: 'מי צריך לנהל את עזה כדי שיהיה לנו שקט?', options: [ 'אנחנו צריכים להישאר שם, לשלוט בעצמנו, ואפילו להקים מחדש יישובים ישראלים בתוך עזה.', 'הצבא שלנו ישמור, וניתן למקומיים בעזה שאין להם קשר לטרור לנהל לעצמם את החיים.', 'הצבא שלנו ישמור מבחוץ, ונביא מדינות ערביות נורמליות שינהלו וישקמו את עזה.', 'ניתן למנהיגים הפלסטינים שנמצאים ביהודה ושומרון לקחת אחריות ולנהל את עזה יחד עם העולם.' ] },
      simple: { text: 'מה צריך לעשות ברצועת עזה כדי להבטיח ביטחון לטווח ארוך?', options: [ 'לכבוש את הרצועה, להקים ממשל צבאי קבוע, לעודד הגירה מרצון ולהקים מחדש את יישובי גוש קטיף.', 'צה"ל ישלוט ביטחונית לאורך זמן, והניהול האזרחי יימסר למקומיים שאינם קשורים לחמאס או לרשות.', 'צה"ל יאבטח מבחוץ, וקואליציה של מדינות ערב מתונות תנהל ותשקם את עזה מבפנים.', 'להעביר שליטה מלאה לרשות פלסטינית מחוזקת, בסיוע בינלאומי, כחלק מפתרון מדיני רחב.' ] },
      advanced: { text: 'מהו המתווה האסטרטגי המועדף לעיצוב המציאות ברצועת עזה?', options: [ 'שליטה צבאית דה-פקטו וממשל צבאי גלוי, לצד חידוש ההתיישבות היהודית בצפון ובמרכז הרצועה.', 'שליטה ביטחונית רציפה בפרוזדורים, דחיקת חמאס והעברת הניהול האזרחי לטכנוקרטים או ראשי חמולות נטולי זיקה לרש"פ.', 'ברית אזורית בחסות אמריקאית: כוח ערבי-סוני רב-לאומי לניהול השיקום, מול מעטפת ביטחונית ישראלית.', 'אינטגרציה של מנגנוני הרשות הפלסטינית "המחודשת" כגורם הריבוני ברצועה, כצעד מקדים להסדר קבע.' ] },
    },
    stances: { farRight: 0, likud: 1, yisraelBeiteinu: 1.2, shas: 1.2, utj: 1.2, kacholLavan: 2, yashar: 2, bYachad: 2, raam: 2.5, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'economy', axis: 'economy', category: 'כלכלה ויוקר המחיה', icon: Coins, accent: '#16a34a',
    variants: {
      everyday: { text: 'איך דואגים שיהיה לנו יותר כסף בסוף החודש?', options: [ 'המדינה צריכה לקחת מאיתנו פחות מיסים, ולתת לעסקים להתחרות אחד בשני בחופשיות.', 'לעזור לאנשים לצאת לעבוד, ולהפסיק לחלק מיליארדים מהמיסים שלנו לכל מיני מגזרים.', 'הממשלה צריכה לפקח חזק על המחירים בסופרמרקט ולחלק קצבאות למשפחות שקשה להן.', 'המדינה צריכה לתת הכול בחינם: חינוך, בריאות, ולממן את זה ממיסים כבדים על העשירים.' ] },
      simple: { text: 'איך הממשלה צריכה להוריד את יוקר המחיה?', options: [ 'שוק חופשי: לפרק מונופולים ואת ההסתדרות, להפריט, לפתוח לייבוא ולחתוך מיסים.', 'שוק חופשי אחראי: לעודד תעסוקה ולשחרר רגולציה, בלי לחלק מיליארדים לפרויקטים סקטוריאליים.', 'רווחה מסורתית: פיקוח על מחירי המזון, סיוע לעניים והגדלה משמעותית של קצבאות.', 'סוציאל-דמוקרטיה: להעלות מיסים על ההון, חינוך חינם מגיל אפס, רפואה ציבורית ופיקוח על שכר הדירה.' ] },
      advanced: { text: 'איזו אסכולה מקרו-כלכלית על ישראל לאמץ מול הגירעון, האינפלציה והריכוזיות?', options: [ 'נאו-ליברליזם: דה-רגולציה עמוקה, החלשת העבודה המאורגנת, ביטול מכסים, צמצום המגזר הציבורי והורדת מס חברות.', 'כלכלת שוק עם משמעת פיסקלית: הסרת חסמי יבוא, בלימת תקציבים לא-יצרניים וקיצוץ בכספים קואליציוניים.', 'רשת ביטחון והרחבת סובסידיות: פיקוח מחירים, קצבאות עמוקות למשפחות ברוכות ילדים והגנה על תוצרת מקומית.', 'מודל סוציאל-דמוקרטי: מס עושר, מיסוי רווחי יתר של הבנקים ומימון שירותים ציבוריים אוניברסליים על חשבון ההון.' ] },
    },
    stances: { yisraelBeiteinu: 0, bYachad: 0.6, kacholLavan: 1, yashar: 1, likud: 1.6, shas: 2, utj: 2, raam: 2.2, farRight: 2, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'religion', axis: 'civil', category: 'דת ומדינה', icon: BookOpen, accent: '#ca8a04',
    variants: {
      everyday: { text: 'מה לגבי אוטובוסים בשבת וחתונות?', options: [ 'אנחנו מדינה יהודית: אסור לפתוח עסקים או תחבורה ציבורית בשבת, ומתחתנים רק דרך הרבנות.', 'להשאיר את המצב כמו עכשיו. לא צריך לשנות חוקים או לפתוח מלחמות דת מיותרות.', 'שכל עיר תחליט לעצמה אם לפתוח אוטובוסים בשבת. ומי שלא יכול להתחתן ברבנות - שיתחתן בעירייה.', 'חופש מלא: אוטובוסים בשבת בכל הארץ, ואפשרות להתחתן בעירייה (ללא רבנות) למי שרק רוצה.' ] },
      simple: { text: 'איך צריכים להיראות החיים הציבוריים מבחינת דת (שבת, נישואים)?', options: [ 'ישראל היא קודם כל מדינה יהודית: לאסור מרכולים בשבת, לאסור חמץ בבתי חולים, ונישואים רק דרך הרבנות.', 'לשמור על הסטטוס קוו: בלי פשרות דתיות אבל גם בלי לחוקק עכשיו תחבורה ציבורית בשבת, כדי למנוע קרע.', 'פתרון מקומי: ראשי ערים יחליטו על תחבורה ומסחר בשבת בעירם, ומסלול נישואים אזרחי למנועי חיתון.', 'הפרדה מוחלטת: תחבורה ציבורית בשבת בכל הארץ, נישואים אזרחיים לכולם וביטול תקציבים למוסדות ללא ליבה.' ] },
      advanced: { text: 'כיצד יש להכריע במאבק על עיצוב המרחב הציבורי ביחסי דת ומדינה?', options: [ 'הגברת הכפיפות להלכה במרחב הציבורי: שימור מונופול הרבנות בדיני אישות ואכיפת חוקי המרכולים ואיסור חמץ.', 'דבקות בסטטוס קוו ההיסטורי: הימנעות משינויים משפטיים רדיקליים או חקיקה חילונית, מתוך תפיסת ממלכתיות.', 'ביזור סמכויות: העברת סמכויות תחבורה ומסחר בשבת לשלטון המקומי, וממסד אזרחי חלופי לנישואין למנועי חיתון.', 'הפרדת דת ומדינה: נישואין וגירושין אזרחיים מלאים, שלילת סמכויות בתי הדין הרבניים ותחבורה ציבורית ארצית בשבת.' ] },
    },
    stances: { shas: 0, utj: 0, farRight: 0, raam: 0.3, likud: 1, kacholLavan: 1.6, yashar: 2, bYachad: 2, yisraelBeiteinu: 3, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'draft', axis: 'civil', category: 'גיוס ושוויון בנטל', icon: Users, accent: '#0891b2',
    variants: {
      everyday: { text: 'מי צריך להתגייס לצבא?', options: [ 'מי שלומד תורה לא מתגייס. צבא זה לא להם, וצריך לאפשר להם לצאת לעבוד כדי שלא יחיו בעוני.', 'אי אפשר לגייס חרדים בכוח. אבל מי שלא הולך לצבא - שהישיבה שלו תקבל קצת פחות כסף.', 'כולם חייבים לתרום למדינה. אם לא צבא, אז לעשות שירות בבית חולים. מי שיסרב, לא יקבל כסף מהמדינה.', 'חוק אחד לכולם - מתגייסים. חרדי שמשתמט ישלם קנסות אישיים ולא יקבל שום הנחות מאיתנו.' ] },
      simple: { text: 'מה הדרך הנכונה לפתור את סוגיית גיוס החרדים?', options: [ 'פטור חוקי מלא מגיל מוקדם. לימוד התורה חשוב למדינה, ומי שפטור יוכל לצאת לעבוד בלי כפייה.', 'גיוס בהסכמה עם תמריצים: יעדי גיוס לישיבות וקיצוץ תקציבי אם לא יעמדו בהם, בלי לגייס בכוח.', 'חובה אזרחית לכולם: מי שלא מתגייס לצה"ל יחויב בשירות לאומי-אזרחי מלא. מי שיסרב, מוסדותיו לא יתוקצבו.', 'גיוס שווה כולל סנקציות: חוק גיוס אחד, וסנקציות אישיות על משתמטים (שלילת הנחות ורישיונות).' ] },
      advanced: { text: 'מהו המתווה האידיאלי לחוק הגיוס והסדרת פטור "תורתו אומנותו"?', options: [ 'עיגון לימוד התורה כערך עליון, הורדת גיל הפטור ל-21 לשילוב בתעסוקה, והתנגדות לכל סנקציה.', 'מתווה יעדים מתון והדרגתי: סנקציות כלכליות על תקציב הישיבות בלבד (לא על התלמיד), ללא הליכים פליליים.', 'שירות חובה אוניברסלי (צבאי או אזרחי): שלילת תמיכות ממוסדות מעודדי השתמטות ותגמול דיפרנציאלי למשרתים.', 'ביטול דחיית השירות: החלת חוק שירות ביטחון על כל האזרחים, כולל הליכים פליליים ושלילת הטבות ממשתמטים.' ] },
    },
    stances: { shas: 0, utj: 0, hadashTaal: 0.3, raam: 0.3, likud: 1, farRight: 1.4, kacholLavan: 2, yashar: 2, bYachad: 2.3, democrats: 2.7, yisraelBeiteinu: 3 },
  },
  {
    id: 'lgbtq', axis: 'civil', category: 'זכויות פרט וקהילת הלהט"ב', icon: Heart, accent: '#a855f7',
    variants: {
      everyday: { text: 'מה היחס הנכון לקהילת הלהט"ב (גייז, לסביות)?', options: [ 'משפחה זה רק אבא ואמא. אני נגד מצעדי גאווה ונגד לתת להם לאמץ ילדים.', 'שיעשו מה שהם רוצים בחיים שלהם הפרטיים, אבל שלא יבקשו מאיתנו לשנות את החוקים במדינה.', 'אנחנו חייבים להגן עליהם מאפליה. לעשות חוקים שישמרו עליהם בעבודה ובחברה.', 'שוויון רשמי ומוחלט: נישואים במשרד הפנים, פונדקאות, ואימוץ שוויוני בדיוק כמו כל זוג אחר.' ] },
      simple: { text: 'מה צריכה להיות מדיניות המדינה כלפי הקהילה הגאה?', options: [ 'המדינה תכיר רק במשפחה של אבא ואמא. נגד תקצוב מצעדי גאווה ונגד אימוץ על ידי זוגות חד-מיניים.', 'לחיות ולתת לחיות, בלי שינוי חוקים: אין בעיה במישור הפרטי, אבל לא להפוך את זה למאבק חקיקה.', 'חינוך לסובלנות וחוקים נגד אפליה: איסור אפליה בתעסוקה והשוואת זכויות במסגרת פשרות אזרחיות.', 'שוויון מלא בחוק: נישואים גאים, פונדקאות לזוגות גברים ואימוץ שוויוני ללא הבדל נטייה.' ] },
      advanced: { text: 'מה עמדתך ביחס לחקיקה פרואקטיבית בנושאי קהילת הלהט"ב וזכויות פרט?', options: [ 'שמרנות אקטיבית: התנגדות להכרה במודלים אלטרנטיביים למשפחה ההטרונורמטיבית ומניעת מימון ציבורי לארגוני גאווה.', 'היצמדות לסטטוס קוו: הימנעות משינוי חוקי הפונדקאות והאימוץ, לצד חופש פרט מלא במישור האישי.', 'חקיקה מגינה: איסור אפליה בתעסוקה ובשירותים, השוואת תנאים בביטוח הלאומי וקידום סובלנות בחינוך הממלכתי.', 'רפורמה אזרחית: פונדקאות לזוגות חד-מיניים, הכרה סטטוטורית בנישואין גאים וחוק עבירות שנאה מחמיר.' ] },
    },
    stances: { farRight: 0, shas: 0, utj: 0, raam: 0.2, likud: 1, kacholLavan: 2, yashar: 2, bYachad: 2.2, hadashTaal: 2.8, democrats: 3, yisraelBeiteinu: 3 },
  },
  {
    id: 'governance', axis: 'security', category: 'משילות ושומרי סף', icon: BrainCircuit, accent: '#0d9488',
    variants: {
      everyday: { text: 'האם עורכי הדין של המדינה והיועצת המשפטית יכולים לעצור את הממשלה?', options: [ 'השרים נבחרו על ידינו. פקידים ויועצים משפטיים צריכים רק לייעץ, ואם הם מפריעים צריך לפטר אותם.', 'השרים מחליטים, אבל כדאי להקשיב לעורכי הדין. במקרה של ריב, השר יכול לקחת עורך דין פרטי שיגן עליו.', 'היועצים הם אלה ששומרים עלינו שלא תהיה שחיתות. מה שהיועצת מחליטה זה מחייב, והשרים צריכים להקשיב.', 'אסור שפוליטיקאים יתערבו בכלל במינויים של יועצים משפטיים ומשטרה, כי הם חומת המגן שלנו.' ] },
      simple: { text: 'מה צריך להיות תפקידה של היועצת המשפטית לממשלה?', options: [ 'השרים נבחרו על ידי העם והיא רק "יועצת". שר שהיא תוקעת לו את המדיניות צריך לוכל לפטר אותה.', 'הממשלה צריכה למשול, אבל להקשיב ליועצים. במחלוקת קשה, השר רשאי להביא עורך דין פרטי שייצג אותו.', 'היא שומרת סף נגד שחיתות. חוות דעתה מחייבת את השר, ואסור לשרים להתעלם מהנחיותיה.', 'שומרי הסף הם חומת המגן של הדמוקרטיה. יש לאסור על פוליטיקאים להתערב במינויים שלהם.' ] },
      advanced: { text: 'כיצד יש להגדיר את יחסי הכוחות בין הדרג הנבחר לייעוץ המשפטי הממשלתי?', options: [ 'חוות הדעת היא עצה בלבד. חוק שיאפשר לשרים למנות יועמ"שים במשרות אמון ולפטרם על בסיס חוסר התאמה למדיניות.', 'משקל רב לייעוץ המשפטי, אך ללא זכות וטו: במחלוקת קשה תתאפשר לממשלה הסתייעות בייצוג משפטי פרטי.', 'חוות הדעת מחייבת את הרשות המבצעת כדי להבטיח מנהל תקין, אלא אם פסק בית המשפט אחרת.', 'הגנה חוקתית על עצמאות שומרי הסף: עיגון סמכותם בחוק יסוד וניתוק מינוים והדחתם מהדרג הפוליטי.' ] },
    },
    stances: { farRight: 0, likud: 0, shas: 0.4, utj: 0.4, bYachad: 1, kacholLavan: 1.5, yashar: 2, yisraelBeiteinu: 2, raam: 2.6, democrats: 3, hadashTaal: 3 },
  },
  {
    id: 'education', axis: 'civil', category: 'חינוך ולימודי ליבה', icon: GraduationCap, accent: '#f59e0b',
    variants: {
      everyday: { text: 'האם להכריח בתי ספר חרדיים ללמד מתמטיקה ואנגלית?', options: [ 'לא. לכל אחד מותר ללמוד מה שבא לו, והמדינה צריכה להמשיך לשלם להם כסף כרגיל.', 'לא להכריח, אבל מי שיחליט כן ללמד אנגלית - המדינה תיתן לו קצת אקסטרה כסף.', 'לחתוך בתקציב: בית ספר שלא מלמד את כל החומר, יקבל מהמדינה רק חלק קטן מהכסף.', 'חובה לכולם. מי שלא מלמד מתמטיקה ואנגלית בצורה מלאה, לא יקבל שקל מהמיסים שלנו.' ] },
      simple: { text: 'האם לחייב את כל בתי הספר ללמד לימודי ליבה (מתמטיקה ואנגלית)?', options: [ 'לא לכפות. לכל קהילה זכות לחנך את ילדיה על פי דרכה, והמדינה תמשיך לתקצב גם מוסדות שלא מלמדים ליבה.', 'לעודד בלי לכפות: תמריצים ותוכניות רשות למוסדות שיוסיפו ליבה, בלי לפגוע בתקציב של מי שלא.', 'תקצוב מלא רק למי שמלמד ליבה: מוסד בלי מתמטיקה ואנגלית יקבל מימון חלקי בלבד, בתהליך הדרגתי.', 'חובה על כולם: אין תעודה ואין שקל ציבורי בלי ליבה מלאה, בפיקוח צמוד של משרד החינוך.' ] },
      advanced: { text: 'כיצד יש להסדיר את לימודי הליבה בחינוך המוכר שאינו רשמי ובמוסדות הפטור?', options: [ 'עיגון האוטונומיה החינוכית בחקיקה: תקצוב שוויוני לכל הזרמים ללא התניה קוריקולרית, מתוך כיבוד חופש הדת.', 'מדיניות תמרוץ וולונטרית: תוספות תקציב למוסדות שיאמצו ליבה, ללא סנקציות על הנמנעים וללא שינוי הסטטוס קוו.', 'התניה תקציבית הדרגתית: הצמדת שיעור התקצוב להיקף הוראת הליבה, תחת פיקוח פדגוגי של משרד החינוך.', 'החלה אוניברסלית של תוכנית הליבה כתנאי סף לרישוי ולתקצוב, לרבות מוסדות הפטור, באכיפה מלאה.' ] },
    },
    stances: { utj: 0, shas: 0.2, farRight: 1, likud: 1, raam: 1.5, kacholLavan: 2, yashar: 2.2, bYachad: 2.2, hadashTaal: 2.4, democrats: 2.6, yisraelBeiteinu: 3 },
  },
  {
    id: 'termLimits', axis: 'security', category: 'שיטת הממשל', icon: Landmark, accent: '#3b82f6',
    variants: {
      everyday: { text: 'האם לעשות חוק שמגביל מראש כמה שנים מותר להיות ראש ממשלה?', options: [ 'לא. אם העם בוחר שוב ושוב באותו אדם, מותר לו להמשיך. לא עושים חוקים נגד אנשים ספציפיים.', 'אולי רק לעתיד, ורק אם מסכימים על זה. בטוח לא למי שנמצא היום.', 'כן! בן אדם לא צריך להיות בשלטון יותר מ-8 שנים. יותר מדי זמן על הכיסא זה מסוכן למדינה.', 'חייבים לשנות הכל מן היסוד. לא רק להגביל זמן, אלא גם לשנות את כל איך שאנחנו מצביעים פה בבחירות.' ] },
      simple: { text: 'האם להגביל בחוק את מספר שנות הכהונה של ראש הממשלה?', options: [ 'לא. בדמוקרטיה העם מחליט בקלפי מי ימשיך לכהן, ואסור לחוקק חוקים שמכוונים נגד אדם מסוים.', 'אפשר לשקול, אבל רק בהסכמה רחבה ורק אם החוק יחול על ראשי ממשלה עתידיים בלבד.', 'כן: חוק יסוד שמגביל כהונה לשמונה שנים, כמו בארה"ב. ריכוז כוח ממושך מסוכן לדמוקרטיה.', 'הגבלת כהונה היא רק ההתחלה: צריך רפורמה מלאה — חוקה, שינוי שיטת הבחירות וחיזוק הכנסת מול הממשלה.' ] },
      advanced: { text: 'מהי עמדתך ביחס להגבלת כהונות ראש הממשלה ותיקון שיטת הממשל?', options: [ 'התנגדות עקרונית: הגבלת כהונה פוגעת בריבונות הבוחר, וחקיקה פרסונלית מערערת את יציבות המשטר.', 'פתיחות מותנית: תחולה פרוספקטיבית בלבד, ברוב מיוחס, ובמסגרת עסקה חוקתית רחבה ומאוזנת.', 'עיגון בחוק יסוד של מגבלת שמונה שנים או שתי קדנציות, כבלם מבני מפני ריכוז כוח שלטוני.', 'רפורמה משטרית כוללת: חוקה נוקשה, מרכיב אזורי בשיטת הבחירות, הגבלת כהונות וחיזוק הפיקוח הפרלמנטרי.' ] },
    },
    stances: { likud: 0, shas: 0.3, utj: 0.3, farRight: 0.4, raam: 1.6, bYachad: 2, kacholLavan: 2, yashar: 2, yisraelBeiteinu: 2, hadashTaal: 2.6, democrats: 3 },
  },
  {
    id: 'conversion', axis: 'civil', category: 'גיור וחוק השבות', icon: Globe, accent: '#0ea5e9',
    variants: {
      everyday: { text: 'מי יכול להיחשב יהודי בישראל כדי לעלות לארץ?', options: [ 'רק מי שמתגייר רגיל אצל הרבנות הראשית. וצריך לבטל את החוק שמרשה לאנשים שהם רק נכדים ליהודים לעלות.', 'נשאיר כמו עכשיו. הרבנות היא זו שמגיירת, אבל נמשיך לתת למי שסבא שלו יהודי לבוא לכאן.', 'צריך לתת ליותר רבני ערים לגייר אנשים בקלות כדי שלא ירגישו סוג ב\'. והנכדים ימשיכו לעלות לארץ.', 'המדינה צריכה להכיר בכולם - גם מי שהתגייר רפורמי מחוץ לרבנות בכלל ייחשב פה ליהודי רגיל.' ] },
      simple: { text: 'מי צריך לקבוע מיהו יהודי — בגיור ובחוק השבות?', options: [ 'רק גיור אורתודוקסי דרך הרבנות הראשית, ולתקן את חוק השבות: לבטל את "סעיף הנכד" שמעלה לא-יהודים.', 'להשאיר את המצב הקיים: הרבנות ממשיכה להיות הגורם המוסמך, וחוק השבות נשאר כמו שהוא.', 'גיור ממלכתי נגיש ומקל: להסמיך רבני ערים לגייר ולפתוח את הדלת למאות אלפי עולים. חוק השבות לא ייפגע.', 'המדינה תכיר בכל גיור — אורתודוקסי, רפורמי וקונסרבטיבי — ויונהג רישום אזרחי שאינו תלוי ברבנות.' ] },
      advanced: { text: 'כיצד יש להסדיר את סמכויות הגיור ואת היקפו של חוק השבות?', options: [ 'ריכוז הגיור במערך הממלכתי-אורתודוקסי בלבד, וצמצום חוק השבות באמצעות ביטול סעיף הנכד.', 'שימור הסטטוס קוו: מונופול הרבנות הראשית על הגיור לצד הותרת חוק השבות על כנו, ללא חקיקה חדשה.', 'רפורמת הגיור הממלכתי: ביזור הסמכות לרבני ערים ומסלולים מקילים, תוך הגנה על סעיף הנכד בחוק השבות.', 'פלורליזם מלא: הכרה סטטוטורית בגיור רפורמי וקונסרבטיבי לעניין השבות והמרשם, וניתוק המרשם מהממסד הרבני.' ] },
    },
    stances: { shas: 0, utj: 0, farRight: 0.2, raam: 0.8, likud: 1, kacholLavan: 1.8, yashar: 2, bYachad: 2, yisraelBeiteinu: 2.4, hadashTaal: 2.8, democrats: 3 },
  },
];

const MAX_IDX = 3;

/* ------------------------------------------------------------------
   SCORING LOGIC - מתוקן לחישוב ריבועי חד יותר כמו בהצעה של קלוד
------------------------------------------------------------------- */
const SHARPNESS = 2; // החישוב הריבועי שמבטיח שאחוזי ההתאמה יהיו יותר מדויקים ופחות "נדיבים" על פשרות קטנות

const similarity = (choice, stance) =>
  Math.pow(Math.max(0, 1 - Math.abs(choice - stance) / MAX_IDX), SHARPNESS);

const AGREE_THRESHOLD = Math.pow(1 - 0.6 / MAX_IDX, SHARPNESS);

/* משקלי שאלות מ-0.5 עד 2 */
const WEIGHT_STEPS = [0.5, 1, 2];

const encodeAnswers = (answers, difficulty) =>
  '2' + (difficulty === 'advanced' ? 'a' : (difficulty === 'simple' ? 's' : 'e')) +
  answers.map((a) => `${a.choice === null ? 'x' : a.choice}${WEIGHT_STEPS.indexOf(a.weight)}`).join('');

const decodeAnswers = (str) => {
  if (!str || str[0] !== '2' || !'sae'.includes(str[1])) return null;
  const body = str.slice(2);
  if (body.length !== QUESTIONS.length * 2) return null;
  const answers = [];
  for (let i = 0; i < QUESTIONS.length; i++) {
    const c = body[2 * i];
    const w = WEIGHT_STEPS[parseInt(body[2 * i + 1], 10)];
    const choice = c === 'x' ? null : parseInt(c, 10);
    if (w === undefined || (choice !== null && !(choice >= 0 && choice <= 3))) return null;
    answers.push({ choice, weight: w });
  }
  if (answers.every((a) => a.choice === null)) return null;
  let d = 'everyday';
  if (str[1] === 'a') d = 'advanced';
  else if (str[1] === 's') d = 'simple';
  return { answers, difficulty: d };
};

/* ------------------------------------------------------------------
   STORAGE — עטיפה בטוחה. localStorage יכול לזרוק שגיאה
   (מצב פרטי ב-iOS, סביבות sandbox) ואסור שזה יפיל את האפליקציה.
------------------------------------------------------------------- */
/* ------------------------------------------------------------------
   HAPTICS — משוב מישושי עדין ונעים למובייל.
   פעימות קצרות ורכות במקום זמזום גס. עטוף כולו ב-try כי לא כל דפדפן
   תומך (iOS Safari לא תומך ב-navigator.vibrate — שם פשוט לא ירגישו כלום,
   בלי שגיאות). כל אינטראקציה מקבלת "חתימה" משלה כדי שהמשוב ירגיש מכוון.
------------------------------------------------------------------- */
const haptic = (() => {
  const can = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  const fire = (pattern) => { if (!can) return; try { navigator.vibrate(pattern); } catch { /* noop */ } };
  return {
    light:   () => fire(6),                    // ניווט, צ'יפים, החלפת משקל — נגיעה בלבד
    select:  () => fire([9, 28, 12]),          // בחירת תשובה — פעימה כפולה רכה, מרגיש כמו "ננעל"
    warning: () => fire([22, 45, 22]),         // טוסט אזהרה — שתי פעימות כבדות יותר
    success: () => fire([10, 35, 10, 35, 24]), // הגעה לתוצאות / העתקה — "תרועה" קטנה ועולה
  };
})();

const STORAGE_KEY = 'electionsCompassData_v8';

const safeStorage = {
  get(key) {
    try { return window.localStorage.getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window.localStorage.setItem(key, value); } catch { /* אין אחסון — ממשיכים בזיכרון בלבד */ }
  },
  remove(key) {
    try { window.localStorage.removeItem(key); } catch { /* noop */ }
  },
};

const makeShuffledOrders = () =>
  QUESTIONS.map(() => {
    const o = [0, 1, 2, 3];
    for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
    return o;
  });

const freshState = () => ({
  screen: 'welcome',
  difficulty: 'everyday',
  idx: 0,
  review: false,
  answers: QUESTIONS.map(() => ({ choice: null, weight: 1 })),
  order: makeShuffledOrders(),
});

/* טעינת מצב שמור עם ולידציה מלאה — נתונים ישנים/פגומים לא מפילים את האפליקציה */
const loadInitialState = () => {
  try {
    const saved = safeStorage.get(STORAGE_KEY);
    if (!saved) return freshState();
    const p = JSON.parse(saved);

    const validAnswers =
      Array.isArray(p.answers) &&
      p.answers.length === QUESTIONS.length &&
      p.answers.every((a) =>
        a && (a.choice === null || (Number.isInteger(a.choice) && a.choice >= 0 && a.choice <= 3)) &&
        WEIGHT_STEPS.includes(a.weight)
      );
    if (!validAnswers) return freshState();

    const validOrder =
      Array.isArray(p.order) &&
      p.order.length === QUESTIONS.length &&
      p.order.every((o) => Array.isArray(o) && o.length === 4 && [0, 1, 2, 3].every((n) => o.includes(n)));

    return {
      screen: ['welcome', 'difficulty', 'quiz', 'results'].includes(p.screen)
        ? p.screen
        : (p.screen === 'loading' ? 'quiz' : 'welcome'), // ריענון באמצע מסך הטעינה לא יתקע ספינר לנצח
      difficulty: ['everyday', 'simple', 'advanced'].includes(p.difficulty) ? p.difficulty : 'everyday',
      idx: Number.isInteger(p.idx) && p.idx >= 0 && p.idx < QUESTIONS.length ? p.idx : 0,
      review: false,
      answers: p.answers,
      order: validOrder ? p.order : makeShuffledOrders(),
    };
  } catch {
    return freshState();
  }
};

const BLOCS = [
  { id: 'left',   label: 'גוש השמאל', color: '#ef4444', parties: ['hadashTaal', 'raam', 'democrats'] },
  { id: 'center', label: 'גוש המרכז', color: '#a855f7', parties: ['yashar', 'kacholLavan', 'bYachad'] },
  { id: 'right',  label: 'גוש הימין', color: '#3b82f6', parties: ['yisraelBeiteinu', 'likud', 'shas', 'utj', 'farRight'] },
];

function computeResults(answers) {
  const answered = QUESTIONS.map((q, i) => ({ q, a: answers[i] })).filter(({ a }) => a && a.choice !== null);
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
  
  // Safe calculation for DNA axes
  const calcAxisScore = (axis, getValFn) => {
    const axisQuestions = answered.filter(({ q }) => q.axis === axis);
    if (axisQuestions.length === 0) return null;
    let sum = 0, weightSum = 0;
    axisQuestions.forEach(({ q, a }) => {
      const val = getValFn(q);
      if (val !== undefined && val !== null) {
        sum += (val / MAX_IDX) * a.weight;
        weightSum += a.weight;
      }
    });
    return weightSum > 0 ? (sum / weightSum) * 100 : null;
  };

  const topParty = scored[0];
  const dna = {
    security: { 
      user: calcAxisScore('security', (q) => answers[QUESTIONS.findIndex(x=>x.id === q.id)]?.choice), 
      party: calcAxisScore('security', (q) => q.stances[topParty.id]) 
    },
    economy:  { 
      user: calcAxisScore('economy', (q) => answers[QUESTIONS.findIndex(x=>x.id === q.id)]?.choice), 
      party: calcAxisScore('economy', (q) => q.stances[topParty.id]) 
    },
    civil:    { 
      user: calcAxisScore('civil', (q) => answers[QUESTIONS.findIndex(x=>x.id === q.id)]?.choice), 
      party: calcAxisScore('civil', (q) => q.stances[topParty.id]) 
    }
  };

  return { scored, answeredCount: answered.length, totalWeight, dna };
}

// Jokes for the loading screen (Easter egg)
const LOADING_JOKES = [
  "מנסים להרכיב קואליציה...",
  "מוודאים שאף אחד לא מקליט את השיחה...",
  "סופרים קולות במעטפות כפולות...",
  "מחלקים תיקים דמיוניים לשרים...",
  "בודקים מי עבר את אחוז החסימה...",
  "מכינים את מסך הפיצולים והפלגים...",
];

/* ------------------------------------------------------------------
   GLOBAL STYLES — אנימציות
------------------------------------------------------------------- */
const GLOBAL_CSS = `
  @keyframes auroraFloat {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33%      { transform: translate(4vw, -3vh) scale(1.12); }
    66%      { transform: translate(-3vw, 4vh) scale(0.93); }
  }
  /* חשוב: הכניסות חייבות להסתיים ב-transform: none ולא ב-rotateX(0).
     עם fill-mode: both הטרנספורם האחרון נשאר דבוק לאלמנט לנצח, הדפדפן
     משאיר אותו בשכבת 3D מרוסטרת — והטקסט (במיוחד SVG) נשאר מטושטש. */
  @keyframes fadeSlideIn {
    from { opacity: 0; transform: perspective(900px) rotateX(7deg) translateY(20px); }
    99%  { opacity: 1; transform: perspective(900px) rotateX(0deg) translateY(0); }
    to   { opacity: 1; transform: none; }
  }
  @keyframes popIn {
    0%   { opacity: 0; transform: perspective(700px) scale(0.88) rotateX(8deg); }
    70%  { transform: perspective(700px) scale(1.03) rotateX(-2deg); }
    99%  { opacity: 1; transform: perspective(700px) scale(1) rotateX(0deg); }
    100% { opacity: 1; transform: none; }
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0) rotateZ(0deg); }
    50%      { transform: translateY(-7px) rotateZ(-2deg); }
  }
  .anim-float { animation: floatY 3.6s ease-in-out infinite; }
  @keyframes barGrow { from { width: 0; } }
  @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  .anim-enter  { animation: fadeSlideIn .45s cubic-bezier(.22,1,.36,1) both; }
  .anim-pop    { animation: popIn .5s cubic-bezier(.22,1,.36,1) both; }
  .anim-bar    { animation: barGrow 1s cubic-bezier(.22,1,.36,1) both; }
  .joke-anim   { animation: slideUpFade 0.5s ease-out both; }
  .aurora-blob { animation: auroraFloat 24s ease-in-out infinite; will-change: transform; }
  .aurora-blob.delay { animation-delay: -12s; }
  @keyframes fadeOnly { from { opacity: 0; } to { opacity: 1; } }

  /* "הפחתת תנועה" (iOS/אנדרואיד) מדליקה את הכלל הזה. פעם הוא כיבה הכול
     והאפליקציה נראתה קפואה. עכשיו: תנועה מתמשכת ומטרידה — כבויה;
     כניסות רכות של תוכן — נשארות, כהעלמה בלבד בלי תזוזה. */
  @media (prefers-reduced-motion: reduce) {
    .aurora-blob, .anim-float, .dial-pulse, .hero-needle, .cta-shine::after,
    .dial-draw, .anim-bar { animation: none !important; }
    .anim-enter, .anim-pop, .opt-enter, .joke-anim, .swatch {
      animation: fadeOnly .35s ease-out both !important;
    }
    .btn-3d, .btn-3d:hover, .btn-3d:active { transform: none !important; }
  }
  .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 10px; }

  /* --- מובייל: מגע ותחושה --- */
  button, select, a { touch-action: manipulation; -webkit-tap-highlight-color: transparent; }

  /* אפקטי hover רק במכשירים שבאמת יש בהם עכבר — מונע "hover דביק" אחרי הקשה בטאץ' */
  @media (hover: none) and (pointer: coarse) {
    .hover\\:-translate-y-0\\.5:hover, .hover\\:-translate-y-1:hover { transform: none !important; }
    .group:hover .group-hover\\:scale-110 { transform: none !important; }
  }

  /* --- מובייל: ביצועים --- */
  @media (max-width: 768px) {
    .glass-card { backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); }
    .aurora-blob { filter: blur(64px) !important; animation: none; }
  }

  @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 16px); } to { opacity: 1; transform: translate(-50%, 0); } }
  .toast-anim { animation: toastIn .3s cubic-bezier(.22,1,.36,1) both; }

  /* --- מסך הפתיחה --- */
  @keyframes needleSeek {
    0%   { transform: rotate(-58deg); }
    18%  { transform: rotate(46deg); }
    26%  { transform: rotate(30deg); }
    34%  { transform: rotate(38deg); }
    40%  { transform: rotate(35deg); }
    58%  { transform: rotate(-40deg); }
    66%  { transform: rotate(-28deg); }
    72%  { transform: rotate(-33deg); }
    88%  { transform: rotate(-58deg); }
    100% { transform: rotate(-58deg); }
  }
  .hero-needle { animation: needleSeek 8s cubic-bezier(.4,0,.2,1) infinite; }

  @keyframes shine {
    0%   { transform: translateX(-140%) skewX(-18deg); }
    100% { transform: translateX(260%) skewX(-18deg); }
  }
  .cta-shine::after {
    content: ''; position: absolute; top: 0; bottom: 0; width: 45%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.42), transparent);
    animation: shine 3.4s ease-in-out infinite; animation-delay: 1s;
  }
  @keyframes swatchPop {
    0%   { opacity: 0; transform: translateY(8px) scale(.4); }
    70%  { transform: translateY(0) scale(1.18); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }
  .swatch { animation: swatchPop .5s cubic-bezier(.22,1,.36,1) both; }

  /* --- המצפן ---
     אין כאן טרנספורם תלת-ממדי על ה-SVG: דפדפנים מרסטרים טקסט פעם אחת בתוך
     שכבת 3D ואז מותחים אותה כל פריים — מה שגורם לשמות המפלגות להיטשטש
     ולרעוד. החוגה נשארת שטוחה וחדה; התנועה מגיעה מהמחט עצמה. */
  .dial-needle { filter: drop-shadow(0 4px 5px rgba(15, 23, 42, 0.35)); }
  .dial-label { transition: fill .25s, font-weight .25s, opacity .25s; cursor: pointer; }

  /* --- כפתורים תלת-ממדיים --- */
  .btn-3d { transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .25s; }
  @media (hover: hover) {
    .btn-3d:hover { transform: perspective(600px) translateY(-2px) rotateX(-5deg); }
  }
  .btn-3d:active { transform: perspective(600px) translateY(1px) rotateX(3deg) scale(.98); }

  /* --- כניסה מדורגת לאפשרויות בשאלון --- */
  .opt-enter { animation: fadeSlideIn .45s cubic-bezier(.22,1,.36,1) both; }

  .dial-dot { transform-box: fill-box; transform-origin: center; }
  .dial-hit { outline: none; }
  .dial-hit:focus-visible { stroke: #6366f1; stroke-width: 2.5; stroke-dasharray: 4 3; }
  @keyframes dialDraw { from { stroke-dashoffset: 1; } to { stroke-dashoffset: 0; } }
  .dial-draw { stroke-dasharray: 1; animation: dialDraw .9s cubic-bezier(.22,1,.36,1) both; }
  @keyframes dialPulse { 0%, 100% { transform: scale(1); opacity: .22; } 50% { transform: scale(1.35); opacity: .1; } }
  .dial-pulse { transform-box: fill-box; transform-origin: center; animation: dialPulse 2.4s ease-in-out infinite; }
`;

/* ------------------------------------------------------------------
   BACKGROUND + SHELL
------------------------------------------------------------------- */
function Background({ activeColor }) {
  return (
    <div aria-hidden="true" className="fixed inset-0 overflow-hidden pointer-events-none transition-colors duration-1000 bg-gradient-to-b from-indigo-50 via-white to-sky-50">
      <div 
        className="absolute inset-0 transition-opacity duration-1000 ease-in-out opacity-30"
        style={{
          background: activeColor 
            ? `radial-gradient(circle at 50% 0%, ${activeColor} 0%, transparent 60%)` 
            : 'transparent'
        }}
      />
      <div className="aurora-blob absolute -top-40 -right-32 w-[34rem] h-[34rem] rounded-full bg-blue-300/40 blur-[110px]" />
      <div className="aurora-blob delay absolute -bottom-44 -left-32 w-[36rem] h-[36rem] rounded-full bg-violet-300/35 blur-[120px]" />
      <div className="aurora-blob absolute top-1/3 left-1/2 w-[22rem] h-[22rem] rounded-full bg-cyan-300/30 blur-[100px]" />
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

function AppShell({ children, center = true, activeColor = null }) {
  return (
    <div
      dir="rtl"
      className={`relative min-h-screen text-slate-800 ${center ? 'flex items-start md:items-center justify-center' : ''} px-4 py-6 md:p-8`}
      style={{ fontFamily: FONT_BODY, paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}
    >
      <style>{GLOBAL_CSS}</style>
      <Background activeColor={activeColor} />
      <div className="relative z-10 w-full flex justify-center">{children}</div>
    </div>
  );
}


/* ------------------------------------------------------------------
   מסך הפתיחה — שושנת רוחות אמיתית. עיגול מלא, כוכב שמונה קרניים,
   טבעת מדורגת עם צבעי כל המפלגות בחצי העליון, ומחט שמחפשת כיוון
   ואז ננעלת. אותה שפה חזותית של המצפן בתוצאות, רק כאובייקט.
------------------------------------------------------------------- */
function CompassRose() {
  const C = 150, R_OUT = 100, R_RING = 88, R_DOTS = 77, R_FACE = 68;
  const pt = (deg, r) => {
    const a = (deg * Math.PI) / 180;
    return { x: C + r * Math.cos(a), y: C - r * Math.sin(a) };
  };
  const arc = (from, to, r) => {
    const p1 = pt(from, r), p2 = pt(to, r);
    return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${r} ${r} 0 0 ${to < from ? 1 : 0} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  };

  /* כוכב שמונה קרניים: ארבע ארוכות (ראשיות) וארבע קצרות (משניות) */
  const star = (long, short) =>
    [0, 45, 90, 135, 180, 225, 270, 315]
      .map((deg, i) => {
        const len = i % 2 === 0 ? long : short;
        const tipP = pt(deg, len);
        const lA = pt(deg + 45, len * 0.19);
        const lB = pt(deg - 45, len * 0.19);
        return `M ${C} ${C} L ${lA.x.toFixed(1)} ${lA.y.toFixed(1)} L ${tipP.x.toFixed(1)} ${tipP.y.toFixed(1)} L ${lB.x.toFixed(1)} ${lB.y.toFixed(1)} Z`;
      })
      .join(' ');

  return (
    <svg viewBox="0 0 300 300" className="w-full max-w-[220px] md:max-w-[240px] mx-auto h-auto" aria-hidden="true">
      <defs>
        <linearGradient id="roseArc" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="roseFace" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="55%" stopColor="#f8fafc" />
          <stop offset="100%" stopColor="#e0e7ff" />
        </linearGradient>
        <linearGradient id="roseStar" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#c7d2fe" />
          <stop offset="100%" stopColor="#818cf8" />
        </linearGradient>
        <linearGradient id="roseNeedle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="49.9%" stopColor="#4f46e5" />
          <stop offset="50%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </linearGradient>
        <filter id="roseShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="6" stdDeviation="8" floodColor="#4338ca" floodOpacity="0.20" />
        </filter>
      </defs>

      <g filter="url(#roseShadow)">
        {/* גוף המצפן */}
        <circle cx={C} cy={C} r={R_OUT} fill="#fff" stroke="#e2e8f0" strokeWidth="1.5" />
        <circle cx={C} cy={C} r={R_FACE + 14} fill="url(#roseFace)" stroke="#e2e8f0" strokeWidth="1" />
      </g>

      {/* טבעת: חצי עליון בצבעי הגושים, חצי תחתון ניטרלי */}
      <path d={arc(180, 0, R_RING)} fill="none" stroke="url(#roseArc)" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
      <path d={arc(0, -180, R_RING)} fill="none" stroke="#e2e8f0" strokeWidth="5" strokeLinecap="round" />

      {/* שנתות סביב כל ההיקף */}
      {Array.from({ length: 72 }, (_, i) => i * 5).map((deg) => {
        const major = deg % 45 === 0;
        const a = pt(deg, R_RING - 6), b = pt(deg, R_RING - (major ? 13 : 9));
        return <line key={deg} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={major ? '#94a3b8' : '#cbd5e1'} strokeWidth={major ? 1.8 : 1} strokeLinecap="round" />;
      })}

      {/* כוכב שושנת הרוחות */}
      <path d={star(R_FACE - 4, 26)} fill="url(#roseStar)" opacity="0.5" />
      <path d={star(R_FACE - 4, 26)} fill="none" stroke="#a5b4fc" strokeWidth="0.8" opacity="0.9" />

      {/* המפלגות על הקשת העליונה, לפי מיקומן האמיתי */}
      {PARTY_IDS.map((id, i) => {
        const deg = 180 - (PARTIES[id].position / 100) * 180;
        const c = pt(deg, R_DOTS);
        return (
          <circle
            key={id} cx={c.x} cy={c.y} r="4.2" fill={PARTIES[id].hex} stroke="#fff" strokeWidth="1.7"
            className="swatch" style={{ animationDelay: `${400 + i * 55}ms`, transformBox: 'fill-box', transformOrigin: 'center' }}
          />
        );
      })}

      {/* מחט — סורקת, מהססת, וננעלת */}
      <g className="hero-needle" style={{ transformOrigin: `${C}px ${C}px` }}>
        <polygon points={`${C},${C - (R_FACE - 2)} ${C - 6},${C} ${C},${C + (R_FACE - 2)} ${C + 6},${C}`} fill="url(#roseNeedle)" style={{ filter: 'drop-shadow(0 2px 3px rgba(15,23,42,.28))' }} />
      </g>
      <circle cx={C} cy={C} r="9" fill="#1e293b" stroke="#fff" strokeWidth="3" />
      <circle cx={C} cy={C} r="3" fill="#818cf8" />

      {/* כיווני העולם הפוליטי — מחוץ לגוף המצפן, לא על השנתות */}
      {[
        { t: 'מרכז', deg: 90, w: 36, hex: '#a855f7' },
        { t: 'שמאל', deg: 180, w: 36, hex: '#ef4444' },
        { t: 'ימין', deg: 0, w: 30, hex: '#3b82f6' },
      ].map(({ t, deg, w, hex }) => {
        const p = pt(deg, R_OUT + 6 + w / 2); // הדחיפה תלוית-רוחב: הקצה הפנימי תמיד מחוץ לגוף
        return (
          <text key={t} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="12.5" fontWeight="800" fill={hex}>
            {t}
          </text>
        );
      })}
    </svg>
  );
}

/* ------------------------------------------------------------------
   מספר שסופר את עצמו — לאחוז ההתאמה בהירו ובמצפן
------------------------------------------------------------------- */
function AnimatedPercent({ value, duration = 1200, className = '', style }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) { setVal(value); return undefined; }
    let raf;
    const t0 = performance.now();
    const tick = (now) => {
      const k = Math.min(1, (now - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(value * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <span className={`tabular-nums ${className}`} style={style}>{val}%</span>;
}

/* ------------------------------------------------------------------
   המצפן הפוליטי — חוגה חצי-מעגלית עם מחט קפיצית חיה.
   המפלגות יושבות על הקשת לפי מיקומן במפה (שמאל→ימין), גודל וזוהר
   לפי אחוז ההתאמה. המחט נכנסת בתנופה מצד שמאל, עוברת overshoot קטן
   ונרגעת על ההתאמה הגבוהה ביותר (פיזיקת קפיץ אמיתית, לא easing).
   הקשה על מפלגה מזיזה אליה את המחט. SVG טהור — אפס עלות ביצועים.
------------------------------------------------------------------- */
const DIAL = { CX: 300, CY: 250, R: 200, VIEW: '0 0 660 300' };

const dialAngle = (position) => 180 - (position / 100) * 180; // 0=ימין, 180=שמאל
const dialPoint = (angleDeg, radius) => {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: DIAL.CX + radius * Math.cos(rad), y: DIAL.CY - radius * Math.sin(rad) };
};
const arcPath = (fromDeg, toDeg, radius) => {
  const p1 = dialPoint(fromDeg, radius);
  const p2 = dialPoint(toDeg, radius);
  const sweep = toDeg < fromDeg ? 1 : 0;
  return `M ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} A ${radius} ${radius} 0 0 ${sweep} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
};

function CompassDial({ scored, top }) {
  const [selectedId, setSelectedId] = useState(top.id);
  const [live, setLive] = useState(false); // המחט יוצאת לדרך רק כשהמצפן נכנס למסך
  useEffect(() => { setSelectedId(top.id); }, [top.id]);
  const selected = scored.find((p) => p.id === selectedId) || top;

  const wrapRef = useRef(null);
  const needleRef = useRef(null);
  const fillRef = useRef(null);   // קשת הצבע שממלאת את המסלול עד המחט
  const trailRef = useRef(null);  // שובל motion-blur מאחורי המחט
  const spring = useRef({ x: -95, v: 0, raf: 0 });
  const targetDeg = 90 - dialAngle(selected.position); // 0 = מחט למעלה

  /* טריגר כניסה: ברגע שהמצפן נראה — המחט מתעוררת */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setLive(true); io.disconnect(); }
    }, { threshold: 0.35 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* פיזיקת קפיץ + עדכון מילוי ושובל בכל פריים */
  useEffect(() => {
    const a = spring.current;
    const needle = needleRef.current;
    if (!needle) return undefined;

    const paint = (deg, vel) => {
      needle.setAttribute('transform', `rotate(${deg.toFixed(2)} ${DIAL.CX} ${DIAL.CY})`);
      const g = Math.max(0, Math.min(180, 90 - deg)); // זווית המחט בקואורדינטות החוגה
      if (fillRef.current) fillRef.current.setAttribute('d', arcPath(180, g, DIAL.R));
      if (trailRef.current) {
        const len = Math.min(30, Math.abs(vel) * 0.11);
        if (len < 1.5) {
          trailRef.current.setAttribute('opacity', '0');
        } else {
          const back = Math.max(0, Math.min(180, g + (vel > 0 ? len : -len)));
          const inner = dialPoint(g, 26);
          const pA = dialPoint(g, DIAL.R - 8);
          const pB = dialPoint(back, DIAL.R - 8);
          const sweep = back < g ? 1 : 0;
          trailRef.current.setAttribute('d',
            `M ${inner.x.toFixed(1)} ${inner.y.toFixed(1)} L ${pA.x.toFixed(1)} ${pA.y.toFixed(1)} A ${DIAL.R - 8} ${DIAL.R - 8} 0 0 ${sweep} ${pB.x.toFixed(1)} ${pB.y.toFixed(1)} Z`);
          trailRef.current.setAttribute('opacity', Math.min(0.3, Math.abs(vel) * 0.0035).toFixed(3));
        }
      }
    };

    if (!live) { paint(a.x, 0); return undefined; }

    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { a.x = targetDeg; a.v = 0; paint(targetDeg, 0); return undefined; }

    cancelAnimationFrame(a.raf);
    let last = performance.now();
    const K = 90, D = 10; // קשיחות וריסון — overshoot נעים
    const step = (now) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      const acc = -K * (a.x - targetDeg) - D * a.v;
      a.v += acc * dt;
      a.x += a.v * dt;
      paint(a.x, a.v);
      if (Math.abs(a.v) > 0.06 || Math.abs(a.x - targetDeg) > 0.06) {
        a.raf = requestAnimationFrame(step);
      } else {
        a.x = targetDeg; a.v = 0; paint(targetDeg, 0);
        haptic.light(); // "טיק" קטן כשהמחט ננעלת
      }
    };
    a.raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(a.raf);
  }, [targetDeg, live]);

  const pick = (p) => { if (p.id !== selectedId) { haptic.select(); setSelectedId(p.id); } };

  const tip = dialPoint(90, DIAL.R - 34);

  /* ------------------------------------------------------------------
     פריסת שמות המפלגות — פותר התנגשויות במקום לקוות שלא יהיו.
     כל תווית ממורכזת (textAnchor="middle") ולא start/end: ה-SVG יורש
     dir="rtl", ולכן start/end מתהפכים והטקסט זולג פנימה אל תוך החוגה.
     מיקום ממורכז חסין לכיווניות. כל תווית נדחפת החוצה ברדיוס עד
     שהיא מפנה מקום גם לקשת (CLEARANCE) וגם לשכנות שלה.
  ------------------------------------------------------------------- */
  const LABEL_H = 13;
  const CLEARANCE = 12;
  const labelFont = (name) => (name.length > 12 ? 9.5 : 11);
  const labelWidth = (name) => name.length * labelFont(name) * 0.55;

  const labels = useMemo(() => {
    const distToBox = (px, py, b) => {
      const dx = Math.max(b.x0 - px, 0, px - b.x1);
      const dy = Math.max(b.y0 - py, 0, py - b.y1);
      return Math.hypot(dx, dy);
    };
    const overlaps = (a, b, pad = 4) =>
      a.x0 < b.x1 + pad && b.x0 < a.x1 + pad && a.y0 < b.y1 + pad && b.y0 < a.y1 + pad;

    const placed = [];
    scored.forEach((p) => {
      const a = dialAngle(p.position);
      const rad = (a * Math.PI) / 180;
      const w = labelWidth(p.name);
      let r = DIAL.R + 24;
      let box = null;
      for (let tries = 0; tries < 40; tries++) {
        // דחיפה אופקית נוספת לזוויות שטוחות, כדי שרוחב הטקסט לא יחזור אל הקשת
        const cx = DIAL.CX + Math.cos(rad) * (r + (w / 2) * Math.abs(Math.cos(rad)));
        const cy = DIAL.CY - Math.sin(rad) * r;
        box = { id: p.id, cx, cy, r, x0: cx - w / 2, x1: cx + w / 2, y0: cy - LABEL_H / 2, y1: cy + LABEL_H / 2 };
        const clearsArc = distToBox(DIAL.CX, DIAL.CY, box) > DIAL.R + CLEARANCE;
        const clearsOthers = !placed.some((q) => overlaps(box, q));
        if (clearsArc && clearsOthers) break;
        r += 5;
      }
      placed.push(box);
    });
    return Object.fromEntries(placed.map((b) => [b.id, b]));
  }, [scored]);

  return (
    <div ref={wrapRef} className="w-full max-w-2xl md:max-w-none mx-auto">
      <div>
        <svg viewBox={DIAL.VIEW} className="w-full h-auto select-none" role="img" aria-label={`מצפן פוליטי — המחט מצביעה על ${selected.name}, ${selected.match}% התאמה`}>
          <defs>
            <linearGradient id="dialArc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
            <radialGradient id="dialBg" cx="50%" cy="100%" r="90%">
              <stop offset="0%" stopColor="#eef2ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#eef2ff" stopOpacity="0" />
            </radialGradient>
            <filter id="dialGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="5" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* רקע רך בפנים החוגה */}
          <path d={`${arcPath(180, 0, DIAL.R)} L ${DIAL.CX} ${DIAL.CY} Z`} fill="url(#dialBg)" />

          {/* שנתות מינימליסטיות */}
          {Array.from({ length: 13 }, (_, i) => i * 15).map((a) => {
            const p1 = dialPoint(a, DIAL.R - 14);
            const p2 = dialPoint(a, DIAL.R - (a % 45 === 0 ? 25 : 20));
            return <line key={a} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#cbd5e1" strokeWidth={a % 45 === 0 ? 2.2 : 1.3} strokeLinecap="round" />;
          })}

          {/* מסלול אפור + מילוי צבעוני שרודף אחרי המחט */}
          <path d={arcPath(180, 0, DIAL.R)} fill="none" stroke="#e2e8f0" strokeWidth="8" strokeLinecap="round" pathLength="1" className="dial-draw" />
          <path ref={fillRef} d="" fill="none" stroke="url(#dialArc)" strokeWidth="8" strokeLinecap="round" opacity="0.95" />

          {/* שובל motion-blur — נראה רק כשהמחט בתנועה, עוצמתו לפי המהירות */}
          <path ref={trailRef} d="" fill={selected.hex} opacity="0" style={{ pointerEvents: 'none' }} />

          {/* "מרכז" בתוך החוגה, מתחת לקודקוד */}
          <text x={DIAL.CX} y={DIAL.CY - DIAL.R + 46} textAnchor="middle" fontSize="13" fontWeight="800" fill="#a855f7" opacity="0.85">מרכז</text>

          {/* מפלגות: נקודה + קו מוביל + שם אופקי */}
          {scored.map((p, i) => {
            const isWinner = p.id === top.id;
            const isSelected = p.id === selectedId;
            const a = dialAngle(p.position);
            const pos = dialPoint(a, DIAL.R);
            const r = 5.5 + p.match * 0.07;
            const lbl = labels[p.id];
            const leadStart = dialPoint(a, DIAL.R + r + 3);
            const leadEnd = dialPoint(a, lbl.r - 9);
            return (
              <g key={p.id} className="dial-dot anim-pop" style={{ animationDelay: `${140 + i * 55}ms` }}>
                <line x1={leadStart.x} y1={leadStart.y} x2={leadEnd.x} y2={leadEnd.y} stroke={isSelected ? p.hex : '#cbd5e1'} strokeWidth="1.2" opacity="0.8" />
                {isWinner && <circle cx={pos.x} cy={pos.y} r={r + 7} fill={p.hex} opacity="0.22" className="dial-pulse" />}
                <circle
                  cx={pos.x} cy={pos.y} r={isSelected ? r + 1.5 : r}
                  fill={p.hex} stroke="#fff" strokeWidth="2.5"
                  opacity={p.match > 0 ? 1 : 0.35}
                  filter={isSelected ? 'url(#dialGlow)' : undefined}
                />
                <text
                  x={lbl.cx} y={lbl.cy}
                  textAnchor="middle" dominantBaseline="middle"
                  fontSize={labelFont(p.name)}
                  fontWeight={isSelected ? 800 : 600}
                  fill={isSelected ? p.hex : '#64748b'}
                  opacity={p.match > 0 || isSelected ? 1 : 0.55}
                  className="dial-label"
                  onClick={() => pick(p)}
                >
                  {p.name}
                </text>
                {/* אזור הקשה מוגדל — נוח לאצבע */}
                <circle
                  cx={pos.x} cy={pos.y} r="18" fill="transparent" className="dial-hit cursor-pointer"
                  role="button" tabIndex={0} aria-label={`${p.name} — ${p.match}% התאמה`}
                  onClick={() => pick(p)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(p); } }}
                />
              </g>
            );
          })}

          {/* תוויות גושים בקצוות */}
          <text x={dialPoint(180, DIAL.R).x} y={dialPoint(180, DIAL.R).y + 26} textAnchor="middle" fontSize="13" fontWeight="800" fill="#ef4444">שמאל</text>
          <text x={dialPoint(0, DIAL.R).x} y={dialPoint(0, DIAL.R).y + 26} textAnchor="middle" fontSize="13" fontWeight="800" fill="#3b82f6">ימין</text>

          {/* המחט — להב דק עם קצה זוהר בצבע המפלגה */}
          <g ref={needleRef} transform={`rotate(-95 ${DIAL.CX} ${DIAL.CY})`} style={{ pointerEvents: 'none' }} className="dial-needle">
            <polygon points={`${tip.x},${tip.y} ${DIAL.CX - 6},${DIAL.CY + 9} ${DIAL.CX + 6},${DIAL.CY + 9}`} fill="#1e293b" />
          </g>
          <circle cx={DIAL.CX} cy={DIAL.CY} r="12" fill="#1e293b" stroke="#fff" strokeWidth="3.5" />
          <circle cx={DIAL.CX} cy={DIAL.CY} r="4" fill={selected.hex} />

        </svg>
      </div>

      {/* קריאת המצפן */}
      <div className="text-center mt-1" aria-live="polite">
        <div className="text-2xl md:text-3xl" style={{ fontFamily: FONT_DISPLAY, color: selected.hex }}>{selected.name}</div>
        <div className="text-slate-600 font-bold text-sm mt-0.5">
          <AnimatedPercent value={selected.match} duration={700} className="text-lg text-slate-900 font-black" /> התאמה
          {selected.id === top.id && <span className="mr-2 text-xs font-extrabold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-lg">ההתאמה הגבוהה שלך</span>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   תעודת זהות פוליטית — ארכיטיפ אישי משלושת צירי ה-DNA
------------------------------------------------------------------- */
const AXIS_META = [
  { key: 'security', label: 'מדיני-ביטחוני', low: 'ניצי',        high: 'יוני' },
  { key: 'economy',  label: 'כלכלה',          low: 'שוק חופשי',   high: 'סוציאל-דמוקרטי' },
  { key: 'civil',    label: 'דת ואזרח',        low: 'שמרני',       high: 'ליברלי' },
];

const ARCHETYPES = {
  RRR: { title: 'הימין השלם',       desc: 'קו מדיני נוקשה, אמון בשוק החופשי ושמירה על צביון מסורתי — פרופיל ימין עקבי מקיר לקיר.' },
  RRL: { title: 'הימין החילוני',    desc: 'יד קשה בביטחון וכלכלה חופשית, לצד ליברליות מלאה בענייני דת ומדינה.' },
  RLR: { title: 'הימין המסורתי',    desc: 'ביטחון תקיף כלפי חוץ, מדינת רווחה תומכת כלפי פנים, וחיבור עמוק למסורת.' },
  RLL: { title: 'ביטחוניסט חברתי',  desc: 'ניצי כלפי חוץ, סולידרי וליברלי כלפי פנים. שילוב לא שגרתי — ומעניין במיוחד.' },
  LRR: { title: 'שמרן פרגמטי',      desc: 'פתיחות מדינית לצד כלכלה חופשית וערכים מסורתיים. פרופיל נדיר במפה הישראלית.' },
  LRL: { title: 'הליברל הקלאסי',    desc: 'הסדרים מדיניים, שוק חופשי וחירויות פרט — ליברליזם במובנו המלא.' },
  LLR: { title: 'סוציאל-מסורתי',    desc: 'חתירה להסדר מדיני ומדינת רווחה, מתוך חיבור לקהילה ולמסורת.' },
  LLL: { title: 'השמאל הליברלי',    desc: 'הסדר מדיני, סוציאל-דמוקרטיה והפרדת דת ומדינה — שמאל עקבי לכל אורך הדרך.' },
};

const axisLean = (score, meta) => {
  const dist = Math.abs(score - 50);
  if (dist < 10) return { text: 'מאוזן', strong: false };
  const side = score < 50 ? meta.low : meta.high;
  return { text: dist < 25 ? `נוטה ל${side}` : `${side} מובהק`, strong: dist >= 25 };
};

function PoliticalID({ dna, top }) {
  const scores = AXIS_META.map((m) => ({ meta: m, user: dna[m.key].user, party: dna[m.key].party }));
  const complete = scores.every((s) => s.user !== null);
  const archetype = complete
    ? ARCHETYPES[scores.map((s) => (s.user < 50 ? 'R' : 'L')).join('')]
    : null;

  return (
    <div className={`${CARD} p-6 md:p-10 anim-enter`}>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Fingerprint className="w-6 h-6" /></div>
        <h3 className="text-2xl tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>תעודת הזהות הפוליטית שלך</h3>
      </div>

      {archetype ? (
        <div className="mb-7">
          <div className="text-2xl md:text-3xl mb-1.5 bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent w-fit" style={{ fontFamily: FONT_DISPLAY }}>
            {archetype.title}
          </div>
          <p className="text-slate-600 leading-relaxed text-[15px] md:text-base">{archetype.desc}</p>
        </div>
      ) : (
        <p className="text-slate-500 text-sm mb-7 font-medium">דילגת על נושאים שלמים, אז אין לנו פרופיל מלא — אבל הנה מה שכן ידוע.</p>
      )}

      {/* מקרא: את/ה מול המפלגה המובילה */}
      <div className="flex items-center gap-4 text-xs font-bold text-slate-500 mb-5 pb-4 border-b border-slate-100">
        <span className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-slate-800 border-2 border-white shadow-sm" /> את/ה
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: top.hex }} /> {top.name}
        </span>
      </div>

      <div className="space-y-6">
        {scores.map(({ meta, user, party }) => {
          if (user === null) {
            return (
              <div key={meta.key} className="flex items-center justify-between text-sm">
                <span className="font-bold text-slate-400">{meta.label}</span>
                <span className="text-xs font-bold text-slate-400 bg-slate-50 border border-slate-100 px-2.5 py-1 rounded-lg">דילגת על הנושא</span>
              </div>
            );
          }
          const lean = axisLean(user, meta);
          const clamp = (v) => Math.max(5, Math.min(95, v));
          const gap = party === null ? null : Math.round(Math.abs(user - party));
          return (
            <div key={meta.key}>
              <div className="flex items-baseline justify-between mb-3">
                <span className="font-bold text-slate-700 text-sm">{meta.label}</span>
                <span className={`text-xs font-extrabold px-2.5 py-1 rounded-lg border ${lean.strong ? 'text-indigo-700 bg-indigo-50 border-indigo-100' : 'text-slate-600 bg-slate-50 border-slate-200'}`}>
                  {lean.text}
                </span>
              </div>
              <div className="relative h-3 rounded-full bg-slate-200 my-4">
                <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'linear-gradient(to left, #3b82f6, #ef4444)' }} />
                {party !== null && (
                  <div className="absolute top-1/2 w-4 h-4 -translate-y-1/2 -translate-x-1/2 rounded-full border-2 border-white shadow-sm z-10" style={{ left: `${clamp(party)}%`, backgroundColor: top.hex }} />
                )}
                <div className="absolute top-1/2 w-8 h-8 -translate-y-1/2 -translate-x-1/2 rounded-full border-[3px] border-white shadow-md flex items-center justify-center bg-slate-800 text-white text-[10px] font-black z-20" style={{ left: `${clamp(user)}%` }}>
                  את/ה
                </div>
              </div>
              <div className="flex justify-between items-center text-[11px] font-bold text-slate-400">
                <span>{meta.high}</span>
                {gap !== null && (
                  <span className={gap <= 10 ? 'text-green-600' : gap >= 35 ? 'text-rose-500' : 'text-slate-400'}>
                    {gap <= 10 ? 'כמעט זהים כאן' : gap >= 35 ? 'פער ניכר בציר הזה' : `פער של ${gap} נק׳`}
                  </span>
                )}
                <span>{meta.low}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   נקודות חיכוך — איפה גם המפלגה הכי קרובה אליך לא איתך, ומי כן
------------------------------------------------------------------- */
function FrictionPoints({ top, answers }) {
  const frictions = top.perQuestion
    .filter((r) => r.sim < AGREE_THRESHOLD)
    .sort((a, b) => a.sim - b.sim)
    .slice(0, 3)
    .map((r) => {
      const qIdx = QUESTIONS.findIndex((q) => q.id === r.questionId);
      const q = QUESTIONS[qIdx];
      const a = answers[qIdx];
      const best = PARTY_IDS
        .map((pid) => ({ party: PARTIES[pid], sim: similarity(a.choice, q.stances[pid]) }))
        .sort((x, y) => y.sim - x.sim)[0];
      return { q, sim: r.sim, best };
    });

  return (
    <div className={`${CARD} p-5 md:p-8 anim-enter`}>
      <div className="flex items-center gap-3 mb-1">
        <div className="p-2.5 rounded-2xl bg-rose-100">
          <Swords className="w-5 h-5 text-rose-600" />
        </div>
        <h3 className="text-xl text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>נקודות החיכוך שלך</h3>
      </div>
      <p className="text-slate-500 text-sm font-medium mb-5 mr-[52px]">
        איפה אפילו <b style={{ color: top.hex }}>{top.name}</b> לא לגמרי איתך — ומי כן.
      </p>

      {frictions.length === 0 ? (
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5 text-center">
          <p className="font-bold text-green-700 mb-1">כמעט תאומים פוליטיים 🤝</p>
          <p className="text-sm text-green-600">אין אף נושא שבו אתם באמת רחוקים זה מזה. זה נדיר.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {frictions.map(({ q, sim, best }) => {
            const Icon = q.icon;
            const showAlly = best.party.id !== top.id && best.sim >= AGREE_THRESHOLD;
            return (
              <div key={q.id} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                <div className="flex items-center gap-2.5 mb-2.5">
                  <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${q.accent}15` }}>
                    <Icon className="w-4 h-4" style={{ color: q.accent }} />
                  </div>
                  <span className="font-bold text-slate-800 text-[15px]">{q.category}</span>
                  <span className="mr-auto text-xs font-extrabold text-slate-500 tabular-nums">{Math.round(sim * 100)}% בלבד</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200/80 overflow-hidden mb-3">
                  <div className="h-full rounded-full anim-bar" style={{ width: `${Math.round(sim * 100)}%`, backgroundColor: top.hex }} />
                </div>
                {showAlly ? (
                  <div className="text-sm text-slate-600 font-medium">
                    מי דווקא כן איתך כאן:{' '}
                    <span className="font-extrabold px-2 py-0.5 rounded-lg" style={{ color: best.party.hex, backgroundColor: `${best.party.hex}0d` }}>
                      {best.party.name}
                    </span>
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 font-medium">כאן אתה לבד בעמדה — אף מפלגה לא ממש קרובה.</div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------
   MAIN COMPONENT
------------------------------------------------------------------- */
export default function ElectionsCompass() {
  const [state, setState] = useState(loadInitialState);

  const [jokeIndex, setJokeIndex] = useState(0);
  const [sharedView, setSharedView] = useState(false);
  const [guestMode, setGuestMode] = useState(false); // מכשיר משותף: משחק חדש שלא דורס את הנתונים של הבעלים
  const [copied, setCopied] = useState(false);
  const [locked, setLocked] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  /* מסך הטעינה: הבדיחות מתחלפות כל 850ms במקום בדיחה אחת קפואה */
  useEffect(() => {
    if (state.screen !== 'loading') return undefined;
    const t = setInterval(() => setJokeIndex((i) => (i + 1) % LOADING_JOKES.length), 850);
    return () => clearInterval(t);
  }, [state.screen]);

  /* שמירה — לא בצפייה בתוצאה של מישהו אחר, ולא במצב אורח.
     בשני המקרים אלו לא הנתונים של בעל המכשיר, ואסור לדרוס אותם. */
  useEffect(() => {
    if (sharedView || guestMode) return;
    safeStorage.set(STORAGE_KEY, JSON.stringify(state));
  }, [state, sharedView, guestMode]);

  useEffect(() => {
    if (!document.getElementById('app-font')) {
      const link = document.createElement('link');
      link.id = 'app-font';
      link.href = 'https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700;800&family=Secular+One&display=swap';
      link.rel = 'stylesheet';
      document.head.appendChild(link);
    }
  }, []);

  /* טעינת תוצאה משותפת מהכתובת (?r=...) */
  useEffect(() => {
    const r = new URLSearchParams(window.location.search).get('r');
    const decoded = decodeAnswers(r);
    if (decoded) {
      setSharedView(true);
      setState({ screen: 'results', difficulty: decoded.difficulty, idx: 0, review: false, answers: decoded.answers, order: makeShuffledOrders() });
    }
  }, []);

  const { screen, difficulty, idx, answers, review, order: displayOrder } = state;
  const results = useMemo(() => computeResults(answers), [answers]);

  const reset = () => {
    setSharedView(false);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    safeStorage.remove(STORAGE_KEY);
    setState(freshState());
  };

  /* יציאה מצפייה בתוצאה משותפת — משחזרים את ההתקדמות של המבקר עצמו, אם קיימת */
  const exitSharedView = () => {
    setSharedView(false);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setState(loadInitialState());
  };

  /* מצב אורח — למסירת הטלפון לחבר. שאלון נקי לגמרי, בלי לגעת בנתונים השמורים. */
  const startGuestSession = () => {
    setSharedView(false);
    setGuestMode(true);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setState({ ...freshState(), screen: 'difficulty' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* חזרה לבעל המכשיר — הנתונים שלו מעולם לא נגעו בהם */
  const exitGuestSession = () => {
    setGuestMode(false);
    setState(loadInitialState());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const setAnswer = (patch) => {
    setState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.idx] = { ...newAnswers[prev.idx], ...patch };
      return { ...prev, answers: newAnswers };
    });
  };
  
  /* סיום השאלון — ללא side effects בתוך updater (בעיה ב-StrictMode של React 18) */
  const finishQuiz = () => {
    if (review) {
      // במצב עריכה חוזרים ישר לתוצאות, בלי להריץ שוב את מסך הטעינה
      setState(prev => ({ ...prev, screen: 'results', review: false }));
      return;
    }
    setJokeIndex(Math.floor(Math.random() * LOADING_JOKES.length));
    setState(prev => ({ ...prev, screen: 'loading' }));
    setTimeout(() => {
      haptic.success();
      setState(s => (s.screen === 'loading' ? { ...s, screen: 'results' } : s));
    }, 1800);
  };

  const goNext = () => {
    if (idx >= QUESTIONS.length - 1) finishQuiz();
    else setState(prev => ({ ...prev, idx: prev.idx + 1 }));
  };

  const answerAndAdvance = (choice) => {
    if (locked) return;
    setLocked(true);
    haptic.select();
    setState(prev => { const newAnswers = [...prev.answers]; newAnswers[prev.idx] = { ...newAnswers[prev.idx], choice }; return { ...prev, answers: newAnswers }; });
    setTimeout(() => { setLocked(false); goNext(); }, 350);
  };

  const handleSkip = () => {
    haptic.light();
    // סופרים דילוגים בלי לספור פעמיים את השאלה הנוכחית
    const skipCount = answers.filter((a, i) => i !== idx && a.choice === null).length + 1;
    setAnswer({ choice: null });
    if (skipCount === 4 && idx < QUESTIONS.length - 1) {
      haptic.warning();
      showToast('מדלג הרבה, הא? ככה לא בונים חומה (או קואליציה...)');
    }
    goNext();
  };

  const jumpToQuestion = (i) => { haptic.light(); setState(prev => ({ ...prev, idx: i })); };

  const shareUrl = () =>
    `${window.location.origin}${window.location.pathname}?r=${encodeAnswers(answers, difficulty)}`;

  /* קישור הזמנה — הכתובת הנקייה, בלי התשובות שלי מקודדות בתוכה.
     מי שיפתח אותו יקבל שאלון ריק משלו. זה הקישור שרוצים לשלוח לחברים. */
  const inviteUrl = () => `${window.location.origin}${window.location.pathname}`;

  const [invited, setInvited] = useState(false);
  const shareGame = async () => {
    const url = inviteUrl();
    const text = 'מצפן הבחירות 2026 — 11 שאלות, ומגלים לאיזו מפלגה אתם באמת הכי קרובים. נסו בעצמכם:';
    if (navigator.share) {
      try {
        await navigator.share({ title: 'מצפן הבחירות 2026', text, url });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return;
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      haptic.success();
      setInvited(true);
      setTimeout(() => setInvited(false), 2000);
    } catch { showToast('לא הצלחנו להעתיק את הקישור'); }
  };

  const shareLink = async () => {
    if (!results.scored || results.scored.length === 0) return;
    const top = results.scored[0];
    const url = shareUrl();
    const text = `מצפן הבחירות 2026 — ההתאמה הגבוהה שלי: ${top.name} (${top.match}%). ומה יוצא לכם?`;
    
    if (navigator.share) {
      try {
        await navigator.share({ title: 'מצפן הבחירות 2026', text, url });
        return;
      } catch (e) {
        if (e && e.name === 'AbortError') return; 
      }
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      haptic.success();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  /* יצירת תמונת שיתוף (קנבס) — לוואטסאפ/אינסטגרם */
  const shareImage = async () => {
    const top = results.scored[0];
    try {
      await document.fonts.ready;
      await Promise.all([
        document.fonts.load("110px 'Secular One'"),
        document.fonts.load("600 34px 'Assistant'"),
      ]).catch(() => {});

      const W = 1080, H = 1080;
      const cv = document.createElement('canvas');
      cv.width = W; cv.height = H;
      const ctx = cv.getContext('2d');

      const g = ctx.createLinearGradient(0, 0, 0, H);
      g.addColorStop(0, '#eef2ff'); g.addColorStop(0.5, '#ffffff'); g.addColorStop(1, '#e0f2fe');
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);

      const blob = (x, y, r, c) => {
        const rg = ctx.createRadialGradient(x, y, 0, x, y, r);
        rg.addColorStop(0, c); rg.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = rg; ctx.fillRect(0, 0, W, H);
      };
      blob(W - 120, 100, 420, 'rgba(147,197,253,0.55)');
      blob(120, H - 120, 460, 'rgba(196,181,253,0.5)');

      ctx.fillStyle = 'rgba(255,255,255,0.93)';
      ctx.strokeStyle = '#e2e8f0'; ctx.lineWidth = 2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(90, 140, W - 180, H - 280, 48);
      else ctx.rect(90, 140, W - 180, H - 280);
      ctx.fill(); ctx.stroke();

      ctx.direction = 'rtl';
      ctx.textAlign = 'center';

      ctx.fillStyle = '#0f172a';
      ctx.font = "52px 'Secular One', 'Assistant', sans-serif";
      ctx.fillText('מצפן הבחירות 2026', W / 2, 265);

      ctx.font = "600 34px 'Assistant', sans-serif";
      ctx.fillStyle = '#64748b';
      ctx.fillText('המפלגה הקרובה אליי ביותר', W / 2, 355);

      ctx.fillStyle = top.hex;
      let size = 118;
      ctx.font = `${size}px 'Secular One', 'Assistant', sans-serif`;
      while (ctx.measureText(top.name).width > W - 300 && size > 44) {
        size -= 6;
        ctx.font = `${size}px 'Secular One', 'Assistant', sans-serif`;
      }
      ctx.fillText(top.name, W / 2, 520);

      ctx.fillStyle = '#0f172a';
      ctx.font = "170px 'Secular One', 'Assistant', sans-serif";
      ctx.fillText(`${top.match}%`, W / 2, 720);

      ctx.font = "600 32px 'Assistant', sans-serif";
      ctx.fillStyle = '#64748b';
      ctx.fillText('התאמה לעמדותיי', W / 2, 780);

      ctx.font = "700 36px 'Assistant', sans-serif";
      ctx.fillStyle = '#4f46e5';
      ctx.fillText('ומה יוצא לכם?', W / 2, 870);

      ctx.direction = 'ltr';
      ctx.font = "500 28px 'Assistant', sans-serif";
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(window.location.host, W / 2, H - 60);

      const png = await new Promise((res) => cv.toBlob(res, 'image/png'));
      const file = new File([png], 'elections-compass.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: 'מצפן הבחירות 2026' });
          return;
        } catch (e) {
          if (e && e.name === 'AbortError') return;
        }
      }
      const a = document.createElement('a');
      a.href = URL.createObjectURL(png);
      a.download = 'elections-compass.png';
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      console.error('share image failed', e);
    }
  };

  /* ---------------- WELCOME ---------------- */
  if (screen === 'welcome') {
    const answered = answers.filter((a) => a.choice !== null).length;
    const hasProgress = answered > 0;
    return (
      <AppShell>
        <div className="max-w-3xl w-full">
          <div className={`${CARD} overflow-hidden anim-pop`}>
            {/* שושנת הרוחות — האובייקט שנותן לאפליקציה את שמה */}
            <div className="relative px-6 pt-6 md:pt-8 bg-gradient-to-b from-indigo-50/80 to-transparent">
              <CompassRose />
            </div>

            <div className="relative px-6 pb-8 md:px-14 md:pb-12 text-center mt-2">
              <h1 className="text-4xl md:text-6xl mb-3 tracking-tight bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent" style={HERO_HEAVY}>
                מצפן הבחירות 2026
              </h1>

              {/* מה בעצם מקבלים כאן */}
              <p className="text-slate-700 text-lg md:text-2xl font-bold mb-3">
                לאיזו מפלגה אתם באמת הכי קרובים?
              </p>
              <p className="text-slate-500 text-[15px] md:text-lg font-medium mb-7 max-w-lg mx-auto leading-relaxed">
                ענו על {QUESTIONS.length} שאלות קצרות וקבלו דירוג התאמה למפלגות, מיקום על המפה הפוליטית ופירוט של הנושאים שבהם אתם מסכימים – וגם אלה שבהם פחות.
              </p>

              {/* שלוש עובדות במקום שלוש פסקאות */}
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-7 max-w-md mx-auto">
                {[
                  { n: QUESTIONS.length, label: 'שאלות', icon: MessageCircleHeart },
                  { n: PARTY_IDS.length, label: 'מפלגות', icon: Landmark },
                  { n: '2', label: 'דקות', icon: Coffee },
                ].map(({ n, label, icon: Icon }, i) => (
                  <div key={label} className="anim-pop bg-white/70 border border-slate-200 rounded-2xl py-3 px-2" style={{ animationDelay: `${300 + i * 90}ms` }}>
                    <Icon className="w-4 h-4 mx-auto mb-1 text-indigo-500" />
                    <div className="text-2xl leading-none text-slate-900" style={HERO_HEAVY}>{n}</div>
                    <div className="text-[11px] font-bold text-slate-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>

              {/* פס המפלגות — כל השחקנים על השולחן, מיד */}
              <div className="flex items-center justify-center gap-1.5 mb-2">
                {[...PARTY_IDS].sort((a, b) => PARTIES[a].position - PARTIES[b].position).map((id, i) => (
                  <span
                    key={id}
                    title={PARTIES[id].name}
                    className="swatch w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ring-2 ring-white shadow-sm"
                    style={{ backgroundColor: PARTIES[id].hex, animationDelay: `${420 + i * 45}ms` }}
                  />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 mb-8">כל המפלגות, מהשמאל לימין — בלי העדפה לאף אחת</p>

              {/* CTA */}
              {hasProgress ? (
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <button onClick={() => setState(prev => ({ ...prev, screen: 'quiz' }))} className={`${BTN_PRIMARY} cta-shine relative overflow-hidden w-full sm:w-auto text-lg`}>
                    להמשיך מאיפה שעצרתי <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={reset} className={`${BTN_SECONDARY} w-full sm:w-auto text-lg`}>להתחיל מחדש</button>
                </div>
              ) : (
                <button onClick={() => setState(prev => ({ ...prev, screen: 'difficulty' }))} className={`${BTN_PRIMARY} cta-shine relative overflow-hidden w-full sm:w-auto text-lg px-10`}>
                  בואו נתחיל <ChevronLeft className="w-5 h-5" />
                </button>
              )}

              {hasProgress && (
                <div className="mt-4 max-w-xs mx-auto">
                  <div className="h-1.5 rounded-full bg-slate-200 overflow-hidden">
                    <div className="anim-bar h-full rounded-full bg-indigo-500" style={{ width: `${(answered / QUESTIONS.length) * 100}%` }} />
                  </div>
                  <p className="text-xs font-bold text-slate-500 mt-1.5">ענית על {answered} מתוך {QUESTIONS.length} שאלות</p>
                </div>
              )}
            </div>
          </div>

          {/* המתודולוגיה — נגישה, אבל לא חוסמת את הדרך לכפתור */}
          <details className={`${CARD} mt-4 group anim-enter`} style={{ animationDelay: '.2s' }}>
            <summary className={`flex items-center gap-3 p-5 cursor-pointer list-none font-bold text-slate-700 ${FOCUS} rounded-3xl`}>
              <Info className="w-5 h-5 text-indigo-500 flex-shrink-0" />
              איך מחושבת ההתאמה? (ולמה זה לא סקר פופולריות)
              <ChevronLeft className="w-4 h-4 mr-auto text-slate-400 transition-transform group-open:-rotate-90" />
            </summary>
            <p className="px-5 pb-5 text-[15px] text-slate-600 leading-relaxed text-right">
              השאלון אובייקטיבי ומחלק בדיוק את אותו משקל לכל המפלגות. לכל מפלגה יש עמדה מוצהרת בכל שאלה, והאחוז מודד עד כמה עמדתך <b>קרובה</b> לשלה — הסכמה מלאה שווה 100%, וכל התרחקות מורידה את הציון בחדות. אפשר גם לסמן נושאים כ״קריטיים״, והם יקבלו משקל כפול בחישוב. אלה אחוזי התאמה אמיתיים, לא סקר פופולריות.
            </p>
          </details>
        </div>
      </AppShell>
    );
  }

  /* ---------------- DIFFICULTY ---------------- */
  if (screen === 'difficulty') {
    return (
      <AppShell>
        <div className={`max-w-5xl w-full ${CARD} p-6 md:p-12 text-center anim-enter`}>
          <h2 className="text-3xl md:text-4xl mb-3 tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>באיזו שפה נדבר?</h2>
          <p className="text-slate-500 mb-8 md:mb-10 text-lg">אנשים שונים חיים את הפוליטיקה אחרת. בחר את הרמה שנוחה לך.</p>
          <div className="grid md:grid-cols-3 gap-4 md:gap-6">
            {[
              { key: 'everyday', icon: Coffee, title: "תכל'ס", desc: 'שפת רחוב ברורה. לא צריך להכיר שום מושג פוליטי. רק את היומיום.', grad: 'from-amber-400 to-orange-500', hover: 'hover:border-orange-300 hover:shadow-orange-200/60' },
              { key: 'simple', icon: MessageCircleHeart, title: 'בגובה העיניים', desc: 'שפה יומיומית עם קצת מושגים. למי שעוקב מדי פעם אחרי חדשות.', grad: 'from-cyan-500 to-blue-600', hover: 'hover:border-blue-300 hover:shadow-blue-200/60' },
              { key: 'advanced', icon: BrainCircuit, title: 'מעמיק ומקצועי', desc: 'מונחים משפטיים, מדיניים וכלכליים. למי שחי ונושם פוליטיקה.', grad: 'from-violet-500 to-indigo-600', hover: 'hover:border-violet-300 hover:shadow-violet-200/60' },
            ].map(({ key, icon: Icon, title, desc, grad, hover }) => (
              <button
                key={key}
                onClick={() => setState(prev => ({ ...prev, difficulty: key, screen: 'quiz' }))}
                className={`group relative p-6 md:p-8 rounded-3xl border-2 border-slate-200 bg-white text-right transition-all duration-300 hover:-translate-y-1 hover:shadow-xl flex flex-col h-full ${hover} ${FOCUS}`}
              >
                <div className={`relative p-3.5 w-fit rounded-2xl bg-gradient-to-br ${grad} shadow-md mb-5 group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}><Icon className="w-6 h-6 text-white" /></div>
                <h3 className="text-xl mb-2 text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>{title}</h3>
                <p className="text-slate-500 text-[15px] md:text-sm leading-relaxed font-medium flex-grow">{desc}</p>
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
      <AppShell activeColor={q.accent}>
        <div className="max-w-3xl w-full">
          {/* Progress — דביק למעלה במובייל כדי לא לאבד התמצאות בגלילה */}
          <div className="sticky top-0 z-30 -mx-4 px-4 py-2.5 mb-3 bg-gradient-to-b from-white/90 to-white/60 backdrop-blur-md md:static md:mx-0 md:px-1 md:py-0 md:mb-4 md:bg-none md:backdrop-blur-0">
            <div className="flex items-center gap-4">
              <div
                role="progressbar" aria-valuemin={1} aria-valuemax={QUESTIONS.length} aria-valuenow={idx + 1}
                aria-label={`שאלה ${idx + 1} מתוך ${QUESTIONS.length}`}
                className="flex-1 h-2.5 rounded-full bg-white/50 border border-slate-200 overflow-hidden shadow-inner"
              >
                <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${progress}%`, backgroundColor: q.accent }} />
              </div>
              <span className="text-base md:text-sm font-extrabold text-slate-600 tabular-nums whitespace-nowrap">{idx + 1} / {QUESTIONS.length}</span>
            </div>
            {/* ניווט מהיר בין שאלות — קריטי בעריכת תשובות מהתוצאות */}
            <nav className="flex gap-1.5 mt-2.5 overflow-x-auto custom-scrollbar pb-1" aria-label="ניווט בין שאלות">
              {QUESTIONS.map((qq, i) => {
                const answered = answers[i].choice !== null;
                const isCurrent = i === idx;
                return (
                  <button
                    key={qq.id}
                    onClick={() => jumpToQuestion(i)}
                    aria-label={`שאלה ${i + 1}: ${qq.category}${answered ? ' (נענתה)' : ''}`}
                    aria-current={isCurrent ? 'step' : undefined}
                    className={`flex-shrink-0 min-w-[36px] h-8 px-2 rounded-lg text-xs font-extrabold tabular-nums transition-colors border ${FOCUS} ${
                      isCurrent
                        ? 'text-white border-transparent shadow-sm'
                        : answered
                          ? 'bg-white text-slate-700 border-slate-200'
                          : 'bg-transparent text-slate-400 border-dashed border-slate-300'
                    }`}
                    style={isCurrent ? { backgroundColor: q.accent } : answered ? { color: QUESTIONS[i].accent, borderColor: `${QUESTIONS[i].accent}50` } : undefined}
                  >
                    {i + 1}
                  </button>
                );
              })}
            </nav>
          </div>

          <div key={idx} className={`${CARD} overflow-hidden anim-enter`}>
            <div className="p-5 md:p-10">
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl" style={{ backgroundColor: `${q.accent}15` }}><Icon className="w-5 h-5" style={{ color: q.accent }} /></div>
                  <span className="text-base md:text-sm font-extrabold uppercase tracking-wider" style={{ color: q.accent }}>{q.category}</span>
                </div>
                <div className="w-full sm:w-auto sm:mr-auto">
                  <div className="text-[11px] font-bold text-slate-400 mb-1 sm:text-left">כמה הנושא חשוב לך? (משפיע על המשקל בחישוב)</div>
                  <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-xl p-1" role="group" aria-label="חשיבות הנושא">
                  {[{ w: 0.5, label: 'שולי' }, { w: 1, label: 'רגיל' }, { w: 2, label: 'קריטי' }].map(({ w, label }) => (
                    <button
                      key={w} onClick={() => { haptic.light(); setAnswer({ weight: w }); }}
                      aria-pressed={current.weight === w}
                      className={`flex-1 sm:flex-none px-3 py-2 sm:py-1.5 rounded-lg text-sm md:text-xs font-bold transition-colors ${FOCUS} ${current.weight === w ? 'bg-white text-slate-800 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-800'}`}
                    >
                      {w === 2 && <Star className={`w-3 h-3 inline ml-1 -mt-0.5 ${current.weight === w ? 'fill-amber-500 text-amber-500' : ''}`} />}
                      {label}
                    </button>
                  ))}
                  </div>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl mb-8 leading-snug tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>{v.text}</h2>

              <div className="space-y-3" role="radiogroup" aria-label={v.text}>
                {displayOrder[idx].map((optIdx) => {
                  const selected = current.choice === optIdx;
                  return (
                    <button
                      key={optIdx} onClick={() => answerAndAdvance(optIdx)} disabled={locked && !selected}
                      role="radio" aria-checked={selected}
                      className={`opt-enter relative group w-full text-right p-4 md:p-5 rounded-2xl border-2 transition-[border-color,background-color,box-shadow,transform] duration-200 flex items-start gap-3 md:gap-4 active:scale-[0.99] ${FOCUS} ${
                        selected ? 'bg-slate-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                      style={{ animationDelay: `${0.08 + displayOrder[idx].indexOf(optIdx) * 0.06}s`, ...(selected ? { borderColor: q.accent } : {}) }}
                    >
                      {selected && <div className="absolute inset-0 rounded-2xl opacity-10 pointer-events-none" style={{ backgroundColor: q.accent }} />}
                      <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors z-10 ${selected ? 'border-transparent' : 'border-slate-300'}`} style={selected ? { backgroundColor: q.accent } : {}}>
                        {selected && <Check className="w-3.5 h-3.5 text-white" />}
                      </div>
                      <span className={`text-[17px] md:text-base leading-relaxed z-10 ${selected ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>{v.options[optIdx]}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-8 flex items-center justify-between gap-2 border-t border-slate-100 pt-5">
                <button onClick={() => { haptic.light(); (idx === 0 ? setState(prev => ({...prev, screen: 'difficulty'})) : setState(prev => ({...prev, idx: prev.idx - 1}))); }} className={`${BTN_GHOST} min-h-[44px]`}>
                  <ChevronRight className="w-5 h-5" /> קודמת
                </button>
                {review && results.answeredCount > 0 && (
                  <button
                    onClick={() => setState(prev => ({ ...prev, screen: 'results', review: false }))}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors ${FOCUS}`}
                  >
                    <Check className="w-4 h-4" /> לתוצאות
                  </button>
                )}
                <button onClick={handleSkip} className={`${BTN_GHOST} min-h-[44px]`}>
                  לדלג <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {toast && (
            <div role="status" aria-live="polite" className="toast-anim fixed bottom-6 left-1/2 z-50 max-w-[90vw] bg-slate-900 text-white text-sm font-bold px-5 py-3.5 rounded-2xl shadow-xl" style={{ bottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
              {toast}
            </div>
          )}
        </div>
      </AppShell>
    );
  }

  /* ---------------- LOADING (EASTER EGG) ---------------- */
  if (screen === 'loading') {
    return (
      <AppShell>
        <div className={`max-w-md w-full ${CARD} p-12 text-center flex flex-col items-center justify-center min-h-[300px]`}>
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-6" />
          <h2 key={jokeIndex} className="text-2xl text-slate-800 joke-anim" style={{ fontFamily: FONT_DISPLAY }}>
            {LOADING_JOKES[jokeIndex]}
          </h2>
        </div>
      </AppShell>
    );
  }

  /* ---------------- RESULTS ---------------- */
  const { scored, answeredCount, dna } = results;
  
  if (answeredCount === 0) {
    return (
      <AppShell>
         <div className={`max-w-md w-full ${CARD} p-10 text-center anim-pop`}>
           <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6"><Coffee className="w-10 h-10 text-slate-400" /></div>
           <h2 className="text-3xl mb-4 text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>קול שטבע</h2>
           <p className="text-slate-600 mb-8 text-lg">אי אפשר להקים ממשלה מ"לא יודע". דילגת על כל השאלות, אז אין לנו מושג מה להגיד לך.</p>
           <button onClick={reset} className={BTN_PRIMARY}>טוב נו, ננסה שוב</button>
         </div>
      </AppShell>
    );
  }

  const top = scored[0];
  
  const isPerfectMatch = top.match === 100;
  const isLoneWolf = top.match < 45;

/* תובנות: ההפתעה שלך + התאמה לפי גושים.
     הפתעה אמיתית = מפלגה מהחצי התחתון שקרובה אליך בנושא מסוים
     אפילו יותר מהמפלגה המובילה שלך — לא סתם קונצנזוס שכולם מסכימים עליו. */
  const half = Math.floor(scored.length / 2);
  let surprise = null;
  scored.slice(half).forEach((p, j) => {
    p.perQuestion.forEach((rec) => {
      const topRec = top.perQuestion.find((r) => r.questionId === rec.questionId);
      const beatsTop = !topRec || rec.sim > topRec.sim;
      if (rec.sim >= AGREE_THRESHOLD && beatsTop && (!surprise || rec.sim > surprise.sim)) {
        surprise = { party: p, rank: half + j + 1, category: rec.category, sim: rec.sim };
      }
    });
  });

  const blocScores = BLOCS.map((b) => {
    const members = scored.filter((p) => b.parties.includes(p.id));
    const avg = Math.round(members.reduce((sum, p) => sum + p.match, 0) / members.length);
    return { ...b, avg };
  });


  return (
    <AppShell center={false}>
      <div className="max-w-5xl w-full mx-auto space-y-6 pb-16">

        {guestMode && (
          <div className="anim-enter bg-amber-50 border border-amber-200 rounded-3xl p-4 md:p-5 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-right">
            <div className="p-2.5 bg-amber-100 rounded-2xl flex-shrink-0"><Info className="w-5 h-5 text-amber-600" /></div>
            <p className="flex-1 text-sm font-bold text-amber-900">
              מצב אורח — התוצאות האלה לא נשמרות במכשיר, והן לא דורסות את התוצאות של בעל הטלפון.
            </p>
            <button onClick={exitGuestSession} className={`flex-shrink-0 px-5 py-2.5 rounded-xl font-bold bg-white text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors ${FOCUS}`}>
              חזרה לתוצאות שלי
            </button>
          </div>
        )}

        {sharedView && (
          <div className="rounded-3xl border border-indigo-200 bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 p-5 md:p-6 text-white shadow-lg shadow-indigo-300/50 anim-pop flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-right">
              <p className="font-extrabold text-lg">מישהו שיתף איתך את התוצאה שלו 👀</p>
              <p className="text-indigo-100 text-sm font-medium">כך נראית ההתאמה הפוליטית שלו. סקרנים מה יוצא לכם?</p>
            </div>
            <button onClick={exitSharedView} className={`flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold bg-white text-indigo-700 hover:bg-indigo-50 transition-colors shadow-md ${FOCUS}`}>
              גלו את ההתאמה שלכם <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* 1. Winner Hero */}
        <div className={`${CARD} p-8 md:p-14 text-center relative overflow-hidden anim-pop`}>
          <div aria-hidden="true" className="absolute top-0 left-1/2 -translate-x-1/2 w-[32rem] h-[32rem] rounded-full blur-[100px] pointer-events-none opacity-20" style={{ backgroundColor: top.hex }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-slate-500 bg-white border border-slate-200 px-4 py-2 rounded-full mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-500" /> המפלגה הקרובה אליך ביותר
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-8xl mb-6 tracking-tight break-words" style={{ fontFamily: FONT_DISPLAY, color: top.hex }}>{top.name}</h1>
            
            <div className="inline-flex flex-col items-center mb-6">
               <div className="inline-flex items-baseline gap-2 bg-white/60 px-6 py-2 rounded-3xl border border-slate-200/50 shadow-sm backdrop-blur-md mb-2">
                 <AnimatedPercent value={top.match} className="text-6xl text-slate-900" style={{ fontFamily: FONT_DISPLAY }} />
                 <span className="text-slate-600 font-bold text-xl">התאמה</span>
               </div>
               {isPerfectMatch && <div className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1"><PartyPopper className="w-4 h-4"/> מועמד ודאי לשיריון ברשימה!</div>}
               {isLoneWolf && <div className="text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">זאב בודד. אולי הגיע הזמן להקים מפלגה?</div>}
            </div>
            
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">{top.description}</p>
          </div>
        </div>

        {/* 2. המצפן הפוליטי — מיד אחרי התוצאה הראשית */}
        <div className={`${CARD} p-5 md:p-10 anim-enter`} style={{ animationDelay: '.1s' }}>
          <h3 className="text-2xl md:text-3xl mb-1 text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>המצפן הפוליטי</h3>
          <p className="text-slate-500 text-center mb-2 font-medium text-[15px]">המחט מצביעה על ההתאמה הגבוהה ביותר שלך. הקישו על מפלגה כדי להזיז אותה.</p>
          <CompassDial scored={scored} top={top} />
        </div>

        {/* 3. תעודת זהות פוליטית + טבלת המפלגות */}
        <div className="grid md:grid-cols-2 gap-6">
          <PoliticalID dna={dna} top={top} />

          <div className={`${CARD} p-6 md:p-10 anim-enter`}>
            <h3 className="text-2xl mb-6 tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>שאר המפלגות</h3>
            <div className="space-y-4 max-h-[350px] overflow-y-auto px-2 custom-scrollbar">
              {scored.slice(1).map((p, i) => {
                const isRunnerUp = i === 0 && p.match > 0;
                return (
                  <div key={p.id} className={`relative ${isRunnerUp ? 'bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6' : 'mb-4'}`}>
                     {isRunnerUp && <div className="text-xs font-bold text-slate-400 mb-2">כמעט מתאים:</div>}
                     <div className="flex justify-between items-end mb-2">
                        <span className={`flex items-center gap-2 ${isRunnerUp ? 'font-black text-slate-900 text-lg' : 'font-bold text-slate-700'}`}>
                          {!isRunnerUp && <span className="text-slate-400 text-sm">{i + 2}.</span>}
                          {p.name}
                        </span>
                        <span className={`font-black tabular-nums ${isRunnerUp ? 'text-slate-800 text-xl' : 'text-slate-600'}`}>{p.match}%</span>
                     </div>
                     <div className={`w-full bg-slate-100 rounded-full overflow-hidden ${isRunnerUp ? 'h-3' : 'h-2'}`}>
                        <div className="h-full rounded-full anim-bar" style={{ width: `${p.match}%`, backgroundColor: p.hex, animationDelay: `${0.15 + i * 0.07}s` }} />
                     </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* תובנות: ההפתעה שלך + ממוצע גושים */}
        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {surprise && (
            <div className={`${CARD} p-5 md:p-8 anim-enter`}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-2xl bg-amber-100">
                  <Lightbulb className="w-5 h-5 text-amber-600" />
                </div>
                <h3 className="text-xl text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>ההפתעה שלך</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-[16px] md:text-base">
                למרות ש<b style={{ color: surprise.party.hex }}>{surprise.party.name}</b> נמצאת
                רק במקום ה־{surprise.rank} בדירוג שלך, דווקא בנושא{' '}
                <b>{surprise.category}</b> העמדה שלך קרובה מאוד לעמדתה. גם בין יריבים פוליטיים
                יש לפעמים נקודות הסכמה לא צפויות.
              </p>
            </div>
          )}

          <div className={`${CARD} p-5 md:p-8 anim-enter ${surprise ? '' : 'md:col-span-2'}`}>
            <h3 className="text-xl mb-1 text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>ההתאמה שלך לפי גושים</h3>
            <p className="text-slate-500 text-sm font-medium mb-5">ממוצע ההתאמה לכל המפלגות בכל גוש</p>
            <div className="space-y-4">
              {blocScores.map((b) => (
                <div key={b.id}>
                  <div className="flex items-baseline justify-between mb-1.5">
                    <span className="font-bold text-slate-700 text-[15px] flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: b.color }} />
                      {b.label}
                    </span>
                    <span className="font-extrabold text-slate-700 tabular-nums text-sm">{b.avg}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200/70 overflow-hidden">
                    <div className="anim-bar h-full rounded-full" style={{ width: `${b.avg}%`, backgroundColor: b.color, animationDelay: `${0.2 + blocScores.indexOf(b) * 0.12}s` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* נקודות חיכוך */}
        <div className="anim-enter" style={{ animationDelay: '.25s' }}>
          <FrictionPoints top={top} answers={answers} />
        </div>

        {/* Detailed Breakdown */}
        <div className={`${CARD} p-6 md:p-10 anim-enter`}>
          <h3 className="text-2xl md:text-3xl mb-8 text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>
            איפה הסכמתם עם מי?
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            {QUESTIONS.map((q, i) => {
              const a = answers[i];
              const Icon = q.icon;
              if (a.choice === null) {
                return (
                  <div key={q.id} className="bg-slate-50 p-5 md:p-6 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 opacity-50 text-slate-600"><Icon className="w-5 h-5" /><span className="font-bold">{q.category}</span></div>
                    <span className="text-xs font-bold text-slate-400 bg-white px-3 py-1.5 rounded-lg border border-slate-200">דילגתם</span>
                  </div>
                );
              }
              const agree = PARTY_IDS
                .map((pid) => ({ ...PARTIES[pid], sim: similarity(a.choice, q.stances[pid]) }))
                .filter((p) => p.sim >= AGREE_THRESHOLD)
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
                  <p className="text-slate-600 font-medium mb-5 text-sm md:text-base leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {q.variants[difficulty].options[a.choice]}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {agree.length > 0 ? (
                      agree.map((p) => (
                        <span key={p.id} className="text-xs md:text-sm font-bold px-3 py-1.5 rounded-lg border" style={{ color: p.hex, backgroundColor: `${p.hex}0d`, borderColor: `${p.hex}35` }}>
                          {p.name}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs md:text-sm font-medium text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                        אף מפלגה לא מציגה עמדה קרובה.
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Actions */}
        {sharedView ? (
          /* צופה בתוצאה של מישהו אחר — כל המטרה כאן היא להתחיל שאלון משלו */
          <div className={`${CARD} p-6 md:p-8 text-center anim-enter`}>
            <h3 className="text-2xl md:text-3xl mb-2 text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>ומה יוצא לכם?</h3>
            <p className="text-slate-500 font-medium mb-5">אלה התוצאות של מי ששלח לכם את הקישור. השאלון שלכם עדיין ריק — 11 שאלות ומגלים.</p>
            <button onClick={exitSharedView} className={`${BTN_PRIMARY} cta-shine relative overflow-hidden text-lg px-10`}>
              להתחיל את השאלון שלי <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-6">
            <button onClick={shareLink} className={`${BTN_PRIMARY} text-lg`}>
              {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />} {copied ? 'הועתק!' : 'שיתוף התוצאה שלי'}
            </button>
            {/* קישור נקי — החבר מקבל שאלון ריק משלו, לא את התוצאות שלי */}
            <button onClick={shareGame} className={`${BTN_SECONDARY} text-lg`}>
              {invited ? <Check className="w-5 h-5" /> : <Users className="w-5 h-5" />} {invited ? 'הועתק!' : 'הזמנת חבר לשחק'}
            </button>
            <button onClick={shareImage} className={`${BTN_SECONDARY} text-lg`}>
              <Download className="w-5 h-5" /> תמונה לשיתוף
            </button>
            <button onClick={() => setState(prev => ({ ...prev, screen: 'quiz', idx: 0, review: true }))} className={`${BTN_SECONDARY} text-lg`}>
              <RotateCcw className="w-5 h-5" /> עריכת תשובות
            </button>
            {!guestMode && (
              <button onClick={startGuestSession} className={`${BTN_SECONDARY} text-lg`}>
                <UserPlus className="w-5 h-5" /> מישהו אחר רוצה לנסות?
              </button>
            )}
            <button onClick={reset} className={`${BTN_GHOST} justify-center`}>מחיקת נתונים והתחלה</button>
          </div>
        )}

      </div>
    </AppShell>
  );
}