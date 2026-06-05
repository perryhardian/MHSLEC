-- AlterTable
ALTER TABLE "users" ADD COLUMN "expected_daily_spend" DECIMAL(14,2);

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN "daily_expense_setting_id" TEXT,
ADD COLUMN "generated_for_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "savings_contributions" ADD COLUMN "auto_savings_setting_id" TEXT,
ADD COLUMN "generated_for_date" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "daily_expense_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Kebutuhan harian',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL,
    "frozen_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_expense_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auto_savings_settings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "savings_goal_id" TEXT NOT NULL,
    "amount" DECIMAL(14,2) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3) NOT NULL,
    "frozen_until" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "auto_savings_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "daily_expense_settings_user_id_key" ON "daily_expense_settings"("user_id");

-- CreateIndex
CREATE INDEX "daily_expense_settings_category_id_idx" ON "daily_expense_settings"("category_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_daily_expense_setting_id_generated_for_date_key" ON "transactions"("daily_expense_setting_id", "generated_for_date");

-- CreateIndex
CREATE UNIQUE INDEX "auto_savings_settings_user_id_savings_goal_id_key" ON "auto_savings_settings"("user_id", "savings_goal_id");

-- CreateIndex
CREATE INDEX "auto_savings_settings_savings_goal_id_idx" ON "auto_savings_settings"("savings_goal_id");

-- CreateIndex
CREATE UNIQUE INDEX "savings_contributions_auto_savings_setting_id_generated_for_date_key" ON "savings_contributions"("auto_savings_setting_id", "generated_for_date");

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_daily_expense_setting_id_fkey" FOREIGN KEY ("daily_expense_setting_id") REFERENCES "daily_expense_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "savings_contributions" ADD CONSTRAINT "savings_contributions_auto_savings_setting_id_fkey" FOREIGN KEY ("auto_savings_setting_id") REFERENCES "auto_savings_settings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_expense_settings" ADD CONSTRAINT "daily_expense_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_expense_settings" ADD CONSTRAINT "daily_expense_settings_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_savings_settings" ADD CONSTRAINT "auto_savings_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auto_savings_settings" ADD CONSTRAINT "auto_savings_settings_savings_goal_id_fkey" FOREIGN KEY ("savings_goal_id") REFERENCES "savings_goals"("id") ON DELETE CASCADE ON UPDATE CASCADE;
