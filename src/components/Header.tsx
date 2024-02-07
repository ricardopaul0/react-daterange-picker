import {
	WithStyles,
	Grid,
	createStyles,
	withStyles,
	IconButton,
	Select,
	MenuItem
} from "@material-ui/core";
import React from "react";
import ChevronLeft from "@material-ui/icons/ChevronLeft";
import ChevronRight from "@material-ui/icons/ChevronRight";
import { setMonth, getMonth, setYear, getYear } from "date-fns";
import { NavigationAction } from "../types";

interface HeaderProps extends WithStyles<typeof styles> {
	date: Date;
	setDate: (date: Date) => void;
	nextDisabled: boolean;
	prevDisabled: boolean;
	marker: symbol;
	handlers: {
		onDayClick: (day: Date) => void;
		onDayHover: (day: Date) => void;
		onMonthNavigate: (marker: symbol, action: NavigationAction) => void;
	};
}

const styles = createStyles({
	iconContainer: {
		padding: 5
	},
	icon: {
		padding: 10,
		"&:hover": {
			background: "none"
		}
	}
});

const MONTHS = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"June",
	"July",
	"Aug",
	"Sept",
	"Oct",
	"Nov",
	"Dec"
];

function generateYearRange(startYear: number, endYear: number) {
  let years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
}

const Header: React.FunctionComponent<HeaderProps> = ({
	date,
	classes,
	setDate,
	nextDisabled,
	prevDisabled,
	marker,
	handlers,
}) => {
	const handleMonthChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setDate(setMonth(date, parseInt(event.target.value as string)));
	};

	const handleYearChange = (event: React.ChangeEvent<{ value: unknown }>) => {
		setDate(setYear(date, parseInt(event.target.value as string)));
	};


	return (
		<Grid container justify="space-between" alignItems="center">
			<Grid item className={classes.iconContainer}>
				<IconButton
					className={classes.icon}
					disabled={prevDisabled}
					onClick={() => {
						handlers.onMonthNavigate(marker, NavigationAction.Previous)
					}}>
					<ChevronLeft color={prevDisabled ? "disabled" : "action"} />
				</IconButton>
			</Grid>
			<Grid item>
				<Select
					value={getMonth(date)}
					onChange={handleMonthChange}
					MenuProps={{ disablePortal: true }}>
					{MONTHS.map((month, idx) => (
						<MenuItem key={month} value={idx}>
							{month}
						</MenuItem>
					))}
				</Select>
			</Grid>

			<Grid item>
				<Select
					value={getYear(date)}
					onChange={handleYearChange}
					MenuProps={{ disablePortal: true }}>
					{generateYearRange(2000, 2050).map((year) => (
						<MenuItem key={year} value={year}>
							{year}
						</MenuItem>
					))}
				</Select>

			</Grid>
			<Grid item className={classes.iconContainer}>
				<IconButton className={classes.icon} disabled={nextDisabled} onClick={
					() => { handlers.onMonthNavigate(marker, NavigationAction.Next ) }
				}>
					<ChevronRight color={nextDisabled ? "disabled" : "action"} />
				</IconButton>
			</Grid>
		</Grid>
	);
};

export default withStyles(styles)(Header);
