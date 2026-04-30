/**
 * Demo Seed — populates all Zustand persist stores with realistic Omani
 * personal-finance data spanning the last 12 months.
 *
 * Calling loadDemoData() writes directly to localStorage using the same
 * keys Zustand's persist middleware uses, then reloads the page so every
 * store picks up the fresh state.
 */

import type { Transaction, SavingsGoal } from "@/types";
import type { FinancialMonthConfig } from "@/types";
import type { InvestmentPlan, AdvisorAnswers } from "@/types/markets";
import type { CharityEntry } from "@/store/charityStore";

// ─── helpers ──────────────────────────────────────────────────────────────────

function uid() {
  return crypto.randomUUID();
}

function iso(year: number, month: number, day: number) {
  return new Date(year, month - 1, day).toISOString();
}

// ─── Transactions (May 2025 → Apr 2026, 12 months) ────────────────────────────

function makeTransactions(): Transaction[] {
  const rows: Omit<Transaction, "id" | "createdAt">[] = [

    // ══════════════════════════════════════════════════════════
    // ── May 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1100, category: "other",         note: "راتب مايو",              date: iso(2025, 5,25) },
    { type: "expense", amount: 180,  category: "bills",         note: "إيجار",                  date: iso(2025, 5,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025, 5,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025, 5,27) },
    { type: "expense", amount: 22,   category: "bills",         note: "كهرباء ومياه",           date: iso(2025, 5,27) },
    { type: "expense", amount: 44,   category: "food",          note: "بقالة",                  date: iso(2025, 5, 3) },
    { type: "expense", amount: 16.5, category: "food",          note: "غداء مطعم",              date: iso(2025, 5, 9) },
    { type: "expense", amount: 8.5,  category: "food",          note: "قهوة ومشروبات",          date: iso(2025, 5,16) },
    { type: "expense", amount: 28,   category: "transport",     note: "وقود",                   date: iso(2025, 5,12) },
    { type: "expense", amount: 35,   category: "shopping",      note: "أدوات مكتب",             date: iso(2025, 5,20) },
    { type: "expense", amount: 20,   category: "entertainment", note: "اشتراكات",               date: iso(2025, 5, 5) },
    { type: "expense", amount: 25,   category: "health",        note: "نادي رياضي",             date: iso(2025, 5, 2) },
    { type: "expense", amount: 30,   category: "education",     note: "كتب دراسية",             date: iso(2025, 5,22) },
    { type: "expense", amount: 80,   category: "savings",       note: "تحويل للادخار",          date: iso(2025, 5,26) },

    // ══════════════════════════════════════════════════════════
    // ── June 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1100, category: "other",         note: "راتب يونيو",             date: iso(2025, 6,25) },
    { type: "expense", amount: 180,  category: "bills",         note: "إيجار",                  date: iso(2025, 6,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025, 6,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025, 6,27) },
    { type: "expense", amount: 30,   category: "bills",         note: "كهرباء (صيف)",           date: iso(2025, 6,27) },
    { type: "expense", amount: 51,   category: "food",          note: "بقالة",                  date: iso(2025, 6, 4) },
    { type: "expense", amount: 19.5, category: "food",          note: "مطعم مع الأصدقاء",       date: iso(2025, 6,14) },
    { type: "expense", amount: 12,   category: "food",          note: "مشروبات باردة",          date: iso(2025, 6,20) },
    { type: "expense", amount: 32,   category: "transport",     note: "وقود",                   date: iso(2025, 6,10) },
    { type: "expense", amount: 60,   category: "shopping",      note: "ملابس صيفية",            date: iso(2025, 6,18) },
    { type: "expense", amount: 20,   category: "entertainment", note: "اشتراكات",               date: iso(2025, 6, 5) },
    { type: "expense", amount: 25,   category: "health",        note: "نادي رياضي",             date: iso(2025, 6, 2) },
    { type: "expense", amount: 18,   category: "health",        note: "فيتامينات وأدوية",       date: iso(2025, 6,22) },
    { type: "expense", amount: 90,   category: "savings",       note: "تحويل للادخار",          date: iso(2025, 6,26) },
    { type: "income",  amount: 150,  category: "other",         note: "مكافأة أداء",            date: iso(2025, 6,30) },

    // ══════════════════════════════════════════════════════════
    // ── July 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1100, category: "other",         note: "راتب يوليو",             date: iso(2025, 7,25) },
    { type: "expense", amount: 180,  category: "bills",         note: "إيجار",                  date: iso(2025, 7,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025, 7,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025, 7,27) },
    { type: "expense", amount: 35,   category: "bills",         note: "كهرباء (صيف)",           date: iso(2025, 7,27) },
    { type: "expense", amount: 49,   category: "food",          note: "بقالة لولو",             date: iso(2025, 7, 5) },
    { type: "expense", amount: 22,   category: "food",          note: "عشاء عائلي",             date: iso(2025, 7,13) },
    { type: "expense", amount: 14,   category: "food",          note: "مطعم",                   date: iso(2025, 7,21) },
    { type: "expense", amount: 34,   category: "transport",     note: "وقود",                   date: iso(2025, 7,11) },
    { type: "expense", amount: 120,  category: "shopping",      note: "تذاكر سفر داخلي",        date: iso(2025, 7,15) },
    { type: "expense", amount: 20,   category: "entertainment", note: "اشتراكات",               date: iso(2025, 7, 5) },
    { type: "expense", amount: 25,   category: "health",        note: "نادي رياضي",             date: iso(2025, 7, 2) },
    { type: "expense", amount: 40,   category: "entertainment", note: "رحلة ترفيهية",           date: iso(2025, 7,17) },
    { type: "expense", amount: 80,   category: "savings",       note: "تحويل للادخار",          date: iso(2025, 7,26) },

    // ══════════════════════════════════════════════════════════
    // ── August 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1100, category: "other",         note: "راتب أغسطس",             date: iso(2025, 8,25) },
    { type: "expense", amount: 180,  category: "bills",         note: "إيجار",                  date: iso(2025, 8,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025, 8,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025, 8,27) },
    { type: "expense", amount: 38,   category: "bills",         note: "كهرباء (ذروة الصيف)",    date: iso(2025, 8,27) },
    { type: "expense", amount: 55,   category: "food",          note: "بقالة",                  date: iso(2025, 8, 3) },
    { type: "expense", amount: 18,   category: "food",          note: "مطعم",                   date: iso(2025, 8,10) },
    { type: "expense", amount: 9,    category: "food",          note: "قهوة",                   date: iso(2025, 8,18) },
    { type: "expense", amount: 33,   category: "transport",     note: "وقود",                   date: iso(2025, 8, 9) },
    { type: "expense", amount: 45,   category: "shopping",      note: "أجهزة منزلية صغيرة",    date: iso(2025, 8,20) },
    { type: "expense", amount: 20,   category: "entertainment", note: "اشتراكات",               date: iso(2025, 8, 5) },
    { type: "expense", amount: 25,   category: "health",        note: "نادي رياضي",             date: iso(2025, 8, 2) },
    { type: "expense", amount: 50,   category: "education",     note: "كورس تطوير ذات",         date: iso(2025, 8,12) },
    { type: "expense", amount: 100,  category: "savings",       note: "تحويل للادخار",          date: iso(2025, 8,26) },

    // ══════════════════════════════════════════════════════════
    // ── September 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب سبتمبر (زيادة)",   date: iso(2025, 9,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار (جديد)",           date: iso(2025, 9,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025, 9,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025, 9,27) },
    { type: "expense", amount: 26,   category: "bills",         note: "كهرباء ومياه",           date: iso(2025, 9,27) },
    { type: "expense", amount: 58,   category: "food",          note: "بقالة",                  date: iso(2025, 9, 4) },
    { type: "expense", amount: 21,   category: "food",          note: "غداء",                   date: iso(2025, 9,11) },
    { type: "expense", amount: 13,   category: "food",          note: "إفطار خارجي",            date: iso(2025, 9,19) },
    { type: "expense", amount: 31,   category: "transport",     note: "وقود",                   date: iso(2025, 9,14) },
    { type: "expense", amount: 55,   category: "shopping",      note: "ملابس شتوية مبكرة",      date: iso(2025, 9,22) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراكات",               date: iso(2025, 9, 5) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي",             date: iso(2025, 9, 2) },
    { type: "expense", amount: 100,  category: "savings",       note: "تحويل للادخار",          date: iso(2025, 9,26) },
    { type: "income",  amount: 80,   category: "other",         note: "بيع أغراض قديمة",       date: iso(2025, 9,18) },

    // ══════════════════════════════════════════════════════════
    // ── October 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب أكتوبر",            date: iso(2025,10,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار",                  date: iso(2025,10,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025,10,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025,10,27) },
    { type: "expense", amount: 23,   category: "bills",         note: "كهرباء ومياه",           date: iso(2025,10,27) },
    { type: "expense", amount: 53,   category: "food",          note: "بقالة",                  date: iso(2025,10, 5) },
    { type: "expense", amount: 20,   category: "food",          note: "مطعم",                   date: iso(2025,10,12) },
    { type: "expense", amount: 10,   category: "food",          note: "كافيه",                  date: iso(2025,10,19) },
    { type: "expense", amount: 30,   category: "transport",     note: "وقود",                   date: iso(2025,10,13) },
    { type: "expense", amount: 70,   category: "shopping",      note: "هاتف جديد (إكسسوارات)",  date: iso(2025,10,16) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراكات",               date: iso(2025,10, 5) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي",             date: iso(2025,10, 2) },
    { type: "expense", amount: 45,   category: "education",     note: "كورس لغة إنجليزية",      date: iso(2025,10, 8) },
    { type: "expense", amount: 100,  category: "savings",       note: "تحويل للادخار",          date: iso(2025,10,26) },

    // ══════════════════════════════════════════════════════════
    // ── November 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب نوفمبر",            date: iso(2025,11,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار",                  date: iso(2025,11,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025,11,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025,11,27) },
    { type: "expense", amount: 25,   category: "bills",         note: "كهرباء ومياه",           date: iso(2025,11,28) },
    { type: "expense", amount: 52.5, category: "food",          note: "بقالة لولو",             date: iso(2025,11, 3) },
    { type: "expense", amount: 18.3, category: "food",          note: "مطعم الشاورما",          date: iso(2025,11, 7) },
    { type: "expense", amount: 12,   category: "food",          note: "كافيه",                  date: iso(2025,11,10) },
    { type: "expense", amount: 14,   category: "food",          note: "فطور خارجي",             date: iso(2025,11,22) },
    { type: "expense", amount: 30,   category: "transport",     note: "وقود",                   date: iso(2025,11,15) },
    { type: "expense", amount: 45,   category: "shopping",      note: "ملابس",                  date: iso(2025,11,18) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراك نتفليكس + سبوتيفاي", date: iso(2025,11, 5) },
    { type: "expense", amount: 35,   category: "health",        note: "صيدلية",                 date: iso(2025,11,20) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي",             date: iso(2025,11, 2) },
    { type: "expense", amount: 100,  category: "savings",       note: "تحويل للادخار",          date: iso(2025,11,26) },

    // ══════════════════════════════════════════════════════════
    // ── December 2025 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب ديسمبر",            date: iso(2025,12,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار",                  date: iso(2025,12,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2025,12,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2025,12,27) },
    { type: "expense", amount: 28,   category: "bills",         note: "كهرباء ومياه",           date: iso(2025,12,28) },
    { type: "expense", amount: 65,   category: "food",          note: "بقالة كارفور",           date: iso(2025,12, 4) },
    { type: "expense", amount: 25.5, category: "food",          note: "عشاء عائلي",             date: iso(2025,12,12) },
    { type: "expense", amount: 14,   category: "food",          note: "فطور",                   date: iso(2025,12,18) },
    { type: "expense", amount: 32,   category: "transport",     note: "وقود",                   date: iso(2025,12,10) },
    { type: "expense", amount: 85,   category: "shopping",      note: "هدايا رأس السنة",        date: iso(2025,12,22) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراكات شهرية",         date: iso(2025,12, 5) },
    { type: "expense", amount: 15,   category: "health",        note: "كشف طبي",                date: iso(2025,12,14) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي",             date: iso(2025,12, 2) },
    { type: "expense", amount: 20,   category: "education",     note: "كتب",                    date: iso(2025,12,20) },
    { type: "expense", amount: 100,  category: "savings",       note: "تحويل للادخار",          date: iso(2025,12,26) },
    { type: "income",  amount: 200,  category: "other",         note: "مكافأة نهاية السنة",     date: iso(2025,12,31) },

    // ══════════════════════════════════════════════════════════
    // ── January 2026 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب يناير",             date: iso(2026, 1,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار",                  date: iso(2026, 1,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2026, 1,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2026, 1,27) },
    { type: "expense", amount: 24,   category: "bills",         note: "كهرباء ومياه",           date: iso(2026, 1,28) },
    { type: "expense", amount: 48.5, category: "food",          note: "بقالة",                  date: iso(2026, 1, 6) },
    { type: "expense", amount: 21,   category: "food",          note: "غداء عمل",               date: iso(2026, 1,14) },
    { type: "expense", amount: 9.5,  category: "food",          note: "قهوة وعصير",             date: iso(2026, 1,20) },
    { type: "expense", amount: 16,   category: "food",          note: "بيتزا ليلة",             date: iso(2026, 1,24) },
    { type: "expense", amount: 33,   category: "transport",     note: "وقود",                   date: iso(2026, 1,12) },
    { type: "expense", amount: 55,   category: "shopping",      note: "أدوات منزلية",           date: iso(2026, 1,16) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراكات شهرية",         date: iso(2026, 1, 5) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي شهر",         date: iso(2026, 1, 2) },
    { type: "expense", amount: 35,   category: "education",     note: "كورس أونلاين",           date: iso(2026, 1, 8) },
    { type: "expense", amount: 120,  category: "savings",       note: "تحويل للادخار",          date: iso(2026, 1,26) },

    // ══════════════════════════════════════════════════════════
    // ── February 2026 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب فبراير",            date: iso(2026, 2,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار",                  date: iso(2026, 2,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2026, 2,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2026, 2,27) },
    { type: "expense", amount: 22,   category: "bills",         note: "كهرباء ومياه",           date: iso(2026, 2,28) },
    { type: "expense", amount: 57,   category: "food",          note: "بقالة أسبوعية",          date: iso(2026, 2, 5) },
    { type: "expense", amount: 17.8, category: "food",          note: "مطعم",                   date: iso(2026, 2,11) },
    { type: "expense", amount: 8,    category: "food",          note: "مشروبات",                date: iso(2026, 2,17) },
    { type: "expense", amount: 12.5, category: "food",          note: "وجبة سريعة",             date: iso(2026, 2,23) },
    { type: "expense", amount: 31,   category: "transport",     note: "وقود",                   date: iso(2026, 2, 9) },
    { type: "expense", amount: 42,   category: "shopping",      note: "عطور وعناية",            date: iso(2026, 2,14) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراكات شهرية",         date: iso(2026, 2, 5) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي",             date: iso(2026, 2, 2) },
    { type: "expense", amount: 40,   category: "health",        note: "تأمين طبي تكميلي",       date: iso(2026, 2,20) },
    { type: "expense", amount: 120,  category: "savings",       note: "تحويل للادخار",          date: iso(2026, 2,26) },

    // ══════════════════════════════════════════════════════════
    // ── March 2026 ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب مارس",              date: iso(2026, 3,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار",                  date: iso(2026, 3,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2026, 3,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2026, 3,27) },
    { type: "expense", amount: 26,   category: "bills",         note: "كهرباء ومياه",           date: iso(2026, 3,28) },
    { type: "expense", amount: 61,   category: "food",          note: "بقالة",                  date: iso(2026, 3, 4) },
    { type: "expense", amount: 23.5, category: "food",          note: "إفطار رمضان",            date: iso(2026, 3,10) },
    { type: "expense", amount: 19,   category: "food",          note: "سحور",                   date: iso(2026, 3,15) },
    { type: "expense", amount: 15,   category: "food",          note: "تمر وفواكه",             date: iso(2026, 3,20) },
    { type: "expense", amount: 35,   category: "transport",     note: "وقود",                   date: iso(2026, 3,12) },
    { type: "expense", amount: 75,   category: "shopping",      note: "ملابس رمضان",            date: iso(2026, 3,20) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراكات",               date: iso(2026, 3, 5) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي",             date: iso(2026, 3, 2) },
    { type: "expense", amount: 120,  category: "savings",       note: "تحويل للادخار",          date: iso(2026, 3,26) },
    { type: "income",  amount: 300,  category: "other",         note: "بونص رمضان",             date: iso(2026, 3,28) },

    // ══════════════════════════════════════════════════════════
    // ── April 2026 (current month) ──
    // ══════════════════════════════════════════════════════════
    { type: "income",  amount: 1200, category: "other",         note: "راتب أبريل",             date: iso(2026, 4,25) },
    { type: "expense", amount: 200,  category: "bills",         note: "إيجار",                  date: iso(2026, 4,26) },
    { type: "expense", amount: 95,   category: "transport",     note: "قسط سيارة",              date: iso(2026, 4,26) },
    { type: "expense", amount: 15,   category: "bills",         note: "إنترنت",                 date: iso(2026, 4,27) },
    { type: "expense", amount: 24,   category: "bills",         note: "كهرباء ومياه",           date: iso(2026, 4,27) },
    { type: "expense", amount: 63,   category: "food",          note: "بقالة الأسبوع",          date: iso(2026, 4, 3) },
    { type: "expense", amount: 29,   category: "food",          note: "عزومة عيد",              date: iso(2026, 4, 7) },
    { type: "expense", amount: 11.5, category: "food",          note: "كافيه",                  date: iso(2026, 4,14) },
    { type: "expense", amount: 17,   category: "food",          note: "غداء",                   date: iso(2026, 4,21) },
    { type: "expense", amount: 33,   category: "transport",     note: "وقود",                   date: iso(2026, 4,10) },
    { type: "expense", amount: 90,   category: "shopping",      note: "ملابس العيد",            date: iso(2026, 4, 2) },
    { type: "expense", amount: 22,   category: "entertainment", note: "اشتراكات",               date: iso(2026, 4, 5) },
    { type: "expense", amount: 28,   category: "health",        note: "نادي رياضي",             date: iso(2026, 4, 2) },
    { type: "expense", amount: 35,   category: "health",        note: "صيدلية العيد",           date: iso(2026, 4,12) },
    { type: "expense", amount: 120,  category: "savings",       note: "تحويل للادخار",          date: iso(2026, 4,26) },
    { type: "income",  amount: 250,  category: "other",         note: "عيدية من الأهل",         date: iso(2026, 4, 1) },
  ];

  return rows.map((r) => ({
    ...r,
    id: uid(),
    createdAt: r.date,
  }));
}

// ─── Goals ────────────────────────────────────────────────────────────────────

function makeGoals(): SavingsGoal[] {
  return [
    {
      id: uid(),
      name: "سيارة جديدة",
      targetAmount: 5000,
      savedAmount: 2400,
      targetDate: iso(2027, 6, 1),
      icon: "car",
      createdAt: iso(2025, 5, 1),
    },
    {
      id: uid(),
      name: "رحلة إلى تركيا",
      targetAmount: 800,
      savedAmount: 680,
      targetDate: iso(2026, 8, 1),
      icon: "plane",
      createdAt: iso(2025, 9, 1),
    },
    {
      id: uid(),
      name: "صندوق الطوارئ",
      targetAmount: 3000,
      savedAmount: 2400,
      targetDate: undefined,
      icon: "shield",
      createdAt: iso(2025, 5, 1),
    },
    {
      id: uid(),
      name: "لابتوب جديد",
      targetAmount: 400,
      savedAmount: 400,
      targetDate: iso(2026, 3, 1),
      icon: "laptop",
      createdAt: iso(2025,10, 1),
    },
    {
      id: uid(),
      name: "مكتبة منزلية",
      targetAmount: 250,
      savedAmount: 110,
      targetDate: iso(2026, 9, 1),
      icon: "book",
      createdAt: iso(2025,11, 1),
    },
    {
      id: uid(),
      name: "دورة تدريبية متقدمة",
      targetAmount: 500,
      savedAmount: 200,
      targetDate: iso(2026,10, 1),
      icon: "star",
      createdAt: iso(2026, 1, 10),
    },
    {
      id: uid(),
      name: "تجديد غرفة النوم",
      targetAmount: 1200,
      savedAmount: 350,
      targetDate: iso(2027, 1, 1),
      icon: "home",
      createdAt: iso(2026, 2, 1),
    },
    {
      id: uid(),
      name: "ساعة ذكية",
      targetAmount: 150,
      savedAmount: 150,
      targetDate: iso(2025,12, 1),
      icon: "star",
      createdAt: iso(2025, 8, 1),
    },
  ];
}

// ─── Financial Month Config ───────────────────────────────────────────────────

function makeFinancialMonthConfig(): FinancialMonthConfig {
  return {
    salaryDay: 25,
    reminderDaysBefore: 3,
    fixedExpenses: [
      { id: uid(), name: "إيجار",           amount: 200, category: "bills",         isRecurring: true },
      { id: uid(), name: "قسط السيارة",    amount: 95,  category: "transport",     isRecurring: true },
      { id: uid(), name: "إنترنت",          amount: 15,  category: "bills",         isRecurring: true },
      { id: uid(), name: "كهرباء ومياه",   amount: 25,  category: "bills",         isRecurring: true },
      { id: uid(), name: "اشتراكات رقمية",  amount: 22,  category: "entertainment", isRecurring: true },
      { id: uid(), name: "نادي رياضي",      amount: 28,  category: "health",        isRecurring: true },
      { id: uid(), name: "تأمين سيارة",    amount: 18,  category: "transport",     isRecurring: true },
    ],
  };
}

// ─── Investment Plan ──────────────────────────────────────────────────────────

function makeAdvisorData(): {
  answers: AdvisorAnswers;
  plan: InvestmentPlan;
} {
  const answers: AdvisorAnswers = {
    monthlyIncome: 1200,
    monthlyExpenses: 700,
    ageRange: "26-35",
    goals: ["wealth", "retirement"],
    riskTolerance: "medium",
    hasExperience: true,
  };

  const plan: InvestmentPlan = {
    monthlyTarget: 120,
    riskLevel: "medium",
    timelineYears: 7,
    allocation: {
      stocks: 35,
      sukuk: 30,
      gold: 20,
      realEstate: 10,
      cash: 5,
    },
    tips: [
      "advisor.tips.diversify",
      "advisor.tips.longTerm",
      "advisor.tips.emergency",
      "advisor.tips.sukuk",
    ],
  };

  return { answers, plan };
}

// ─── Points / Level ───────────────────────────────────────────────────────────

function makePoints() {
  const history = [
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2026, 4, 29) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2026, 4, 29) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2026, 4, 27) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2026, 4, 28) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2026, 4, 26) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2026, 4, 27) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2026, 4, 20) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2026, 4, 15) },
    { id: uid(), reason: "complete_challenge", amount: 25, date: iso(2026, 4, 10) },
    { id: uid(), reason: "charity_donation",   amount: 15, date: iso(2026, 4,  5) },
    { id: uid(), reason: "complete_challenge", amount: 25, date: iso(2026, 3, 28) },
    { id: uid(), reason: "goal_reached",       amount: 50, date: iso(2026, 3, 20) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2026, 3, 15) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2026, 3, 10) },
    { id: uid(), reason: "charity_donation",   amount: 15, date: iso(2026, 3,  5) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2026, 2, 25) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2026, 2, 20) },
    { id: uid(), reason: "charity_donation",   amount: 15, date: iso(2026, 2, 15) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2026, 2, 10) },
    { id: uid(), reason: "complete_challenge", amount: 25, date: iso(2026, 2,  1) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2026, 1, 25) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2026, 1, 20) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2026, 1, 15) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2026, 1, 10) },
    { id: uid(), reason: "goal_reached",       amount: 50, date: iso(2025,12, 28) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2025,12, 20) },
    { id: uid(), reason: "charity_donation",   amount: 15, date: iso(2025,12, 15) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2025,12, 10) },
    { id: uid(), reason: "complete_challenge", amount: 25, date: iso(2025,12,  5) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2025,11, 25) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2025,11, 15) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2025,11, 10) },
    { id: uid(), reason: "complete_challenge", amount: 25, date: iso(2025,10, 28) },
    { id: uid(), reason: "goal_reached",       amount: 50, date: iso(2025,10, 20) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2025,10, 10) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2025, 9, 20) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2025, 9, 15) },
    { id: uid(), reason: "charity_donation",   amount: 15, date: iso(2025, 9,  5) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2025, 8, 20) },
    { id: uid(), reason: "complete_challenge", amount: 25, date: iso(2025, 8, 10) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2025, 7, 25) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2025, 7, 15) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2025, 6, 20) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2025, 6, 10) },
    { id: uid(), reason: "complete_challenge", amount: 25, date: iso(2025, 5, 25) },
    { id: uid(), reason: "daily_login",        amount: 10, date: iso(2025, 5, 15) },
    { id: uid(), reason: "add_transaction",    amount: 5,  date: iso(2025, 5,  5) },
    { id: uid(), reason: "complete_lesson",    amount: 20, date: iso(2025, 5,  1) },
  ];

  const totalPoints = history.reduce((s, h) => s + h.amount, 0);
  const level = Math.floor(totalPoints / 100) + 1;

  return { totalPoints, level, history };
}

