import * as React from "react";
import {
	MuiThemeProvider,
	createMuiTheme,
	CssBaseline,
	Grid,
	Paper,
	Typography,
	createStyles,
	WithStyles,
	withStyles,
	Divider,
	Theme,
	ListItem,
	ListItemText,
	List
} from "@material-ui/core";
import {
	addMonths,
	isSameDay,
	isWithinRange,
	isAfter,
	startOfWeek,
	startOfMonth,
	endOfWeek,
	endOfMonth,
	isBefore,
	addDays,
	format,
	isSameMonth,
	differenceInCalendarMonths,
	getDate
} from "date-fns";
import Month from "./components/Month";
import { ArrowRightAlt } from "@material-ui/icons";
import { DateRange, NavigationAction, Setter as StateSetter } from "./types";

const theme = createMuiTheme({ typography: { useNextVariants: true } });
type Marker = symbol;

const MARKERS: { [key: string]: Marker } = {
	FIRST_MONTH: Symbol("firstMonth"),
	SECOND_MONTH: Symbol("secondMonth")
};

const styles = (theme: Theme) =>
	createStyles({
		header: {
			padding: "20px 70px"
		},
		headerItem: {
			flex: 1
		},
		divider: {
			borderLeft: `1px solid ${theme.palette.action.hover}`,
			marginBottom: 20
		}
	});

interface DateRangePickerProps extends WithStyles<typeof styles> {
	title: string;
	dateRange?: DateRange;
}

const DateRangePickerImpl: React.FunctionComponent<DateRangePickerProps> = props => {
	const [dateRange, setDateRange] = React.useState<DateRange>({ ...props.dateRange });
	const [hoverDay, setHoverDay] = React.useState<Date>();
	const [firstMonth, setFirstMonth] = React.useState<Date>(
		(props.dateRange && props.dateRange.startDate) || new Date()
	);
	const [secondMonth, setSecondMonth] = React.useState<Date>(
		(props.dateRange && props.dateRange.endDate) || addMonths(firstMonth, 1)
	);

	const { startDate, endDate } = dateRange;
	const { classes } = props;

	const matchEnds = (day: Date) => isStartOfRange(day) || isEndOfRange(day);
	const isStartOfRange = (day: Date) => (startDate && isSameDay(day, startDate)) as boolean;
	const isEndOfRange = (day: Date) => (endDate && isSameDay(day, endDate)) as boolean;
	const inDateRange = (day: Date) => {
		return (startDate && endDate && isWithinRange(day, startDate, endDate)) as boolean;
	};

	const inHoverRange = (day: Date) => {
		return (startDate &&
			!endDate &&
			hoverDay &&
			isAfter(hoverDay, startDate) &&
			isWithinRange(day, startDate, hoverDay)) as boolean;
	};

	const getDaysInMonth = (date: Date) => {
		const startWeek = startOfWeek(startOfMonth(date));
		const endWeek = endOfWeek(endOfMonth(date));
		const days = [];
		for (let curr = startWeek; isBefore(curr, endWeek); ) {
			days.push(curr);
			curr = addDays(curr, 1);
		}
		return days;
	};

	const handleClick = (day: Date) => {
		if (startDate && !endDate && isAfter(day, startDate)) {
			setDateRange({ startDate, endDate: day });
		} else {
			setDateRange({ startDate: day, endDate: undefined });
		}
	};

	const onNavigate = (marker: Marker, action: NavigationAction) => {
		console.log("onNavigate", action, marker);
		if (marker == MARKERS.FIRST_MONTH) {
			const firstNew = addMonths(firstMonth, action);
			if (isBefore(firstNew, secondMonth)) setFirstMonth(firstNew);
		} else {
			const secondNew = addMonths(secondMonth, action);
			if (isBefore(firstMonth, secondNew)) setSecondMonth(secondNew);
		}
	};

	const onHover = (date: Date) => {
		if (startDate && !endDate) {
			if(!hoverDay || !isSameDay(date, hoverDay)) {
				console.log("setHoverDay", getDate(date))
				setHoverDay(date)
			}
		}
	};

	const canNavigate = (marker: Marker): [boolean, boolean] => {
		let canNavigateCloser = differenceInCalendarMonths(secondMonth, firstMonth) >= 2;

		if (marker == MARKERS.FIRST_MONTH) {
			return [true, canNavigateCloser];
		} else {
			return [canNavigateCloser, true];
		}
	};

	const functions = {
		inHoverRange,
		inDateRange,
		isStartOfRange,
		isEndOfRange,
		matchEnds,
		getDaysInMonth,
		onHover,
		onNavigate,
		canNavigate,
		handleClick
	};

	return (
		<MuiThemeProvider theme={theme}>
			<CssBaseline />

			<Paper elevation={5} square>
				<Grid container direction="row">
					<Grid>
						<Grid container className={classes.header} alignItems="center">
							<Grid item className={classes.headerItem}>
								<Typography variant="subtitle1">
									{startDate ? format(startDate, "MMMM DD, YYYY") : "Start Date"}
								</Typography>
							</Grid>
							<Grid item className={classes.headerItem}>
								<ArrowRightAlt color="action" />
							</Grid>
							<Grid item className={classes.headerItem}>
								<Typography variant="subtitle1">
									{endDate ? format(endDate, "MMMM DD, YYYY") : "End Date"}
								</Typography>
							</Grid>
						</Grid>
						<Divider />
						<Grid container direction="row" justify="center">
							<Month
								value={firstMonth}
								functions={functions}
								marker={MARKERS.FIRST_MONTH}
							/>
							<div className={classes.divider} />
							<Month
								value={secondMonth}
								marker={MARKERS.SECOND_MONTH}
								functions={functions}
							/>
						</Grid>
					</Grid>
					<div className={classes.divider} />
					<Grid>
						<List>
							<ListItem button>
								<ListItemText>Today</ListItemText>
							</ListItem>
						</List>
					</Grid>
				</Grid>
			</Paper>
		</MuiThemeProvider>
	);

	//return (<Typography>Hello blahblas {props.title}</Typography>);
};

export const DateRangePicker = withStyles(styles)(DateRangePickerImpl);