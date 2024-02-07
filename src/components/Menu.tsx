import React from "react";
import {
	Paper,
	Grid,
	Divider,
	createStyles,
	WithStyles,
	Theme,
	withStyles,
} from "@material-ui/core";
import { differenceInCalendarMonths } from "date-fns";
import Month from "./Month";
import DefinedRanges from "./DefinedRanges";
import { DateRange, DefinedRange, Setter, NavigationAction } from "../types";
import { MARKERS } from "..";
import { grey } from "@material-ui/core/colors";

const styles = (theme: Theme) =>
	createStyles({
		header: {
			padding: "20px 70px"
		},
		headerItem: {
			flex: 1,
			textAlign: "center"
		},
		divider: {
			borderLeft: `1px solid ${theme.palette.action.hover}`,
			marginBottom: 20
		},
		ranges: {
			width: 200
		},
		buttonsWrapper: {
			padding: "1rem",
			gap: 10,
			display: "flex",
			justifyContent: "center",
		},
		applyButton: {
			cursor: "pointer",
			backgroundColor: "#a4d481",
			border: "none",
			padding: 10,
			fontWeight: 600,
			borderRadius: 5,
			width: 92
		},
		cancelButton: {
			cursor: "pointer",
			backgroundColor: grey[40],
			border: "1px solid #b8b8b8",
			padding: 10,
			fontWeight: 600,
			borderRadius: 5,
			width: 92
		}
	});

interface MenuProps extends WithStyles<typeof styles> {
	dateRange: DateRange;
	ranges: DefinedRange[];
	minDate: Date;
	maxDate: Date;
	firstMonth: Date;
	secondMonth: Date;
	setFirstMonth: Setter<Date>;
	setSecondMonth: Setter<Date>;
	setDateRange: Setter<DateRange>;
	isIntervalCheckEnabled: Boolean;
	helpers: {
		inHoverRange: (day: Date) => boolean;
	};
	handlers: {
		onDayClick: (day: Date) => void;
		onDayHover: (day: Date) => void;
		onMonthNavigate: (marker: symbol, action: NavigationAction) => void;
	};
	handleApply: () => void;
	handleCancel: () => void;
}

const Menu: React.FunctionComponent<MenuProps> = props => {
	const {
		classes,
		ranges,
		dateRange,
		minDate,
		maxDate,
		isIntervalCheckEnabled,
		firstMonth,
		setFirstMonth,
		secondMonth,
		setSecondMonth,
		setDateRange,
		helpers,
		handlers,
		handleApply,
		handleCancel,
	} = props;
	const canNavigateCloser = differenceInCalendarMonths(secondMonth, firstMonth) >= 2;
	const commonProps = { dateRange, minDate, maxDate, helpers, handlers, isIntervalCheckEnabled };
	return (
		<Paper elevation={5} square>
			<Grid container direction="row" wrap="nowrap">
				<Grid>
					<Grid container justify="center" wrap="nowrap">
						<Grid className={classes.ranges}>
							<DefinedRanges
								selectedRange={dateRange}
								ranges={ranges}
								setRange={setDateRange}
								/>
						</Grid>
						<div className={classes.divider} />
						<Month
							{...commonProps}
							value={firstMonth}
							setValue={setFirstMonth}
							navState={[true, canNavigateCloser]}
							marker={MARKERS.FIRST_MONTH}
						/>
						<Month
							{...commonProps}
							value={secondMonth}
							setValue={setSecondMonth}
							navState={[canNavigateCloser, true]}
							marker={MARKERS.SECOND_MONTH}
						/>
					</Grid>

				</Grid>
				<div className={classes.divider} />
			</Grid>
			<Divider />
			<Grid className={classes.buttonsWrapper}>
				<button onClick={handleApply} className={classes.applyButton}> Apply </button>
				<button onClick={handleCancel} style={{
					cursor: "pointer",
					backgroundColor: grey[40],
					border: "1px solid #b8b8b8",
					padding: 10,
					fontWeight: 600,
					borderRadius: 5,
					width: 92
				}}> Cancel </button>
			</Grid>
		</Paper>
	);
};

export default withStyles(styles)(Menu);