// ─── Charity ──────────────────────────────────────────────────────────────────

function makeCharity(): CharityEntry[] {
  return [
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة جمعة",          date: iso(2026, 4, 24) },
    { id: uid(), amount: 5,   type: "sadaqah", note: "إطعام",              date: iso(2026, 4, 17) },
    { id: uid(), amount: 30,  type: "zakat",   note: "زكاة المال",         date: iso(2026, 4,  5) },
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة أسبوعية",       date: iso(2026, 3, 28) },
    { id: uid(), amount: 50,  type: "zakat",   note: "زكاة الفطر للعائلة", date: iso(2026, 3, 29) },
    { id: uid(), amount: 15,  type: "sadaqah", note: "تبرع لمسجد",         date: iso(2026, 3, 15) },
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة",               date: iso(2026, 2, 20) },
    { id: uid(), amount: 20,  type: "other",   note: "تبرع لجمعية خيرية",  date: iso(2026, 2,  5) },
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة",               date: iso(2026, 1, 14) },
    { id: uid(), amount: 25,  type: "sadaqah", note: "إعانة أسرة",         date: iso(2025,12, 20) },
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة جمعة",          date: iso(2025,12,  5) },
    { id: uid(), amount: 15,  type: "sadaqah", note: "صدقة",               date: iso(2025,11, 21) },
    { id: uid(), amount: 30,  type: "other",   note: "تبرع لكفالة يتيم",   date: iso(2025,11,  1) },
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة أسبوعية",       date: iso(2025,10, 17) },
    { id: uid(), amount: 20,  type: "sadaqah", note: "إطعام محتاجين",       date: iso(2025, 9, 12) },
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة",               date: iso(2025, 8, 22) },
    { id: uid(), amount: 15,  type: "sadaqah", note: "صدقة جمعة",          date: iso(2025, 7, 11) },
    { id: uid(), amount: 25,  type: "other",   note: "تبرع خيري",          date: iso(2025, 6,  5) },
    { id: uid(), amount: 10,  type: "sadaqah", note: "صدقة",               date: iso(2025, 5, 16) },
  ];
}

