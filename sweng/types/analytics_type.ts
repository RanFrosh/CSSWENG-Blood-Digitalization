export type BloodTypeBreakdown = {
    blood_type: string;
    count: number;
}

export type LogisticsStats = {
    registered: number;
    attended: number;
    ratePercent: number;
}

export type ExtractionStats = {
    targetGoal: number;
    currentCollected: number;
    progressPercent: number;
}

export type ViewDirectorStats = {
    totalActiveDonors: number;
    donorDemographics: BloodTypeBreakdown[];
    showUpRates: LogisticsStats;
    extractionGoals: ExtractionStats;
}