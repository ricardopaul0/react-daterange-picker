import { DefinedRange } from "./types";

import {
	addDays,
	addWeeks,
	subMonths,
	subYears,
} from "date-fns";

const getDefaultRanges = (date: Date): DefinedRange[] => [
	{
		label: "Select past 7 days",
		startDate: addWeeks(date, -1),
		endDate: date
	},
	{
		label: "Previous 30 days",
		startDate: addDays(date, -30),
		endDate: date
	},
	{
		label: "Previous 6 Months",
		startDate: subMonths(date, 6),
		endDate: date,
	},
	{
		label: "Previous Year",
		startDate: subYears(date, 1),
		endDate: date
	},
];

export const defaultRanges = getDefaultRanges(new Date());
