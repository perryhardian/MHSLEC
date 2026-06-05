import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SavingsContributionModel = runtime.Types.Result.DefaultSelection<Prisma.$SavingsContributionPayload>;
export type AggregateSavingsContribution = {
    _count: SavingsContributionCountAggregateOutputType | null;
    _avg: SavingsContributionAvgAggregateOutputType | null;
    _sum: SavingsContributionSumAggregateOutputType | null;
    _min: SavingsContributionMinAggregateOutputType | null;
    _max: SavingsContributionMaxAggregateOutputType | null;
};
export type SavingsContributionAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type SavingsContributionSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type SavingsContributionMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    savingsGoalId: string | null;
    amount: runtime.Decimal | null;
    note: string | null;
    contributedAt: Date | null;
    createdAt: Date | null;
};
export type SavingsContributionMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    savingsGoalId: string | null;
    amount: runtime.Decimal | null;
    note: string | null;
    contributedAt: Date | null;
    createdAt: Date | null;
};
export type SavingsContributionCountAggregateOutputType = {
    id: number;
    userId: number;
    savingsGoalId: number;
    amount: number;
    note: number;
    contributedAt: number;
    createdAt: number;
    _all: number;
};
export type SavingsContributionAvgAggregateInputType = {
    amount?: true;
};
export type SavingsContributionSumAggregateInputType = {
    amount?: true;
};
export type SavingsContributionMinAggregateInputType = {
    id?: true;
    userId?: true;
    savingsGoalId?: true;
    amount?: true;
    note?: true;
    contributedAt?: true;
    createdAt?: true;
};
export type SavingsContributionMaxAggregateInputType = {
    id?: true;
    userId?: true;
    savingsGoalId?: true;
    amount?: true;
    note?: true;
    contributedAt?: true;
    createdAt?: true;
};
export type SavingsContributionCountAggregateInputType = {
    id?: true;
    userId?: true;
    savingsGoalId?: true;
    amount?: true;
    note?: true;
    contributedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type SavingsContributionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavingsContributionWhereInput;
    orderBy?: Prisma.SavingsContributionOrderByWithRelationInput | Prisma.SavingsContributionOrderByWithRelationInput[];
    cursor?: Prisma.SavingsContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SavingsContributionCountAggregateInputType;
    _avg?: SavingsContributionAvgAggregateInputType;
    _sum?: SavingsContributionSumAggregateInputType;
    _min?: SavingsContributionMinAggregateInputType;
    _max?: SavingsContributionMaxAggregateInputType;
};
export type GetSavingsContributionAggregateType<T extends SavingsContributionAggregateArgs> = {
    [P in keyof T & keyof AggregateSavingsContribution]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSavingsContribution[P]> : Prisma.GetScalarType<T[P], AggregateSavingsContribution[P]>;
};
export type SavingsContributionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavingsContributionWhereInput;
    orderBy?: Prisma.SavingsContributionOrderByWithAggregationInput | Prisma.SavingsContributionOrderByWithAggregationInput[];
    by: Prisma.SavingsContributionScalarFieldEnum[] | Prisma.SavingsContributionScalarFieldEnum;
    having?: Prisma.SavingsContributionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SavingsContributionCountAggregateInputType | true;
    _avg?: SavingsContributionAvgAggregateInputType;
    _sum?: SavingsContributionSumAggregateInputType;
    _min?: SavingsContributionMinAggregateInputType;
    _max?: SavingsContributionMaxAggregateInputType;
};
export type SavingsContributionGroupByOutputType = {
    id: string;
    userId: string;
    savingsGoalId: string;
    amount: runtime.Decimal;
    note: string | null;
    contributedAt: Date;
    createdAt: Date;
    _count: SavingsContributionCountAggregateOutputType | null;
    _avg: SavingsContributionAvgAggregateOutputType | null;
    _sum: SavingsContributionSumAggregateOutputType | null;
    _min: SavingsContributionMinAggregateOutputType | null;
    _max: SavingsContributionMaxAggregateOutputType | null;
};
export type GetSavingsContributionGroupByPayload<T extends SavingsContributionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SavingsContributionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SavingsContributionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SavingsContributionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SavingsContributionGroupByOutputType[P]>;
}>>;
export type SavingsContributionWhereInput = {
    AND?: Prisma.SavingsContributionWhereInput | Prisma.SavingsContributionWhereInput[];
    OR?: Prisma.SavingsContributionWhereInput[];
    NOT?: Prisma.SavingsContributionWhereInput | Prisma.SavingsContributionWhereInput[];
    id?: Prisma.StringFilter<"SavingsContribution"> | string;
    userId?: Prisma.StringFilter<"SavingsContribution"> | string;
    savingsGoalId?: Prisma.StringFilter<"SavingsContribution"> | string;
    amount?: Prisma.DecimalFilter<"SavingsContribution"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.StringNullableFilter<"SavingsContribution"> | string | null;
    contributedAt?: Prisma.DateTimeFilter<"SavingsContribution"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"SavingsContribution"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    savingsGoal?: Prisma.XOR<Prisma.SavingsGoalScalarRelationFilter, Prisma.SavingsGoalWhereInput>;
};
export type SavingsContributionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    savingsGoalId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    contributedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    savingsGoal?: Prisma.SavingsGoalOrderByWithRelationInput;
};
export type SavingsContributionWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.SavingsContributionWhereInput | Prisma.SavingsContributionWhereInput[];
    OR?: Prisma.SavingsContributionWhereInput[];
    NOT?: Prisma.SavingsContributionWhereInput | Prisma.SavingsContributionWhereInput[];
    userId?: Prisma.StringFilter<"SavingsContribution"> | string;
    savingsGoalId?: Prisma.StringFilter<"SavingsContribution"> | string;
    amount?: Prisma.DecimalFilter<"SavingsContribution"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.StringNullableFilter<"SavingsContribution"> | string | null;
    contributedAt?: Prisma.DateTimeFilter<"SavingsContribution"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"SavingsContribution"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    savingsGoal?: Prisma.XOR<Prisma.SavingsGoalScalarRelationFilter, Prisma.SavingsGoalWhereInput>;
}, "id">;
export type SavingsContributionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    savingsGoalId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    contributedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.SavingsContributionCountOrderByAggregateInput;
    _avg?: Prisma.SavingsContributionAvgOrderByAggregateInput;
    _max?: Prisma.SavingsContributionMaxOrderByAggregateInput;
    _min?: Prisma.SavingsContributionMinOrderByAggregateInput;
    _sum?: Prisma.SavingsContributionSumOrderByAggregateInput;
};
export type SavingsContributionScalarWhereWithAggregatesInput = {
    AND?: Prisma.SavingsContributionScalarWhereWithAggregatesInput | Prisma.SavingsContributionScalarWhereWithAggregatesInput[];
    OR?: Prisma.SavingsContributionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SavingsContributionScalarWhereWithAggregatesInput | Prisma.SavingsContributionScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"SavingsContribution"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"SavingsContribution"> | string;
    savingsGoalId?: Prisma.StringWithAggregatesFilter<"SavingsContribution"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"SavingsContribution"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.StringNullableWithAggregatesFilter<"SavingsContribution"> | string | null;
    contributedAt?: Prisma.DateTimeWithAggregatesFilter<"SavingsContribution"> | Date | string;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"SavingsContribution"> | Date | string;
};
export type SavingsContributionCreateInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavingsContributionsInput;
    savingsGoal: Prisma.SavingsGoalCreateNestedOneWithoutContributionsInput;
};
export type SavingsContributionUncheckedCreateInput = {
    id?: string;
    userId: string;
    savingsGoalId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
};
export type SavingsContributionUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavingsContributionsNestedInput;
    savingsGoal?: Prisma.SavingsGoalUpdateOneRequiredWithoutContributionsNestedInput;
};
export type SavingsContributionUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    savingsGoalId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsContributionCreateManyInput = {
    id?: string;
    userId: string;
    savingsGoalId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
};
export type SavingsContributionUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsContributionUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    savingsGoalId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsContributionListRelationFilter = {
    every?: Prisma.SavingsContributionWhereInput;
    some?: Prisma.SavingsContributionWhereInput;
    none?: Prisma.SavingsContributionWhereInput;
};
export type SavingsContributionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type SavingsContributionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    savingsGoalId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    contributedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavingsContributionAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type SavingsContributionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    savingsGoalId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    contributedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavingsContributionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    savingsGoalId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    contributedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type SavingsContributionSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type SavingsContributionCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutUserInput, Prisma.SavingsContributionUncheckedCreateWithoutUserInput> | Prisma.SavingsContributionCreateWithoutUserInput[] | Prisma.SavingsContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutUserInput | Prisma.SavingsContributionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavingsContributionCreateManyUserInputEnvelope;
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
};
export type SavingsContributionUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutUserInput, Prisma.SavingsContributionUncheckedCreateWithoutUserInput> | Prisma.SavingsContributionCreateWithoutUserInput[] | Prisma.SavingsContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutUserInput | Prisma.SavingsContributionCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.SavingsContributionCreateManyUserInputEnvelope;
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
};
export type SavingsContributionUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutUserInput, Prisma.SavingsContributionUncheckedCreateWithoutUserInput> | Prisma.SavingsContributionCreateWithoutUserInput[] | Prisma.SavingsContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutUserInput | Prisma.SavingsContributionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavingsContributionUpsertWithWhereUniqueWithoutUserInput | Prisma.SavingsContributionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavingsContributionCreateManyUserInputEnvelope;
    set?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    disconnect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    delete?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    update?: Prisma.SavingsContributionUpdateWithWhereUniqueWithoutUserInput | Prisma.SavingsContributionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavingsContributionUpdateManyWithWhereWithoutUserInput | Prisma.SavingsContributionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavingsContributionScalarWhereInput | Prisma.SavingsContributionScalarWhereInput[];
};
export type SavingsContributionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutUserInput, Prisma.SavingsContributionUncheckedCreateWithoutUserInput> | Prisma.SavingsContributionCreateWithoutUserInput[] | Prisma.SavingsContributionUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutUserInput | Prisma.SavingsContributionCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.SavingsContributionUpsertWithWhereUniqueWithoutUserInput | Prisma.SavingsContributionUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.SavingsContributionCreateManyUserInputEnvelope;
    set?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    disconnect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    delete?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    update?: Prisma.SavingsContributionUpdateWithWhereUniqueWithoutUserInput | Prisma.SavingsContributionUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.SavingsContributionUpdateManyWithWhereWithoutUserInput | Prisma.SavingsContributionUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.SavingsContributionScalarWhereInput | Prisma.SavingsContributionScalarWhereInput[];
};
export type SavingsContributionCreateNestedManyWithoutSavingsGoalInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput> | Prisma.SavingsContributionCreateWithoutSavingsGoalInput[] | Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput | Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput[];
    createMany?: Prisma.SavingsContributionCreateManySavingsGoalInputEnvelope;
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
};
export type SavingsContributionUncheckedCreateNestedManyWithoutSavingsGoalInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput> | Prisma.SavingsContributionCreateWithoutSavingsGoalInput[] | Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput | Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput[];
    createMany?: Prisma.SavingsContributionCreateManySavingsGoalInputEnvelope;
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
};
export type SavingsContributionUpdateManyWithoutSavingsGoalNestedInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput> | Prisma.SavingsContributionCreateWithoutSavingsGoalInput[] | Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput | Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput[];
    upsert?: Prisma.SavingsContributionUpsertWithWhereUniqueWithoutSavingsGoalInput | Prisma.SavingsContributionUpsertWithWhereUniqueWithoutSavingsGoalInput[];
    createMany?: Prisma.SavingsContributionCreateManySavingsGoalInputEnvelope;
    set?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    disconnect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    delete?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    update?: Prisma.SavingsContributionUpdateWithWhereUniqueWithoutSavingsGoalInput | Prisma.SavingsContributionUpdateWithWhereUniqueWithoutSavingsGoalInput[];
    updateMany?: Prisma.SavingsContributionUpdateManyWithWhereWithoutSavingsGoalInput | Prisma.SavingsContributionUpdateManyWithWhereWithoutSavingsGoalInput[];
    deleteMany?: Prisma.SavingsContributionScalarWhereInput | Prisma.SavingsContributionScalarWhereInput[];
};
export type SavingsContributionUncheckedUpdateManyWithoutSavingsGoalNestedInput = {
    create?: Prisma.XOR<Prisma.SavingsContributionCreateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput> | Prisma.SavingsContributionCreateWithoutSavingsGoalInput[] | Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput[];
    connectOrCreate?: Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput | Prisma.SavingsContributionCreateOrConnectWithoutSavingsGoalInput[];
    upsert?: Prisma.SavingsContributionUpsertWithWhereUniqueWithoutSavingsGoalInput | Prisma.SavingsContributionUpsertWithWhereUniqueWithoutSavingsGoalInput[];
    createMany?: Prisma.SavingsContributionCreateManySavingsGoalInputEnvelope;
    set?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    disconnect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    delete?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    connect?: Prisma.SavingsContributionWhereUniqueInput | Prisma.SavingsContributionWhereUniqueInput[];
    update?: Prisma.SavingsContributionUpdateWithWhereUniqueWithoutSavingsGoalInput | Prisma.SavingsContributionUpdateWithWhereUniqueWithoutSavingsGoalInput[];
    updateMany?: Prisma.SavingsContributionUpdateManyWithWhereWithoutSavingsGoalInput | Prisma.SavingsContributionUpdateManyWithWhereWithoutSavingsGoalInput[];
    deleteMany?: Prisma.SavingsContributionScalarWhereInput | Prisma.SavingsContributionScalarWhereInput[];
};
export type SavingsContributionCreateWithoutUserInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
    savingsGoal: Prisma.SavingsGoalCreateNestedOneWithoutContributionsInput;
};
export type SavingsContributionUncheckedCreateWithoutUserInput = {
    id?: string;
    savingsGoalId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
};
export type SavingsContributionCreateOrConnectWithoutUserInput = {
    where: Prisma.SavingsContributionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavingsContributionCreateWithoutUserInput, Prisma.SavingsContributionUncheckedCreateWithoutUserInput>;
};
export type SavingsContributionCreateManyUserInputEnvelope = {
    data: Prisma.SavingsContributionCreateManyUserInput | Prisma.SavingsContributionCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type SavingsContributionUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavingsContributionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavingsContributionUpdateWithoutUserInput, Prisma.SavingsContributionUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.SavingsContributionCreateWithoutUserInput, Prisma.SavingsContributionUncheckedCreateWithoutUserInput>;
};
export type SavingsContributionUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.SavingsContributionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavingsContributionUpdateWithoutUserInput, Prisma.SavingsContributionUncheckedUpdateWithoutUserInput>;
};
export type SavingsContributionUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.SavingsContributionScalarWhereInput;
    data: Prisma.XOR<Prisma.SavingsContributionUpdateManyMutationInput, Prisma.SavingsContributionUncheckedUpdateManyWithoutUserInput>;
};
export type SavingsContributionScalarWhereInput = {
    AND?: Prisma.SavingsContributionScalarWhereInput | Prisma.SavingsContributionScalarWhereInput[];
    OR?: Prisma.SavingsContributionScalarWhereInput[];
    NOT?: Prisma.SavingsContributionScalarWhereInput | Prisma.SavingsContributionScalarWhereInput[];
    id?: Prisma.StringFilter<"SavingsContribution"> | string;
    userId?: Prisma.StringFilter<"SavingsContribution"> | string;
    savingsGoalId?: Prisma.StringFilter<"SavingsContribution"> | string;
    amount?: Prisma.DecimalFilter<"SavingsContribution"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.StringNullableFilter<"SavingsContribution"> | string | null;
    contributedAt?: Prisma.DateTimeFilter<"SavingsContribution"> | Date | string;
    createdAt?: Prisma.DateTimeFilter<"SavingsContribution"> | Date | string;
};
export type SavingsContributionCreateWithoutSavingsGoalInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutSavingsContributionsInput;
};
export type SavingsContributionUncheckedCreateWithoutSavingsGoalInput = {
    id?: string;
    userId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
};
export type SavingsContributionCreateOrConnectWithoutSavingsGoalInput = {
    where: Prisma.SavingsContributionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavingsContributionCreateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput>;
};
export type SavingsContributionCreateManySavingsGoalInputEnvelope = {
    data: Prisma.SavingsContributionCreateManySavingsGoalInput | Prisma.SavingsContributionCreateManySavingsGoalInput[];
    skipDuplicates?: boolean;
};
export type SavingsContributionUpsertWithWhereUniqueWithoutSavingsGoalInput = {
    where: Prisma.SavingsContributionWhereUniqueInput;
    update: Prisma.XOR<Prisma.SavingsContributionUpdateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedUpdateWithoutSavingsGoalInput>;
    create: Prisma.XOR<Prisma.SavingsContributionCreateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedCreateWithoutSavingsGoalInput>;
};
export type SavingsContributionUpdateWithWhereUniqueWithoutSavingsGoalInput = {
    where: Prisma.SavingsContributionWhereUniqueInput;
    data: Prisma.XOR<Prisma.SavingsContributionUpdateWithoutSavingsGoalInput, Prisma.SavingsContributionUncheckedUpdateWithoutSavingsGoalInput>;
};
export type SavingsContributionUpdateManyWithWhereWithoutSavingsGoalInput = {
    where: Prisma.SavingsContributionScalarWhereInput;
    data: Prisma.XOR<Prisma.SavingsContributionUpdateManyMutationInput, Prisma.SavingsContributionUncheckedUpdateManyWithoutSavingsGoalInput>;
};
export type SavingsContributionCreateManyUserInput = {
    id?: string;
    savingsGoalId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
};
export type SavingsContributionUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    savingsGoal?: Prisma.SavingsGoalUpdateOneRequiredWithoutContributionsNestedInput;
};
export type SavingsContributionUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    savingsGoalId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsContributionUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    savingsGoalId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsContributionCreateManySavingsGoalInput = {
    id?: string;
    userId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: string | null;
    contributedAt: Date | string;
    createdAt?: Date | string;
};
export type SavingsContributionUpdateWithoutSavingsGoalInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutSavingsContributionsNestedInput;
};
export type SavingsContributionUncheckedUpdateWithoutSavingsGoalInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsContributionUncheckedUpdateManyWithoutSavingsGoalInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    contributedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type SavingsContributionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    savingsGoalId?: boolean;
    amount?: boolean;
    note?: boolean;
    contributedAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    savingsGoal?: boolean | Prisma.SavingsGoalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savingsContribution"]>;
