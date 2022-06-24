import moment from "moment";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import React from "react";
import RangePicker from "./RangePicker";

interface Data {
  documents: {
    name: string;
    date: string;
    amount: number;
    id: number;
  }[];
}

dayjs.extend(isBetween);

const RangePickerForm = (props: any) => {
  const [data, setData] = React.useState<Data>();

  const [end, setEnd] = React.useState<moment.MomentInput>(moment());
  const [start, setStart] = React.useState<moment.MomentInput>(moment());

  const disabledDatesFn = React.useCallback(
    (current: moment.Moment) =>
      // [6, 7].includes(moment(current).isoWeekday()) ||
      // current > moment().endOf("day"),
      [0, 6].includes(moment(current).weekday()) ||
      current > moment().endOf("day"),
    []
  );

  React.useEffect(() => {
    fetch("api/documents")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const activityDateRanges = {
    today: {
      from: moment().startOf("day").format(),
      label: "Today",
      to: moment().endOf("day").format()
    },
    priorDay: {
      from: moment().subtract(1, "day").startOf("day").format(),
      label: "Prior Day",
      to: moment().subtract(1, "day").endOf("day").format()
    },
    prior7Days: {
      from: moment().subtract(7, "day").startOf("day").format(),
      label: "Prior 7 Days",
      to: moment().endOf("day").format()
    },
    last30: {
      from: moment().subtract(30, "days").startOf("day").format(),
      label: "Prior 30 Days",
      to: moment().endOf("day").format()
    },
    last90Days: {
      from: moment().subtract(90, "days").startOf("day").format(),
      label: "Prior 90 Days",
      to: moment().endOf("day").format()
    },
    lastMonth: {
      from: moment()
        .subtract(1, "month")
        .startOf("month")
        .startOf("day")
        .format(),
      label: "Last Month",
      to: moment().subtract(1, "month").endOf("month").format()
    },
    thisMonth: {
      from: moment().startOf("month").startOf("day").format(),
      label: "This Month",
      to: moment().endOf("day").format()
    },
    thisQuarter: {
      from: moment().startOf("quarter").startOf("day").format(),
      label: "This Quarter",
      to: moment().endOf("day").format()
    },
    thisYear: {
      from: moment().startOf("year").startOf("day").format(),
      label: "Year to Date",
      to: moment().endOf("day").format()
    }
  };

  const onDatesChange = (dates: Array<moment.MomentInput>): void => {
    setEnd(moment(dates[1]).format());
    setStart(moment(dates[0]).format());
  };

  const renderData = (data: { name: string; date: string; amount: number }) => {
    let renderDate = dayjs(data.date).isBetween(
      start as Dayjs,
      end as Dayjs,
      "day",
      "[]"
    );

    if (renderDate) {
      return `${data.name} - ${moment(data.date).format("YYYY-MM-DD")}, $${
        data.amount
      }`;
    }
  };

  return (
    <div className="App">
      <RangePicker
        dateKey={"current"}
        dateRanges={activityDateRanges}
        disabledDatesFn={disabledDatesFn}
        format={"YYYY-MM-DD"}
        onChange={onDatesChange}
        value={{
          endDate: end,
          startDate: start
        }}
      />
      <div>
        {data?.documents.map((data) => (
          <div key={data.id}>{renderData(data)}</div>
        ))}
      </div>
    </div>
  );
};

export default RangePickerForm;
