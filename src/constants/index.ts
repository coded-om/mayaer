import type { Category, Achievement, Badge, EducationLesson } from "@/types";

export const NISAB_GOLD_GRAMS = 85;
export const GOLD_PRICE_OMR = 26.5;
export const SILVER_PRICE_OMR = 0.33;
export const NISAB_VALUE = NISAB_GOLD_GRAMS * GOLD_PRICE_OMR; // 2252.5 ر.ع
export const ZAKAT_RATE = 0.025; // 2.5%
export const STREAK_FREEZE_LIMIT = 1; // مرة واحدة في الأسبوع

export const ALPHA_VANTAGE_BASE_URL = "https://www.alphavantage.co/query";

export const CATEGORIES: Category[] = [
  {
    id: "food",
    label: "أكل ومشروبات",
    icon: "TbToolsKitchen2",
    color: "#EF4444",
  },
  { id: "transport", label: "مواصلات", icon: "TbCar", color: "#F97316" },
  {
    id: "entertainment",
    label: "ترفيه",
    icon: "TbDeviceGamepad2",
    color: "#8B5CF6",
  },
  { id: "health", label: "صحة", icon: "TbHeartbeat", color: "#22C55E" },
  { id: "shopping", label: "تسوق", icon: "TbShoppingBag", color: "#3B82F6" },
  { id: "education", label: "تعليم", icon: "TbBook", color: "#06B6D4" },
  { id: "savings", label: "ادخار", icon: "TbMoneybag", color: "#1F7A63" },
  { id: "bills", label: "فواتير", icon: "TbFileInvoice", color: "#6B7280" },
  { id: "other", label: "أخرى", icon: "TbDots", color: "#9CA3AF" },
];

// ── Achievements ──
export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_transaction",
    titleKey: "rewards.ach_first_transaction",
    descriptionKey: "rewards.ach_first_transaction_desc",
    icon: "TbReceipt",
    condition: "first_transaction",
  },
  {
    id: "first_goal",
    titleKey: "rewards.ach_first_goal",
    descriptionKey: "rewards.ach_first_goal_desc",
    icon: "TbTarget",
    condition: "first_goal",
  },
  {
    id: "streak_7",
    titleKey: "rewards.ach_streak_7",
    descriptionKey: "rewards.ach_streak_7_desc",
    icon: "TbFlame",
    condition: "streak_7",
  },
  {
    id: "streak_30",
    titleKey: "rewards.ach_streak_30",
    descriptionKey: "rewards.ach_streak_30_desc",
    icon: "TbFlame",
    condition: "streak_30",
  },
  {
    id: "points_100",
    titleKey: "rewards.ach_points_100",
    descriptionKey: "rewards.ach_points_100_desc",
    icon: "TbStar",
    condition: "points_100",
  },
  {
    id: "points_500",
    titleKey: "rewards.ach_points_500",
    descriptionKey: "rewards.ach_points_500_desc",
    icon: "TbStarFilled",
    condition: "points_500",
  },
  {
    id: "complete_course",
    titleKey: "rewards.ach_complete_course",
    descriptionKey: "rewards.ach_complete_course_desc",
    icon: "TbSchool",
    condition: "complete_course",
  },
  {
    id: "budget_master",
    titleKey: "rewards.ach_budget_master",
    descriptionKey: "rewards.ach_budget_master_desc",
    icon: "TbCrown",
    condition: "budget_master",
  },
  {
    id: "charity_giver",
    titleKey: "rewards.ach_charity_giver",
    descriptionKey: "rewards.ach_charity_giver_desc",
    icon: "TbHeart",
    condition: "charity_giver",
  },
  {
    id: "zakat_paid",
    titleKey: "rewards.ach_zakat_paid",
    descriptionKey: "rewards.ach_zakat_paid_desc",
    icon: "TbMoonStars",
    condition: "zakat_paid",
  },
  {
    id: "all_categories",
    titleKey: "rewards.ach_all_categories",
    descriptionKey: "rewards.ach_all_categories_desc",
    icon: "TbCategory",
    condition: "all_categories",
  },
  {
    id: "investment_profit",
    titleKey: "rewards.ach_investment_profit",
    descriptionKey: "rewards.ach_investment_profit_desc",
    icon: "TbTrendingUp",
    condition: "investment_profit",
  },
];

// ── Badges ──
export const BADGES: Badge[] = [
  {
    id: "bronze_saver",
    nameKey: "rewards.badge_bronze",
    icon: "🥉",
    tier: "bronze",
    requiredPoints: 50,
  },
  {
    id: "silver_saver",
    nameKey: "rewards.badge_silver",
    icon: "🥈",
    tier: "silver",
    requiredPoints: 200,
  },
  {
    id: "gold_saver",
    nameKey: "rewards.badge_gold",
    icon: "🥇",
    tier: "gold",
    requiredPoints: 500,
  },
  {
    id: "bronze_investor",
    nameKey: "rewards.badge_bronze_investor",
    icon: "📈",
    tier: "bronze",
    requiredPoints: 100,
  },
  {
    id: "silver_investor",
    nameKey: "rewards.badge_silver_investor",
    icon: "📊",
    tier: "silver",
    requiredPoints: 300,
  },
  {
    id: "gold_investor",
    nameKey: "rewards.badge_gold_investor",
    icon: "💎",
    tier: "gold",
    requiredPoints: 750,
  },
];