// ─── Category Budgets ─────────────────────────────────────────────────────────

function makeCategoryBudgets() {
  return [
    { category: "food",          limit: 150 },
    { category: "transport",     limit: 130 },
    { category: "shopping",      limit: 80  },
    { category: "entertainment", limit: 40  },
    { category: "health",        limit: 60  },
    { category: "education",     limit: 50  },
    { category: "bills",         limit: 290 },
    { category: "savings",       limit: 130 },
  ];
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function loadDemoData() {
  const transactions = makeTransactions();
  const goals = makeGoals();
  const config = makeFinancialMonthConfig();
  const { answers, plan } = makeAdvisorData();
  const points = makePoints();
  const charity = makeCharity();
  const categoryBudgets = makeCategoryBudgets();

  // budget store
  localStorage.setItem(
    "budget-buddy-budget",
    JSON.stringify({
      state: {
        transactions,
        monthlyIncome: 1200,
        categoryBudgets,
      },
      version: 0,
    }),
  );

  // goals store
  localStorage.setItem(
    "budget-buddy-goals",
    JSON.stringify({ state: { goals }, version: 0 }),
  );

  // financial month store
  localStorage.setItem(
    "budget-buddy-financial-month",
    JSON.stringify({
      state: { config, isConfigured: true },
      version: 0,
    }),
  );

  // advisor store
  localStorage.setItem(
    "budget-buddy-advisor",
    JSON.stringify({
      state: { answers, plan, step: 0 },
      version: 0,
    }),
  );

  // points store
  localStorage.setItem(
    "budget-buddy-points",
    JSON.stringify({ state: points, version: 0 }),
  );

  // charity store
  localStorage.setItem(
    "budget-buddy-charity",
    JSON.stringify({ state: { entries: charity }, version: 0 }),
  );

  // profile store — update income only, keep name/language as-is
  try {
    const raw = localStorage.getItem("budget-buddy-profile");
    const existing = raw ? JSON.parse(raw) : { state: {} };
    existing.state.monthlyIncome = 1200;
    existing.state.onboardingCompleted = true;
    localStorage.setItem("budget-buddy-profile", JSON.stringify(existing));
  } catch {
    localStorage.setItem(
      "budget-buddy-profile",
      JSON.stringify({
        state: {
          name: "محمد",
          monthlyIncome: 1200,
          darkMode: false,
          language: "ar",
          onboardingCompleted: true,
          salaryDay: 25,
          savingsGoalPercent: 20,
          currencyDisplay: "symbol",
          notificationsEnabled: false,
        },
        version: 0,
      }),
    );
  }

  // reload to let Zustand rehydrate all stores
  window.location.reload();
}

export function clearAllData() {
  const keys = [
    "budget-buddy-budget",
    "budget-buddy-goals",
    "budget-buddy-financial-month",
    "budget-buddy-advisor",
    "budget-buddy-points",
    "budget-buddy-charity",
    "budget-buddy-achievements",
    "budget-buddy-challenges",
    "budget-buddy-streak",
  ];
  keys.forEach((k) => localStorage.removeItem(k));
  window.location.reload();
}