export type SavingsContributionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    savingsGoalId?: boolean;
    amount?: boolean;
    note?: boolean;
    contributedAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    savingsGoal?: boolean | Prisma.SavingsGoalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savingsContribution"]>;
export type SavingsContributionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    savingsGoalId?: boolean;
    amount?: boolean;
    note?: boolean;
    contributedAt?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    savingsGoal?: boolean | Prisma.SavingsGoalDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["savingsContribution"]>;
export type SavingsContributionSelectScalar = {
    id?: boolean;
    userId?: boolean;
    savingsGoalId?: boolean;
    amount?: boolean;
    note?: boolean;
    contributedAt?: boolean;
    createdAt?: boolean;
};
export type SavingsContributionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "savingsGoalId" | "amount" | "note" | "contributedAt" | "createdAt", ExtArgs["result"]["savingsContribution"]>;
export type SavingsContributionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    savingsGoal?: boolean | Prisma.SavingsGoalDefaultArgs<ExtArgs>;
};
export type SavingsContributionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    savingsGoal?: boolean | Prisma.SavingsGoalDefaultArgs<ExtArgs>;
};
export type SavingsContributionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    savingsGoal?: boolean | Prisma.SavingsGoalDefaultArgs<ExtArgs>;
};
export type $SavingsContributionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SavingsContribution";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        savingsGoal: Prisma.$SavingsGoalPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        savingsGoalId: string;
        amount: runtime.Decimal;
        note: string | null;
        contributedAt: Date;
        createdAt: Date;
    }, ExtArgs["result"]["savingsContribution"]>;
    composites: {};
};
export type SavingsContributionGetPayload<S extends boolean | null | undefined | SavingsContributionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload, S>;
export type SavingsContributionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SavingsContributionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SavingsContributionCountAggregateInputType | true;
};
export interface SavingsContributionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SavingsContribution'];
        meta: {
            name: 'SavingsContribution';
        };
    };
    findUnique<T extends SavingsContributionFindUniqueArgs>(args: Prisma.SelectSubset<T, SavingsContributionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SavingsContributionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SavingsContributionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SavingsContributionFindFirstArgs>(args?: Prisma.SelectSubset<T, SavingsContributionFindFirstArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SavingsContributionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SavingsContributionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SavingsContributionFindManyArgs>(args?: Prisma.SelectSubset<T, SavingsContributionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SavingsContributionCreateArgs>(args: Prisma.SelectSubset<T, SavingsContributionCreateArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SavingsContributionCreateManyArgs>(args?: Prisma.SelectSubset<T, SavingsContributionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SavingsContributionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SavingsContributionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SavingsContributionDeleteArgs>(args: Prisma.SelectSubset<T, SavingsContributionDeleteArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SavingsContributionUpdateArgs>(args: Prisma.SelectSubset<T, SavingsContributionUpdateArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SavingsContributionDeleteManyArgs>(args?: Prisma.SelectSubset<T, SavingsContributionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SavingsContributionUpdateManyArgs>(args: Prisma.SelectSubset<T, SavingsContributionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SavingsContributionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SavingsContributionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SavingsContributionUpsertArgs>(args: Prisma.SelectSubset<T, SavingsContributionUpsertArgs<ExtArgs>>): Prisma.Prisma__SavingsContributionClient<runtime.Types.Result.GetResult<Prisma.$SavingsContributionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SavingsContributionCountArgs>(args?: Prisma.Subset<T, SavingsContributionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SavingsContributionCountAggregateOutputType> : number>;
    aggregate<T extends SavingsContributionAggregateArgs>(args: Prisma.Subset<T, SavingsContributionAggregateArgs>): Prisma.PrismaPromise<GetSavingsContributionAggregateType<T>>;
    groupBy<T extends SavingsContributionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SavingsContributionGroupByArgs['orderBy'];
    } : {
        orderBy?: SavingsContributionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SavingsContributionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSavingsContributionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SavingsContributionFieldRefs;
}
export interface Prisma__SavingsContributionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    savingsGoal<T extends Prisma.SavingsGoalDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.SavingsGoalDefaultArgs<ExtArgs>>): Prisma.Prisma__SavingsGoalClient<runtime.Types.Result.GetResult<Prisma.$SavingsGoalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SavingsContributionFieldRefs {
    readonly id: Prisma.FieldRef<"SavingsContribution", 'String'>;
    readonly userId: Prisma.FieldRef<"SavingsContribution", 'String'>;
    readonly savingsGoalId: Prisma.FieldRef<"SavingsContribution", 'String'>;
    readonly amount: Prisma.FieldRef<"SavingsContribution", 'Decimal'>;
    readonly note: Prisma.FieldRef<"SavingsContribution", 'String'>;
    readonly contributedAt: Prisma.FieldRef<"SavingsContribution", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"SavingsContribution", 'DateTime'>;
}
export type SavingsContributionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    where: Prisma.SavingsContributionWhereUniqueInput;
};
export type SavingsContributionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    where: Prisma.SavingsContributionWhereUniqueInput;
};
export type SavingsContributionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    where?: Prisma.SavingsContributionWhereInput;
    orderBy?: Prisma.SavingsContributionOrderByWithRelationInput | Prisma.SavingsContributionOrderByWithRelationInput[];
    cursor?: Prisma.SavingsContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavingsContributionScalarFieldEnum | Prisma.SavingsContributionScalarFieldEnum[];
};
export type SavingsContributionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    where?: Prisma.SavingsContributionWhereInput;
    orderBy?: Prisma.SavingsContributionOrderByWithRelationInput | Prisma.SavingsContributionOrderByWithRelationInput[];
    cursor?: Prisma.SavingsContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavingsContributionScalarFieldEnum | Prisma.SavingsContributionScalarFieldEnum[];
};
export type SavingsContributionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    where?: Prisma.SavingsContributionWhereInput;
    orderBy?: Prisma.SavingsContributionOrderByWithRelationInput | Prisma.SavingsContributionOrderByWithRelationInput[];
    cursor?: Prisma.SavingsContributionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SavingsContributionScalarFieldEnum | Prisma.SavingsContributionScalarFieldEnum[];
};
export type SavingsContributionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavingsContributionCreateInput, Prisma.SavingsContributionUncheckedCreateInput>;
};
export type SavingsContributionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SavingsContributionCreateManyInput | Prisma.SavingsContributionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SavingsContributionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    data: Prisma.SavingsContributionCreateManyInput | Prisma.SavingsContributionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.SavingsContributionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type SavingsContributionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavingsContributionUpdateInput, Prisma.SavingsContributionUncheckedUpdateInput>;
    where: Prisma.SavingsContributionWhereUniqueInput;
};
export type SavingsContributionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SavingsContributionUpdateManyMutationInput, Prisma.SavingsContributionUncheckedUpdateManyInput>;
    where?: Prisma.SavingsContributionWhereInput;
    limit?: number;
};
export type SavingsContributionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SavingsContributionUpdateManyMutationInput, Prisma.SavingsContributionUncheckedUpdateManyInput>;
    where?: Prisma.SavingsContributionWhereInput;
    limit?: number;
    include?: Prisma.SavingsContributionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type SavingsContributionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    where: Prisma.SavingsContributionWhereUniqueInput;
    create: Prisma.XOR<Prisma.SavingsContributionCreateInput, Prisma.SavingsContributionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SavingsContributionUpdateInput, Prisma.SavingsContributionUncheckedUpdateInput>;
};
export type SavingsContributionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
    where: Prisma.SavingsContributionWhereUniqueInput;
};
export type SavingsContributionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SavingsContributionWhereInput;
    limit?: number;
};
export type SavingsContributionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SavingsContributionSelect<ExtArgs> | null;
    omit?: Prisma.SavingsContributionOmit<ExtArgs> | null;
    include?: Prisma.SavingsContributionInclude<ExtArgs> | null;
};