// ── Education Lessons ──
export const EDUCATION_LESSONS: EducationLesson[] = [
  {
    id: "budgeting_basics",
    titleKey: "education.lesson_budgeting_title",
    descriptionKey: "education.lesson_budgeting_desc",
    category: "budgeting",
    pointsReward: 20,
    steps: [
      { id: "bb_1", contentKey: "education.bb_step1", type: "text" },
      { id: "bb_2", contentKey: "education.bb_step2", type: "tip" },
      {
        id: "bb_3",
        contentKey: "education.bb_step3",
        type: "quiz",
        quizOptions: [
          "education.bb_q1_a",
          "education.bb_q1_b",
          "education.bb_q1_c",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "saving_strategies",
    titleKey: "education.lesson_saving_title",
    descriptionKey: "education.lesson_saving_desc",
    category: "saving",
    pointsReward: 20,
    steps: [
      { id: "ss_1", contentKey: "education.ss_step1", type: "text" },
      { id: "ss_2", contentKey: "education.ss_step2", type: "tip" },
      {
        id: "ss_3",
        contentKey: "education.ss_step3",
        type: "quiz",
        quizOptions: [
          "education.ss_q1_a",
          "education.ss_q1_b",
          "education.ss_q1_c",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "investment_intro",
    titleKey: "education.lesson_invest_title",
    descriptionKey: "education.lesson_invest_desc",
    category: "investing",
    pointsReward: 25,
    steps: [
      { id: "ii_1", contentKey: "education.ii_step1", type: "text" },
      { id: "ii_2", contentKey: "education.ii_step2", type: "text" },
      { id: "ii_3", contentKey: "education.ii_step3", type: "tip" },
      {
        id: "ii_4",
        contentKey: "education.ii_step4",
        type: "quiz",
        quizOptions: [
          "education.ii_q1_a",
          "education.ii_q1_b",
          "education.ii_q1_c",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "zakat_rules",
    titleKey: "education.lesson_zakat_title",
    descriptionKey: "education.lesson_zakat_desc",
    category: "islamic_finance",
    pointsReward: 20,
    steps: [
      { id: "zr_1", contentKey: "education.zr_step1", type: "text" },
      { id: "zr_2", contentKey: "education.zr_step2", type: "tip" },
      {
        id: "zr_3",
        contentKey: "education.zr_step3",
        type: "quiz",
        quizOptions: [
          "education.zr_q1_a",
          "education.zr_q1_b",
          "education.zr_q1_c",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "debt_management",
    titleKey: "education.lesson_debt_title",
    descriptionKey: "education.lesson_debt_desc",
    category: "budgeting",
    pointsReward: 20,
    steps: [
      { id: "dm_1", contentKey: "education.dm_step1", type: "text" },
      { id: "dm_2", contentKey: "education.dm_step2", type: "tip" },
      {
        id: "dm_3",
        contentKey: "education.dm_step3",
        type: "quiz",
        quizOptions: [
          "education.dm_q1_a",
          "education.dm_q1_b",
          "education.dm_q1_c",
        ],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "emergency_fund",
    titleKey: "education.lesson_emergency_title",
    descriptionKey: "education.lesson_emergency_desc",
    category: "saving",
    pointsReward: 20,
    steps: [
      { id: "ef_1", contentKey: "education.ef_step1", type: "text" },
      { id: "ef_2", contentKey: "education.ef_step2", type: "tip" },
      {
        id: "ef_3",
        contentKey: "education.ef_step3",
        type: "quiz",
        quizOptions: [
          "education.ef_q1_a",
          "education.ef_q1_b",
          "education.ef_q1_c",
        ],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "compound_interest",
    titleKey: "education.lesson_compound_title",
    descriptionKey: "education.lesson_compound_desc",
    category: "investing",
    pointsReward: 25,
    steps: [
      { id: "ci_1", contentKey: "education.ci_step1", type: "text" },
      { id: "ci_2", contentKey: "education.ci_step2", type: "text" },
      { id: "ci_3", contentKey: "education.ci_step3", type: "tip" },
      {
        id: "ci_4",
        contentKey: "education.ci_step4",
        type: "quiz",
        quizOptions: [
          "education.ci_q1_a",
          "education.ci_q1_b",
          "education.ci_q1_c",
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    id: "islamic_finance",
    titleKey: "education.lesson_islamic_title",
    descriptionKey: "education.lesson_islamic_desc",
    category: "islamic_finance",
    pointsReward: 25,
    steps: [
      { id: "if_1", contentKey: "education.if_step1", type: "text" },
      { id: "if_2", contentKey: "education.if_step2", type: "text" },
      { id: "if_3", contentKey: "education.if_step3", type: "tip" },
      {
        id: "if_4",
        contentKey: "education.if_step4",
        type: "quiz",
        quizOptions: [
          "education.if_q1_a",
          "education.if_q1_b",
          "education.if_q1_c",
        ],
        correctAnswer: 0,
      },
    ],
  },
];
