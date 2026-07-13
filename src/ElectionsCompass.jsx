import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, RotateCcw, Vote, Shield, Scale, Coins,
  BookOpen, Users, Map, BrainCircuit, MessageCircleHeart, Heart,
  Star, Info, Check, Share2, Sparkles, Coffee, Activity, Loader2, PartyPopper, GraduationCap, Landmark, Globe,
  Download, Lightbulb, ArrowRightLeft
} from 'lucide-react';

/* ==================================================================
   DESIGN SYSTEM
================================================================== */
const FONT_BODY = "'Assistant', system-ui, sans-serif";
const FONT_DISPLAY = "'Secular One', 'Assistant', sans-serif";

const CARD = 'glass-card bg-white/85 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-xl shadow-indigo-200/40';
const FOCUS = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white';
const BTN_PRIMARY = `inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-white
  bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-[length:200%_100%] bg-right
  hover:bg-left transition-[background-position,transform,box-shadow] duration-500
  shadow-lg shadow-indigo-300/60 hover:shadow-indigo-400/60 hover:-translate-y-0.5 active:translate-y-0 ${FOCUS}`;
const BTN_SECONDARY = `inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-slate-700
  bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 shadow-sm transition-colors ${FOCUS}`;
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
  @keyframes slideUpFade { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
  
  .anim-enter  { animation: fadeSlideIn .45s cubic-bezier(.22,1,.36,1) both; }
  .anim-pop    { animation: popIn .5s cubic-bezier(.22,1,.36,1) both; }
  .anim-bar    { animation: barGrow 1s cubic-bezier(.22,1,.36,1) both; }
  .joke-anim   { animation: slideUpFade 0.5s ease-out both; }
  .aurora-blob { animation: auroraFloat 24s ease-in-out infinite; will-change: transform; }
  .aurora-blob.delay { animation-delay: -12s; }
  @media (prefers-reduced-motion: reduce) {
    .anim-enter, .anim-pop, .anim-bar, .aurora-blob, .joke-anim { animation: none !important; }
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
   MAIN COMPONENT
------------------------------------------------------------------- */
export default function ElectionsCompass() {
  const [state, setState] = useState(loadInitialState);

  const [jokeIndex, setJokeIndex] = useState(0);
  const [sharedView, setSharedView] = useState(false);
  const [cmpA, setCmpA] = useState(null);
  const [cmpB, setCmpB] = useState(null);
  const [copied, setCopied] = useState(false);
  const [locked, setLocked] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  };

  /* שמירה — אבל לא כשצופים בתוצאה של מישהו אחר (אחרת נדרוס את ההתקדמות של המבקר) */
  useEffect(() => {
    if (sharedView) return;
    safeStorage.set(STORAGE_KEY, JSON.stringify(state));
  }, [state, sharedView]);

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
    setCmpA(null);
    setCmpB(null);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    safeStorage.remove(STORAGE_KEY);
    setState(freshState());
  };

  /* יציאה מצפייה בתוצאה משותפת — משחזרים את ההתקדמות של המבקר עצמו, אם קיימת */
  const exitSharedView = () => {
    setSharedView(false);
    setCmpA(null);
    setCmpB(null);
    if (window.location.search) {
      window.history.replaceState({}, '', window.location.pathname);
    }
    setState(loadInitialState());
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
    if (navigator.vibrate) { try { navigator.vibrate(8); } catch { /* noop */ } }
    setState(prev => { const newAnswers = [...prev.answers]; newAnswers[prev.idx] = { ...newAnswers[prev.idx], choice }; return { ...prev, answers: newAnswers }; });
    setTimeout(() => { setLocked(false); goNext(); }, 350);
  };

  const handleSkip = () => {
    // סופרים דילוגים בלי לספור פעמיים את השאלה הנוכחית
    const skipCount = answers.filter((a, i) => i !== idx && a.choice === null).length + 1;
    setAnswer({ choice: null });
    if (skipCount === 4 && idx < QUESTIONS.length - 1) {
      showToast('מדלג הרבה, הא? ככה לא בונים חומה (או קואליציה...)');
    }
    goNext();
  };

  const jumpToQuestion = (i) => setState(prev => ({ ...prev, idx: i }));

  const shareUrl = () =>
    `${window.location.origin}${window.location.pathname}?r=${encodeAnswers(answers, difficulty)}`;

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
    return (
      <AppShell>
        <div className={`max-w-2xl w-full ${CARD} overflow-hidden anim-pop`}>
          <div className="relative p-8 md:p-14 text-center">
            <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg mb-6">
              <Vote className="w-10 h-10 text-white" />
            </div>
            <h1 className="relative text-4xl md:text-6xl mb-4 tracking-tight bg-gradient-to-l from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent" style={{ fontFamily: FONT_DISPLAY }}>מצפן הבחירות 2026</h1>
            <p className="relative text-slate-600 text-lg md:text-xl font-semibold mb-6">איפה העמדות שלך פוגשות את המציאות?</p>
            <p className="relative text-[17px] md:text-base text-slate-500 leading-relaxed max-w-lg mx-auto mb-8">
              אחת־עשרה שאלות על נושאי הליבה. לכל מפלגה יש עמדה מוצהרת, ואנחנו מודדים עד כמה התשובות שלך קרובות אליה — תוך התחשבות בנושאים שבאמת חשובים לך.
            </p>
            <div className="relative bg-indigo-50/70 border border-indigo-100 p-5 rounded-2xl text-[15px] md:text-sm text-slate-600 mb-8 flex items-start gap-3 text-right">
              <Info className="w-5 h-5 flex-shrink-0 text-indigo-500 mt-0.5" />
              <p className="leading-relaxed">השאלון אובייקטיבי ומחלק בדיוק את אותו משקל לכל המפלגות. האחוז מודד עד כמה עמדתך <b>קרובה</b> לעמדת המפלגה בכל שאלה — הסכמה מלאה שווה 100%, וכל התרחקות מורידה את הציון בחדות. אלה אחוזי התאמה אמיתיים, לא סקר פופולריות.</p>
            </div>
            {answers.some(a => a.choice !== null) ? (
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                 <button onClick={() => setState(prev => ({...prev, screen: 'quiz'}))} className={`${BTN_PRIMARY} w-full sm:w-auto text-lg`}>להמשיך מאיפה שעצרתי <ChevronLeft className="w-5 h-5" /></button>
                 <button onClick={reset} className={`${BTN_SECONDARY} w-full sm:w-auto text-lg`}>להתחיל מחדש</button>
              </div>
            ) : (
              <button onClick={() => setState(prev => ({...prev, screen: 'difficulty'}))} className={`${BTN_PRIMARY} w-full sm:w-auto text-lg`}>בואו נתחיל <ChevronLeft className="w-5 h-5" /></button>
            )}
          </div>
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
                      key={w} onClick={() => setAnswer({ weight: w })}
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
                      className={`relative group w-full text-right p-4 md:p-5 rounded-2xl border-2 transition-[border-color,background-color,box-shadow,transform] duration-200 flex items-start gap-3 md:gap-4 active:scale-[0.99] ${FOCUS} ${
                        selected ? 'bg-slate-50 shadow-md' : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                      style={selected ? { borderColor: q.accent } : {}}
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
                <button onClick={() => (idx === 0 ? setState(prev => ({...prev, screen: 'difficulty'})) : setState(prev => ({...prev, idx: prev.idx - 1})))} className={`${BTN_GHOST} min-h-[44px]`}>
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
  const timelineParties = [...scored].sort((a, b) => a.position - b.position);
  
  const isPerfectMatch = top.match === 100;
  const isLoneWolf = top.match < 45;

  const DNASlider = ({ label, leftLabel, rightLabel, userScore, partyScore }) => {
    if (userScore === null || partyScore === null) return null;
    const clamp = (v) => Math.max(5, Math.min(95, v)); // שהסמנים לא ייחתכו בקצוות הפס
    userScore = clamp(userScore);
    partyScore = clamp(partyScore);
    return (
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
           <span className="font-extrabold text-slate-700 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{label}</span>
        </div>
        <div className="relative w-full h-3 bg-slate-200 rounded-full my-4">
           <div className="absolute inset-0 rounded-full opacity-30" style={{ background: `linear-gradient(to left, #3b82f6, #ef4444)` }} />
           <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center" style={{ left: `${partyScore}%` }}>
              <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm z-10" style={{ backgroundColor: top.hex }} />
           </div>
           <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex flex-col items-center z-20" style={{ left: `${userScore}%` }}>
              <div className="w-8 h-8 rounded-full border-[3px] border-white shadow-md flex items-center justify-center bg-slate-800 text-white text-xs font-black">את/ה</div>
           </div>
        </div>
        <div className="flex justify-between text-xs font-bold text-slate-400">
          <span>{rightLabel}</span>
          <span>{leftLabel}</span>
        </div>
      </div>
    );
  };

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

  /* השוואת שתי מפלגות */
  const cmpAId = cmpA ?? scored[0].id;
  const cmpBId = cmpB ?? scored[1].id;
  const cmpPartyA = scored.find((p) => p.id === cmpAId);
  const cmpPartyB = scored.find((p) => p.id === cmpBId);
  const answeredQuestions = QUESTIONS.map((q, i) => ({ q, a: answers[i] }))
    .filter(({ a }) => a.choice !== null);

  return (
    <AppShell center={false}>
      <div className="max-w-5xl w-full mx-auto space-y-6 pb-16">

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
                 <span className="text-6xl text-slate-900 tabular-nums" style={{ fontFamily: FONT_DISPLAY }}>{top.match}%</span>
                 <span className="text-slate-600 font-bold text-xl">התאמה</span>
               </div>
               {isPerfectMatch && <div className="text-sm font-bold text-green-600 bg-green-100 px-3 py-1 rounded-full flex items-center gap-1"><PartyPopper className="w-4 h-4"/> מועמד ודאי לשיריון ברשימה!</div>}
               {isLoneWolf && <div className="text-sm font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">זאב בודד. אולי הגיע הזמן להקים מפלגה?</div>}
            </div>
            
            <p className="text-lg md:text-xl text-slate-700 max-w-2xl mx-auto leading-relaxed font-medium">{top.description}</p>
          </div>
        </div>

        {/* 2. DNA + Leaderboard Side-by-Side */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className={`${CARD} p-6 md:p-10 anim-enter`}>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-indigo-100 text-indigo-600 rounded-2xl"><Activity className="w-6 h-6" /></div>
              <h3 className="text-2xl tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>ה-DNA הפוליטי שלך</h3>
            </div>
            <p className="text-slate-500 text-sm mb-8 font-medium">השוואת עמדות לפי צירי מדיניות בין <span className="font-bold text-slate-800">העמדות שלך</span> לבין <span className="font-bold" style={{color: top.hex}}>{top.name}</span>.</p>
            <DNASlider label="מדיני-ביטחוני" rightLabel="ימין/ניצי" leftLabel="שמאל/יוני" userScore={dna.security.user} partyScore={dna.security.party} />
            <DNASlider label="כלכלה" rightLabel="שוק חופשי" leftLabel="סוציאל-דמוקרטיה" userScore={dna.economy.user} partyScore={dna.economy.party} />
            <DNASlider label="אזרחי ודת" rightLabel="מסורתי/שמרני" leftLabel="הפרדת דת/ליברלי" userScore={dna.civil.user} partyScore={dna.civil.party} />
          </div>

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
                        <div className="h-full rounded-full transition-all duration-1000 ease-out anim-bar" style={{ width: `${p.match}%`, backgroundColor: p.hex }} />
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
                    <div className="anim-bar h-full rounded-full" style={{ width: `${b.avg}%`, backgroundColor: b.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* המפה הפוליטית - מובייל */}
        <div className={`${CARD} p-5 lg:hidden anim-enter`}>
          <h3 className="text-2xl mb-1 text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>המפה הפוליטית</h3>
          <p className="text-slate-500 text-center mb-6 font-medium text-[15px]">מיקום המפלגות על הציר, והיכן ההתאמה שלך</p>
          <div className="flex items-center justify-center gap-2 mb-4 text-sm font-extrabold text-red-600">
            <div className="w-3 h-3 rounded-full bg-red-500" /> גוש השמאל
          </div>
          <div className="relative" style={{ height: `${timelineParties.length * 58 + 40}px` }}>
            <div className="absolute right-[18px] top-0 bottom-0 w-2.5 rounded-full" style={{ background: 'linear-gradient(to bottom, #ef4444, #a855f7, #3b82f6)' }} />
            <div className="absolute inset-x-0 top-5 bottom-5">
              {timelineParties.map((p, index) => {
              const isWinner = p.id === top.id;
              const topPct = (index / (timelineParties.length - 1)) * 100;
              return (
                <div key={p.id} className="absolute right-0 left-0 flex items-center gap-3" style={{ top: `${topPct}%`, transform: 'translateY(-50%)' }}>
                  <div className={`relative z-10 rounded-full border-[3px] border-white flex-shrink-0 transition-transform ${isWinner ? 'scale-125' : ''}`} style={{ width: '22px', height: '22px', marginRight: '8px', backgroundColor: p.hex, opacity: p.match > 0 ? 1 : 0.4, boxShadow: isWinner ? `0 0 0 4px ${p.hex}25, 0 2px 8px ${p.hex}60` : '0 1px 3px rgba(0,0,0,.15)' }} />
                  <div className={`flex-1 flex items-center justify-between gap-2 px-3 py-2 rounded-xl border ${isWinner ? 'bg-white shadow-md' : 'bg-slate-50/70 border-slate-100'}`} style={isWinner ? { borderColor: `${p.hex}50` } : undefined}>
                    <span className={`text-[15px] truncate ${isWinner ? 'font-extrabold text-slate-900' : 'font-bold text-slate-600'}`}>{p.name}</span>
                    <span className={`text-sm font-extrabold tabular-nums flex-shrink-0 ${isWinner ? '' : 'text-slate-500'}`} style={isWinner ? { color: p.hex } : undefined}>{p.match}%</span>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm font-extrabold text-blue-600">
            <div className="w-3 h-3 rounded-full bg-blue-500" /> גוש הימין
          </div>
        </div>

        {/* המפה הפוליטית - דסקטופ */}
        <div className={`${CARD} p-6 md:p-10 hidden lg:block overflow-hidden anim-enter`}>
          <h3 className="text-2xl mb-2 text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>המפה הפוליטית בישראל</h3>
          <p className="text-slate-500 text-center mb-8 font-medium">גלול ימינה ושמאלה כדי לראות את מיקום כל המפלגות על הציר, ואת המיקום שלך.</p>
          <div className="overflow-x-auto custom-scrollbar pb-10">
            <div className="min-w-[900px] relative mt-16 mb-8 px-8">
              <div className="relative w-full h-[180px] flex items-center">
                <div dir="ltr" className="absolute left-0 right-0 h-3 rounded-full z-10 shadow-inner" style={{ background: 'linear-gradient(to right, #ef4444, #a855f7, #3b82f6)' }} />
                {timelineParties.map((p, index) => {
                  const isWinner = p.id === top.id;
                  const isTopRow = index % 2 === 0;
                  return (
                    <div key={p.id} className="absolute z-20 flex flex-col items-center" style={{ left: `${p.position}%`, top: '50%', transform: 'translate(-50%, -50%)' }}>
                      <div className={`rounded-full relative z-10 border-[3px] border-white transition-all ${isWinner ? 'scale-[1.8] shadow-lg z-30' : 'shadow-sm hover:scale-125'}`} style={{ backgroundColor: p.hex, width: '20px', height: '20px', opacity: p.match > 0 ? 1 : 0.3 }} />
                      {isTopRow ? (
                        <div className="absolute bottom-full mb-3 flex flex-col items-center pointer-events-none">
                          <span className={`text-sm whitespace-nowrap mb-1 ${isWinner ? 'font-black text-slate-900 scale-110' : 'font-bold text-slate-500'}`}>{p.name}</span>
                          <span className={`text-xs font-bold mb-3 tabular-nums ${isWinner ? 'text-slate-900' : 'text-slate-400'}`}>{p.match}%</span>
                          <div className={`w-px h-10 ${isWinner ? 'bg-slate-400' : 'bg-slate-200'}`} />
                        </div>
                      ) : (
                        <div className="absolute top-full mt-3 flex flex-col items-center pointer-events-none">
                          <div className={`w-px h-10 ${isWinner ? 'bg-slate-400' : 'bg-slate-200'}`} />
                          <span className={`text-xs font-bold mt-3 tabular-nums ${isWinner ? 'text-slate-900' : 'text-slate-400'}`}>{p.match}%</span>
                          <span className={`text-sm whitespace-nowrap mt-1 ${isWinner ? 'font-black text-slate-900 scale-110' : 'font-bold text-slate-500'}`}>{p.name}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div dir="ltr" className="flex justify-between items-center text-sm font-bold bg-slate-50 border border-slate-200 px-6 py-4 rounded-2xl max-w-2xl mx-auto mt-2">
            <div className="flex items-center gap-2 text-red-600"><div className="w-3.5 h-3.5 rounded-full bg-red-500" /> גוש השמאל</div>
            <div className="flex items-center gap-2 text-purple-600"><div className="w-3.5 h-3.5 rounded-full bg-purple-500" /> גוש המרכז</div>
            <div className="flex items-center gap-2 text-blue-600"><div className="w-3.5 h-3.5 rounded-full bg-blue-500" /> גוש הימין</div>
          </div>
        </div>

        {/* ראש בראש - Head to Head */}
        <div className={`${CARD} p-5 md:p-10 anim-enter`}>
          <div className="flex items-center justify-center gap-3 mb-2">
            <ArrowRightLeft className="w-6 h-6 text-indigo-500" />
            <h3 className="text-2xl text-center tracking-tight text-slate-900" style={{ fontFamily: FONT_DISPLAY }}>ראש בראש</h3>
          </div>
          <p className="text-slate-500 text-center mb-6 font-medium text-[15px]">בחרו שתי מפלגות וראו עד כמה כל אחת קרובה לעמדתך, נושא מול נושא</p>
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-xl mx-auto mb-8">
            {[ { val: cmpAId, set: setCmpA, party: cmpPartyA }, { val: cmpBId, set: setCmpB, party: cmpPartyB } ].map(({ val, set, party }, side) => (
              <div key={side}>
                <select value={val} onChange={(e) => set(e.target.value)} className={`w-full p-3 rounded-xl border-2 bg-white font-bold text-slate-800 text-sm md:text-base cursor-pointer ${FOCUS}`} style={{ borderColor: `${party.hex}60` }}>
                  {scored.map((p) => (<option key={p.id} value={p.id}>{p.name} — {p.match}%</option>))}
                </select>
              </div>
            ))}
          </div>
          <div className="space-y-4 max-w-2xl mx-auto">
            {answeredQuestions.map(({ q, a }) => {
              const simA = similarity(a.choice, q.stances[cmpAId]);
              const simB = similarity(a.choice, q.stances[cmpBId]);
              return (
                <div key={q.id} className="bg-slate-50/70 border border-slate-100 rounded-2xl p-4">
                  <p className="font-bold text-slate-700 text-[15px] mb-3">{q.category}</p>
                  {[ { sim: simA, party: cmpPartyA }, { sim: simB, party: cmpPartyB } ].map(({ sim: sv, party }, k) => (
                    <div key={k} className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2.5 sm:mb-1.5 last:mb-0">
                      <span className="sm:w-32 text-xs md:text-sm font-bold sm:truncate flex-shrink-0" style={{ color: party.hex }}>{party.name}</span>
                      <div className="flex items-center gap-3 flex-1 w-full">
                      <div className="flex-1 h-2.5 rounded-full bg-slate-200/80 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${Math.round(sv * 100)}%`, backgroundColor: party.hex }} />
                      </div>
                      <span className="w-9 text-left text-xs font-extrabold text-slate-500 tabular-nums flex-shrink-0">{Math.round(sv * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
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

        {/* 5. Actions — בצפייה בתוצאה של מישהו אחר לא מציגים עריכה/שיתוף (זו לא התוצאה שלך) */}
        <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 pt-6">
          {sharedView ? (
            <button onClick={exitSharedView} className={`${BTN_PRIMARY} text-lg`}>
              גלו את ההתאמה שלכם <ChevronLeft className="w-5 h-5" />
            </button>
          ) : (
            <>
              <button onClick={shareLink} className={`${BTN_PRIMARY} text-lg`}>
                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />} {copied ? 'הועתק!' : 'שיתוף קישור'}
              </button>
              <button onClick={shareImage} className={`${BTN_SECONDARY} text-lg`}>
                <Download className="w-5 h-5" /> תמונה לשיתוף
              </button>
              <button onClick={() => setState(prev => ({ ...prev, screen: 'quiz', idx: 0, review: true }))} className={`${BTN_SECONDARY} text-lg`}>
                <RotateCcw className="w-5 h-5" /> עריכת תשובות
              </button>
              <button onClick={reset} className={`${BTN_GHOST} justify-center`}>מחיקת נתונים והתחלה</button>
            </>
          )}
        </div>

      </div>
    </AppShell>
  );
}