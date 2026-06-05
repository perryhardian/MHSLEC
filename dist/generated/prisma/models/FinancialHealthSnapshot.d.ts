import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type FinancialHealthSnapshotModel = runtime.Types.Result.DefaultSelection<Prisma.$FinancialHealthSnapshotPayload>;
export type AggregateFinancialHealthSnapshot = {
    _count: FinancialHealthSnapshotCountAggregateOutputType | null;
    _avg: FinancialHealthSnapshotAvgAggregateOutputType | null;
    _sum: FinancialHealthSnapshotSumAggregateOutputType | null;
    _min: FinancialHealthSnapshotMinAggregateOutputType | null;
    _max: FinancialHealthSnapshotMaxAggregateOutputType | null;
};
export type FinancialHealthSnapshotAvgAggregateOutputType = {
    score: number | null;
    month: number | null;
    year: number | null;
    totalIncome: runtime.Decimal | null;
    totalExpense: runtime.Decimal | null;
    remainingMoney: runtime.Decimal | null;
    savingsProgressRate: runtime.Decimal | null;
};
export type FinancialHealthSnapshotSumAggregateOutputType = {
    score: number | null;
    month: number | null;
    year: number | null;
    totalIncome: runtime.Decimal | null;
    totalExpense: runtime.Decimal | null;
    remainingMoney: runtime.Decimal | null;
    savingsProgressRate: runtime.Decimal | null;
};
export type FinancialHealthSnapshotMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    score: number | null;
    month: number | null;
    year: number | null;
    totalIncome: runtime.Decimal | null;
    totalExpense: runtime.Decimal | null;
    remainingMoney: runtime.Decimal | null;
    savingsProgressRate: runtime.Decimal | null;
    createdAt: Date | null;
};
export type FinancialHealthSnapshotMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    score: number | null;
    month: number | null;
    year: number | null;
    totalIncome: runtime.Decimal | null;
    totalExpense: runtime.Decimal | null;
    remainingMoney: runtime.Decimal | null;
    savingsProgressRate: runtime.Decimal | null;
    createdAt: Date | null;
};
export type FinancialHealthSnapshotCountAggregateOutputType = {
    id: number;
    userId: number;
    score: number;
    month: number;
    year: number;
    totalIncome: number;
    totalExpense: number;
    remainingMoney: number;
    savingsProgressRate: number;
    createdAt: number;
    _all: number;
};
export type FinancialHealthSnapshotAvgAggregateInputType = {
    score?: true;
    month?: true;
    year?: true;
    totalIncome?: true;
    totalExpense?: true;
    remainingMoney?: true;
    savingsProgressRate?: true;
};
export type FinancialHealthSnapshotSumAggregateInputType = {
    score?: true;
    month?: true;
    year?: true;
    totalIncome?: true;
    totalExpense?: true;
    remainingMoney?: true;
    savingsProgressRate?: true;
};
export type FinancialHealthSnapshotMinAggregateInputType = {
    id?: true;
    userId?: true;
    score?: true;
    month?: true;
    year?: true;
    totalIncome?: true;
    totalExpense?: true;
    remainingMoney?: true;
    savingsProgressRate?: true;
    createdAt?: true;
};
export type FinancialHealthSnapshotMaxAggregateInputType = {
    id?: true;
    userId?: true;
    score?: true;
    month?: true;
    year?: true;
    totalIncome?: true;
    totalExpense?: true;
    remainingMoney?: true;
    savingsProgressRate?: true;
    createdAt?: true;
};
export type FinancialHealthSnapshotCountAggregateInputType = {
    id?: true;
    userId?: true;
    score?: true;
    month?: true;
    year?: true;
    totalIncome?: true;
    totalExpense?: true;
    remainingMoney?: true;
    savingsProgressRate?: true;
    createdAt?: true;
    _all?: true;
};
export type FinancialHealthSnapshotAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    orderBy?: Prisma.FinancialHealthSnapshotOrderByWithRelationInput | Prisma.FinancialHealthSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FinancialHealthSnapshotCountAggregateInputType;
    _avg?: FinancialHealthSnapshotAvgAggregateInputType;
    _sum?: FinancialHealthSnapshotSumAggregateInputType;
    _min?: FinancialHealthSnapshotMinAggregateInputType;
    _max?: FinancialHealthSnapshotMaxAggregateInputType;
};
export type GetFinancialHealthSnapshotAggregateType<T extends FinancialHealthSnapshotAggregateArgs> = {
    [P in keyof T & keyof AggregateFinancialHealthSnapshot]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFinancialHealthSnapshot[P]> : Prisma.GetScalarType<T[P], AggregateFinancialHealthSnapshot[P]>;
};
export type FinancialHealthSnapshotGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    orderBy?: Prisma.FinancialHealthSnapshotOrderByWithAggregationInput | Prisma.FinancialHealthSnapshotOrderByWithAggregationInput[];
    by: Prisma.FinancialHealthSnapshotScalarFieldEnum[] | Prisma.FinancialHealthSnapshotScalarFieldEnum;
    having?: Prisma.FinancialHealthSnapshotScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FinancialHealthSnapshotCountAggregateInputType | true;
    _avg?: FinancialHealthSnapshotAvgAggregateInputType;
    _sum?: FinancialHealthSnapshotSumAggregateInputType;
    _min?: FinancialHealthSnapshotMinAggregateInputType;
    _max?: FinancialHealthSnapshotMaxAggregateInputType;
};
export type FinancialHealthSnapshotGroupByOutputType = {
    id: string;
    userId: string;
    score: number;
    month: number;
    year: number;
    totalIncome: runtime.Decimal;
    totalExpense: runtime.Decimal;
    remainingMoney: runtime.Decimal;
    savingsProgressRate: runtime.Decimal;
    createdAt: Date;
    _count: FinancialHealthSnapshotCountAggregateOutputType | null;
    _avg: FinancialHealthSnapshotAvgAggregateOutputType | null;
    _sum: FinancialHealthSnapshotSumAggregateOutputType | null;
    _min: FinancialHealthSnapshotMinAggregateOutputType | null;
    _max: FinancialHealthSnapshotMaxAggregateOutputType | null;
};
export type GetFinancialHealthSnapshotGroupByPayload<T extends FinancialHealthSnapshotGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FinancialHealthSnapshotGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FinancialHealthSnapshotGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FinancialHealthSnapshotGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FinancialHealthSnapshotGroupByOutputType[P]>;
}>>;
export type FinancialHealthSnapshotWhereInput = {
    AND?: Prisma.FinancialHealthSnapshotWhereInput | Prisma.FinancialHealthSnapshotWhereInput[];
    OR?: Prisma.FinancialHealthSnapshotWhereInput[];
    NOT?: Prisma.FinancialHealthSnapshotWhereInput | Prisma.FinancialHealthSnapshotWhereInput[];
    id?: Prisma.StringFilter<"FinancialHealthSnapshot"> | string;
    userId?: Prisma.StringFilter<"FinancialHealthSnapshot"> | string;
    score?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    month?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    year?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    totalIncome?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"FinancialHealthSnapshot"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type FinancialHealthSnapshotOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalIncome?: Prisma.SortOrder;
    totalExpense?: Prisma.SortOrder;
    remainingMoney?: Prisma.SortOrder;
    savingsProgressRate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type FinancialHealthSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_month_year?: Prisma.FinancialHealthSnapshotUserIdMonthYearCompoundUniqueInput;
    AND?: Prisma.FinancialHealthSnapshotWhereInput | Prisma.FinancialHealthSnapshotWhereInput[];
    OR?: Prisma.FinancialHealthSnapshotWhereInput[];
    NOT?: Prisma.FinancialHealthSnapshotWhereInput | Prisma.FinancialHealthSnapshotWhereInput[];
    userId?: Prisma.StringFilter<"FinancialHealthSnapshot"> | string;
    score?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    month?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    year?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    totalIncome?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"FinancialHealthSnapshot"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id" | "userId_month_year">;
export type FinancialHealthSnapshotOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalIncome?: Prisma.SortOrder;
    totalExpense?: Prisma.SortOrder;
    remainingMoney?: Prisma.SortOrder;
    savingsProgressRate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.FinancialHealthSnapshotCountOrderByAggregateInput;
    _avg?: Prisma.FinancialHealthSnapshotAvgOrderByAggregateInput;
    _max?: Prisma.FinancialHealthSnapshotMaxOrderByAggregateInput;
    _min?: Prisma.FinancialHealthSnapshotMinOrderByAggregateInput;
    _sum?: Prisma.FinancialHealthSnapshotSumOrderByAggregateInput;
};
export type FinancialHealthSnapshotScalarWhereWithAggregatesInput = {
    AND?: Prisma.FinancialHealthSnapshotScalarWhereWithAggregatesInput | Prisma.FinancialHealthSnapshotScalarWhereWithAggregatesInput[];
    OR?: Prisma.FinancialHealthSnapshotScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FinancialHealthSnapshotScalarWhereWithAggregatesInput | Prisma.FinancialHealthSnapshotScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"FinancialHealthSnapshot"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"FinancialHealthSnapshot"> | string;
    score?: Prisma.IntWithAggregatesFilter<"FinancialHealthSnapshot"> | number;
    month?: Prisma.IntWithAggregatesFilter<"FinancialHealthSnapshot"> | number;
    year?: Prisma.IntWithAggregatesFilter<"FinancialHealthSnapshot"> | number;
    totalIncome?: Prisma.DecimalWithAggregatesFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalWithAggregatesFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalWithAggregatesFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalWithAggregatesFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"FinancialHealthSnapshot"> | Date | string;
};
export type FinancialHealthSnapshotCreateInput = {
    id?: string;
    score: number;
    month: number;
    year: number;
    totalIncome: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney: runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutFinancialHealthSnapshotsInput;
};
export type FinancialHealthSnapshotUncheckedCreateInput = {
    id?: string;
    userId: string;
    score: number;
    month: number;
    year: number;
    totalIncome: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney: runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type FinancialHealthSnapshotUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalIncome?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutFinancialHealthSnapshotsNestedInput;
};
export type FinancialHealthSnapshotUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalIncome?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FinancialHealthSnapshotCreateManyInput = {
    id?: string;
    userId: string;
    score: number;
    month: number;
    year: number;
    totalIncome: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney: runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type FinancialHealthSnapshotUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalIncome?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FinancialHealthSnapshotUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalIncome?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FinancialHealthSnapshotListRelationFilter = {
    every?: Prisma.FinancialHealthSnapshotWhereInput;
    some?: Prisma.FinancialHealthSnapshotWhereInput;
    none?: Prisma.FinancialHealthSnapshotWhereInput;
};
export type FinancialHealthSnapshotOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FinancialHealthSnapshotUserIdMonthYearCompoundUniqueInput = {
    userId: string;
    month: number;
    year: number;
};
export type FinancialHealthSnapshotCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalIncome?: Prisma.SortOrder;
    totalExpense?: Prisma.SortOrder;
    remainingMoney?: Prisma.SortOrder;
    savingsProgressRate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FinancialHealthSnapshotAvgOrderByAggregateInput = {
    score?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalIncome?: Prisma.SortOrder;
    totalExpense?: Prisma.SortOrder;
    remainingMoney?: Prisma.SortOrder;
    savingsProgressRate?: Prisma.SortOrder;
};
export type FinancialHealthSnapshotMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalIncome?: Prisma.SortOrder;
    totalExpense?: Prisma.SortOrder;
    remainingMoney?: Prisma.SortOrder;
    savingsProgressRate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FinancialHealthSnapshotMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    score?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalIncome?: Prisma.SortOrder;
    totalExpense?: Prisma.SortOrder;
    remainingMoney?: Prisma.SortOrder;
    savingsProgressRate?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type FinancialHealthSnapshotSumOrderByAggregateInput = {
    score?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalIncome?: Prisma.SortOrder;
    totalExpense?: Prisma.SortOrder;
    remainingMoney?: Prisma.SortOrder;
    savingsProgressRate?: Prisma.SortOrder;
};
export type FinancialHealthSnapshotCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput> | Prisma.FinancialHealthSnapshotCreateWithoutUserInput[] | Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput | Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FinancialHealthSnapshotCreateManyUserInputEnvelope;
    connect?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
};
export type FinancialHealthSnapshotUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput> | Prisma.FinancialHealthSnapshotCreateWithoutUserInput[] | Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput | Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.FinancialHealthSnapshotCreateManyUserInputEnvelope;
    connect?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
};
export type FinancialHealthSnapshotUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput> | Prisma.FinancialHealthSnapshotCreateWithoutUserInput[] | Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput | Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FinancialHealthSnapshotUpsertWithWhereUniqueWithoutUserInput | Prisma.FinancialHealthSnapshotUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FinancialHealthSnapshotCreateManyUserInputEnvelope;
    set?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    disconnect?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    delete?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    connect?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    update?: Prisma.FinancialHealthSnapshotUpdateWithWhereUniqueWithoutUserInput | Prisma.FinancialHealthSnapshotUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FinancialHealthSnapshotUpdateManyWithWhereWithoutUserInput | Prisma.FinancialHealthSnapshotUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FinancialHealthSnapshotScalarWhereInput | Prisma.FinancialHealthSnapshotScalarWhereInput[];
};
export type FinancialHealthSnapshotUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput> | Prisma.FinancialHealthSnapshotCreateWithoutUserInput[] | Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput | Prisma.FinancialHealthSnapshotCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.FinancialHealthSnapshotUpsertWithWhereUniqueWithoutUserInput | Prisma.FinancialHealthSnapshotUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.FinancialHealthSnapshotCreateManyUserInputEnvelope;
    set?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    disconnect?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    delete?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    connect?: Prisma.FinancialHealthSnapshotWhereUniqueInput | Prisma.FinancialHealthSnapshotWhereUniqueInput[];
    update?: Prisma.FinancialHealthSnapshotUpdateWithWhereUniqueWithoutUserInput | Prisma.FinancialHealthSnapshotUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.FinancialHealthSnapshotUpdateManyWithWhereWithoutUserInput | Prisma.FinancialHealthSnapshotUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.FinancialHealthSnapshotScalarWhereInput | Prisma.FinancialHealthSnapshotScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type FinancialHealthSnapshotCreateWithoutUserInput = {
    id?: string;
    score: number;
    month: number;
    year: number;
    totalIncome: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney: runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type FinancialHealthSnapshotUncheckedCreateWithoutUserInput = {
    id?: string;
    score: number;
    month: number;
    year: number;
    totalIncome: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney: runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type FinancialHealthSnapshotCreateOrConnectWithoutUserInput = {
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput>;
};
export type FinancialHealthSnapshotCreateManyUserInputEnvelope = {
    data: Prisma.FinancialHealthSnapshotCreateManyUserInput | Prisma.FinancialHealthSnapshotCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type FinancialHealthSnapshotUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    update: Prisma.XOR<Prisma.FinancialHealthSnapshotUpdateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedCreateWithoutUserInput>;
};
export type FinancialHealthSnapshotUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    data: Prisma.XOR<Prisma.FinancialHealthSnapshotUpdateWithoutUserInput, Prisma.FinancialHealthSnapshotUncheckedUpdateWithoutUserInput>;
};
export type FinancialHealthSnapshotUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.FinancialHealthSnapshotScalarWhereInput;
    data: Prisma.XOR<Prisma.FinancialHealthSnapshotUpdateManyMutationInput, Prisma.FinancialHealthSnapshotUncheckedUpdateManyWithoutUserInput>;
};
export type FinancialHealthSnapshotScalarWhereInput = {
    AND?: Prisma.FinancialHealthSnapshotScalarWhereInput | Prisma.FinancialHealthSnapshotScalarWhereInput[];
    OR?: Prisma.FinancialHealthSnapshotScalarWhereInput[];
    NOT?: Prisma.FinancialHealthSnapshotScalarWhereInput | Prisma.FinancialHealthSnapshotScalarWhereInput[];
    id?: Prisma.StringFilter<"FinancialHealthSnapshot"> | string;
    userId?: Prisma.StringFilter<"FinancialHealthSnapshot"> | string;
    score?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    month?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    year?: Prisma.IntFilter<"FinancialHealthSnapshot"> | number;
    totalIncome?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFilter<"FinancialHealthSnapshot"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFilter<"FinancialHealthSnapshot"> | Date | string;
};
export type FinancialHealthSnapshotCreateManyUserInput = {
    id?: string;
    score: number;
    month: number;
    year: number;
    totalIncome: runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense: runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney: runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate: runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Date | string;
};
export type FinancialHealthSnapshotUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalIncome?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FinancialHealthSnapshotUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalIncome?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FinancialHealthSnapshotUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    score?: Prisma.IntFieldUpdateOperationsInput | number;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalIncome?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    totalExpense?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    remainingMoney?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    savingsProgressRate?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type FinancialHealthSnapshotSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    score?: boolean;
    month?: boolean;
    year?: boolean;
    totalIncome?: boolean;
    totalExpense?: boolean;
    remainingMoney?: boolean;
    savingsProgressRate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["financialHealthSnapshot"]>;
export type FinancialHealthSnapshotSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    score?: boolean;
    month?: boolean;
    year?: boolean;
    totalIncome?: boolean;
    totalExpense?: boolean;
    remainingMoney?: boolean;
    savingsProgressRate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["financialHealthSnapshot"]>;
export type FinancialHealthSnapshotSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    score?: boolean;
    month?: boolean;
    year?: boolean;
    totalIncome?: boolean;
    totalExpense?: boolean;
    remainingMoney?: boolean;
    savingsProgressRate?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["financialHealthSnapshot"]>;
export type FinancialHealthSnapshotSelectScalar = {
    id?: boolean;
    userId?: boolean;
    score?: boolean;
    month?: boolean;
    year?: boolean;
    totalIncome?: boolean;
    totalExpense?: boolean;
    remainingMoney?: boolean;
    savingsProgressRate?: boolean;
    createdAt?: boolean;
};
export type FinancialHealthSnapshotOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "score" | "month" | "year" | "totalIncome" | "totalExpense" | "remainingMoney" | "savingsProgressRate" | "createdAt", ExtArgs["result"]["financialHealthSnapshot"]>;
export type FinancialHealthSnapshotInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type FinancialHealthSnapshotIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type FinancialHealthSnapshotIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $FinancialHealthSnapshotPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FinancialHealthSnapshot";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        score: number;
        month: number;
        year: number;
        totalIncome: runtime.Decimal;
        totalExpense: runtime.Decimal;
        remainingMoney: runtime.Decimal;
        savingsProgressRate: runtime.Decimal;
        createdAt: Date;
    }, ExtArgs["result"]["financialHealthSnapshot"]>;
    composites: {};
};
export type FinancialHealthSnapshotGetPayload<S extends boolean | null | undefined | FinancialHealthSnapshotDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload, S>;
export type FinancialHealthSnapshotCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FinancialHealthSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FinancialHealthSnapshotCountAggregateInputType | true;
};
export interface FinancialHealthSnapshotDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FinancialHealthSnapshot'];
        meta: {
            name: 'FinancialHealthSnapshot';
        };
    };
    findUnique<T extends FinancialHealthSnapshotFindUniqueArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FinancialHealthSnapshotFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FinancialHealthSnapshotFindFirstArgs>(args?: Prisma.SelectSubset<T, FinancialHealthSnapshotFindFirstArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FinancialHealthSnapshotFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FinancialHealthSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FinancialHealthSnapshotFindManyArgs>(args?: Prisma.SelectSubset<T, FinancialHealthSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FinancialHealthSnapshotCreateArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotCreateArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FinancialHealthSnapshotCreateManyArgs>(args?: Prisma.SelectSubset<T, FinancialHealthSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FinancialHealthSnapshotCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FinancialHealthSnapshotCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FinancialHealthSnapshotDeleteArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotDeleteArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FinancialHealthSnapshotUpdateArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotUpdateArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FinancialHealthSnapshotDeleteManyArgs>(args?: Prisma.SelectSubset<T, FinancialHealthSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FinancialHealthSnapshotUpdateManyArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FinancialHealthSnapshotUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FinancialHealthSnapshotUpsertArgs>(args: Prisma.SelectSubset<T, FinancialHealthSnapshotUpsertArgs<ExtArgs>>): Prisma.Prisma__FinancialHealthSnapshotClient<runtime.Types.Result.GetResult<Prisma.$FinancialHealthSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FinancialHealthSnapshotCountArgs>(args?: Prisma.Subset<T, FinancialHealthSnapshotCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FinancialHealthSnapshotCountAggregateOutputType> : number>;
    aggregate<T extends FinancialHealthSnapshotAggregateArgs>(args: Prisma.Subset<T, FinancialHealthSnapshotAggregateArgs>): Prisma.PrismaPromise<GetFinancialHealthSnapshotAggregateType<T>>;
    groupBy<T extends FinancialHealthSnapshotGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FinancialHealthSnapshotGroupByArgs['orderBy'];
    } : {
        orderBy?: FinancialHealthSnapshotGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FinancialHealthSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFinancialHealthSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FinancialHealthSnapshotFieldRefs;
}
export interface Prisma__FinancialHealthSnapshotClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FinancialHealthSnapshotFieldRefs {
    readonly id: Prisma.FieldRef<"FinancialHealthSnapshot", 'String'>;
    readonly userId: Prisma.FieldRef<"FinancialHealthSnapshot", 'String'>;
    readonly score: Prisma.FieldRef<"FinancialHealthSnapshot", 'Int'>;
    readonly month: Prisma.FieldRef<"FinancialHealthSnapshot", 'Int'>;
    readonly year: Prisma.FieldRef<"FinancialHealthSnapshot", 'Int'>;
    readonly totalIncome: Prisma.FieldRef<"FinancialHealthSnapshot", 'Decimal'>;
    readonly totalExpense: Prisma.FieldRef<"FinancialHealthSnapshot", 'Decimal'>;
    readonly remainingMoney: Prisma.FieldRef<"FinancialHealthSnapshot", 'Decimal'>;
    readonly savingsProgressRate: Prisma.FieldRef<"FinancialHealthSnapshot", 'Decimal'>;
    readonly createdAt: Prisma.FieldRef<"FinancialHealthSnapshot", 'DateTime'>;
}
export type FinancialHealthSnapshotFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
};
export type FinancialHealthSnapshotFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
};
export type FinancialHealthSnapshotFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    orderBy?: Prisma.FinancialHealthSnapshotOrderByWithRelationInput | Prisma.FinancialHealthSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FinancialHealthSnapshotScalarFieldEnum | Prisma.FinancialHealthSnapshotScalarFieldEnum[];
};
export type FinancialHealthSnapshotFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    orderBy?: Prisma.FinancialHealthSnapshotOrderByWithRelationInput | Prisma.FinancialHealthSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FinancialHealthSnapshotScalarFieldEnum | Prisma.FinancialHealthSnapshotScalarFieldEnum[];
};
export type FinancialHealthSnapshotFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    orderBy?: Prisma.FinancialHealthSnapshotOrderByWithRelationInput | Prisma.FinancialHealthSnapshotOrderByWithRelationInput[];
    cursor?: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FinancialHealthSnapshotScalarFieldEnum | Prisma.FinancialHealthSnapshotScalarFieldEnum[];
};
export type FinancialHealthSnapshotCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateInput, Prisma.FinancialHealthSnapshotUncheckedCreateInput>;
};
export type FinancialHealthSnapshotCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FinancialHealthSnapshotCreateManyInput | Prisma.FinancialHealthSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FinancialHealthSnapshotCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    data: Prisma.FinancialHealthSnapshotCreateManyInput | Prisma.FinancialHealthSnapshotCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.FinancialHealthSnapshotIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type FinancialHealthSnapshotUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FinancialHealthSnapshotUpdateInput, Prisma.FinancialHealthSnapshotUncheckedUpdateInput>;
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
};
export type FinancialHealthSnapshotUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FinancialHealthSnapshotUpdateManyMutationInput, Prisma.FinancialHealthSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    limit?: number;
};
export type FinancialHealthSnapshotUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FinancialHealthSnapshotUpdateManyMutationInput, Prisma.FinancialHealthSnapshotUncheckedUpdateManyInput>;
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    limit?: number;
    include?: Prisma.FinancialHealthSnapshotIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type FinancialHealthSnapshotUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
    create: Prisma.XOR<Prisma.FinancialHealthSnapshotCreateInput, Prisma.FinancialHealthSnapshotUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FinancialHealthSnapshotUpdateInput, Prisma.FinancialHealthSnapshotUncheckedUpdateInput>;
};
export type FinancialHealthSnapshotDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
    where: Prisma.FinancialHealthSnapshotWhereUniqueInput;
};
export type FinancialHealthSnapshotDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FinancialHealthSnapshotWhereInput;
    limit?: number;
};
export type FinancialHealthSnapshotDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FinancialHealthSnapshotSelect<ExtArgs> | null;
    omit?: Prisma.FinancialHealthSnapshotOmit<ExtArgs> | null;
    include?: Prisma.FinancialHealthSnapshotInclude<ExtArgs> | null;
};
